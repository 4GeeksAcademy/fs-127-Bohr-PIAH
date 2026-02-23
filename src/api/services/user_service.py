"""
Servicio de usuarios - Logica de negocio para CRUD de User
"""


from flask import abort
from api.models import db, User
from api.models.user import RoleName
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
        return user.serialize_with_profile()

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
            abort(404, description="Role invalid}")

        try:
            new_user = User(
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=data["role"],
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

    # @staticmethod
    # def get_with_orders(user_id):
    #     user = User.query.get(user_id)
    #     if user is None:
    #         abort(404, description=f"Usuario con id {user_id} no encontrado")
    #     return user.serialize_with_orders()
