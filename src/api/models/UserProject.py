from datetime import datetime
from sqlalchemy import ForeignKey, String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db


class UserProject(Base):
    __tablename__ = "user_projects"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), primary_key=True)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"), primary_key=True)

    user: Mapped["User"] = relationship(back_populates="project_links")
    project: Mapped["Project"] = relationship(back_populates="member_links")
