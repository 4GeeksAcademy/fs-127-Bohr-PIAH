from flask import Blueprint
from api.services.report_service import ReportService
from api.auth.decorators import require_permission

report_bp = Blueprint("reports", __name__, url_prefix="/reports")


@report_bp.get("/project/<int:project_id>")
@require_permission("reports_project:create")
def generate_project_report(project_id: int):
    return ReportService.generate_project_pdf(project_id)


@report_bp.get("/department/<int:department_id>")
@require_permission("reports_department:create")
def generate_department_report(department_id: int):
    return ReportService.generate_department_pdf(department_id)


@report_bp.get("/organization")
@require_permission("reports_organization:create")
def generate_organization_report():
    return ReportService.generate_organization_pdf()
