from flask import request, jsonify, current_app as app, make_response
from werkzeug.utils import secure_filename
import os
import bcrypt
from bson.objectid import ObjectId
from . import mongo
from .services import get_doctor_by_id


@app.route('/')
def index():
    return "Welcome to the Medical Backend API"

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

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
    response = make_response(jsonify([doctor for doctor in doctors]), 200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


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

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["firstName", "lastName", "birthDate", "email", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    if mongo.db.patients.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists"}), 409

    
    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())

    patient = {
        "_id": str(ObjectId()),
        "first_name": data["firstName"],
        "last_name": data["lastName"],
        "birth_date": data["birthDate"],
        "email": data["email"],
        "password": hashed_password.decode('utf-8'),
        "role": "patient",
    }

    result = mongo.db.patients.insert_one(patient)
    if result.inserted_id:
        return jsonify({"message": "Account created successfully", "id": patient["_id"]}), 201
    else:
        return jsonify({"error": "Failed to create account"}), 500
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Email et mot de passe requis"}), 400

    email = data['email']
    password = data['password'].encode('utf-8')
    print("Email reçu:", email)

    
    patient = mongo.db.patients.find_one({"email": email})
    print("Patient trouvé:", patient)
    if patient:
        if bcrypt.checkpw(password, patient['password'].encode('utf-8')):
            return jsonify({
                "message": "Connexion réussie",
                "role": patient.get('role', 'patient'),
                "id": str(patient['_id'])  # Convertir ObjectId en string
            }), 200
        else:
            return jsonify({"error": "Mot de passe incorrect"}), 401

   
    doctor = mongo.db.doctors.find_one({"email": email})
    print("Doctor trouvé:", doctor)
    if doctor:
        if bcrypt.checkpw(password, doctor['password'].encode('utf-8')):
            return jsonify({
                "message": "Connexion réussie",
                "role": doctor.get('role', 'doctor'),
                "id": str(doctor['_id'])  # Convertir ObjectId en string
            }), 200
        else:
            return jsonify({"error": "Mot de passe incorrect"}), 401

    
    administrator = mongo.db.administrators.find_one({"email": email})
    print("Administrator trouvé:", administrator)
    if administrator:
        if bcrypt.checkpw(password, administrator['password'].encode('utf-8')):
            return jsonify({
                "message": "Connexion réussie",
                "role": administrator.get('role', 'admin'),
                "id": str(administrator['_id'])  # Corriger 'id' en '_id' et convertir en string
            }), 200
        else:
            return jsonify({"error": "Mot de passe incorrect"}), 401

    
    return jsonify({"error": "Adresse email introuvable"}), 404