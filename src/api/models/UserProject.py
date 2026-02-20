import enum
import bcrypt
from sqlalchemy import ForeignKey, String, Boolean, DateTime, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db


class UserProject(db.Model):
    __tablename__ = "user_projects"
    # __table_args__ = (
    # No repetir combinaciones
    #   UniqueConstraint("user_id", "project_id", name="uq_user_project"),
    # )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        primary_key=True,
    )

    # Relaciones
    user: Mapped["User"] = relationship(back_populates="user_projects")
    project: Mapped["Project"] = relationship(back_populates="user_projects")

# class UserProject(db.Model):
#     __tablename__ = "user_projects"
#     __table_args__ = (
#         # No repetir combinaciones
#         UniqueConstraint("user_id", "project_id", name="uq_user_project"),
#     )

#     user_id: Mapped[int] = mapped_column(
#         ForeignKey("users.id", ondelete="CASCADE"),
#         primary_key=True,
#     )
#     project_id: Mapped[int] = mapped_column(
#         ForeignKey("projects.id", ondelete="CASCADE"),
#         primary_key=True,
#     )

#     # Relaciones
#     user: Mapped["User"] = relationship(back_populates="user_projects")
#     project: Mapped["Project"] = relationship(back_populates="user_projects")
