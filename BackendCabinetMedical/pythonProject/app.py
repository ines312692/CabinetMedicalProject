from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

from app.services import get_doctor_by_id
from run import app

mongo = PyMongo()


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Enable CORS for all routes
    CORS(app)
    mongo.init_app(app)

    with app.app_context():
        return app