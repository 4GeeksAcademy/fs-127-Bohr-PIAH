"""
=============================================================================
                              MODELO: USER (Usuario)
=============================================================================

Tabla principal de usuarios.
- Relacion 1 a 1 con ProfileInfo
- Relacion 1 a Muchos con Order
"""

import enum
import bcrypt
from sqlalchemy import String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db

class RoleName(enum.Enum):
    admin = "admin"
    head = "head"
    staff = "staff"
    guest = "guest"


class User(db.Model):
    __tablename__ = 'users'

    # Columnas
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    last_name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(256), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, nullable=False)
    role: Mapped[RoleName] = mapped_column(Enum(RoleName), nullable=False)

    #Relaciones
    department: Mapped["Department"] = relationship(
        "department",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    def set_password(self, password):
        """Hashea un password en texto plano y lo almacena."""
        password_bytes = password.encode('utf-8')
        hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, password):
        """Verifica un password en texto plano contra el hash almacenado."""
        password_bytes = password.encode('utf-8')
        hashed_bytes = self.password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)

    def __repr__(self):
        return f'<User {self.id}: {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role
        }

    def serialize_with_profile(self):
        data = self.serialize()
        data["profile"] = self.profile.serialize() if self.profile else None
        return data

    def serialize_with_orders(self):
        data = self.serialize()
        data["orders"] = [order.serialize() for order in self.orders]
        return data
