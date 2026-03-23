from flask import Blueprint, request, jsonify, abort
from api.services.task_service import TaskService
from api.auth.decorators import require_permission

task_bp = Blueprint('tasks', __name__, url_prefix='/tasks')

# GET /api/tasks - Get all tasks


@task_bp.route('', methods=['GET'])
@require_permission("tasks:read")
def get_tasks():
    tasks = TaskService.get_all()
    return jsonify(tasks), 200


# GET /api/tasks/<id> - Get task by ID
@task_bp.route('/<int:task_id>', methods=['GET'])
@require_permission("tasks:read")
def get_user(task_id):
    task = TaskService.get_by_id(task_id)
    return jsonify(task), 200


# POST /api/tasks - Create a new task
@task_bp.route('', methods=['POST'])
@require_permission("tasks:create")
def create_task():
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    task = TaskService.create(body)
    return jsonify(task), 201


# PUT /api/tasks/<id> - Edit task
@task_bp.route('/<int:task_id>', methods=['PUT'])
@require_permission("tasks:update")
def update_user(task_id):
    body = request.get_json()
    if not body:
        abort(400, description="Body cannot be empty")
    task = TaskService.update(task_id, body)
    return jsonify(task), 200


# DELETE /api/tasks/<id> - Delete task
@task_bp.route('/<int:task_id>', methods=['DELETE'])
@require_permission("tasks:delete")
def delete_user(task_id):
    result = TaskService.delete(task_id)
    return jsonify(result), 200
