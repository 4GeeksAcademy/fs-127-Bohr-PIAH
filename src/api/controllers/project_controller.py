from flask import Blueprint, request, jsonify, abort
from api.services.project_service import ProjectService
from api.auth.decorators import require_permission

project_bp = Blueprint('projects', __name__, url_prefix='/projects')


# GET /api/projects - Get all projcets
@project_bp.route('', methods=['GET'])
@require_permission("projects:read")
def get_projects():
    projects = ProjectService.get_all()
    return jsonify(projects), 200


# GET /api/projects/<id> - Get project by id
@project_bp.route('/<int:project_id>', methods=['GET'])
@require_permission("projects:read")
def get_project(project_id):
    project = ProjectService.get_by_id(project_id)
    return jsonify(project), 200


# POST /api/projects - Create new project
@project_bp.route('', methods=['POST'])
@require_permission("projects:create")
def create_project():
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    project = ProjectService.create(body)
    return jsonify(project), 201


# PUT /api/projects/<id> - Edit project
@project_bp.route('/<int:project_id>', methods=['PUT'])
@require_permission("projects:update")
def update_project(project_id):
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    project = ProjectService.update(project_id, body)
    return jsonify(project), 200


# DELETE /api/projects/<id> - Delete project
@project_bp.route('/<int:project_id>', methods=['DELETE'])
@require_permission("projects:delete")
def delete_project(project_id):
    result = ProjectService.delete(project_id)
    return jsonify(result), 200


# GET /api/projects/<id> - Get project with all wp and tasks
@project_bp.route('/<int:project_id>/tree', methods=['GET'])
@require_permission("projects:read")
def get_project_tree(project_id):
    project = ProjectService.get_by_id_tree(project_id)
    return jsonify(project), 200


# GET api/departments/<int:department_id>/projects - get department with projects
@project_bp.route("<int:department_id>/projects", methods=["GET"])
@require_permission("projects:read")
def get_projects_by_department(department_id):
    result = ProjectService.get_projects_by_department(department_id)
    return jsonify(result), 200
