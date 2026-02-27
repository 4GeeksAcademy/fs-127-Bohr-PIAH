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
from sqlalchemy import ForeignKey, String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db


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
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)#añadida
    role: Mapped[RoleName] = mapped_column(Enum(RoleName), nullable=False, default=RoleName.guest)#cambiado
    

    #Relaciones
    department: Mapped["Department"] = relationship(
        "department",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    projects: Mapped[List["Project"]] = relationship(
        secondary="user_projects",
        back_populates="users",
        viewonly=True,
    )

    owned_projects: Mapped[List["Project"]] = relationship(
        back_populates="owner",
        foreign_keys="Project.user_id",
    )

    # created_projects: Mapped[List["Project"]] = relationship(
    #   back_populates="creator",
    #   foreign_keys="Project.created_by",
    # )

    assigned_tasks: Mapped[List["Task"]] = relationship(
        back_populates="assignee",
        foreign_keys="Task.todo_by",
    )

    def set_first_name(self, first_name):
        self.first_name = first_name

    def set_last_name(self, last_name):
        self.last_name = last_name

    def set_role(self, role):
        self.role = role

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
            "role": self.role
        }
