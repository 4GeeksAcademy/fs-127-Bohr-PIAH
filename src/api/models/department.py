from typing import List
from sqlalchemy import String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db


class Department(db.Model):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True)

    users: Mapped[List["User"]] = relationship(
        back_populates="department"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }

    def serialize_with_users(self):
        return {
            "id": self.id,
            "name": self.name,
            "users": [u.serialize() for u in self.users],
        }
