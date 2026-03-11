from flask import Blueprint, request, jsonify, abort
from api.services.work_package_service import WorkPackageService


work_package_bp = Blueprint(
    'work_packages', __name__, url_prefix='/work_packages')


# GET /api/work_packages - Get all work_packages
@work_package_bp.route('', methods=['GET'])
def get_work_packages():
    work_packages = WorkPackageService.get_all()
    return jsonify(work_packages), 200


# GET /api/work_packages/<id> - Get work package by id
@work_package_bp.route('/<int:work_package_id>', methods=['GET'])
def get_work_package(work_package_id):
    work_package = WorkPackageService.get_by_id(work_package_id)
    return jsonify(work_package), 200


# POST /api/work_packages - Create work package
@work_package_bp.route('', methods=['POST'])
def create_work_package():
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    work_package = WorkPackageService.create(body)
    return jsonify(work_package), 201


# PUT /api/work_packages/<id> - Edit work package
@work_package_bp.route('/<int:work_package_id>', methods=['PUT'])
def update_work_package(work_package_id):
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    work_package = WorkPackageService.update(work_package_id, body)
    return jsonify(work_package), 200


# DELETE /api/work_packages/<id> - Delete work package
@work_package_bp.route('/<int:work_package_id>', methods=['DELETE'])
def delete_work_package(work_package_id):
    result = WorkPackageService.delete(work_package_id)
    return jsonify(result), 200
