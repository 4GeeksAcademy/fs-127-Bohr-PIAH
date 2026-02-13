"""
Servicio de usuarios - Logica de negocio para CRUD de User
"""

from flask import abort
from api.models import db, User, ProfileInfo


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
        # Validar campos obligatorios
        required_fields = ["email", "username", "password"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"El campo '{field}' es obligatorio")

        # Verificar duplicados
        if User.query.filter_by(email=data["email"]).first():
            abort(409, description="Ya existe un usuario con ese email")

        if User.query.filter_by(username=data["username"]).first():
            abort(409, description="Ya existe un usuario con ese username")

        try:
            new_user = User(
                email=data["email"],
                username=data["username"],
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

        # Verificar duplicados si se cambia email o username
        if "email" in data and data["email"] != user.email:
            if User.query.filter_by(email=data["email"]).first():
                abort(409, description="Ya existe un usuario con ese email")
            user.email = data["email"]

        if "username" in data and data["username"] != user.username:
            if User.query.filter_by(username=data["username"]).first():
                abort(409, description="Ya existe un usuario con ese username")
            user.username = data["username"]

        if "password" in data:
            user.set_password(data["password"])
        if "is_active" in data:
            user.is_active = data["is_active"]

        try:
            db.session.commit()
            return user.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al actualizar usuario: {str(error)}")

    @staticmethod
    def delete(user_id):
        user = User.query.get(user_id)
        if user is None:
            abort(404, description=f"Usuario con id {user_id} no encontrado")

        username = user.username
        try:
            db.session.delete(user)
            db.session.commit()
            return {"message": f"Usuario '{username}' eliminado correctamente"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al eliminar usuario: {str(error)}")

    @staticmethod
    def create_with_profile(data):
        # Validar campos obligatorios del usuario
        required_fields = ["email", "username", "password"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"El campo '{field}' es obligatorio")

        # Verificar duplicados
        if User.query.filter_by(email=data["email"]).first():
            abort(409, description="Ya existe un usuario con ese email")
        if User.query.filter_by(username=data["username"]).first():
            abort(409, description="Ya existe un usuario con ese username")

        try:
            new_user = User(
                email=data["email"],
                username=data["username"],
                is_active=data.get("is_active", True)
            )
            new_user.set_password(data["password"])

            # Crear el perfil asociado
            profile_data = data.get("profile", {})
            new_profile = ProfileInfo(
                first_name=profile_data.get("first_name"),
                last_name=profile_data.get("last_name"),
                phone=profile_data.get("phone"),
                address=profile_data.get("address"),
                bio=profile_data.get("bio"),
                avatar_url=profile_data.get("avatar_url")
            )
            new_user.profile = new_profile

            db.session.add(new_user)
            db.session.commit()
            return new_user.serialize_with_profile()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al crear usuario con perfil: {str(error)}")

    @staticmethod
    def get_with_orders(user_id):
        user = User.query.get(user_id)
        if user is None:
            abort(404, description=f"Usuario con id {user_id} no encontrado")
        return user.serialize_with_orders()
