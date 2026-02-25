from flask import abort
from api.models import db, Project, User


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
        if "project_id" not in data:
            abort(400, description="Field 'project_id' is mandatory")

        required_fields = ["name", "created_by"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"Field '{field}' is mandatory")

        # Verify that project exists
        project = Project.query.get(data["project_id"])
        if project is None:
            abort(
                404, description=f"Project with id {data['user_id']} not found")

        # Validate fields before order execution
        # y comprobar que es jefe o admin
        if not User.query.filter_by(id=data["created_by"]).first():
            abort(404, description="Creator user not found")

        # Validar que deadline sea mayor que start date

        try:
            new_project = Project(
                name=data["name"],
                created_by=data["created_by"],
                created_at=data["created_at"],
                deadline=data["deadline"],
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
            abort(404, description=f"Project with id {order_id} not found")

        if "name" in data:
            project.name = data["name"]

        if "created_by" in data:
            # y comprobar que es jefe o admin
            if not User.query.filter_by(id=data["created_by"]).first():
                abort(404, description="Creator user not found")
            project.created_by = data["created_by"]

        if "created_at" in data:
            # comprobar que se creó antes de ahora
            project.created_at = data["created_at"]

        if "deadline" in data:
            # comprobar que es mayor a created_at
            project.deadline = data["deadline"]

        if "finalized" in data:
            project.finalized = data["finalized"]

        try:
            db.session.commit()
            return project.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error updating user: {str(error)}")

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
