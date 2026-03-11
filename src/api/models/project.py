from typing import List, Optional
from sqlalchemy import ForeignKey, String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db
from sqlalchemy.ext.associationproxy import association_proxy


class Project(db.Model):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)

    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    created_by: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(255))

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    deadline: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True
    )

    finalized: Mapped[bool] = mapped_column(Boolean, default=False)

    department: Mapped["Department"] = relationship(
        "Department",
        back_populates="projects",
        foreign_keys=[department_id],
    )

    owner: Mapped["User"] = relationship(
        "User",
        back_populates="owned_projects",
        foreign_keys=[user_id],
    )

    work_packages: Mapped[List["WorkPackage"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
    )

    user_projects: Mapped[List["UserProject"]] = relationship(
        "UserProject",
        back_populates="project",
        cascade="all, delete-orphan",
    )

    users = association_proxy("user_projects", "user")

    def serialize(self):
        return {
            "id": self.id,
            "department_id": self.department_id,
            "user_id": self.user_id,
            "name": self.name,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "finalized": self.finalized
        }

    def serialize_with_wps(self):
        return {
            "id": self.id,
            "department_id": self.department_id,
            "user_id": self.user_id,
            "name": self.name,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "finalized": self.finalized,
            "work_packages": [wp.serialize_with_tasks() for wp in self.work_packages],
        }