from flask import Flask
from flask_pymongo import PyMongo

mongo = PyMongo()


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    mongo.init_app(app)

    with app.app_context():
        from . import routes
        return app