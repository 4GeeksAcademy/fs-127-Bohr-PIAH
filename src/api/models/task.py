import enum
from sqlalchemy import String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship, ForeignKey
from datetime import datetime
from api.models import db


class Status(enum.Enum):
    to_do = "to_do"
    in_progress = "in_progress"
    in_review = "in_review"
    done = "done"


class Task(db.Model):
    __tablename__ = 'tasks'

    # Columnas
    id: Mapped[int] = mapped_column(primary_key=True)
    wp_id: Mapped[int] = mapped_column(
        ForeignKey(work_packages.id), nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    task_description: Mapped[str] = mapped_column(String(80), nullable=False)
    status: Mapped[Status] = mapped_column(Enum(Status), nullable=False)

    def __repr__(self):
        return f'<Task {self.id}: {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "wp_id": self.wp_id,
            "name": self.name,
            "task_description": self.task_description,
            "status": self.status
        }
