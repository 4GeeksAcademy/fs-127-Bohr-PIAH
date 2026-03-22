# guardar como texto y evaluar al final de la función para que no se rompa porque haya atributos que todavía no existen
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from io import BytesIO
from typing import Any
import math

from flask import abort, send_file
from sqlalchemy.orm import selectinload

from api.models import Department, Project
from api.models.task import Task
from api.models.work_package import WorkPackage

from reportlab.lib import colors
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.barcharts import HorizontalBarChart
from reportlab.graphics.charts.legends import Legend
from reportlab.graphics.shapes import Drawing, String
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfgen.canvas import Canvas

# to test:
# pipenv shell
# flask shell
# from api.services.report_service import ReportService
# from api.models.project import Project
# from api.models.department import Department
# project = Project.query.filter_by(finalized=False).first()
# project.id
# response = ReportService.generate_project_pdf(project.id)
# response


@dataclass  # Método típico para clases que solo almacenan datos, genera dunder methods
class ReportScope:
    kind: str
    entity_id: int | None
    title: str
    subtitle: str


class ReportService:
    '''
    Servicio encargado de generar informes en formato PDF para proyectos,
    departamentos y para la organización completa.

    Este servicio obtiene la información necesaria desde la base de datos
    (departamentos, proyectos, paquetes de trabajo y tareas), calcula métricas
    y genera el text del report sobre el estado del trabajo.
    Posteriormente renderiza la info en un documento PDF.

    Los archivos se descargan automáticamente, no se almacenan en la app

    Tipos de report:
        - Proyecto: informe detallado con sus paquetes de trabajo y tareas.
        - Departamento: informe agregado de todos los proyectos activos
          dentro de un departamento.
        - Organización: informe global que aúna información de todos los
          departamentos, proyectos y tareas.

    Partes del proceso:
        - Cargar los datos de la BBDD.
        - Calcular métricas y KPIs
        - Generar el texto.
        - Construir el doc.
    '''

    # Helpers
    @staticmethod
    def fmt_dt(value):
        if value is None:
            return None
        if isinstance(value, datetime):
            if value.tzinfo is None:
                value = value.replace(tzinfo=timezone.utc)
            return value.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        return str(value)

    @staticmethod
    def is_overdue(deadline, status):
        if deadline is None:
            return False

        if hasattr(status, "value"):
            status = status.value

        if status == "done":
            return False

        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)

        return deadline < datetime.now(timezone.utc)

    @staticmethod
    def short_label(value: str, max_length: int = 18) -> str:
        if len(value) <= max_length:
            return value
        return value[: max_length - 1] + "…"

    # Task utilities

    @staticmethod
    def task_to_dict(task: Task):
        raw_status = getattr(task, "status", None)
        status = raw_status.value if hasattr(
            raw_status, "value") else str(raw_status or "to_do")

        deadline = getattr(task, "deadline", None)

        return {
            "id": getattr(task, "id", None),
            "name": getattr(task, "name", ""),
            "description": getattr(task, "task_description", None),
            "status": status,
            "alert": bool(getattr(task, "alert", False)),
            "todo_by": getattr(task, "todo_by", None),
            "created_at": ReportService.fmt_dt(getattr(task, "created_at", None)),
            "deadline": ReportService.fmt_dt(deadline),
            "is_overdue": ReportService.is_overdue(deadline, raw_status),
        }

    @staticmethod
    def task_metrics(tasks: list[dict[str, Any]]):
        by_status: dict[str, int] = {
            "to_do": 0,
            "in_progress": 0,
            "in_review": 0,
            "done": 0,
        }

        for task in tasks:
            status = task["status"]
            by_status[status] = by_status.get(status, 0) + 1

        total = len(tasks)
        overdue = sum(1 for task in tasks if task["is_overdue"])
        alerts = sum(1 for task in tasks if task["alert"])
        completed = by_status.get("done", 0)
        in_progress = by_status.get("in_progress", 0)
        in_review = by_status.get("in_review", 0)
        to_do = by_status.get("to_do", 0)

        progress = round((completed / total) * 100, 2) if total else 0.0

        return {
            "total_tasks": total,
            "done": completed,
            "in_progress": in_progress,
            "in_review": in_review,
            "to_do": to_do,
            "overdue": overdue,
            "alerts": alerts,
            "progress_pct": progress,
            "by_status": by_status,
        }

    # Narratives

    @staticmethod
    def project_narrative(project_name: str, tasks: list[dict[str, Any]]):
        m = ReportService.task_metrics(tasks)
        return (
            f"Project '{project_name}' features {m['total_tasks']} tasks. "
            f"Currently, {m['done']} are completed, {m['in_progress']} in progress, "
            f"{m['in_review']} in review and {m['to_do']} to do. "
            f"Estimated completion rate is {m['progress_pct']}%. "
            f"There are {m['overdue']} tasks overdue and "
            f"{m['alerts']} flagged to need a follow-up."
        )

    @staticmethod
    def department_narrative(
        department_name: str,
        projects_payload: list[dict[str, Any]],
        tasks: list[dict[str, Any]],
    ) -> str:
        m = ReportService.task_metrics(tasks)
        return (
            f"Department '{department_name}' features {len(projects_payload)} active projects and "
            f"{m['total_tasks']} tasks. Aggregated completion rate is {m['progress_pct']}%, "
            f"with {m['done']} tasks completed, {m['in_progress']} in progress, "
            f"{m['in_review']} in review and {m['to_do']} to do. "
            f"There are {m['overdue']} task overdue across the department."
        )

    @staticmethod
    def organization_narrative(
        departments_payload: list[dict[str, Any]],
        tasks: list[dict[str, Any]],
    ) -> str:
        m = ReportService.task_metrics(tasks)
        total_projects = sum(len(department["projects"])
                             for department in departments_payload)
        return (
            f"The organization includes {len(departments_payload)} departments, {total_projects} active projects and "
            f"{m['total_tasks']} tasks. Aggregated global completion rate is{m['progress_pct']}%. "
            f"Currently, {m['done']} tasks are completed, {m['in_progress']} in progress, "
            f"{m['in_review']} in review and {m['to_do']} to do. "
            f"There are {m['overdue']} tasks overdue  and {m['alerts']} flagged tasks that require follow-up."
        )

    # Payloads

    @staticmethod
    def build_project_payload(project):
        tasks: list[dict[str, Any]] = []
        work_packages_payload: list[dict[str, Any]] = []

        for wp in project.work_packages:
            wp_tasks = [ReportService.task_to_dict(task) for task in wp.tasks]
            tasks.extend(wp_tasks)
            work_packages_payload.append(
                {
                    "id": wp.id,
                    "name": wp.name,
                    "tasks": wp_tasks,
                    "metrics": ReportService.task_metrics(wp_tasks),
                }
            )

        return {
            "project": {
                "id": project.id,
                "name": project.name,
                "department_id": project.department_id,
                "department_name": getattr(project.department, "name", None),
                "created_by": project.created_by,
                "created_at": ReportService.fmt_dt(getattr(project, "created_at", None)),
                "deadline": ReportService.fmt_dt(getattr(project, "deadline", None)),
                "finalized": bool(getattr(project, "finalized", False)),
            },
            "metrics": ReportService.task_metrics(tasks),
            "work_packages": work_packages_payload,
            "tasks": tasks,
            "narrative": ReportService.project_narrative(project.name, tasks),
        }

    @staticmethod
    def build_department_payload(department):
        department_tasks: list[dict[str, Any]] = []
        projects_payload: list[dict[str, Any]] = []

        for project in department.projects:
            if getattr(project, "finalized", False):
                continue
            project_payload = ReportService.build_project_payload(project)
            department_tasks.extend(project_payload["tasks"])
            projects_payload.append(project_payload)

        return {
            "department": {
                "id": department.id,
                "name": department.name,
                "head_id": getattr(department, "head_id", None),
            },
            "metrics": ReportService.task_metrics(department_tasks),
            "projects": projects_payload,
            "active_projects_count": len(projects_payload),
            "narrative": ReportService.department_narrative(
                department.name,
                projects_payload,
                department_tasks,
            ),
        }

    @staticmethod
    def build_organization_payload(departments):
        all_tasks: list[dict[str, Any]] = []
        departments_payload: list[dict[str, Any]] = []

        for department in departments:
            department_payload = ReportService.build_department_payload(
                department)
            all_tasks.extend(
                task
                for project_payload in department_payload["projects"]
                for task in project_payload["tasks"]
            )
            departments_payload.append(department_payload)

        return {
            "metrics": ReportService.task_metrics(all_tasks),
            "departments": departments_payload,
            "narrative": ReportService.organization_narrative(departments_payload, all_tasks),
        }

    # Data load: Podría usar los métodos de los otros services pero creo que queda más limpio así porque hay
    # hay algún cambio para poder traer más de un proyecto

    @staticmethod
    def get_project_tree(project_id: int):
        project = (
            Project.query.options(
                selectinload(Project.department),
                selectinload(Project.work_packages).selectinload(
                    WorkPackage.tasks),
            )
            .filter(Project.id == project_id, Project.finalized.is_(False))
            .first()
        )
        if project is None:
            abort(
                404, description=f"Active project with id {project_id} not found")
        return project

    @staticmethod
    def get_department_tree(department_id: int):
        department = (
            Department.query.options(
                selectinload(Department.projects.and_(
                    Project.finalized.is_(False)))
                .selectinload(Project.work_packages)
                .selectinload(WorkPackage.tasks)
            )
            .filter(Department.id == department_id)
            .first()
        )
        if department is None:
            abort(
                404, description=f"Department with id {department_id} not found")
        return department

    @staticmethod
    def get_organization_tree():
        return (
            Department.query.options(
                selectinload(Department.projects.and_(
                    Project.finalized.is_(False)))
                .selectinload(Project.work_packages)
                .selectinload(WorkPackage.tasks)
            )
            .all()
        )

    # Things for rendering

    @staticmethod
    def styles():
        base = getSampleStyleSheet()
        return {
            "title": ParagraphStyle(
                "title",
                parent=base["Title"],
                fontName="Helvetica-Bold",
                fontSize=20,
                leading=24,
                textColor=colors.HexColor("#17324D"),
                spaceAfter=6,
                alignment=TA_LEFT,
            ),
            "subtitle": ParagraphStyle(
                "subtitle",
                parent=base["Normal"],
                fontName="Helvetica",
                fontSize=10,
                leading=13,
                textColor=colors.HexColor("#4F6174"),
                spaceAfter=3,
            ),
            "muted": ParagraphStyle(
                "muted",
                parent=base["Normal"],
                fontName="Helvetica",
                fontSize=8.5,
                leading=11,
                textColor=colors.HexColor("#6C7A89"),
                spaceAfter=4,
            ),
            "h1": ParagraphStyle(
                "h1",
                parent=base["Heading1"],
                fontName="Helvetica-Bold",
                fontSize=13,
                leading=16,
                textColor=colors.HexColor("#17324D"),
                spaceBefore=8,
                spaceAfter=6,
            ),
            "h2": ParagraphStyle(
                "h2",
                parent=base["Heading2"],
                fontName="Helvetica-Bold",
                fontSize=11,
                leading=14,
                textColor=colors.HexColor("#274C77"),
                spaceBefore=6,
                spaceAfter=4,
            ),
            "body": ParagraphStyle(
                "body",
                parent=base["BodyText"],
                fontName="Helvetica",
                fontSize=9.5,
                leading=13,
                textColor=colors.black,
                spaceAfter=4,
            ),
        }

    @staticmethod
    def metrics_sentence(metrics: dict[str, Any]) -> str:
        return (
            f"{metrics['total_tasks']} tasks, {metrics['done']} completed, "
            f"{metrics['in_progress']} in progress, {metrics['in_review']} in review, "
            f"{metrics['to_do']} to do, {metrics['overdue']} overdue, "
            f"completion rate {metrics['progress_pct']}%."
        )

    @staticmethod
    def kv_table(rows: list[list[str]]):
        table = Table(rows, colWidths=[35 * mm, 120 * mm])
        table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D0D7E2")),
                    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EEF3F8")),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("PADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        return table

    @staticmethod
    def metrics_table(metrics: dict[str, Any]):
        data = [
            ["KPIs", "Value"],
            ["Total tasks", str(metrics["total_tasks"])],
            ["Completed", str(metrics["done"])],
            ["In progress", str(metrics["in_progress"])],
            ["In review", str(metrics["in_review"])],
            ["To do", str(metrics["to_do"])],
            ["Overdue", str(metrics["overdue"])],
            ["Stopper", str(metrics["alerts"])],
            ["Completion rate", f"{metrics['progress_pct']}%"],
        ]

        table = Table(data, colWidths=[75 * mm, 35 * mm])
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F3A5F")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#C7D2E0")),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("PADDING", (0, 0), (-1, -1), 6),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
                ]
            )
        )
        return table

    @staticmethod
    def tasks_table(tasks: list[dict[str, Any]]):
        rows = [["ID", "Task", "Status", "In charge", "Deadline", "Stopper"]]
        for task in tasks:
            rows.append(
                [
                    str(task["id"]),
                    task["name"],
                    task["status"],
                    str(task.get("todo_by") or "-"),
                    task.get("deadline") or "-",
                    "Yes" if task.get("alert") else "No",
                ]
            )

        table = Table(
            rows,
            colWidths=[12 * mm, 55 * mm, 28 * mm, 24 * mm, 30 * mm, 16 * mm],
            repeatRows=1,
        )
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#314E6E")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D0D7E2")),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("PADDING", (0, 0), (-1, -1), 5),
                    ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1),
                     [colors.white, colors.HexColor("#F6F8FB")]),
                ]
            )
        )
        return table

    @staticmethod
    def index_table(rows: list[list[str]]):
        table = Table(rows, colWidths=[20 * mm, 135 * mm], repeatRows=1)
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F3A5F")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D0D7E2")),
                    ("PADDING", (0, 0), (-1, -1), 6),
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1),
                     [colors.white, colors.HexColor("#F6F8FB")]),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ]
            )
        )
        return table

    # Charts

    @staticmethod
    def status_chart(metrics: dict[str, Any], title: str) -> Drawing:
        labels = ["To do", "In progress", "In review", "Done"]
        values = [
            metrics.get("to_do", 0),
            metrics.get("in_progress", 0),
            metrics.get("in_review", 0),
            metrics.get("done", 0),
        ]

        drawing = Drawing(170 * mm, 60 * mm)
        drawing.add(String(0, 56 * mm, title, fontName="Helvetica-Bold",
                    fontSize=10, fillColor=colors.HexColor("#17324D")))

        chart = VerticalBarChart()
        chart.x = 10 * mm
        chart.y = 8 * mm
        chart.height = 38 * mm
        chart.width = 140 * mm
        chart.data = [values]
        chart.categoryAxis.categoryNames = labels
        chart.categoryAxis.labels.fontName = "Helvetica"
        chart.categoryAxis.labels.fontSize = 8
        chart.valueAxis.labels.fontName = "Helvetica"
        chart.valueAxis.labels.fontSize = 8
        chart.valueAxis.valueMin = 0
        chart.valueAxis.valueMax = max(max(values, default=0), 1)
        chart.valueAxis.valueStep = max(
            1, int((chart.valueAxis.valueMax + 3) / 4))
        chart.barWidth = 14
        chart.groupSpacing = 12
        chart.barSpacing = 6
        chart.bars[0].fillColor = colors.HexColor("#4F81BD")
        chart.bars[0].strokeColor = colors.HexColor("#385D8A")
        drawing.add(chart)
        return drawing

    @staticmethod
    def comparison_chart(labels: list[str], values: list[int], title: str, y_label: str) -> Drawing:
        if not labels:
            labels = ["No data"]
            values = [0]

        max_per_block = 8
        blocks = [
            (labels[index:index + max_per_block],
             values[index:index + max_per_block])
            for index in range(0, len(labels), max_per_block)
        ]

        block_height = 65 * mm
        block_spacing = 8 * mm
        total_height = max(
            block_height * len(blocks) + block_spacing * (len(blocks) - 1),
            block_height,
        )

        drawing = Drawing(170 * mm, total_height)

        for block_index, (block_labels, block_values) in enumerate(blocks):
            y_offset = total_height - \
                ((block_index + 1) * block_height) - \
                (block_index * block_spacing)
            title_suffix = f" (Block {block_index + 1})" if len(blocks) > 1 else ""

            drawing.add(
                String(
                    0,
                    y_offset + 61 * mm,
                    title + title_suffix,
                    fontName="Helvetica-Bold",
                    fontSize=10,
                    fillColor=colors.HexColor("#17324D"),
                )
            )
            drawing.add(
                String(
                    0,
                    y_offset + 56 * mm,
                    y_label,
                    fontName="Helvetica",
                    fontSize=8,
                    fillColor=colors.HexColor("#4F6174"),
                )
            )

            chart = VerticalBarChart()
            chart.x = 10 * mm
            chart.y = y_offset + 8 * mm
            chart.height = 42 * mm
            chart.width = 145 * mm
            chart.data = [block_values]
            chart.categoryAxis.categoryNames = block_labels
            chart.categoryAxis.labels.fontName = "Helvetica"
            chart.categoryAxis.labels.fontSize = 7
            chart.categoryAxis.labels.angle = 20
            chart.valueAxis.labels.fontName = "Helvetica"
            chart.valueAxis.labels.fontSize = 8
            chart.valueAxis.valueMin = 0
            chart.valueAxis.valueMax = max(max(block_values, default=0), 1)
            chart.valueAxis.valueStep = max(
                1, int((chart.valueAxis.valueMax + 3) / 4))
            chart.barWidth = 12
            chart.groupSpacing = 10
            chart.barSpacing = 5
            chart.bars[0].fillColor = colors.HexColor("#7AA6D8")
            chart.bars[0].strokeColor = colors.HexColor("#4F81BD")
            drawing.add(chart)

        return drawing

    @staticmethod
    def comparison_chart_from_projects(projects_payload: list[dict[str, Any]], title: str, y_label: str) -> Drawing:
        labels = [
            ReportService.short_label(
                project_payload["project"]["name"], max_length=14)
            for project_payload in projects_payload
        ]
        values = [project_payload["metrics"]["total_tasks"]
                  for project_payload in projects_payload]
        return ReportService.comparison_chart(labels, values, title, y_label)

    @staticmethod
    def comparison_chart_from_departments(departments_payload: list[dict[str, Any]], title: str, y_label: str) -> Drawing:
        labels = [
            ReportService.short_label(
                department_payload["department"]["name"], max_length=14)
            for department_payload in departments_payload
        ]
        values = [department_payload["metrics"]["total_tasks"]
                  for department_payload in departments_payload]
        return ReportService.comparison_chart(labels, values, title, y_label)

    @staticmethod
    def wp_status_chart(work_packages: list[dict[str, Any]], title: str = "Tasks by status per work package"):
        styles = ReportService.styles()

        if not work_packages:
            return Paragraph("No work packages to display.", styles["muted"])

        labels = [ReportService.short_label(
            wp["name"], 18) for wp in work_packages]

        to_do_data = []
        in_progress_data = []
        in_review_data = []
        done_data = []

        max_value = 0

        for wp in work_packages:
            by_status = wp["metrics"].get("by_status", {})
            to_do = by_status.get("to_do", 0)
            in_progress = by_status.get("in_progress", 0)
            in_review = by_status.get("in_review", 0)
            done = by_status.get("done", 0)

            to_do_data.append(to_do)
            in_progress_data.append(in_progress)
            in_review_data.append(in_review)
            done_data.append(done)

            max_value = max(max_value, to_do, in_progress, in_review, done)

        # altura dinámica según número de work packages
        chart_height = max(120, len(work_packages) * 22)
        drawing_height = chart_height + 80
        drawing = Drawing(500, drawing_height)

        drawing.add(String(10, drawing_height - 18, title,
                    fontName="Helvetica-Bold", fontSize=11))

        chart = HorizontalBarChart()
        chart.x = 110
        chart.y = 25
        chart.height = chart_height
        chart.width = 300

        chart.data = [
            tuple(to_do_data),
            tuple(in_progress_data),
            tuple(in_review_data),
            tuple(done_data),
        ]

        chart.categoryAxis.categoryNames = labels
        chart.categoryAxis.labels.fontName = "Helvetica"
        chart.categoryAxis.labels.fontSize = 8
        chart.categoryAxis.labels.boxAnchor = "e"
        chart.categoryAxis.labels.dx = -6

        chart.valueAxis.valueMin = 0
        chart.valueAxis.valueMax = max(max_value + 1, 1)
        chart.valueAxis.valueStep = 1 if max_value <= 10 else max(
            1, math.ceil(max_value / 5))

        chart.barSpacing = 3
        chart.groupSpacing = 8

        chart.bars[0].fillColor = colors.HexColor("#9E9E9E")   # to_do
        chart.bars[1].fillColor = colors.HexColor("#42A5F5")   # in_progress
        chart.bars[2].fillColor = colors.HexColor("#FFB74D")   # in_review
        chart.bars[3].fillColor = colors.HexColor("#66BB6A")   # done

        drawing.add(chart)

        legend = Legend()
        legend.x = 420
        legend.y = drawing_height - 28
        legend.dx = 8
        legend.dy = 8
        legend.fontName = "Helvetica"
        legend.fontSize = 8
        legend.boxAnchor = "ne"
        legend.columnMaximum = 4
        legend.deltax = 55
        legend.deltay = 10

        legend.colorNamePairs = [
            (colors.HexColor("#9E9E9E"), "To do"),
            (colors.HexColor("#42A5F5"), "In progress"),
            (colors.HexColor("#FFB74D"), "In review"),
            (colors.HexColor("#66BB6A"), "Done"),
        ]

        drawing.add(legend)

        return drawing

    # Decorators for pages

    @staticmethod
    def draw_header_footer(canvas: Canvas, doc, scope: ReportScope, generated_at: datetime):
        canvas.saveState()
        page_width, page_height = A4

        header_y = page_height - 12 * mm
        footer_y = 10 * mm

        canvas.setStrokeColor(colors.HexColor("#C7D2E0"))
        canvas.setLineWidth(0.6)
        canvas.line(doc.leftMargin, page_height - 16 * mm,
                    page_width - doc.rightMargin, page_height - 16 * mm)
        canvas.line(doc.leftMargin, 15 * mm,
                    page_width - doc.rightMargin, 15 * mm)

        canvas.setFont("Helvetica-Bold", 9)
        canvas.setFillColor(colors.HexColor("#17324D"))
        canvas.drawString(doc.leftMargin, header_y, scope.title)

        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#4F6174"))
        right_header = scope.subtitle
        canvas.drawRightString(
            page_width - doc.rightMargin, header_y, right_header)

        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#6C7A89"))
        generated_text = f"Generado: {ReportService.fmt_dt(generated_at)}"
        canvas.drawString(doc.leftMargin, footer_y, generated_text)

        page_text = f"Página {canvas.getPageNumber()}"
        canvas.drawRightString(
            page_width - doc.rightMargin, footer_y, page_text)

        canvas.restoreState()

    @staticmethod
    def build_page_decorator(scope: ReportScope, generated_at: datetime):
        def decorate(canvas: Canvas, doc):
            ReportService.draw_header_footer(canvas, doc, scope, generated_at)
        return decorate

    # Sections
    @staticmethod
    def append_project_detail(story, payload, styles):
        project = payload["project"]
        story.append(Paragraph("Project report", styles["h1"]))
        story.append(
            ReportService.kv_table(
                [
                    ["ID", str(project["id"])],
                    ["Name", project["name"]],
                    ["Department", project.get("department_name") or "-"],
                    ["Created at", project.get("created_at") or "-"],
                    ["Deadline", project.get("deadline") or "-"],
                    ["Finished", "Yes" if project.get("finalized") else "No"],
                ]
            )
        )
        story.append(Spacer(1, 6))
        story.append(ReportService.metrics_table(payload["metrics"]))
        story.append(Spacer(1, 6))
        story.append(
            ReportService.status_chart(
                payload["metrics"],
                f"Tasks per project · {project['name']}",
            )
        )
        story.append(Spacer(1, 8))
        story.append(
            ReportService.wp_status_chart(
                payload["work_packages"],
                "Tasks by status per work package",
            )
        )
        story.append(Spacer(1, 10))

        for wp in payload["work_packages"]:
            story.append(
                Paragraph(f"Work package: {wp['name']}", styles["h2"]))
            story.append(Paragraph(ReportService.metrics_sentence(
                wp["metrics"]), styles["body"]))
            story.append(Spacer(1, 4))
            story.append(ReportService.tasks_table(wp["tasks"]))
            story.append(Spacer(1, 8))

    @staticmethod
    def append_department_index(story, payload, styles):
        story.append(Paragraph("Índice", styles["h1"]))

        rows = [["Section", "Content"]]
        rows.append(["1", "Executive summary for the department"])
        rows.append(["2", "Department datasheet"])
        rows.append(["2.1", "Only active projects shown"])

        section_number = 3
        for project_payload in payload["projects"]:
            project = project_payload["project"]
            rows.append(
                [str(section_number), f"Report for project: {project['name']}"])
            section_number += 1

        story.append(ReportService.index_table(rows))
        story.append(Spacer(1, 10))
        story.append(PageBreak())

    @staticmethod
    def append_department_detail(story, payload, styles):
        department = payload["department"]
        story.append(Paragraph("Department datasheet", styles["h1"]))
        story.append(
            ReportService.kv_table(
                [
                    ["ID", str(department["id"])],
                    ["Name", department["name"]],
                    ["Head ID", str(department.get("head_id") or "-")],
                    ["Active projects", str(payload.get(
                        "active_projects_count", len(payload["projects"])))],
                ]
            )
        )
        story.append(Spacer(1, 10))

        story.append(Paragraph("Project reports", styles["h1"]))
        story.append(
            Paragraph(
                "Individual reports for the active projects in the department",
                styles["body"],
            )
        )
        story.append(Spacer(1, 6))

        total_projects = len(payload["projects"])
        for index, project_payload in enumerate(payload["projects"]):
            ReportService.append_embedded_project_report(
                story,
                project_payload,
                styles,
                show_page_break=index < total_projects - 1,
            )

    @staticmethod
    def append_organization_index(story, payload, styles):
        story.append(Paragraph("Índice", styles["h1"]))

        rows = [["Section", "Content"]]
        rows.append(["1", "Corporate-wide executive summary"])
        rows.append(["1.1", "Only active projects shown"])

        section_number = 2
        for department_payload in payload["departments"]:
            department = department_payload["department"]
            rows.append(
                [str(section_number), f"Department overview: {department['name']}"])
            section_number += 1

            for project_payload in department_payload["projects"]:
                project = project_payload["project"]
                rows.append(
                    [str(section_number), f"Report for project: {project['name']}"])
                section_number += 1

        story.append(ReportService.index_table(rows))
        story.append(Spacer(1, 10))
        story.append(PageBreak())

    @staticmethod
    def append_organization_detail(story, payload, styles):
        departments_with_projects = [
            department_payload
            for department_payload in payload["departments"]
            if department_payload["projects"]
        ]
        total_departments = len(departments_with_projects)

        for dept_index, department_payload in enumerate(departments_with_projects):
            department = department_payload["department"]
            story.append(
                Paragraph(f"Department: {department['name']}", styles["h1"]))
            story.append(
                Paragraph(department_payload["narrative"], styles["body"]))
            story.append(Spacer(1, 4))
            story.append(ReportService.metrics_table(
                department_payload["metrics"]))
            story.append(Spacer(1, 6))
            story.append(
                ReportService.comparison_chart_from_projects(
                    department_payload["projects"],
                    f"Tasks per project · {department['name']}",
                    "Tasks",
                )
            )
            story.append(Spacer(1, 8))
            story.append(Paragraph("Department project reports", styles["h2"]))
            story.append(
                Paragraph(
                    "Individual reports for the active projects in the department",
                    styles["body"],
                )
            )
            story.append(Spacer(1, 6))

            total_projects = len(department_payload["projects"])
            for project_index, project_payload in enumerate(department_payload["projects"]):
                is_last_project_in_department = project_index == total_projects - 1
                is_last_department = dept_index == total_departments - 1

                ReportService.append_embedded_project_report(
                    story,
                    project_payload,
                    styles,
                    show_page_break=not (
                        is_last_project_in_department and is_last_department),
                )

    @staticmethod
    def append_embedded_project_report(story, project_payload, styles, show_page_break: bool = True):
        project = project_payload["project"]
        story.append(
            Paragraph(f"Project report: {project['name']}", styles["h2"]))
        story.append(Paragraph(project_payload["narrative"], styles["body"]))
        story.append(Spacer(1, 4))
        story.append(
            ReportService.kv_table(
                [
                    ["ID", str(project["id"])],
                    ["Name", project["name"]],
                    ["Department", project.get("department_name") or "-"],
                    ["Created at", project.get("created_at") or "-"],
                    ["Deadline", project.get("deadline") or "-"],
                    ["Finished", "Yes" if project.get("finalized") else "No"],
                ]
            )
        )
        story.append(Spacer(1, 6))
        story.append(ReportService.metrics_table(project_payload["metrics"]))
        story.append(Spacer(1, 6))
        story.append(
            ReportService.status_chart(
                project_payload["metrics"],
                f"Tasks per project · {project['name']}",
            )
        )
        story.append(Spacer(1, 8))
        story.append(
            ReportService.wp_status_chart(
                project_payload["work_packages"],
                "Tasks by status per work package",
            )
        )
        story.append(Spacer(1, 8))

        for wp in project_payload["work_packages"]:
            story.append(
                Paragraph(f"Work package: {wp['name']}", styles["h2"]))
            story.append(Paragraph(ReportService.metrics_sentence(
                wp["metrics"]), styles["body"]))
            story.append(Spacer(1, 4))
            story.append(ReportService.tasks_table(wp["tasks"]))
            story.append(Spacer(1, 8))

        if show_page_break:
            story.append(PageBreak())

    @staticmethod
    def render_pdf(scope: ReportScope, payload: dict[str, Any], generated_at: datetime) -> bytes:
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=18 * mm,
            leftMargin=18 * mm,
            topMargin=24 * mm,
            bottomMargin=20 * mm,
        )
        styles = ReportService.styles()
        story = []

        story.append(Paragraph(scope.title, styles["title"]))
        story.append(Paragraph(scope.subtitle, styles["subtitle"]))
        story.append(
            Paragraph(
                f"Generated at: {ReportService.fmt_dt(generated_at)}",
                styles["muted"],
            )
        )
        story.append(Spacer(1, 8))

        story.append(Paragraph("Executive summary", styles["h1"]))
        story.append(Paragraph(payload["narrative"], styles["body"]))
        story.append(Spacer(1, 8))

        story.append(ReportService.metrics_table(payload["metrics"]))
        story.append(Spacer(1, 8))

        if scope.kind == "project":
            story.append(ReportService.status_chart(
                payload["metrics"], "Tasks by status"))
        elif scope.kind == "department":
            story.append(ReportService.status_chart(
                payload["metrics"], "Tasks by department"))
            story.append(Spacer(1, 8))
            story.append(ReportService.comparison_chart_from_projects(
                payload["projects"], "Workload by project", "Tasks"))
        elif scope.kind == "organization":
            story.append(ReportService.status_chart(
                payload["metrics"], "Global distribution of tasks"))
            story.append(Spacer(1, 8))
            story.append(ReportService.comparison_chart_from_departments(
                payload["departments"], "Workload by department", "Tasks"))

        story.append(Spacer(1, 10))

        if scope.kind == "project":
            ReportService.append_project_detail(story, payload, styles)
        elif scope.kind == "department":
            ReportService.append_department_index(story, payload, styles)
            ReportService.append_department_detail(story, payload, styles)
        elif scope.kind == "organization":
            ReportService.append_organization_index(story, payload, styles)
            ReportService.append_organization_detail(story, payload, styles)

        doc.build(
            story,
            onFirstPage=ReportService.build_page_decorator(
                scope, generated_at),
            onLaterPages=ReportService.build_page_decorator(
                scope, generated_at),
        )
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

    # Report generation

    @staticmethod
    @staticmethod
    def generate_project_pdf(project_id: int):
        project = ReportService.get_project_tree(project_id)
        payload = ReportService.build_project_payload(project)
        scope = ReportScope(
            kind="project",
            entity_id=project.id,
            title=f"Project name: {project.name}",
            subtitle=f"Project #{project.id}",
        )
        generated_at = datetime.now(timezone.utc)
        pdf_bytes = ReportService.render_pdf(scope, payload, generated_at)

        print("PDF length:", len(pdf_bytes))
        print("PDF header:", pdf_bytes[:10])

        return ReportService.pdf_response(
            pdf_bytes,
            filename=f"Report_{project.name}.pdf",
        )

    @staticmethod
    def generate_department_pdf(department_id: int):
        department = ReportService.get_department_tree(department_id)
        payload = ReportService.build_department_payload(department)

        scope = ReportScope(
            kind="department",
            entity_id=department.id,
            title=f"Department name: {department.name}",
            subtitle=f"Department #{department.id}",
        )

        generated_at = datetime.now(timezone.utc)
        pdf_bytes = ReportService.render_pdf(scope, payload, generated_at)

        print("PDF length:", len(pdf_bytes))
        print("PDF header:", pdf_bytes[:10])

        return ReportService.pdf_response(
            pdf_bytes,
            filename=f"Report_{department.name}.pdf",
        )

    ORGANIZATION = {"id": None, "name": "BOHR"}

    @staticmethod
    def generate_organization_pdf():
        organization = ReportService.get_organization_tree()
        payload = ReportService.build_organization_payload(organization)

        scope = ReportScope(
            kind="organization",
            entity_id=ReportService.ORGANIZATION["id"],
            title=f"Organization: {ReportService.ORGANIZATION['name']}",
            subtitle="Organization report",
        )

        generated_at = datetime.now(timezone.utc)
        pdf_bytes = ReportService.render_pdf(scope, payload, generated_at)

        return ReportService.pdf_response(
            pdf_bytes,
            filename=f"Report_{ReportService.ORGANIZATION['name']}.pdf",
        )

    @staticmethod
    def pdf_response(pdf_bytes: bytes, filename: str):
        if not pdf_bytes:
            abort(500, description="Generated PDF is empty")

        if not pdf_bytes.startswith(b"%PDF"):
            abort(
                500, description=f"Generated content is not a valid PDF. Header: {pdf_bytes[:20]!r}")

        return send_file(
            BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename,
        )
