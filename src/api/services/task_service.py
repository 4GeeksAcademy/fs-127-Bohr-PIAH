from flask import abort
from api.models import db, Task, User
from api.models.task import Status
VALID_STATUSES = {status.value for status in Status}


class TaskService:

    @staticmethod
    def get_all():
        tasks = Task.query.all()
        return [task.serialize() for task in tasks]

    @staticmethod
    def get_by_id(task_id):
        task = Task.query.get(task_id)
        if task is None:
            abort(404, description=f"Task with id {task_id} not found")
        return task.serialize()

    @staticmethod
    def create(data):
        required_fields = ["wp_id", "name",
                           "task_description", "status", "todo_by", "deadline"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"Field '{field}' is mandatory")

        if not Task.query.filter_by(wp_id=data["wp_id"]).first():
            abort(409, description="Work package non existant")

        if not User.query.filter_by(id=data["todo_by"]).first():
            abort(404, description="Asignee not found")

        # Ver tema fechas cómo gestionar
        # if deadline < día de hoy -> error

        try:
            new_task = Task(
                wp_id=data["wp_id"],
                name=data["name"],
                task_description=data["task_description"],
                status=data.get("status", "to_do"),
                alert=data.get("alert", False),
                todo_by=data["todo_by"],
                created_at=data["created_at"],
                deadline=data["deadline"]
            )

            db.session.add(new_task)
            db.session.commit()
            return new_task.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error creating task: {str(error)}")
