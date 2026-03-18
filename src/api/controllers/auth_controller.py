"""
Controlador de autenticacion - Endpoints /api/auth
"""

from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


# POST /api/auth/signup - Registrar un nuevo usuario
@auth_bp.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    result = AuthService.signup(body)
    return jsonify(result), 201


# POST /api/auth/login - Iniciar sesion
@auth_bp.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    result = AuthService.login(body)
    return jsonify(result), 200


#GET /api/auth/me - Obtener usuario actual (requiere token)
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()
    user = AuthService.get_current_user(current_user_id)
    return jsonify(user), 200

# PUT /api/auth/me - Actualizar usuario actual
@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_me():
    current_user_id = get_jwt_identity()
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    result = AuthService.update_user(current_user_id, body)
    return jsonify(result), 200


# DELETE /api/auth/me - Eliminar usuario actual
@auth_bp.route('/me', methods=['DELETE'])
@jwt_required()
def delete_me():
    current_user_id = get_jwt_identity()
    AuthService.delete_user(current_user_id)
    return jsonify({"message": "Usuario eliminado correctamente"}), 200


# POST /api/auth/forgot-password - Solicitar recuperacion de contraseña
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    result = AuthService.forgot_password(body)
    return jsonify(result), 200


# POST /api/auth/reset-password - Restablecer contraseña con token
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    result = AuthService.reset_password(body)
    return jsonify(result), 200

# POST /api/auth/change-password - Change password
@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    result = AuthService.change_password(current_user_id, body)
    return jsonify(result), 200
