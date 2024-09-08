from flask import Blueprint, jsonify, request
from ..models import db, Todo

# Definimos blueprint para rutas de to-do
todo_bp = Blueprint('todo_bp', __name__)

# Ruta para los to-do READ
@todo_bp.route("/todos", methods=["GET"])
def get_todos():
    todos = Todo.query.all()
    return jsonify(
        [
            {
                "id": todo.id,
                "title": todo.title,
                "description": todo.description,
                "completed": todo.completed,
            }
            for todo in todos
        ]
    )

# Ruta para agregar to-do CREATE
@todo_bp.route("/todos", methods=["POST"])
def create_todo():
    data = request.get_json()
    new_todo = Todo(title=data["title"],
                    description=data.get("description", ""))
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"message": "Todo created successfully!"}), 201


# Ruta para actualizar una tarea UPDATE
@todo_bp.route("/todos/<int:id>", methods=["PUT"])
def update_todo(id):
    todo = Todo.query.get_or_404(id)
    data = request.get_json()
    todo.title = data["title"]
    todo.description = data.get("description", todo.description)
    todo.completed = data.get("completed", todo.completed)
    db.session.commit()
    return jsonify({"message": "Todo updated successfully"})


# Ruta para eliminar una tarea DELETE
@todo_bp.route("/todos/<int:id>", methods=["DELETE"])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Todo deleted successfully"})