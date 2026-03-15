# guardar como texto y evaluar al final de la función para que no se rompa porque haya atributos que todavía no existen
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from io import BytesIO
from typing import Any

from flask import abort, send_file
from sqlalchemy.orm import selectinload

from api.models import Department, Project
from api.models.task import Task
from api.models.work_package import WorkPackage

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
        status = task.status.value if hasattr(
            task.status, "value") else str(task.status)
        return {
            "id": task.id,
            "name": task.name,
            "description": task.task_description,
            "status": status,
            "alert": bool(getattr(task, "alert", False)),
            "todo_by": getattr(task, "todo_by", None),
            "created_at": ReportService.fmt_dt(task.created_at),
            "deadline": ReportService.fmt_dt(task.deadline),
            "is_overdue": ReportService.is_overdue(task.deadline, task.status),
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
            project_payload = ReportService._build_project_payload(project)
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
            "narrative": ReportService._department_narrative(
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
            department_payload = ReportService._build_department_payload(
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
            "narrative": ReportService._organization_narrative(departments_payload, all_tasks),
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
            f"cmopletion rate {metrics['progress_pct']}%."
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
                    "Sí" if task.get("alert") else "No",
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
