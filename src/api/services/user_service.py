"""
Servicio de usuarios - Logica de negocio para CRUD de User
"""


from flask import abort
from api.models import db, User
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
            abort(404, description=f"Usuario con id {user_id} no encontrado")
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
            abort(400, description=f"Invalid role {data["role"]}")

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
            abort(500, description=f"Error al crear usuario: {str(error)}")

    @staticmethod
    def update(user_id, data):
        user = User.query.get(user_id)
        if user is None:
            abort(404, description=f"Usuario con id {user_id} no encontrado")

        if "email" in data and data["email"] != user.email:
            if User.query.filter_by(email=data["email"]).first():
                abort(409, description="Ya existe un usuario con ese email")
            user.email = data["email"]

        if "password" in data:
            user.set_password(data["password"])
        if "first_name" in data:
            user.set_first_name(data["first_name"])
        if "last_name" in data:
            user.set_last_name(data["last_name"])
        if "role" in data:
            if data["role"] not in VALID_ROLES:
                abort(400, description=f"Invalid role {data['role']}")
            user.set_role(data["role"])
        if "is_active" in data:
            user.is_active = data["is_active"]

        try:
            db.session.commit()
            return user.serialize()
        except Exception as error:
            db.session.rollback()
            abort(
                500, description=f"Error al actualizar usuario: {str(error)}")

    @staticmethod
    def delete(user_id):
        user = User.query.get(user_id)
        if user is None:
            abort(404, description=f"Usuario con id {user_id} no encontrado")

        email = user.email
        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": f"Usuario '{email}' eliminado correctamente"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al eliminar usuario: {str(error)}")

    @staticmethod
    def get_by_id_with_projects(user_id):
        user = (
            User.query.options(
                selectinload(User.owned_projects),
                selectinload(User.user_projects)
            )
            .filter(User.id == user_id)
            .first()
        )

        if user is None:
            abort(404, description=f"User with id {user_id} not found")

        return user.serialize_with_projects()
