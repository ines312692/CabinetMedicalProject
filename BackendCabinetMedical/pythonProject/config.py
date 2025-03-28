import os


class Config:
    MONGO_URI = "mongodb://localhost:27017/medic_db"
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)