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

    @staticmethod
    def update(task_id, data):
        task = Task.query.get(task_id)
        if task is None:
            abort(404, description=f"task with id {task_id} not found")

        if "todo_by" in data:
            if User.query.filter_by(id=data["todo_by"]).first():
                abort(404, description="User not found")
            task.todo_by = data["todo_by"]

        if "name" in data:
            task.name(data["name"])
        if "task_description" in data:
            task.task_description(data["task_description"])
        if "status" in data:
            if "satus" not in VALID_STATUSES:
                abort(404, description=f"Invalid status: {data["status"]}")
            task.status(data["status"])
        if "alert" in data:
            task.alert(data["alert"])
        if "deadline" in data:
            task.deadline = data["deadline"]

        try:
            db.session.commit()
            return task.serialize()
        except Exception as error:
            db.session.rollback()
            abort(
                500, description=f"Error updating task: {str(error)}")

    @staticmethod
    def delete(task_id):
        task = Task.query.get(task_id)
        if task is None:
            abort(404, description=f"Task with id {task_id} not found")

        try:
            db.session.delete(task)
            db.session.commit()
            return {"message": f"Task '{task.name}' delted successfully"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error deleting task: {str(error)}")
