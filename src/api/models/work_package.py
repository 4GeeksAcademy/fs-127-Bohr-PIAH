import enum
from typing import List, Optional
from sqlalchemy import ForeignKey, String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db


class WorkPackage(db.Model):
    __tablename__ = "work_packages"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255))

    project: Mapped["Project"] = relationship(back_populates="work_packages")
    tasks: Mapped[List["Task"]] = relationship(
        back_populates="work_package",
        cascade="all, delete-orphan",
    )

    def serialize(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "name": self.name,
            "tasks": self.tasks,
        }
