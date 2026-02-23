"""
Servicio de autenticacion - Login, Signup y validacion de tokens
"""

from flask import abort
from flask_jwt_extended import create_access_token
from api.models import db, User


class AuthService:

    @staticmethod
    def signup(data):
        """Registrar un nuevo usuario con password hasheado."""
        # Cambiado: eliminado 'username', añadido 'first_name' y 'last_name' para que coincida con el modelo User
        required_fields = ["email", "first_name", "last_name", "password"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"El campo '{field}' es obligatorio")

        if User.query.filter_by(email=data["email"]).first():
            abort(409, description="Ya existe un usuario con ese email")

        try:
            # Cambiado: eliminado 'username', añadido 'first_name' y 'last_name'
            new_user = User(
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                is_active=True
            )
            new_user.set_password(data["password"])
            db.session.add(new_user)
            db.session.commit()

            access_token = create_access_token(identity=str(new_user.id))
            return {
                "user": new_user.serialize(),
                "token": access_token
            }
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al registrar usuario: {str(error)}")

    @staticmethod
    def login(data):
        """Autenticar usuario y devolver token JWT."""
        if "email" not in data or "password" not in data:
            abort(400, description="Email y password son obligatorios")

        user = User.query.filter_by(email=data["email"]).first()
        if user is None:
            abort(401, description="Email o password incorrectos")

        if not user.is_active:
            abort(401, description="La cuenta esta desactivada")

        if not user.check_password(data["password"]):
            abort(401, description="Email o password incorrectos")

        access_token = create_access_token(identity=str(user.id))
        return {
            "user": user.serialize(),
            "token": access_token
        }

    @staticmethod
    def get_current_user(user_id):
        """Obtener el usuario actual a partir del identity del token."""
        user = User.query.get(int(user_id))
        if user is None:
            abort(404, description="Usuario no encontrado")
        return user.serialize()
    
    @staticmethod
    def update_user(user_id, data):
        user = User.query.get(int(user_id))
        if user is None:
            abort(404, description="Usuario no encontrado")

        if "email" in data and data["email"]:
            existing = User.query.filter_by(email=data["email"]).first()
            if existing and existing.id != user.id:
                abort(409, description="Ya existe un usuario con ese email")
            user.email = data["email"]

        if "first_name" in data and data["first_name"]:
            user.first_name = data["first_name"]

        if "last_name" in data and data["last_name"]:
            user.last_name = data["last_name"]

        if "password" in data and data["password"]:
            user.set_password(data["password"])

        try:
            db.session.commit()
            return user.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al actualizar usuario: {str(error)}")

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(int(user_id))
        if user is None:
            abort(404, description="Usuario no encontrado")

        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error al eliminar usuario: {str(error)}")
