from flask import Flask
from flask_cors import CORS
from .routes.index import index_bp
from .routes.upload import upload_bp
from .routes.documents import documents_bp
from .routes.doctors import doctors_bp
from .routes.auth import auth_bp
from .routes.patients import patients_bp
from .routes.appointments import appointments_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "DELETE", "PUT", "OPTIONS"]}})

app.register_blueprint(index_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(documents_bp)
app.register_blueprint(doctors_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(patients_bp)
app.register_blueprint(appointments_bp)

if __name__ == '__main__':
    app.run(debug=True)