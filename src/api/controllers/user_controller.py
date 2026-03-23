"""
Controlador de usuarios - Endpoints /api/users
"""

from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required
from api.services.user_service import UserService
from api.auth.decorators import require_permission

user_bp = Blueprint('users', __name__, url_prefix='/users')


# GET /api/users - Obtener todos los usuarios (protegido)
@user_bp.route('', methods=['GET'])
@require_permission("users:read")
@jwt_required()
def get_users():
    users = UserService.get_all()
    return jsonify(users), 200


# GET /api/users/<id> - Obtener un usuario por ID
@user_bp.route('/<int:user_id>', methods=['GET'])
@require_permission("users:read")
@jwt_required()
def get_user(user_id):
    user = UserService.get_by_id(user_id)
    return jsonify(user), 200


# POST /api/users - Crear un nuevo usuario (protegido)
@user_bp.route('', methods=['POST'])
@require_permission("users:create")
@jwt_required()
def create_user():
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    user = UserService.create(body)
    return jsonify(user), 201


# PUT /api/users/<id> - Editar un usuario (protegido)
@user_bp.route('/<int:user_id>', methods=['PUT'])
@require_permission("users:update")
@jwt_required()
def update_user(user_id):
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    user = UserService.update(user_id, body)
    return jsonify(user), 200


# DELETE /api/users/<id> - Eliminar un usuario (protegido)
@user_bp.route('/<int:user_id>', methods=['DELETE'])
@require_permission("users:delete")
@jwt_required()
def delete_user(user_id):
    result = UserService.delete(user_id)
    return jsonify(result), 200


# GET /api/users/<id>/projects - Usuario con proyectos
@user_bp.route('/<int:user_id>/projects', methods=['GET'])
@require_permission("users:read")
@jwt_required()
def get_user_with_projects(user_id):
    user = UserService.get_by_id_with_projects(user_id)
    return jsonify(user), 200
