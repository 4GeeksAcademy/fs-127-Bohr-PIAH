from flask import abort
from api.models import db, WorkPackage
from api.models.task import Status


class WorkPackageService:

    @staticmethod
    def get_all():
        work_packages = WorkPackage.query.all()
        return [work_package.serialize() for work_package in work_packages]

    @staticmethod
    def get_by_id(work_package_id):
        work_package = WorkPackage.query.get(work_package_id)
        if work_package is None:
            abort(
                404, description=f"Work package with id {work_package_id} not found")

        data = work_package.serialize()

        completion = WorkPackageService.get_completion_status(work_package_id)
        data["completion_status"] = completion["completion_status"]

        return data

    @staticmethod
    def create(data):
        required_fields = ["name", "project_id"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"Field '{field}' is mandatory")

        if WorkPackage.query.filter_by(name=data["name"], project_id=data["project_id"]).first():
            abort(
                409, description="Work Package with that name already exists in that project")

        try:
            new_work_package = WorkPackage(
                name=data["name"],
                project_id=data["project_id"],
            )

            db.session.add(new_work_package)
            db.session.commit()
            return new_work_package.serialize()
        except Exception as error:
            db.session.rollback()
            abort(
                500, description=f"Error creating owrk package: {str(error)}")

    @staticmethod
    def update(work_package_id, data):
        work_package = WorkPackage.query.get(work_package_id)
        if work_package is None:
            abort(
                404, description=f"Work Package with id {work_package_id} not found")

        if "name" in data and data["name"] != work_package.name:
            work_package.name = data["name"]

        try:
            db.session.commit()
            return work_package.serialize()
        except Exception as error:
            db.session.rollback()
            abort(
                500, description=f"Error updating work_package: {str(error)}")

    @staticmethod
    def delete(work_package_id):
        work_package = WorkPackage.query.get(work_package_id)
        if work_package is None:
            abort(
                404, description=f"Work Package with id {work_package_id} not found")

        name = work_package.name
        try:
            db.session.delete(work_package)
            db.session.commit()
            return {"message": f"Work pacakge '{name}' deleted correctly"}
        except Exception as error:
            db.session.rollback()
            abort(
                500, description=f"Error deleting work package: {str(error)}")

    @staticmethod
    def get_completion_status(work_package_id):
        work_package = WorkPackage.query.get(work_package_id)
        if work_package is None:
            abort(
                404, description=f"Work package with id {work_package_id} not found")

        total_tasks = len(work_package.tasks)
        if total_tasks == 0:
            completion_ratio = 0
        else:
            done_tasks = sum(
                1 for task in work_package.tasks if task.status == Status.done
            )
            completion_ratio = done_tasks / total_tasks * 100

        return {
            "work_package_id": work_package.id,
            "completion_status": completion_ratio,
        }
