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


# GET /api/auth/me - Obtener usuario actual (requiere token)
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()
    user = AuthService.get_current_user(current_user_id)
    return jsonify(user), 200
