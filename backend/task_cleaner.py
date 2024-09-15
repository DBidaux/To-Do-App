from datetime import datetime, timedelta
from .models import Todo, db
from flask import current_app as app

def clean_archived_tasks(app):
    # Contexto de la aplicación para realizar consultas a la base de datos
    with app.app_context():
        try:
            # Consulta para seleccionar tareas inactivas que no se han actualizado en los últimos 30 días
            archived_tasks = Todo.query.filter(
                Todo.active == False,
                Todo.updated_at < datetime.now() - timedelta(days=30)
            ).all()
            
            if archived_tasks:
                print(f"Tareas archivadas encontradas: {len(archived_tasks)}")
                
                # Eliminar las tareas que cumplen con la condición
                for task in archived_tasks:
                    db.session.delete(task)
                
                db.session.commit()  # Confirmar los cambios
                print(f"{len(archived_tasks)} tareas eliminadas.")
            else:
                print("No se encontraron tareas inactivas para eliminar.")
        except Exception as e:
            print(f"Error durante la limpieza de tareas archivadas: {e}")
