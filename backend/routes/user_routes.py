from flask import Blueprint, jsonify, request
from ..models import db, User, Todo, StatusEnum

# Definimos blueprint para rutas de usuarios
user_bp = Blueprint('user_bp', __name__)

# Ruta para crear un nuevo usuario


@user_bp.route("/newuser", methods=["POST"])
def create_user():
    data = request.get_json()
    new_user = User(username=data['username'],
                    email=data['email'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully!"}), 201


# Ruta para obtener todos los usuarios
@user_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": user.id,
            "username": user.username,
            "email": user.email
        } for user in users
    ])


# Ruta para crear un nuevo to-do para un usuario específico
@user_bp.route("/users/<int:user_id>/todos", methods=["POST"])
def create_todo_for_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    status = data.get('status', StatusEnum.TODO.value)

    if status not in StatusEnum.__members__:
        return jsonify({"message": "Invalid status value"}), 400

    new_todo = Todo(
        title=data['title'],
        description=data.get('description', ''),
        status=StatusEnum[status],
        user_id=user.id
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"message": "Todo created successfully!"}), 201

# Ruta para obtener todos los to-dos de un usuario


@user_bp.route("/users/<int:user_id>/todos", methods=["GET"])
def get_todos_for_user(user_id):
    user = User.query.get_or_404(user_id)
    todos = Todo.query.filter_by(user_id=user.id).all()
    return jsonify([
        {
            "id": todo.id,
            "title": todo.title,
            "description": todo.description,
            "completed": todo.completed
        } for todo in todos
    ])
