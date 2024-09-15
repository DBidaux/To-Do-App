from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
# Importar JWTManager
from flask_jwt_extended import JWTManager
from datetime import timedelta

from .scheduler import start_scheduler

# Importaciones relativas
from .config import Config
from .models import db

# Migracion automatica de BD
from flask_migrate import Migrate

# Importar blueprints
from .routes.user_routes import user_bp
from .routes.todo_routes import todo_bp
from .routes.auth_routes import auth_bp

app = Flask(__name__)
app.config.from_object(Config)
bcrypt = Bcrypt(app)
CORS(app)
start_scheduler(app)

# Inicializamos BD
db.init_app(app)

# Configuración de JWT
# Cambia esto por una clave más segura
app.config["JWT_SECRET_KEY"] = "super-secret-key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=3)

# Inicializamos JWTManager
jwt = JWTManager(app)

# Configuración Flask-Migrate
migrate = Migrate(app, db)

# Registramos los blueprints
app.register_blueprint(todo_bp)
app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)

# Crear BD si no existe
with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True)
