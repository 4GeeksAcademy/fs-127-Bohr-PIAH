from functools import wraps
from flask import jsonify
from api.services.auth_service import AuthService
from flask_jwt_extended import get_jwt_identity
from auth.permissions import PERMISSIONS


def require_permission(permission):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):

            user_id = get_jwt_identity()
            user = AuthService.get_current_user(user_id)

            if not user:
                return jsonify({"error": "Authentication required"}), 401

            role = user["role"]

            allowed_roles = PERMISSIONS.get(permission, [])

            if role not in allowed_roles:
                return jsonify({"error": "Forbidden"}), 403

            return fn(*args, **kwargs)

        return wrapper
    return decorator
