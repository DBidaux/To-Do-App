from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required
from datetime import timedelta
from ..models import db, User

auth_bp = Blueprint('auth_bp', __name__)

# Ruta del login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user is None or not user.check_password(data['password']):
        return jsonify({"message":"Invalid email or password"}), 401

    # Si el usuario es válido, crea un token JWT
    access_token = create_access_token(identity=user.id)
    
    return jsonify(access_token=access_token), 200

# Ruta protegida (ejemplo: dashboard)
@auth_bp.route('/dashboard', methods=['GET'])
@jwt_required()  # Proteger la ruta con el decorador jwt_required
def protected():
    return jsonify(message="Welcome to the protected route!"), 200
