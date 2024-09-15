# Modelado de tablas en DB

# ACUERDATE DE HACER LAS MIGRACIONES!

# flask db migrate -m "cambios"
# flask db upgrade (downgrade si falla la implementacion)


from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt, generate_password_hash, check_password_hash
from enum import Enum
from datetime import datetime, timezone

bcrypt = Bcrypt()
db = SQLAlchemy()


class StatusEnum(Enum):
    TODO = 'TODO'
    IN_PROGRESS = 'IN_PROGRESS'
    DONE = 'DONE'


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    todos = db.relationship('Todo', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    # Cambiar la columna status de Enum a String
    status = db.Column(db.String(20), default="TODO")  # Ahora el status es un String
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    active = db.Column(db.Boolean, default=True)
    updated_at = db.Column(db.DateTime, default=datetime.now(
        timezone.utc), onupdate=datetime.now(timezone.utc))

    def __repr__(self) -> str:
        return f'<To-Do: {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,  # El status se maneja como una cadena
            'user_id': self.user_id,
            'active': self.active,
            'updated_at': self.updated_at
        }
