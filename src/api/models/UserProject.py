import enum
import bcrypt
from sqlalchemy import ForeignKey, String, Boolean, DateTime, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db
from sqlalchemy.ext.associationproxy import association_proxy


class UserProject(db.Model):
    __tablename__ = "user_projects"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        primary_key=True,
    )

    user: Mapped["User"] = relationship("User", back_populates="user_projects")
    project: Mapped["Project"] = relationship("Project", back_populates="user_projects")