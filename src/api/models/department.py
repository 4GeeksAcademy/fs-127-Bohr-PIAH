from typing import List, Optional
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db


class Department(db.Model):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)

    head_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id",use_alter= True, ondelete="SET NULL"),
        nullable=True,
        unique=True
    )

    users: Mapped[List["User"]] = relationship(
        "User",
        back_populates="department",
        foreign_keys="User.department_id"
    )

    head: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[head_id],
        post_update=True
    )

    projects: Mapped[List["Project"]] = relationship(
        "Project",
        back_populates="department",
        cascade="all, delete-orphan",
        foreign_keys="Project.department_id"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "head_id": self.head_id
        }

    def serialize_with_users(self):
        return {
            "id": self.id,
            "name": self.name,
            "head_id": self.head_id,
            "users": [u.serialize() for u in self.users],
        }
