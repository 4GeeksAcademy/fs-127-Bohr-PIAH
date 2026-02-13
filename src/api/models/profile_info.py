"""
=============================================================================
                        MODELO: PROFILE_INFO (Perfil de Usuario)
=============================================================================

Informacion adicional del usuario.
Relacion 1 a 1 con User (un usuario = un perfil).
"""

from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from api.models import db


class ProfileInfo(db.Model):
    __tablename__ = 'profile_info'

    # Columnas
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'),
        unique=True,
        nullable=False
    )
    first_name: Mapped[str] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str] = mapped_column(String(100), nullable=True)
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    address: Mapped[str] = mapped_column(String(250), nullable=True)
    bio: Mapped[str] = mapped_column(Text(), nullable=True)
    avatar_url: Mapped[str] = mapped_column(String(500), nullable=True)

    # Relacion inversa con User
    user: Mapped["User"] = relationship(
        "User",
        back_populates="profile"
    )

    def __repr__(self):
        return f'<ProfileInfo {self.id}: {self.first_name} {self.last_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "full_name": f"{self.first_name or ''} {self.last_name or ''}".strip(),
            "phone": self.phone,
            "address": self.address,
            "bio": self.bio,
            "avatar_url": self.avatar_url
        }
