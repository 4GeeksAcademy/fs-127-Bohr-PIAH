from datetime import datetime, timezone
from flask import abort
from api.models import db, Project, User
from sqlalchemy.orm import selectinload
from api.models.user import RoleName
from api.models.work_package import WorkPackage


def parse_dt_utc(value, field_name) -> datetime:
    if isinstance(value, datetime):
        dt = value
    elif isinstance(value, str):
        s = value.strip()
        if s.endswith("Z"):
            s = s[:-1] + "+00:00"
        try:
            dt = datetime.fromisoformat(s)
        except ValueError:
            raise ValueError(f"{field_name} must be ISO 8601 datetime")
    else:
        raise ValueError(f"{field_name} must be datetime or ISO string")

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)

    return dt


class ProjectService:

    @staticmethod
    def get_all():
        projects = Project.query.all()
        return [project.serialize() for project in projects]

    @staticmethod
    def get_by_id(project_id):
        project = Project.query.get(project_id)
        if project is None:
            abort(404, description=f"Project with ID {project_id} not found")
        return project.serialize()

    @staticmethod
    def create(data):
        required_fields = ["user_id", "name", "created_by"]
        for field in required_fields:
            if field not in data or data[field] is None or data[field] == "":
                abort(400, description=f"Field '{field}' is mandatory")

        owner = User.query.get(data["user_id"])
        if owner is None:
            abort(404, description=f"User with id {data['user_id']} not found")

        creator = User.query.get(data["created_by"])
        if creator is None:
            abort(404, description="Creator user not found")

        if creator.role not in (RoleName.admin, RoleName.head):
            abort(403, description="created_by must be admin or head")

        now_utc = datetime.now(timezone.utc)

        if "created_at" in data and data["created_at"] is not None:
            try:
                created_at = parse_dt_utc(data["created_at"], "created_at")
            except ValueError as e:
                abort(400, description=str(e))

            if created_at > now_utc:
                abort(400, description="created_at cannot be in the future (UTC)")
        else:
            created_at = now_utc

        deadline = None
        if "deadline" in data and data["deadline"] is not None:
            try:
                deadline = parse_dt_utc(data["deadline"], "deadline")
            except ValueError as e:
                abort(400, description=str(e))

            if deadline < created_at:
                abort(400, description="deadline must be >= created_at (UTC)")

        try:
            new_project = Project(
                user_id=data["user_id"],
                name=data["name"],
                created_by=data["created_by"],
                created_at=created_at,
                deadline=deadline,
                finalized=data.get("finalized", False)
            )

            db.session.add(new_project)
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

        if "created_at" in data and data["created_at"] is not None:
            try:
                created_at = parse_dt_utc(data["created_at"], "created_at")
            except ValueError as e:
                abort(400, description=str(e))

            if created_at > now_utc:
                abort(400, description="created_at cannot be in the future (UTC)")

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

                if deadline < created_at_ref:
                    abort(400, description="deadline must be >= created_at (UTC)")

                project.deadline = deadline

        if "finalized" in data and data["finalized"] is not None:
            project.finalized = bool(data["finalized"])

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
            abort(
                404, description=f"Project with id {project_id} not found")

        return project.serialize_with_wps()
