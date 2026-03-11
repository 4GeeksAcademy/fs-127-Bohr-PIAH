"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.controllers.auth_controller import auth_bp
from api.controllers.user_controller import user_bp
from api.controllers.project_controller import project_bp
from api.controllers.department_controller import department_bp
from api.controllers.work_package_controller import work_package_bp
from api.controllers.task_controller import task_bp

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Register authentication blueprint
api.register_blueprint(auth_bp)
api.register_blueprint(user_bp)
api.register_blueprint(task_bp)
api.register_blueprint(project_bp)
api.register_blueprint(department_bp)
api.register_blueprint(work_package_bp)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
