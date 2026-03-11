from flask import abort
from api.models import User, db, Department
from sqlalchemy.orm import selectinload

from api.models.user import RoleName


class DepartmentService:

    @staticmethod
    def get_all():
        departments = Department.query.all()
        return [department.serialize() for department in departments]

    @staticmethod
    def get_by_id(department_id):
        department = Department.query.get(department_id)
        if department is None:
            abort(
                404, description=f"Department with id {department_id} not found")
        return department.serialize()

    @staticmethod
    def create(data):
        required_fields = ["name"]
        for field in required_fields:
            if field not in data or data[field] is None or data[field] == "":
                abort(400, description=f"Field '{field}' is mandatory")

        if Department.query.filter_by(name=data["name"]).first():
            abort(409, description="Department with that name already exists")

        try:
            new_department = Department(name=data["name"])
            db.session.add(new_department)
            db.session.commit()
            return new_department.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error creating department: {str(error)}")

    @staticmethod
    def update(department_id, data):
        department = Department.query.get(department_id)
        if department is None:
            abort(
                404, description=f"Department with id {department_id} not found")

        if "name" in data and data["name"] is not None and data["name"] != department.name:
            if Department.query.filter_by(name=data["name"]).first():
                abort(409, description="Department with name already existing")
            department.name = data["name"]

        if "head_id" in data:
            if data["head_id"] is None:
                department.head_id = None
            else:
                head = User.query.get(data["head_id"])
                if head is None:
                    abort(
                        404, description=f"User with id {data['head_id']} not found")

                if head.role not in (RoleName.head, RoleName.admin):
                    abort(400, description="Head user must have role 'head' or 'admin'")

                if head.department_id != department.id:
                    abort(400, description="Head user must belong to this department")

                department.head_id = head.id

        try:
            db.session.commit()
            return department.serialize()
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error updating department: {str(error)}")

    @staticmethod
    def delete(department_id):
        department = Department.query.get(department_id)
        if department is None:
            abort(
                404, description=f"Department with id {department_id} not found")

        name = department.name
        try:
            db.session.delete(department)
            db.session.commit()
            return {"message": f"Department '{name}' deleted correctly"}
        except Exception as error:
            db.session.rollback()
            abort(500, description=f"Error deleting department: {str(error)}")

    @staticmethod
    def get_by_id_with_users(department_id):
        department = (
            Department.query.options(
                selectinload(Department.users)
            )
            .filter(Department.id == department_id)
            .first()
        )

        if department is None:
            abort(
                404, description=f"Department with id {department_id} not found")

        return department.serialize_with_users()
