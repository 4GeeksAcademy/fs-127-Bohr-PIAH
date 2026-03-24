"""
Authentication service - Login, Signup and token validation
"""
import os
import resend
from datetime import timedelta
from flask import abort
from flask_jwt_extended import create_access_token, decode_token
from api.models import db, User
from api.models.user import RoleName
from api.services.email_service import send_password_changed_email


class AuthService:

    @staticmethod
    def signup(data):
        """Register a new user with hashed password."""
        required_fields = ["email", "first_name", "last_name", "password"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"Field '{field}' is required")

        if User.query.filter_by(email=data["email"]).first():
            abort(409, description="A user with that email already exists")

        try:
            new_user = User(
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                is_active=True,
                role=RoleName[data["role"].lower()] if "role" in data and data["role"] else RoleName.GUEST,
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
            abort(500, description=f"Error registering user: {error}")

    @staticmethod
    def login(data):
        """Authenticate user and return JWT token."""
        if "email" not in data or "password" not in data:
            abort(400, description="Email and password are required")

        user = User.query.filter_by(email=data["email"]).first()
        if user is None:
            abort(401, description="Invalid email or password")

        if not user.is_active:
            abort(401, description="Account is disabled")

        if not user.check_password(data["password"]):
            abort(401, description="Invalid email or password")

        access_token = create_access_token(identity=str(user.id))
        return {
            "user": user.serialize(),
            "token": access_token
        }

    @staticmethod
    def get_current_user(user_id):
        """Get current user from token identity."""
        user = User.query.get(int(user_id))
        if user is None:
            abort(404, description="User not found")
        return user.serialize()

    @staticmethod
    def update_user(user_id, data):
        user = User.query.get(int(user_id))
        if user is None:
            abort(404, description="User not found")

        if "email" in data and data["email"]:
            existing = User.query.filter_by(email=data["email"]).first()
            if existing and existing.id != user.id:
                abort(409, description="A user with that email already exists")
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
            abort(500, description=f"Error updating user: {error}")

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(int(user_id))
        if user is None:
            abort(404, description="User not found")

        try:
            db.session.delete(user)
            db.session.commit()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error deleting user: {error}")

    @staticmethod
    def forgot_password(data):
        if "email" not in data or not data["email"]:
            abort(400, description="Email is required")

        user = User.query.filter_by(email=data["email"]).first()
        if user is None:
            abort(404, description="No user found with that email")

        reset_token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(minutes=60),
            additional_claims={"type": "password_reset"}
        )

        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"

        # Configuramos la API key de Resend leyéndola del archivo .env
        resend.api_key = os.getenv("RESEND_API_KEY")

        # En desarrollo sin dominio verificado, Resend solo permite enviar
        # al email de la cuenta de Resend. RESEND_TEST_EMAIL permite redirigir
        # todos los emails a ese email de prueba.
        # En producción con dominio verificado, se elimina RESEND_TEST_EMAIL
        # del .env y los emails llegarán al email real de cada usuario.
        to_email = os.getenv("RESEND_TEST_EMAIL", user.email)

        try:
            resend.Emails.send({
                "from": "onboarding@resend.dev",
                "to": to_email,
                "subject": "Password Recovery - Bohr PIAH",
                "html": f"""
                    <h2>Password Recovery</h2>
                    <p>Hi {user.first_name},</p>
                    <p>Click the link below to reset your password:</p>
                    <a href="{reset_link}">Reset Password</a>
                    <p>This link expires in 60 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                """
            })
        except Exception:
            abort(503, description="Email service unavailable. Please try again later.")

        return {"message": "Password recovery email sent successfully"}

    @staticmethod
    def reset_password(data):
        if "token" not in data or "new_password" not in data:
            abort(400, description="Token and new password are required")

        try:
            decoded = decode_token(data["token"])
        except Exception:
            abort(401, description="Invalid or expired token")

        if decoded.get("type") != "password_reset":
            abort(401, description="Invalid token")

        user = User.query.get(int(decoded.get("sub")))
        if user is None:
            abort(404, description="User not found")

        user.set_password(data["new_password"])
        try:
            db.session.commit()
            return {"message": "Password updated successfully"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error updating password: {error}")

    @staticmethod
    def change_password(user_id, data):
        if "current_password" not in data or "new_password" not in data:
            abort(400, description="Current password and new password are required")

        user = User.query.get(int(user_id))
        if user is None:
            abort(404, description="User not found")

        if not user.check_password(data["current_password"]):
            abort(401, description="Current password is incorrect")

        user.set_password(data["new_password"])
        try:
            db.session.commit()
            try:
                send_password_changed_email(user)
            except Exception:
                pass
            return {"message": "Password changed successfully"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error changing password: {error}")