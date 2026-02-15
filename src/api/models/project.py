import enum
from typing import List, Optional
from sqlalchemy import ForeignKey, String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db


class Project(db.Model):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
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
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    deadline: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    finalized: Mapped[bool] = mapped_column(Boolean, default=False)

    owner: Mapped["User"] = relationship(
        back_populates="owned_projects",
        foreign_keys=[user_id],
    )
    creator: Mapped["User"] = relationship(
        back_populates="created_projects",
        foreign_keys=[created_by],
    )

    work_packages: Mapped[List["WorkPackage"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
    )

    # M:N via modelo intermedio
    user_projects: Mapped[List["UserProject"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
    )
    users: Mapped[List["User"]] = relationship(
        secondary="user_projects",
        back_populates="projects",
        viewonly=True,
    )
