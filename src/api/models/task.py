import enum
import bcrypt
from sqlalchemy import String, Boolean, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from api.models import db

class Status(enum.Enum):
    in_process = "in_process"
    finished = "finished"

class Task(db.Model):
    __tablename__ = 'tasks'

    # Columnas
    id: Mapped[int] = mapped_column(primary_key=True)
    wp_id: Mapped[int] = mapped_column(ForeignKey(work_package.id), nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    task_description: Mapped[str] = mapped_column(String(80), nullable=False)
    status: Mapped[Status] = mapped_column(Enum(Status), nullable=False)

    # Relaciones
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