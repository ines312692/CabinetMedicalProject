from flask import request, jsonify, current_app as app, make_response
from werkzeug.utils import secure_filename
import os
from . import mongo
from .services import get_doctor_by_id


@app.route('/')
def index():
    return "Welcome to the Medical Backend API"


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        mongo.db.documents.insert_one({
            "filename": filename,
            "status": "not viewed"
        })
        return jsonify({"message": "File uploaded successfully"}), 201


@app.route('/documents', methods=['GET'])
def list_documents():
    documents = mongo.db.documents.find()
    return jsonify([doc for doc in documents]), 200


@app.route('/doctors', methods=['GET'])
def list_doctors():
    doctors = mongo.db.doctors.find()
    return jsonify([doctor for doctor in doctors]), 200


@app.route('/doctors/<id>', methods=['GET'])
def get_doctor(id):
    doctor = get_doctor_by_id(mongo.db.doctors, id)
    if doctor:
        response = make_response(jsonify(doctor.__dict__))
    else:
        response = make_response(jsonify({'error': 'Doctor not found'}), 404)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# app/routes.py
@app.route('/doctors', methods=['POST'])
def add_doctor():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["id", "name", "specialty", "description", "address", "phone", "latitude", "longitude", "image"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    doctor = {
        "id": data['id'],
        "name": data['name'],
        "specialty": data['specialty'],
        "description": data['description'],
        "address": data['address'],
        "phone": data['phone'],
        "latitude": data['latitude'],
        "longitude": data['longitude'],
        "image": data['image']
    }

    mongo.db.doctors.insert_one(doctor)
    return jsonify({"message": "Doctor added successfully"}), 201


@app.route('/doctors', methods=['DELETE'])
def delete_all_doctors():
    result = mongo.db.doctors.delete_many({})
    return jsonify({"message": f"Deleted {result.deleted_count} doctors"}), 200


@app.route('/doctors/<id>', methods=['DELETE'])
def delete_doctor(id):
    result = mongo.db.doctors.delete_one({"id": id})
    if result.deleted_count == 1:
        return jsonify({"message": "Doctor deleted successfully"}), 200
    else:
        return jsonify({"error": "Doctor not found"}), 404
