from datetime import datetime, timezone

from flask import abort
from api.models import db, Task, User, WorkPackage
from api.models.task import Status
from api.services.common import parse_dt_utc
from api.services.email_service import send_task_assigned_email
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
        required_fields = ["wp_id", "name"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"Field '{field}' is mandatory")

        if not WorkPackage.query.filter_by(id=data["wp_id"]).first():
            abort(409, description="Work package non existant")

        if data.get("todo_by") and not User.query.filter_by(id=data["todo_by"]).first():
            abort(404, description="Asignee not found")

        now_utc = datetime.now(timezone.utc)

        if "created_at" in data and data["created_at"] is not None:
            try:
                created_at = parse_dt_utc(data["created_at"], "created_at")
            except ValueError as e:
                abort(400, description=str(e))

            if created_at > now_utc:
                abort(400, description="created_at cannot be in the future (UTC)")
        else:
            created_at = now_utc

        deadline = None
        if "deadline" in data and data["deadline"] is not None:
            try:
                deadline = parse_dt_utc(data["deadline"], "deadline")
            except ValueError as e:
                abort(400, description=str(e))

            if deadline < created_at:
                abort(400, description="deadline must be >= created_at (UTC)")

        try:
            new_task = Task(
                wp_id=data["wp_id"],
                name=data["name"],
                task_description=data.get("task_description") or None,
                status=data.get("status", "to_do"),
                alert=data.get("alert", False),
                todo_by=data.get("todo_by") or None,
                created_at=created_at,
                deadline=deadline
            )

            db.session.add(new_task)
            db.session.commit()

            if new_task.todo_by:
                try:
                    assignee = User.query.get(new_task.todo_by)
                    if assignee:
                        send_task_assigned_email(assignee, new_task)
                except Exception:
                    pass  # Email failure should not block task creation

            return new_task.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error creating task: {str(error)}")

    @staticmethod
    def update(task_id, data):
        task = Task.query.get(task_id)
        if task is None:
            abort(404, description=f"task with id {task_id} not found")

        previous_todo_by = task.todo_by

        if "todo_by" in data:
            if data["todo_by"] is None:
                task.todo_by = None
            else:
                assignee = User.query.get(data["todo_by"])
                if assignee is None:
                    abort(404, description="User not found")
                task.todo_by = data["todo_by"]

        if "name" in data and data["name"] is not None:
            task.name = data["name"]

        if "task_description" in data and data["task_description"] is not None:
            task.task_description = data["task_description"]

        if "status" in data and data["status"] is not None:
            if data["status"] not in VALID_STATUSES:
                abort(404, description=f"Invalid status: {data['status']}")
            task.status = data["status"]

        if "alert" in data and data["alert"] is not None:
            task.alert = data["alert"]

        now_utc = datetime.now(timezone.utc)
        if "created_at" in data and data["created_at"] is not None:
            try:
                created_at = parse_dt_utc(data["created_at"], "created_at")
            except ValueError as e:
                abort(400, description=str(e))

            if created_at > now_utc:
                abort(400, description="created_at cannot be in the future (UTC)")

            current_deadline = task.deadline
            if current_deadline is not None:
                if current_deadline.tzinfo is None:
                    current_deadline = current_deadline.replace(
                        tzinfo=timezone.utc)
                else:
                    current_deadline = current_deadline.astimezone(
                        timezone.utc)

                if current_deadline < created_at:
                    abort(
                        400, description="created_at cannot be greater than current deadline (UTC)")

            task.created_at = created_at

        if "deadline" in data:
            if data["deadline"] is None:
                task.deadline = None
            else:
                try:
                    deadline = parse_dt_utc(data["deadline"], "deadline")
                except ValueError as e:
                    abort(400, description=str(e))

                created_at_ref = task.created_at
                if created_at_ref is None:
                    abort(
                        400, description="created_at is required before setting deadline")

                if created_at_ref.tzinfo is None:
                    created_at_ref = created_at_ref.replace(
                        tzinfo=timezone.utc)
                else:
                    created_at_ref = created_at_ref.astimezone(timezone.utc)

                if deadline < created_at_ref:
                    abort(400, description="deadline must be >= created_at (UTC)")

                task.deadline = deadline

        try:
            db.session.commit()

            new_todo_by = task.todo_by
            if new_todo_by and new_todo_by != previous_todo_by:
                try:
                    assignee = User.query.get(new_todo_by)
                    if assignee:
                        send_task_assigned_email(assignee, task)
                except Exception:
                    pass  # Email failure should not block task update

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
            return {"message": f"Task '{task.name}' deleted successfully"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error deleting task: {str(error)}")
