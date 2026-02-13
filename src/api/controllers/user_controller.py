"""
Controlador de usuarios - Endpoints /api/users
"""

from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import jwt_required
from api.services.user_service import UserService

user_bp = Blueprint('users', __name__, url_prefix='/users')


# GET /api/users - Obtener todos los usuarios (protegido)
@user_bp.route('', methods=['GET'])
@jwt_required()
def get_users():
    users = UserService.get_all()
    return jsonify(users), 200


# GET /api/users/<id> - Obtener un usuario por ID
@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = UserService.get_by_id(user_id)
    return jsonify(user), 200


# POST /api/users - Crear un nuevo usuario (protegido)
@user_bp.route('', methods=['POST'])
@jwt_required()
def create_user():
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    user = UserService.create(body)
    return jsonify(user), 201


# PUT /api/users/<id> - Editar un usuario (protegido)
@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    user = UserService.update(user_id, body)
    return jsonify(user), 200


# DELETE /api/users/<id> - Eliminar un usuario (protegido)
@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    result = UserService.delete(user_id)
    return jsonify(result), 200


# POST /api/users/with-profile - Crear usuario con su perfil (protegido)
@user_bp.route('/with-profile', methods=['POST'])
@jwt_required()
def create_user_with_profile():
    body = request.get_json()
    if not body:
        abort(400, description="El body no puede estar vacio")
    user = UserService.create_with_profile(body)
    return jsonify(user), 201


# GET /api/users/<id>/orders - Obtener un usuario con sus ordenes
@user_bp.route('/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    user = UserService.get_with_orders(user_id)
    return jsonify(user), 200
