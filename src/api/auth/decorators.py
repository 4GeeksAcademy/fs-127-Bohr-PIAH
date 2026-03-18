from functools import wraps
from flask import jsonify
from api.services.auth_service import AuthService
<<<<<<< feat/1.7.2_Make_token_permanent
from flask_jwt_extended import get_jwt_identity
from api.auth.permissions import PERMISSIONS
=======
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from .permissions import PERMISSIONS
>>>>>>> dev


def require_permission(permission):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):

            verify_jwt_in_request()
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
