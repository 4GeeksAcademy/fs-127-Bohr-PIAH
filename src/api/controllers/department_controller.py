from flask import Blueprint, request, jsonify, abort
from api.services.department_service import DepartmentService

department_bp = Blueprint('departments', __name__, url_prefix='/departments')


# GET /api/departments - Get all departments
@department_bp.route('', methods=['GET'])
def get_departments():
    departments = DepartmentService.get_all()
    return jsonify(departments), 200

# GET /api/departments/<id> - Get department by id


@department_bp.route('/<int:department_id>', methods=['GET'])
def get_department_by_id(department_id):
    department = DepartmentService.get_by_id(department_id)
    return jsonify(department), 200


# POST /api/departments - Create new department
@department_bp.route('', methods=['POST'])
def create_departments():
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    department = DepartmentService.create(body)
    return jsonify(department), 201


# PUT /api/departments/<id> - Edit department
@department_bp.route('/<int:department_id>', methods=['PUT'])
def update_department(department_id):
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    department = DepartmentService.update(department_id, body)
    return jsonify(department), 200


# DELETE /api/departments/<id> - Delete department
@department_bp.route('/<int:department_id>', methods=['DELETE'])
def delete_department(department_id):
    result = DepartmentService.delete(department_id)
    return jsonify(result), 200


# GET /api/departments/<id> - get department with users
@department_bp.route('/<int:department_id>', methods=['GET'])
def get_department_with_users(department_id):
    department = DepartmentService.get_by_id_with_users(department_id)
    return jsonify(department), 200
