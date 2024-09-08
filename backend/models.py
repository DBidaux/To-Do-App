# Modelado de tablas en DB

# ACUERDATE DE HACER LAS MIGRACIONES!

# flask db migrate -m "cambios"
# flask db upgrade (downgrade si falla la implementacion)


from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt, generate_password_hash, check_password_hash
from enum import Enum

bcrypt = Bcrypt()
db = SQLAlchemy()


class StatusEnum(Enum):
    TODO = 'to-do',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'


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
    status = db.Column(db.Enum(StatusEnum), default=StatusEnum.TODO)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self) -> str:
        return f'<To-Do: {self.title}>'
