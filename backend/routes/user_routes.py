from flask import Blueprint, jsonify, request
from ..models import db, User, Todo, StatusEnum
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import and_


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


# Ruta para crear un nuevo to-do para el usuario logueado
@user_bp.route("/newtodo", methods=["POST"])
@jwt_required()  # Requiere autenticación JWT
def create_todo_for_user():
    data = request.get_json()

    user_id = get_jwt_identity()  # Obtener el user_id del token

    # Verificar si el status es válido
    valid_statuses = ["TODO", "IN_PROGRESS", "DONE"]
    status = data.get('status')

    if status not in valid_statuses:
        return jsonify({"message": "Invalid status value"}), 400

    # Crear una nueva tarea
    new_todo = Todo(
        title=data['title'],
        description=data.get('description', ''),
        status=status,  # Asignar el status como cadena
        user_id=user_id
    )

    try:
        db.session.add(new_todo)
        db.session.commit()
        return jsonify(new_todo.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


# Ruta para obtener todos los to-dos del usuario logueado
@user_bp.route("/usertodo", methods=["GET"])
@jwt_required()  # Requiere autenticación JWT
def get_todos_for_user():
    user_id = get_jwt_identity()  # Obtener el user_id del token JWT
    todos = Todo.query.filter(
        and_(Todo.user_id == user_id, Todo.active == True)).all()

    # Serializamos con to_dict()
    return jsonify([todo.to_dict() for todo in todos])


# Ruta para obtener los detalles del usuario logueado
@user_bp.route("/userdetails", methods=["GET"])
@jwt_required()  # Requiere autenticación JWT
def get_user_details():
    user_id = get_jwt_identity()  # Obtener el user_id del token JWT
    user = User.query.get(user_id)  # Obtener el usuario basado en su ID

    if user:
        return jsonify({
            "id": user.id,
            "username": user.username,
            "email": user.email
        }), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Ruta para obtener los to-dos inactivos del usuario logueado


@user_bp.route("/usertodo/inactive", methods=["GET"])
@jwt_required()  # Requiere autenticación JWT
def get_inactive_todos_for_user():
    user_id = get_jwt_identity()  # Obtener el user_id del token JWT
    todos = Todo.query.filter(
        and_(Todo.user_id == user_id, Todo.active == False)).all()
    # Serializamos con to_dict()
    return jsonify([todo.to_dict() for todo in todos])
