import os

class Config:
    MONGO_URI = "mongodb://localhost:27017/medic_db"
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')

        FIREBASE_CREDENTIALS = os.getenv('FIREBASE_CREDENTIALS', os.path.join(os.path.dirname(__file__),
        'firebase-service-account.json'))

        MAIL_SERVER = 'smtp.gmail.com'
        MAIL_PORT = 587
        MAIL_USE_TLS = True
        MAIL_USERNAME = os.getenv('MAIL_USERNAME', '')
        MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', 'aipt kggc vdhl hene')
        MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'inestmimi1234@gmail.com')