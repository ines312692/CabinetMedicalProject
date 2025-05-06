from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os

mongo = PyMongo()


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
    
    # Configure CORS
    CORS(app, resources={
        r"/admin/*": {"origins": "*"},
        r"/api/*": {"origins": "*"}
    })

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    mongo.init_app(app)

    with app.app_context():
        from . import routes
        # Register blueprints
        app.register_blueprint(routes.admin_bp)
        return app


