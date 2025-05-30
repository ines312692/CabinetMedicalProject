from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

from app.services import get_doctor_by_id
from run import app

mongo = PyMongo()


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    CORS(app, resources={
        r"/admin/*": {
            "origins": ["http://localhost:8100"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        },
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    })
    mongo.init_app(app)
    print("UPLOAD_FOLDER path:", app.config['UPLOAD_FOLDER'])

    with app.app_context():
        return app