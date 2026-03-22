from datetime import datetime, timezone
from flask import abort
from sqlalchemy.orm import selectinload
from api.models import UserProject, db, Project, User, Department
from api.models.user import RoleName
from api.models.work_package import WorkPackage
from api.services.common import parse_dt_utc


class ProjectService:

    @staticmethod
    def get_all():
        projects = Project.query.all()
        return [project.serialize_with_wps() for project in projects]

    @staticmethod
    def get_by_id(project_id):
        project = Project.query.get(project_id)
        if project is None:
            abort(404, description=f"Project with ID {project_id} not found")
        return project.serialize()

    @staticmethod
    def get_projects_by_department(department_id):
        department = Department.query.get(department_id)
        if department is None:
            abort(
                404, description=f"Department with id {department_id} not found")

        projects = Project.query.filter_by(department_id=department_id).all()
        return [project.serialize() for project in projects]

    @staticmethod
    def create(data):
        required_fields = ["department_id", "name", "created_by"]
        for field in required_fields:
            if field not in data or data[field] is None or data[field] == "":
                abort(400, description=f"Field '{field}' is mandatory")

        department = Department.query.get(data["department_id"])
        if department is None:
            abort(
                404, description=f"Department with id {data['department_id']} not found")

        if department.head_id is None:
            abort(400, description="Department must have a head before creating projects")

        creator = User.query.get(data["created_by"])
        if creator is None:
            abort(404, description="Creator user not found")

        now_utc = datetime.now(timezone.utc)

        created_at = now_utc
        if data.get("created_at"):
            try:
                created_at = parse_dt_utc(data["created_at"], "created_at")
            except ValueError as e:
                abort(400, description=str(e))

            if created_at > now_utc:
                abort(400, description="created_at cannot be in the future")

        deadline = None
        if data.get("deadline"):
            try:
                deadline = parse_dt_utc(data["deadline"], "deadline")
            except ValueError as e:
                abort(400, description=str(e))

            if deadline < created_at:
                abort(400, description="deadline must be >= created_at")

        user_emails = data.get("user_emails", []) or []
        user_emails = list(set(user_emails))

        users = []
        if user_emails:
            users = User.query.filter(User.email.in_(user_emails)).all()

            found_emails = {u.email for u in users}
            missing_emails = [
                email for email in user_emails if email not in found_emails]

            if missing_emails:
                abort(404, description=f"Users not found: {missing_emails}")

        try:
            new_project = Project(
                department_id=department.id,
                user_id=department.head_id,
                name=data["name"],
                created_by=data["created_by"],
                created_at=created_at,
                deadline=deadline,
                finalized=data.get("finalized", False)
            )

            db.session.add(new_project)
            db.session.flush()

            for user in users:
                db.session.add(UserProject(
                    user_id=user.id,
                    project_id=new_project.id
                ))

            if department.head_id not in [u.id for u in users]:
                db.session.add(UserProject(
                    user_id=department.head_id,
                    project_id=new_project.id
                ))

            db.session.commit()
            return new_project.serialize()

        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error creating project: {str(error)}")

    @staticmethod
    def update(project_id, data):
        project = Project.query.get(project_id)
        if project is None:
            abort(404, description=f"Project with id {project_id} not found")

        now_utc = datetime.now(timezone.utc)

        if "name" in data and data["name"] is not None:
            project.name = data["name"]

        if "created_by" in data and data["created_by"] is not None:
            creator = User.query.get(data["created_by"])
            if creator is None:
                abort(404, description="Creator user not found")

            if creator.role not in (RoleName.admin, RoleName.head):
                abort(403, description="created_by must be admin or head")

            project.created_by = creator.id

        if "department_id" in data and data["department_id"] is not None:
            department = Department.query.get(data["department_id"])
            if department is None:
                abort(
                    404, description=f"Department with id {data['department_id']} not found")

            if department.head_id is None:
                abort(
                    400, description="Department must have a head before assigning projects")

            project.department_id = department.id
            project.user_id = department.head_id

        if "created_at" in data and data["created_at"] is not None:
            try:
                created_at = parse_dt_utc(data["created_at"], "created_at")
            except ValueError as e:
                abort(400, description=str(e))

            if created_at > now_utc:
                abort(400, description="created_at cannot be in the future (UTC)")

            current_deadline = project.deadline
            if current_deadline is not None:
                if current_deadline.tzinfo is None:
                    current_deadline = current_deadline.replace(
                        tzinfo=timezone.utc)
                else:
                    current_deadline = current_deadline.astimezone(
                        timezone.utc)

                if current_deadline < created_at:
                    abort(
                        400, description="created_at cannot be greater than current deadline (UTC)")

            project.created_at = created_at

        if "deadline" in data:
            if data["deadline"] is None:
                project.deadline = None
            else:
                try:
                    deadline = parse_dt_utc(data["deadline"], "deadline")
                except ValueError as e:
                    abort(400, description=str(e))

                created_at_ref = project.created_at
                if created_at_ref is None:
                    abort(
                        400, description="created_at is required before setting deadline")

                if isinstance(created_at_ref, datetime) and created_at_ref.tzinfo is None:
                    created_at_ref = created_at_ref.replace(
                        tzinfo=timezone.utc)
                else:
                    created_at_ref = created_at_ref.astimezone(timezone.utc)

                if deadline < created_at_ref:
                    abort(400, description="deadline must be >= created_at (UTC)")

                project.deadline = deadline

        if "finalized" in data and data["finalized"] is not None:
            project.finalized = bool(data["finalized"])

        if "user_emails" in data:
            user_emails = data.get("user_emails") or []
            user_emails = list(set(user_emails))

            users = []
            if user_emails:
                users = User.query.filter(User.email.in_(user_emails)).all()

                found_emails = {u.email for u in users}
                missing_emails = [
                    email for email in user_emails if email not in found_emails]

                if missing_emails:
                    abort(
                        404, description=f"Users not found: {missing_emails}")

            project.user_projects.clear()

            for user in users:
                project.user_projects.append(
                    UserProject(user_id=user.id, project_id=project.id)
                )

        try:
            db.session.commit()
            return project.serialize()

        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error updating project: {str(error)}")

    @staticmethod
    def delete(project_id):
        project = Project.query.get(project_id)
        if project is None:
            abort(404, description=f"Project with ID {project_id} not found")

        try:
            db.session.delete(project)
            db.session.commit()
            return {"message": f"Project #{project_id} deleted successfully"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error deleting project: {str(error)}")

    @staticmethod
    def get_by_id_tree(project_id):
        project = (
            Project.query.options(
                selectinload(Project.work_packages)
                .selectinload(WorkPackage.tasks)
            )
            .filter(Project.id == project_id)
            .first()
        )

        if project is None:
            abort(404, description=f"Project with id {project_id} not found")

        return project.serialize_with_wps()
