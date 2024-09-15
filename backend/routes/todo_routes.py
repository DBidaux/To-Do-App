from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from ..models import db, Todo
from enum import Enum
from flask_jwt_extended import jwt_required

# Definimos blueprint para rutas de to-do
todo_bp = Blueprint('todo_bp', __name__)


class StatusEnum(Enum):
    TODO = 'TODO'
    IN_PROGRESS = 'IN_PROGRESS'
    DONE = 'DONE'


def clean_status(status):
    # Si el status es una instancia de StatusEnum, convertirlo a una cadena
    if isinstance(status, StatusEnum):
        return status.name
    # Si ya es una cadena, devolverla tal cual
    return status


# Ruta para los to-do READ
@todo_bp.route("/todos", methods=["GET"])
def get_todos():
    todos = Todo.query.all()
    return jsonify([todo.to_dict() for todo in todos])

# Ruta para agregar to-do CREATE


@todo_bp.route("/todos", methods=["POST"])
def create_todo():
    data = request.get_json()
    new_todo = Todo(
        title=data["title"],
        description=data.get("description", "")
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_dict()), 201  # Devolvemos el nuevo to-do creado


@todo_bp.route("/todos/<int:id>", methods=["PUT"])
@jwt_required()
def update_todo(id):
    todo = Todo.query.get_or_404(id)
    data = request.get_json()

    # Verificar si 'title' y 'description' están en la petición
    new_title = data.get("title", todo.title)  # Usa el valor recibido o el actual
    new_description = data.get("description", todo.description)  # Usa el valor recibido o el actual
    new_status = data.get("status", todo.status)  # Usa el valor recibido o el actual

    # Validar si el nuevo status es uno de los permitidos
    valid_statuses = ["TODO", "IN_PROGRESS", "DONE"]
    if new_status not in valid_statuses:
        return jsonify({"message": f"Invalid status value: {new_status}"}), 400

    # Actualizar el todo
    todo.title = new_title
    todo.description = new_description
    todo.status = new_status

    # Guardar cambios en la base de datos
    try:
        db.session.commit()
        return jsonify(todo.to_dict()), 200  # Devolvemos el to-do actualizado
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating task: {str(e)}"}), 500

# Ruta para eliminar una tarea DELETE


@todo_bp.route('/todos/<int:todo_id>/deactivate', methods=['PUT'])
@jwt_required()
def deactivate_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)

    todo.active = False  # Marcar la tarea como inactiva
    todo.updated_at = datetime.now(timezone.utc)

    try:
        db.session.commit()
        return jsonify({"message": "Todo deactivated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
