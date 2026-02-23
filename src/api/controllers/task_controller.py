from flask import Blueprint, request, jsonify, abort
from api.services.task_service import TaskService

task_bp = Blueprint('tasks', __name__, url_prefix='/tasks')


# GET /api/users - Get all tasks
@task_bp.route('', methods=['GET'])
def get_tasks():
    tasks = TaskService.get_all()
    return jsonify(tasks), 200


# GET /api/users/<id> - Get task by ID
@task_bp.route('/<int:task_id>', methods=['GET'])
def get_user(task_id):
    task = TaskService.get_by_id(task_id)
    return jsonify(task), 200



