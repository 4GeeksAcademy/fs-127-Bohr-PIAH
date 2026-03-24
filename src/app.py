"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask_cors import CORS
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from datetime import timedelta, date
from apscheduler.schedulers.background import BackgroundScheduler

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False
CORS(app)


# JWT configuration

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
jwt = JWTManager(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

@app.errorhandler(Exception)
def handle_http_exception(error):
    from werkzeug.exceptions import HTTPException
    if isinstance(error, HTTPException):
        return jsonify({"error": error.description}), error.code
    return jsonify({"error": "Internal server error"}), 500

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


def check_deadline_reminders():
    with app.app_context():
        from datetime import date, timedelta
        from api.models.task import Task, Status
        from api.models.user import User
        from api.services.email_service import send_deadline_reminder_email
        target_date = date.today() + timedelta(days=3)
        tasks = Task.query.filter(
            Task.todo_by.isnot(None),
            Task.deadline.isnot(None),
            db.func.date(Task.deadline) == target_date,
            Task.status != Status.done
        ).all()
        for task in tasks:
            user = User.query.get(task.todo_by)
            if user:
                try:
                    send_deadline_reminder_email(user, task)
                except Exception as e:
                    print(f"[Scheduler] Error sending reminder for task {task.id}: {e}")


if not os.environ.get("WERKZEUG_RUN_MAIN") == "false":
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_deadline_reminders, "cron", hour=9, minute=0)
    scheduler.start()


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
