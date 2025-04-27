import os

class Config:
    MONGO_URI = "mongodb://localhost:27017/medic_db"
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')

        # Firebase configuration
        FIREBASE_CREDENTIALS = os.getenv('FIREBASE_CREDENTIALS', os.path.join(os.path.dirname(__file__),
        'firebase-service-account.json'))

        # Email configuration (e.g., Gmail SMTP)
        MAIL_SERVER = 'smtp.gmail.com'
        MAIL_PORT = 587
        MAIL_USE_TLS = True
        MAIL_USERNAME = os.getenv('MAIL_USERNAME', 'testernr009@gmail.com')
        MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', 'f5J2ox9[)39/<1/9jWj2')
        MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'testernr009@gmail.com')