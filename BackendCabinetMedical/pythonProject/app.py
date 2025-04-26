from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Initialize extensions
    CORS(app)
    mongo.init_app(app)
    
    # Register blueprints
    from app.routes import bp
    app.register_blueprint(bp)
    
    print("UPLOAD_FOLDER path:", app.config['UPLOAD_FOLDER'])
    return app