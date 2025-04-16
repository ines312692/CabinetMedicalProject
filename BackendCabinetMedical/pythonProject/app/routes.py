from flask import request, jsonify, current_app as app, make_response
from werkzeug.utils import secure_filename
from .models import File
from bson import ObjectId
import os
from . import mongo
from .services import get_doctor_by_id
from flask_cors import CORS
import bcrypt
from bcrypt import hashpw, gensalt
from flask import send_from_directory


CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "DELETE", "PUT", "OPTIONS"]}})

@app.route('/')
def index():
    return "Welcome to the Medical Backend API"


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        response = jsonify({"error": "No file part"})
        response.status_code = 400
        return response
    file = request.files['file']
    if file.filename == '':
        response = jsonify({"error": "No selected file"})
        response.status_code = 400
        return response
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        mongo.db.documents.insert_one({
            "filename": filename,
            "status": "not viewed"
        })
        response = jsonify({"message": "File uploaded successfully"})
        response.status_code = 201
        return response

@app.route('/documents', methods=['GET'])
def list_documents():
    documents = mongo.db.documents.find()
    files = [File.from_mongo(doc) for doc in documents]
    return jsonify([file.__dict__ for file in files]), 200


@app.route('/documents/<id>', methods=['DELETE'])
def delete_document(id):
    result = mongo.db.documents.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        response = jsonify({"message": "Document deleted successfully"})
        response.status_code = 200
    else:
        response = jsonify({"error": "Document not found"})
        response.status_code = 404
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# @app.route('/doctors', methods=['GET'])
# def list_doctors():
#     doctors = mongo.db.doctors.find()
#     response = make_response(jsonify([doctor for doctor in doctors]), 200)
#     response.headers.add('Access-Control-Allow-Origin', '*')
#     return response
@app.route('/doctors', methods=['GET'])
def list_doctors():
    doctors = mongo.db.doctors.find()
    doctors_list = []
    for doctor in doctors:
        doctor_dict = doctor
        # Ajouter l'URL complète de l'image
        if 'image' in doctor:
            doctor_dict['image_url'] = f"/uploads/{doctor['image']}"
        doctors_list.append(doctor_dict)
    response = make_response(jsonify(doctors_list), 200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/doctors/<id>', methods=['GET'])
def get_doctor(id):
    try:
        # Convertir l'ID string en ObjectId
        doctor_id = ObjectId(id)
    except:
        return jsonify({'error': 'Invalid ID format'}), 400
    
    # Rechercher le docteur dans la base de données
    doctor = mongo.db.doctors.find_one({"_id": doctor_id})
    
    if doctor:
        # Convertir ObjectId en string pour la sérialisation JSON
        doctor['_id'] = str(doctor['_id'])
        
        # Ajouter l'URL complète de l'image si nécessaire
        if 'image' in doctor:
            doctor['image_url'] = f"/uploads/{doctor['image']}"
        
        response = jsonify(doctor)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        return jsonify({'error': 'Doctor not found'}), 404


# app/routes.py
#@app.route('/doctors', methods=['POST'])
#def add_doctor():
    #data = request.json
    # if not data:
    #     return jsonify({"error": "No data provided"}), 400

    # required_fields = ["id", "name", "specialty", "description", "address", "phone", "latitude", "longitude", "image"]
    # for field in required_fields:
    #     if field not in data:
    #         return jsonify({"error": f"Missing field: {field}"}), 400

    # doctor = {
    #     "id": data['id'],
    #     "name": data['name'],
    #     "specialty": data['specialty'],
    #     "description": data['description'],
    #     "address": data['address'],
    #     "phone": data['phone'],
    #     "latitude": data['latitude'],
    #     "longitude": data['longitude'],
    #     "image": data['image']
    # }

    # mongo.db.doctors.insert_one(doctor)
    # return jsonify({"message": "Doctor added successfully"}), 201
#

@app.route('/doctors', methods=['DELETE'])
def delete_all_doctors():
    result = mongo.db.doctors.delete_many({})
    return jsonify({"message": f"Deleted {result.deleted_count} doctors"}), 200


@app.route('/doctors/<id>', methods=['DELETE'])
def delete_doctor(id):
    result = mongo.db.doctors.delete_one({"id": id})
    if result.deleted_count == 1:
        response = jsonify({"message": "Doctor deleted successfully"})
        response.status_code = 200
    else:
        response = jsonify({"error": "Doctor not found"})
        response.status_code = 404
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data:
        response = jsonify({"error": "No data provided"})
        response.status_code = 400
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    required_fields = ["firstName", "lastName", "birthDate", "email", "password"]
    for field in required_fields:
        if field not in data:
            response = jsonify({"error": f"Missing field: {field}"})
            response.status_code = 400
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    if mongo.db.patients.find_one({"email": data["email"]}):
        response = jsonify({"error": "Email already exists"})
        response.status_code = 409
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    hashed_password = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())

    patient = {
        "_id": ObjectId(),
        "first_name": data["firstName"],
        "last_name": data["lastName"],
        "birth_date": data["birthDate"],
        "email": data["email"],
        "password": hashed_password.decode('utf-8'),
        "role": "patient",
    }

    result = mongo.db.patients.insert_one(patient)
    if result.inserted_id:
        response = jsonify({"message": "Account created successfully", "id": patient["_id"]})
        response.status_code = 201
    else:
        response = jsonify({"error": "Failed to create account"})
        response.status_code = 500
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'email' not in data or 'password' not in data:
        response = jsonify({"error": "Email et mot de passe requis"})
        response.status_code = 400
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    email = data['email']
    password = data['password'].encode('utf-8')
    print("Email reçu:", email)

    patient = mongo.db.patients.find_one({"email": email})
    print("Patient trouvé:", patient)
    if patient:
        if bcrypt.checkpw(password, patient['password'].encode('utf-8')):
            response = jsonify({
                "message": "Connexion réussie",
                "role": patient.get('role', 'patient'),
                "id": str(patient['_id'])
            })
            response.status_code = 200
        else:
            response = jsonify({"error": "Mot de passe incorrect"})
            response.status_code = 401
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    doctor = mongo.db.doctors.find_one({"email": email})
    print("Doctor trouvé:", doctor)
    if doctor:
        if bcrypt.checkpw(password, doctor['password'].encode('utf-8')):
            response = jsonify({
                "message": "Connexion réussie",
                "role": doctor.get('role', 'doctor'),
                "id": str(doctor['_id'])
            })
            response.status_code = 200
        else:
            response = jsonify({"error": "Mot de passe incorrect"})
            response.status_code = 401
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    administrator = mongo.db.administrators.find_one({"email": email})
    print("Administrator trouvé:", administrator)
    if administrator:
        if bcrypt.checkpw(password, administrator['password'].encode('utf-8')):
            response = jsonify({
                "message": "Connexion réussie",
                "role": administrator.get('role', 'admin'),
                "id": str(administrator['_id'])
            })
            response.status_code = 200
        else:
            response = jsonify({"error": "Mot de passe incorrect"})
            response.status_code = 401
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    response = jsonify({"error": "Adresse email introuvable"})
    response.status_code = 404
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

from .models import History, Appointment, Consultation, DiagnosticsData, Diagnostic, Prescription

@app.route('/patient/<patient_id>/history', methods=['GET'])
def get_patient_history(patient_id):
    patient = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
    if not patient:
        response = jsonify({"error": "Patient not found"})
        response.status_code = 404
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    appointments = [Appointment(app['date'], app['reason']) for app in mongo.db.appointments.find({"patient_id": patient_id})]
    consultations = [Consultation(con['date'], con['notes']) for con in mongo.db.consultations.find({"patient_id": patient_id})]

    history = History(appointments, consultations)

    response = jsonify(history.__dict__)
    response.status_code = 200
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/patient/<patient_id>/diagnostics', methods=['GET'])
def get_patient_diagnostics(patient_id):
    try:
        # Validate the patient_id format
        patient_id_obj = ObjectId(patient_id)
        print("Valid ObjectId format")
    except Exception as e:
        response = jsonify({"error": "Invalid patient ID format"})
        response.status_code = 400
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    # Check if the patient exists
    patient = mongo.db.patients.find_one({"_id": patient_id_obj})
    print("Patient query result:", patient)
    if not patient:
        response = jsonify({"error": "Patient not found"})
        response.status_code = 404
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    # Retrieve diagnostics and prescriptions
    diagnostics = list(mongo.db.diagnostics.find({"patient_id": patient_id_obj}))
    prescriptions = list(mongo.db.prescriptions.find({"patient_id": patient_id_obj}))

    print("Diagnostics query result:", diagnostics)
    print("Prescriptions query result:", prescriptions)

    if not diagnostics and not prescriptions:
        response = jsonify({"error": "No diagnostics or prescriptions found"})
        response.status_code = 404
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    diagnostics_data = [Diagnostic(diag['date'], diag['result']).__dict__ for diag in diagnostics]
    prescriptions_data = [Prescription(pres['date'], pres['medication']).__dict__ for pres in prescriptions]

    data = DiagnosticsData(diagnostics_data, prescriptions_data).__dict__

    response = jsonify(data)
    response.status_code = 200
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/patients', methods=['GET'])
def list_patients():
    patients = mongo.db.patients.find()
    response = make_response(jsonify([patient for patient in patients]), 200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/doctors', methods=['POST'])
def add_doctor():
    if 'image' not in request.files:
        return jsonify({"error": "Image is required"}), 400
    
    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(image.filename)
    upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    # Créer le dossier s'il n'existe pas
    os.makedirs(os.path.dirname(upload_path), exist_ok=True)
    image.save(upload_path)

    data = request.form  
    required_fields = ['name', 'specialty', 'description', 'address', 'phone', 'email', 'password']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "All fields are required"}), 400

    # Vérifier si l'email existe déjà
    if mongo.db.doctors.find_one({"email": data['email']}):
        return jsonify({"error": "Email already exists"}), 409

    # Cryptage du mot de passe
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    doctor = {
        "name": data['name'],
        "specialty": data['specialty'],
        "description": data['description'],
        "address": data['address'],
        "phone": data['phone'],
        "email": data['email'],
        "password": hashed_password.decode('utf-8'),
        "image": filename,
        "role": "doctor"
    }

    result = mongo.db.doctors.insert_one(doctor)
    
    return jsonify({
        "message": "Doctor added successfully",
        "doctor_id": str(result.inserted_id),
        "image_url": f"/uploads/{filename}"
    }), 201

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    print(f"Looking for file: {file_path}")
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/advertisements', methods=['POST'])
def add_advertisement():
    if 'image' not in request.files:
        return jsonify({"error": "Image is required"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(image.filename)
    upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    # Créer le dossier s'il n'existe pas
    os.makedirs(os.path.dirname(upload_path), exist_ok=True)
    image.save(upload_path)

    data = request.form
    required_fields = ['titre', 'description', 'dateFin']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "All fields are required"}), 400

    advertisement = {
        "titre": data['titre'],
        "description": data['description'],
        "dateFin": data['dateFin'],
        "image": filename
    }

    result = mongo.db.advertisements.insert_one(advertisement)
    
    return jsonify({
        "message": "Advertisement added successfully",
        "advertisement_id": str(result.inserted_id),
        "image": f"/uploads/{filename}"
    }), 201

@app.route('/advertisements', methods=['GET'])
def list_advertisements():
    advertisements = mongo.db.advertisements.find()
    advertisements_list = []
    for ad in advertisements:
        ad_dict = ad
        # Ajouter l'URL complète de l'image
        if 'image' in ad:
            ad_dict['image'] = f"/uploads/{ad['image']}"
        advertisements_list.append(ad_dict)
    response = make_response(jsonify(advertisements_list), 200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/administrators/<id>', methods=['GET'])
def get_administrator(id):
    try:
        # Convertir l'ID string en ObjectId
        admin_id = ObjectId(id)
    except:
        return jsonify({'error': 'Invalid ID format'}), 400

    # Rechercher l'administrateur dans la base de données
    administrator = mongo.db.administrators.find_one({"_id": admin_id})

    if administrator:
        # Convertir ObjectId en string pour la sérialisation JSON
        administrator['_id'] = str(administrator['_id'])

        # Retourner les données de l'administrateur
        response = jsonify(administrator)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        return jsonify({'error': 'Administrator not found'}), 404



