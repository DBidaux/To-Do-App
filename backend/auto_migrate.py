from flask_migrate import upgrade, migrate, init, stamp
from app import app, db
import os

# Verifica si la carpeta de migraciones ya existe
if not os.path.exists("migrations"):
    with app.app_context():
        # Inicializa migraciones
        init()
        # Aplica un sello a la migración inicial
        stamp()
        # Crea la primera migración
        migrate()
        # Aplica los cambios a la base de datos
        upgrade()

with app.app_context():
    # Genera migraciones automáticas cada vez que hay cambios en los modelos
    migrate()
    upgrade()
