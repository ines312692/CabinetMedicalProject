from flask import Flask
from flask_pymongo import PyMongo
import os

mongo = PyMongo()


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
    
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    mongo.init_app(app)

    with app.app_context():
        from . import routes
        return app
