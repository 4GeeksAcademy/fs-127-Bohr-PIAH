"""
=============================================================================
                              MODELO: USER (Usuario)
=============================================================================

Tabla principal de usuarios.
- Relacion 1 a 1 con ProfileInfo
- Relacion 1 a Muchos con Order
"""

import enum
from typing import List, Optional
import bcrypt
from flask import abort
from sqlalchemy import ForeignKey, String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db
from sqlalchemy.ext.associationproxy import association_proxy


class RoleName(enum.Enum):
    admin = "admin"
    head = "head"
    staff = "staff"
    guest = "guest"


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)  # añadida
    role: Mapped[RoleName] = mapped_column(
        Enum(RoleName, name="rolename", native_enum=True),
        nullable=False,
        default=RoleName.guest
    )
    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
    )

    department: Mapped["Department"] = relationship(
        "Department",
        back_populates="users",
        foreign_keys=[department_id]
    )

    user_projects: Mapped[List["UserProject"]] = relationship(
        "UserProject",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    projects = association_proxy("user_projects", "project")

    owned_projects: Mapped[List["Project"]] = relationship(
        back_populates="owner",
        foreign_keys="Project.user_id",
    )

    assigned_tasks: Mapped[List["Task"]] = relationship(
        back_populates="assignee",
        foreign_keys="Task.todo_by",
    )

    def set_first_name(self, first_name):
        self.first_name = first_name

    def set_last_name(self, last_name):
        self.last_name = last_name

    def parse_role(self, role_str):
        try:
            return RoleName(role_str)
        except ValueError:
            abort(400, description=f"Invalid role '{role_str}'")

    def set_role(self, role):
        if isinstance(role, RoleName):
            self.role = role
        else:
            self.role = RoleName(role)

    def set_password(self, password):
        """Hashea un password en texto plano y lo almacena."""
        password_bytes = password.encode('utf-8')
        hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, password):
        """Verifica un password en texto plano contra el hash almacenado."""
        password_bytes = password.encode('utf-8')
        hashed_bytes = self.password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)

    def __repr__(self):
        return f'<User {self.id}: {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role.value,
            "department_id": self.department_id
        }

    def serialize_with_projects(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role.value,
            "projects": [p.serialize_with_wps() for p in self.projects],
        }
