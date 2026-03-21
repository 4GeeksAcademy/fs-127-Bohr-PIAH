"""
Servicio de usuarios - Logica de negocio para CRUD de User
"""


from flask import abort
from api.models import db, User, UserProject, WorkPackage
from api.models.project import Project
from api.models.user import RoleName
from sqlalchemy.orm import selectinload
VALID_ROLES = {role.value for role in RoleName}


class UserService:

    @staticmethod
    def get_all():
        users = User.query.all()
        return [user.serialize() for user in users]

    @staticmethod
    def get_by_id(user_id):
        user = User.query.get(user_id)
        if user is None:
            abort(404, description=f"User with id {user_id} not found")
        return user.serialize()

    @staticmethod
    def create(data):
        required_fields = ["first_name",
                           "last_name", "email", "password", "role"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"Field '{field}' is mandatory")

        if User.query.filter_by(email=data["email"]).first():
            abort(409, description="User with that email already existing")

        if data["role"] not in VALID_ROLES:
            abort(400, description=f"Invalid role {data['role']}")

        try:
            role_enum = RoleName(data["role"])
            new_user = User(
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=role_enum,
                is_active=data.get("is_active", True)
            )
            new_user.set_password(data["password"])
            db.session.add(new_user)
            db.session.commit()
            return new_user.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error creating user: {str(error)}")

    @staticmethod
    def update(user_id, data):
        user = User.query.get(user_id)
        if user is None:
            abort(404, description=f"User with id {user_id} not found")

        if "email" in data and data["email"] != user.email and data["email"] is not None:
            if User.query.filter_by(email=data["email"]).first():
                abort(409, description="User with that email already existing")
            user.email = data["email"]

        if "password" in data and data["password"] is not None:
            user.set_password(data["password"])
        if "first_name" in data and data["first_name"] is not None:
            user.set_first_name(data["first_name"])
        if "last_name" in data and data["last_name"] is not None:
            user.set_last_name(data["last_name"])
        if "role" in data and data["role"] is not None:
            if data["role"] not in VALID_ROLES:
                abort(400, description=f"Invalid role {data['role']}")
            user.set_role(data["role"])
        if "is_active" in data and data["is_active"] is not None:
            user.is_active = data["is_active"]
        if "department_id" in data:
            user.department_id = data["department_id"]

        try:
            db.session.commit()
            return user.serialize()
        except Exception as error:
            db.session.rollback()
            abort(
                500, description=f"Error updating user: {str(error)}")

    @staticmethod
    def delete(user_id):
        user = User.query.get(user_id)
        if user is None:
            abort(404, description=f"User with id {user_id} no t found")

        email = user.email
        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": f"user '{email}' deleted correctly"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error deleting user: {str(error)}")

    @staticmethod
    def get_by_id_with_projects(user_id):
        user = (
            User.query.options(
                selectinload(User.user_projects)
                    .selectinload(UserProject.project)
                    .selectinload(Project.work_packages)
                    .selectinload(WorkPackage.tasks)
            )
            .filter(User.id == user_id)
            .first()
        )

        if user is None:
            abort(404, description=f"User with id {user_id} not found")

        return user.serialize_with_projects()
