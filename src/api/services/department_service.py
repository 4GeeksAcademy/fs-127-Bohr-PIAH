from flask import abort
from api.models import db, Department
from sqlalchemy.orm import selectinload


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
        required_fields = ["name", "head"]
        for field in required_fields:
            if field not in data or not data[field]:
                abort(400, description=f"Field '{field}' is mandatory")

        if Department.query.filter_by(name=data["name"]).first():
            abort(409, description="Department with that name already exists")

        # Comprobar que el head tiene rol de jefe o admin

        try:
            new_department = Department(
                name=data["name"],
                head=data["head"]
            )

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

        if "name" in data and data["name"] != department.name:
            if Department.query.filter_by(name=data["name"]).first():
                abort(409, description="Department with name already existing")
            department.name = data["name"]

        if "head" in data:
            Department.set_head(data["head"])  # Funtion pending to do

        try:
            db.session.commit()
            return department.serialize()
        except Exception as error:
            db.session.rollback()
            abort(
                500, description=f"Error updating department: {str(error)}")

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
