"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.controllers.auth_controller import auth_bp
<<<<<<< HEAD
from api.controllers.user_controller import user_bp
from api.controllers.task_controller import task_bp
from api.controllers.project_controller import project_bp
=======
>>>>>>> 44aa4822ba0c890dac04f75b3e40886c3380c44c

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Register authentication blueprint
api.register_blueprint(auth_bp)
<<<<<<< HEAD
api.register_blueprint(user_bp)
api.register_blueprint(task_bp)
api.register_blueprint(project_bp)
=======
>>>>>>> 44aa4822ba0c890dac04f75b3e40886c3380c44c


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
