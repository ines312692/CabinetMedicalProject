import unittest
from app import create_app
from flask_pymongo import PyMongo
import os

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.app.config['TESTING'] = True
        self.app.config['MONGO_URI'] = "mongodb://localhost:27017/test_db"
        self.mongo = PyMongo(self.app)

        # Ensure the uploads directory exists
        if not os.path.exists(self.app.config['UPLOAD_FOLDER']):
            os.makedirs(self.app.config['UPLOAD_FOLDER'])

    def tearDown(self):
        # Drop the test database
        self.mongo.db.drop_collection('documents')

    def test_index(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Welcome to the Medical Backend API", response.data)

    def test_upload_file(self):
        data = {
            'file': (open('tests/test_file.txt', 'rb'), 'test_file.txt')
        }
        response = self.client.post('/upload', data=data, content_type='multipart/form-data')
        self.assertEqual(response.status_code, 201)
        self.assertIn(b"File uploaded successfully", response.data)

    def test_list_documents(self):
        response = self.client.get('/documents')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()