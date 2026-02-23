import enum
from typing import Optional
from sqlalchemy import ForeignKey, String, Boolean, DateTime, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db


class Status(enum.Enum):
    to_do = "to_do"
    in_progress = "in_progress"
    in_review = "in_review"
    done = "done"


class Task(db.Model):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    wp_id: Mapped[int] = mapped_column(
        ForeignKey("work_packages.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(255))
    task_description: Mapped[Optional[str]
                             ] = mapped_column(Text, nullable=True)

    # status: Mapped[str] = mapped_column(
    #     String(50), default="to_do", nullable=False)
    status: Mapped[Status] = mapped_column(
        Enum(RoleName), default="to_do", nullable=False)
    alert: Mapped[bool] = mapped_column(Boolean, default=False)

    todo_by: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    deadline: Mapped[Optional[datetime]] = mapped_column(
        DateTime, nullable=True)

    work_package: Mapped["WorkPackage"] = relationship(back_populates="tasks")
    assignee: Mapped[Optional["User"]] = relationship(
        back_populates="assigned_tasks",
        foreign_keys=[todo_by],
    )

    def __repr__(self):
        return f'<Task {self.id}: {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "wp_id": self.wp_id,
            "name": self.name,
            "task_description": self.task_description,
            "status": self.status.value,
            "todo_by": self.todo_by,
            "created_at": self.created_at,
            "deadline": self.deadline
        }
