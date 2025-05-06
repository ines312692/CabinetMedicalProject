from flask import current_app
from datetime import datetime, timedelta
from bson import ObjectId
from flask import jsonify, request, current_app as app
from flask import request, jsonify, current_app as app, make_response
from werkzeug.utils import secure_filename
from .models import File, Message
from bson import ObjectId
import os
from . import mongo
from .services import get_doctor_by_id
from flask_cors import CORS
import bcrypt
from bcrypt import hashpw, gensalt
from flask import send_from_directory
from datetime import datetime, timedelta  # Add this import at the top
from flask import Flask
from flask import Blueprint
from .models import File, History, Appointment, Consultation, DiagnosticsData, Diagnostic, Prescription, Message
from bson import ObjectId
import os
from .services import get_doctor_by_id
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

from flask_mail import Mail, Message
from firebase_admin import credentials, initialize_app, messaging
import json
from datetime import datetime

# Create a Blueprint for admin routes
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "DELETE", "PUT", "OPTIONS"]}})


#rayen===============================================================================================================================
#=========================================================================================================================================
#=========================================================================================================================================
#=========================================================================================================================================
#=========================================================================================================================================
#here to add the admin stuff
@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    try:
        period = request.args.get('period', 'week')
        current_app.logger.info(f"Received stats request for period: {period}")

        # Calculate date range based on period
        end_date = datetime.utcnow()
        if period == 'day':
            start_date = end_date - timedelta(days=1)
        elif period == 'week':
            start_date = end_date - timedelta(weeks=1)
        elif period == 'month':
            start_date = end_date - timedelta(days=30)
        else:  # year
            start_date = end_date - timedelta(days=365)

        # Convert to strings for MongoDB query
        start_str = start_date.strftime("%Y-%m-%d")
        end_str = end_date.strftime("%Y-%m-%d")

        # Appointments statistics
        appointments = list(mongo.db.appointments.find({
            "date": {"$gte": start_str, "$lte": end_str}
        }))

        appointment_stats = {
            "total": len(appointments),
            "accepted": len([a for a in appointments if a.get("status") in ["accepted", "confirmed"]]),
            "pending": len([a for a in appointments if a.get("status") == "pending"]),
            "rejected": len([a for a in appointments if a.get("status") in ["rejected", "cancelled"]])
        }

        # Documents statistics
        documents = list(mongo.db.documents.find({
            "uploaded_at": {
                "$gte": start_date.isoformat(),
                "$lte": end_date.isoformat()
            }
        }))

        doc_types = {}
        viewed_count = 0
        pending_count = 0

        for doc in documents:
            if 'filename' in doc:
                file_type = doc['filename'].split('.')[-1].lower()
                doc_types[file_type] = doc_types.get(file_type, 0) + 1
            if doc.get("status") == "viewed":
                viewed_count += 1
            elif doc.get("status") == "pending":
                pending_count += 1

        document_stats = {
            "byType": [{"type": k, "count": v} for k, v in doc_types.items()],
            "viewed": viewed_count,
            "pending": pending_count
        }

        # Response time statistics
        response_times = []
        doctor_response_times = {}

        for app in appointments:
            if 'created_at' in app and 'updated_at' in app:
                try:
                    created = app['created_at'] if isinstance(app['created_at'], datetime) else datetime.fromisoformat(app['created_at'].replace('Z', '+00:00'))
                    updated = app['updated_at'] if isinstance(app['updated_at'], datetime) else datetime.fromisoformat(app['updated_at'].replace('Z', '+00:00'))
                    hours = (updated - created).total_seconds() / 3600
                    response_times.append(hours)

                    doctor_id = str(app['doctor_id']['$oid']) if isinstance(app['doctor_id'], dict) else str(app['doctor_id'])
                    if doctor_id not in doctor_response_times:
                        doctor_response_times[doctor_id] = []
                    doctor_response_times[doctor_id].append(hours)
                except Exception as e:
                    current_app.logger.error(f"Error processing appointment {app.get('_id', 'unknown')}: {str(e)}")
                    continue

        avg_response = sum(response_times) / len(response_times) if response_times else 0

        doctor_stats = []
        if doctor_response_times:
            try:
                doctor_ids = [ObjectId(id) for id in doctor_response_times.keys()]
                doctors = list(mongo.db.doctors.find({"_id": {"$in": doctor_ids}}))
                doctor_map = {str(d['_id']): d.get('name', f"Dr. {str(d['_id'])[:6]}") for d in doctors}

                for doctor_id, times in doctor_response_times.items():
                    doctor_avg = sum(times) / len(times) if times else 0
                    doctor_stats.append({
                        "doctorId": doctor_id,
                        "doctorName": doctor_map.get(doctor_id, "Unknown Doctor"),
                        "averageTime": round(doctor_avg, 1)
                    })
            except Exception as e:
                current_app.logger.error(f"Error processing doctor data: {e}")

        # Advertisements statistics
        try:
            current_date = datetime.utcnow().date()
            advertisements = list(mongo.db.advertisements.find({}))
            ad_stats = []

            for ad in advertisements:
                try:
                    end_date = datetime.strptime(ad['dateFin'], "%Y-%m-%d").date()
                    active = end_date >= current_date

                    ad_stats.append({
                        "titre": ad['titre'],
                        "description": ad['description'],
                        "dateFin": ad['dateFin'],
                        "image": f"/uploads/{ad.get('image', 'default.jpg')}",  # Full URL path
                        "active": active
                    })
                except Exception as e:
                    current_app.logger.error(f"Error processing ad {ad.get('_id')}: {str(e)}")
        except Exception as e:
            current_app.logger.error(f"Error fetching ads: {str(e)}")
            ad_stats = []

        return jsonify({
            "appointments": appointment_stats,
            "documents": document_stats,
            "responseTime": {
                "average": round(avg_response, 1) if avg_response else 0,
                "byDoctor": doctor_stats
            },
            "advertisements": ad_stats
        })

    except Exception as e:
        current_app.logger.error(f"Error in get_stats: {str(e)}", exc_info=True)
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
#=========================================================================================================================================
@admin_bp.route('/advertisements/<ad_id>/toggle-status', methods=['PUT'])
def toggle_ad_status(ad_id):
    try:
        # Convert string ID to ObjectId
        ad_object_id = ObjectId(ad_id)
        ad = mongo.db.advertisements.find_one({"_id": ad_object_id})

        if not ad:
            return jsonify({"error": "Advertisement not found"}), 404

        # Toggle the active status
        new_status = not ad.get('active', True)

        # Update in database
        mongo.db.advertisements.update_one(
            {"_id": ad_object_id},
            {"$set": {"active": new_status}}
        )

        return jsonify({
            "success": True,
            "newStatus": new_status,
            "message": f"Advertisement {'activated' if new_status else 'deactivated'} successfully"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
#=========================================================================================================================================
#=========================================================================================================================================
#=========================================================================================================================================
#=========================================================================================================================================
#=========================================================================================================================================



mail= Mail(app)

firebase_initialized = False
try:
    if 'FIREBASE_CREDENTIALS' in app.config and os.path.exists(app.config['FIREBASE_CREDENTIALS']):
        firebase_cred = credentials.Certificate(app.config['FIREBASE_CREDENTIALS'])
        initialize_app(firebase_cred)
        firebase_initialized = True
        print("Firebase initialized successfully")
    else:
        print("Firebase credentials not found or invalid. FCM notifications will be disabled.")
except Exception as e:
    print(f"Error initializing Firebase: {str(e)}. FCM notifications will be disabled.")

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

        patient_id = request.form.get('patient_id')
        doctor_id = request.form.get('doctor_id')

        mongo.db.documents.insert_one({
            "filename": filename,
            "status": "not viewed",
            "patient_id": patient_id,
            "doctor_id": doctor_id
        })
        response = jsonify({"message": "File uploaded successfully"})
        response.status_code = 201
        return response

@app.route('/documents', methods=['GET'])
def list_documents():
    documents = mongo.db.documents.find()
    files = [File.from_mongo(doc) for doc in documents]
    return jsonify([file.__dict__ for file in files]), 200

@app.route('/<doctor_id>/files', methods=['GET'])
def get_doctor_files(doctor_id):
    try:
        files = mongo.db.documents.find({"doctor_id": doctor_id})

        files_data = [
            {
                "id": str(file["_id"]),
                "filename": file["filename"],
                "status": file["status"],
                "patient_id": file.get("patient_id"),
                "doctor_id": file["doctor_id"]
            }
            for file in files
        ]

        return jsonify(files_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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

@app.route('/update-file-status/<file_id>', methods=['PUT'])
def update_file_status(file_id):
    try:
        if not ObjectId.is_valid(file_id):
            return jsonify({'error': 'Invalid file ID format'}), 400

        file = mongo.db.documents.find_one({"_id": ObjectId(file_id)})
        if not file:
            return jsonify({'error': 'File not found'}), 404

        mongo.db.documents.update_one(
            {"_id": ObjectId(file_id)},
            {"$set": {"status": "view"}}
        )

        return jsonify({'message': 'File status updated to view'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

        doctor_id = ObjectId(id)
    except:
        return jsonify({'error': 'Invalid ID format'}), 400

    # Find the doctor in the database
    doctor = mongo.db.doctors.find_one({"_id": doctor_id})

    if doctor:
        # Convert ObjectId to string for JSON serialization
        doctor['_id'] = str(doctor['_id'])


        if 'latitude' not in doctor:
            doctor['latitude'] = None
        if 'longitude' not in doctor:
            doctor['longitude'] = None

        if 'availability' not in doctor:
            doctor['availability'] = []

        # Add the complete image URL
        if 'image' in doctor:
            doctor['image_url'] = f"/uploads/{doctor['image']}"

        response = jsonify(doctor)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    else:
        return jsonify({'error': 'Doctor not found'}), 404

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
        "fcm_token": data.get("fcm_token", None)
    }

    result = mongo.db.patients.insert_one(patient)
    if result.inserted_id:
        # Send welcome email
        send_email(
            recipient=patient["email"],
            subject="Welcome to Medical Platform",
            body=f"Dear {patient['first_name']},\n\nYour account has been created successfully.\n\nBest regards,\nMedical Team"
        )
        response = jsonify({"message": "Account created successfully", "id": str(patient["_id"])})
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
        response = jsonify({"error": "Email and password required"})
        response.status_code = 400
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    email = data['email']
    password = data['password'].encode('utf-8')
    fcm_token = data.get('fcm_token', None)

    user = None
    role = None
    collection = None

    for col, r in [
        (mongo.db.patients, 'patient'),
        (mongo.db.doctors, 'doctor'),
        (mongo.db.administrators, 'admin')
    ]:
        user = col.find_one({"email": email})
        if user:
            role = r
            collection = col
            break

    if user and bcrypt.checkpw(password, user['password'].encode('utf-8')):
        if fcm_token:
            collection.update_one(
                {"_id": user['_id']},
                {"$set": {"fcm_token": fcm_token}}
            )
        response = jsonify({
            "message": "Login successful",
            "role": role,
            "id": str(user['_id'])
        })
        response.status_code = 200
    else:
        response = jsonify({"error": "Invalid email or password"})
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
        patient_id_obj = ObjectId(patient_id)
    except:
        response = jsonify({"error": "Invalide patient ID format"})
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

    if patient.get('fcm_token'):
        send_fcm_notification(
            fcm_token=patient['fcm_token'],
            title="New Diagnostics Available",
            body="Your diagnostic results are ready to view.",
            data={"type": "diagnostics", "patient_id": str(patient_id)}
        )
    send_email(
        recipient=patient['email'],
        subject="Diagnostics Available",
        body=f"Dear {patient['first_name']},\n\nYour diagnostic results are available. Please log in to view them.\n\nBest regards,\nMedical Team"
    )

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


@app.route('/patients/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        patient_id_obj = ObjectId(patient_id)
    except:
        return jsonify({'error': 'Invalid ID format'}), 400

    try:
        patient_data = mongo.db.patients.find_one({"_id": patient_id_obj})
        if not patient_data:
            return jsonify({"error": "Patient not found"}), 404

        required_fields = ['first_name', 'last_name', 'birth_date', 'email', 'password']
        missing_fields = [field for field in required_fields if field not in patient_data]
        if missing_fields:
            print(f"Missing fields in patient data: {missing_fields}")
            return jsonify({"error": f"Patient data incomplete: missing {', '.join(missing_fields)}"}), 500
        patient_dict = {
            '_id': str(patient_data['_id']),
            'first_name': patient_data['first_name'],
            'last_name': patient_data['last_name'],
            'birth_date': patient_data['birth_date'],
            'email': patient_data['email'],
            'role': patient_data.get('role', 'patient')
        }

        response = make_response(jsonify(patient_dict), 200)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error retrieving patient: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


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

    if mongo.db.doctors.find_one({"email": data['email']}):
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    availability = []
    if 'availability' in data and data['availability']:
        try:
            availability = json.loads(data['availability'])
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid availability format"}), 400

    doctor = {
        "name": data['name'],
        "specialty": data['specialty'],
        "description": data['description'],
        "address": data['address'],
        "phone": data['phone'],
        "email": data['email'],
        "password": hashed_password.decode('utf-8'),
        "image": filename,
        "role": "doctor",

        "latitude": float(data.get('latitude', 0)),
        "longitude": float(data.get('longitude', 0)),
        "availability": data.get('availability', []),
        "fcm_token": data.get('fcm_token', None)

    }

    result = mongo.db.doctors.insert_one(doctor)

    # Send welcome email
    send_email(
        recipient=doctor["email"],
        subject="Welcome to Medical Platform",
        body=f"Dear Dr. {doctor['name']},\n\nYour doctor account has been created successfully.\n\nBest regards,\nMedical Team"
    )

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
        "image": filename,
        "active": True  # Default to active when created
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

        administrator['_id'] = str(administrator['_id'])

        # Retourner les données de l'administrateur
        response = jsonify(administrator)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200
    else:
        return jsonify({'error': 'Administrator not found'}), 404




from .models import Appointment

@app.route('/appointments', methods=['GET'])
def list_appointments():
    appointments = mongo.db.appointments.find()
    response = make_response(jsonify([appointment for appointment in appointments]), 200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/appointments/<id>', methods=['GET'])
def get_appointment(id):
    appointment = mongo.db.appointments.find_one({"_id": ObjectId(id)})
    if appointment:
        response = make_response(jsonify(Appointment.from_mongo(appointment).__dict__), 200)
    else:
        response = make_response(jsonify({'error': 'Appointment not found'}), 404)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/appointments', methods=['POST'])
def add_appointment():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["date", "reason", "time", "location", "doctor_id", "patient_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        appointment = {
            "_id": ObjectId(),
            "date": data['date'],
            "reason": data['reason'],
            "time": data['time'],
            "location": data['location'],
            "doctor_id": ObjectId(data['doctor_id']),
            "patient_id": ObjectId(data['patient_id']),
            "status": data.get('status', 'pending')
        }
    except Exception as e:
        return jsonify({"error": "Invalid ObjectId format"}), 400

    result = mongo.db.appointments.insert_one(appointment)

    doctor = mongo.db.doctors.find_one({"_id": ObjectId(data['doctor_id'])})
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    patient = mongo.db.patients.find_one({"_id": ObjectId(data['patient_id'])})
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    doctor_notification = create_notification(
        user_id=str(doctor['_id']),
        title="New Appointment Request",
        body=f"New appointment scheduled with {patient.get('first_name', 'Unknown')} on {data['date']} at {data['time']}.",
        data={"type": "appointment", "appointment_id": str(appointment['_id'])}
    )

    patient_notification = create_notification(
        user_id=str(patient['_id']),
        title="Appointment Scheduled",
        body=f"Your appointment with Dr. {doctor.get('name', 'Unknown')} on {data['date']} at {data['time']} is pending.",
        data={"type": "appointment", "appointment_id": str(appointment['_id'])}
    )
    # Notify doctor
    if doctor.get('fcm_token'):
        try:
            send_fcm_notification(
                fcm_token=doctor['fcm_token'],
                title="New Appointment Request",
                body=f"New appointment scheduled with {patient.get('first_name', 'Unknown')} on {data['date']} at {data['time']}.",
                data={"type": "appointment", "appointment_id": str(appointment['_id'])}
            )
        except Exception as e:
            logger.error(f"Failed to send FCM to doctor {doctor['email']}: {str(e)}")
            if "Requested entity was not found" in str(e):
                mongo.db.doctors.update_one(
                    {"_id": ObjectId(data['doctor_id'])},
                    {"$unset": {"fcm_token": ""}}
                )

    send_email(
        recipient=doctor['email'],
        subject="New Appointment Request",
        body=f"Dear Dr. {doctor.get('name', 'Unknown')},\n\nA new appointment has been scheduled with {patient.get('first_name', 'Unknown')} on {data['date']} at {data['time']}.\n\nBest regards,\nMedical Team"
    )

    if patient.get('fcm_token'):
        try:
            send_fcm_notification(
                fcm_token=patient['fcm_token'],
                title="Appointment Scheduled",
                body=f"Your appointment with Dr. {doctor.get('name', 'Unknown')} on {data['date']} at {data['time']} is pending.",
                data={"type": "appointment", "appointment_id": str(appointment['_id'])}
            )
        except Exception as e:
            logger.error(f"Failed to send FCM to patient {patient['email']}: {str(e)}")
            if "Requested entity was not found" in str(e):
                mongo.db.patients.update_one(
                    {"_id": ObjectId(data['patient_id'])},
                    {"$unset": {"fcm_token": ""}}
                )

    send_email(
        recipient=patient['email'],
        subject="Appointment Scheduled",
        body=f"Dear {patient.get('first_name', 'Unknown')},\n\nYour appointment with Dr. {doctor.get('name', 'Unknown')} on {data['date']} at {data['time']} has been scheduled and is pending approval.\n\nBest regards,\nMedical Team"
    )

    return jsonify({"message": "Appointment added successfully"}), 201



@app.route('/appointments/<id>', methods=['PUT'])
def update_appointment(id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    update_fields = {key: value for key, value in data.items() if key in ["date", "reason", "time", "location", "status"]}
    result = mongo.db.appointments.update_one({"_id": ObjectId(id)}, {"$set": update_fields})

    if result.matched_count == 1:
        appointment = mongo.db.appointments.find_one({"_id": ObjectId(id)})
        doctor = mongo.db.doctors.find_one({"_id": appointment['doctor_id']})
        patient = mongo.db.patients.find_one({"_id": appointment['patient_id']})

        if 'status' in update_fields:
            status = update_fields['status']
            if patient and patient.get('fcm_token'):
                send_fcm_notification(
                    fcm_token=patient['fcm_token'],
                    title=f"Appointment {status.capitalize()}",
                    body=f"Your appointment with Dr. {doctor['name']} on {appointment['date']} is {status}.",
                    data={"type": "appointment", "appointment_id": id}
                )
            if patient:
                send_email(
                    recipient=patient['email'],
                    subject=f"Appointment {status.capitalize()}",
                    body=f"Dear {patient['first_name']},\n\nYour appointment with Dr. {doctor['name']} on {appointment['date']} has been {status}.\n\nBest regards,\nMedical Team"
                )

        response = jsonify({"message": "Appointment updated successfully"})
        response.status_code = 200
    else:
        response = jsonify({"error": "Appointment not found"})
        response.status_code = 404
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/appointments/<id>', methods=['DELETE'])
def delete_appointment(id):
    appointment = mongo.db.appointments.find_one({"_id": ObjectId(id)})
    if not appointment:
        response = jsonify({"error": "Appointment not found"})
        response.status_code = 404
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    result = mongo.db.appointments.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
        doctor = mongo.db.doctors.find_one({"_id": appointment['doctor_id']})
        patient = mongo.db.patients.find_one({"_id": appointment['patient_id']})

        if patient and patient.get('fcm_token'):
            send_fcm_notification(
                fcm_token=patient['fcm_token'],
                title="Appointment Cancelled",
                body=f"Your appointment with Dr. {doctor['name']} on {appointment['date']} has been cancelled.",
                data={"type": "appointment", "appointment_id": id}
            )
        if patient:
            send_email(
                recipient=patient['email'],
                subject="Appointment Cancelled",
                body=f"Dear {patient['first_name']},\n\nYour appointment with Dr. {doctor['name']} on {appointment['date']} has been cancelled.\n\nBest regards,\nMedical Team"
            )

        if doctor and doctor.get('fcm_token'):
            send_fcm_notification(
                fcm_token=doctor['fcm_token'],
                title="Appointment Cancelled",
                body=f"Appointment with {patient['first_name']} on {appointment['date']} has been cancelled.",
                data={"type": "appointment", "appointment_id": id}
            )
        if doctor:
            send_email(
                recipient=doctor['email'],
                subject="Appointment Cancelled",
                body=f"Dear Dr. {doctor['name']},\n\nThe appointment with {patient['first_name']} on {appointment['date']} has been cancelled.\n\nBest regards,\nMedical Team"
            )

        response = jsonify({"message": "Appointment deleted successfully"})
        response.status_code = 200
    else:
        response = jsonify({"error": "Appointment not found"})
        response.status_code = 404
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/doctors/<doctor_id>/appointments', methods=['GET'])
def get_doctor_appointments(doctor_id):
    appointments = mongo.db.appointments.find({"doctor_id": ObjectId(doctor_id)})
    response = make_response(jsonify([Appointment.from_mongo(app).__dict__ for app in appointments]), 200)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/appointments/<id>/accept', methods=['PUT'])
def accept_appointment(id):
    result = mongo.db.appointments.update_one({"_id": ObjectId(id)}, {"$set": {"status": "accepted"}})
    if result.matched_count == 1:
        appointment = mongo.db.appointments.find_one({"_id": ObjectId(id)})
        doctor = mongo.db.doctors.find_one({"_id": appointment['doctor_id']})
        patient = mongo.db.patients.find_one({"_id": appointment['patient_id']})

        if patient and patient.get('fcm_token'):
            send_fcm_notification(
                fcm_token=patient['fcm_token'],
                title="Appointment Accepted",
                body=f"Your appointment with Dr. {doctor['name']} on {appointment['date']} has been accepted.",
                data={"type": "appointment", "appointment_id": id}
            )
        if patient:
            send_email(
                recipient=patient['email'],
                subject="Appointment Accepted",
                body=f"Dear {patient['first_name']},\n\nYour appointment with Dr. {doctor['name']} on {appointment['date']} has been accepted.\n\nBest regards,\nMedical Team"
            )

        response = jsonify({"message": "Appointment accepted successfully"})
        response.status_code = 200
    else:
        response = jsonify({"error": "Appointment not found"})
        response.status_code = 404
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/appointments/<id>/reject', methods=['PUT'])
def reject_appointment(id):
    result = mongo.db.appointments.update_one({"_id": ObjectId(id)}, {"$set": {"status": "rejected"}})
    if result.matched_count == 1:
        appointment = mongo.db.appointments.find_one({"_id": ObjectId(id)})
        doctor = mongo.db.doctors.find_one({"_id": appointment['doctor_id']})
        patient = mongo.db.patients.find_one({"_id": appointment['patient_id']})

        if patient and patient.get('fcm_token'):
            send_fcm_notification(
                fcm_token=patient['fcm_token'],
                title="Appointment Rejected",
                body=f"Your appointment with Dr. {doctor['name']} on {appointment['date']} has been rejected.",
                data={"type": "appointment", "appointment_id": id}
            )
        if patient:
            send_email(
                recipient=patient['email'],
                subject="Appointment Rejected",
                body=f"Dear {patient['first_name']},\n\nYour appointment with Dr. {doctor['name']} on {appointment['date']} has been rejected.\n\nBest regards,\nMedical Team"
            )

        response = jsonify({"message": "Appointment rejected successfully"})
        response.status_code = 200
    else:
        response = jsonify({"error": "Appointment not found"})
        response.status_code = 404
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response




from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from flask import send_file
import io

@app.route('/patient/<patient_id>/diagnostics/pdf', methods=['GET'])
def export_diagnostics_pdf(patient_id):
    try:
        patient_id_obj = ObjectId(patient_id)
    except Exception:
        return jsonify({"error": "Invalid patient ID format"}), 400

    patient = mongo.db.patients.find_one({"_id": patient_id_obj})
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    diagnostics = list(mongo.db.diagnostics.find({"patient_id": patient_id_obj}))
    if not diagnostics:
        return jsonify({"error": "No diagnostics found"}), 404

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.drawString(100, 750, f"Diagnostics for {patient['first_name']} {patient['last_name']}")

    y = 700
    for diag in diagnostics:
        p.drawString(100, y, f"Date: {diag['date']} - Result: {diag['result']}")
        y -= 20

    p.showPage()
    p.save()

    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name='diagnostics.pdf', mimetype='application/pdf')


from flask import request, jsonify
from datetime import datetime
from bson import ObjectId
from .models import Message
from . import mongo



@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Route pour récupérer les messages entre un docteur et un patient."""
    sender_id = request.args.get("sender_id")
    receiver_id = request.args.get("receiver_id")
    page = int(request.args.get("page", 1))
    per_page = 10

    if not sender_id or not receiver_id:
        return jsonify({"error": "Sender ID and Receiver ID are required"}), 400

    messages = list(mongo.db.messages.find({
        "$or": [
            {"sender_id": ObjectId(sender_id), "receiver_id": ObjectId(receiver_id)},
            {"sender_id": ObjectId(receiver_id), "receiver_id": ObjectId(sender_id)}
        ]
    }).sort("timestamp", -1).skip((page - 1) * per_page).limit(per_page))

    for message in messages:
        message["_id"] = str(message["_id"])
        message["sender_id"] = str(message["sender_id"])
        message["receiver_id"] = str(message["receiver_id"])

    return jsonify({"data": messages, "page": page}), 200

@app.route('/patient/<patient_id>/appointments', methods=['GET'])
def get_patient_appointments(patient_id):
    try:
        patient_id_obj = ObjectId(patient_id)
    except Exception:
        return jsonify({"error": "Invalid patient ID format"}), 400

    appointments = list(mongo.db.appointments.find({"patient_id": patient_id_obj}))
    if not appointments:
        return jsonify({"error": "No appointments found"}), 404

    for appointment in appointments:
        appointment["_id"] = str(appointment["_id"])
        appointment["doctor_id"] = str(appointment["doctor_id"])
        appointment["patient_id"] = str(appointment["patient_id"])

    return jsonify({"appointments": appointments}), 200


def send_fcm_notification(fcm_token, title, body, data=None):
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            token=fcm_token,
            data=data or {}
        )
        response = messaging.send(message)
        print(f"Successfully sent FCM notification: {response}")
        return True
    except Exception as e:
        print(f"Error sending FCM notification: {str(e)}")
        return False

def send_email(recipient, subject, body):
    try:
        msg = Message(
            subject=subject,
            recipients=[recipient],
            body=body,
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)
        print(f"Successfully sent email to {recipient}")
        return True
    except Exception as e:
        print(f"Error sending email to {recipient}: {str(e)}")
        return False

@app.route('/register-fcm-token', methods=['POST'])
def register_fcm_token():
    try:
        data = request.json
        print(f"Received payload: {data}")

        if not data or 'userId' not in data or 'fcmToken' not in data or 'role' not in data:
            print("Missing required fields")
            return jsonify({"error": "userId, fcmToken, and role are required"}), 400

        user_id = data['userId']
        fcm_token = data['fcmToken']
        role = data['role']
        print(f"Processing: userId={user_id}, role={role}, fcmToken={fcm_token}")

        try:
            user_id_obj = ObjectId(user_id)
        except Exception as e:
            print(f"Invalid user_id format: {str(e)}")
            return jsonify({"error": "Invalid userId format"}), 400

        collection = {
            'patient': mongo.db.patients,
            'doctor': mongo.db.doctors,
            'admin': mongo.db.administrators
        }.get(role)

        if collection is None:
            print(f"Invalid role: {role}")
            return jsonify({"error": "Invalid role. Must be 'patient', 'doctor', or 'admin'"}), 400

        print(f"Updating collection: {role}")
        result = collection.update_one(
            {"_id": user_id_obj},
            {"$set": {"fcm_token": fcm_token}}
        )

        print(f"Update result: matched={result.matched_count}, modified={result.modified_count}")
        if result.matched_count == 1:
            return jsonify({"message": "FCM token registered successfully"}), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        print(f"Server error in register_fcm_token: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

import smtplib
from email.mime.text import MIMEText

def send_email(recipient, subject, body):
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = 'testernr009@gmail.com'
        msg['To'] = recipient

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login('testernr009@gmail.com', 'f5J2ox9[)39/<1/9jWj2')
            server.sendmail('testernr009@gmail.com', recipient, msg.as_string())
        print(f"Successfully sent email to {recipient}")
        return True
    except Exception as e:
        print(f"Error sending email to {recipient}: {str(e)}")
        return False


@app.route('/patient/<patient_id>/combined/pdf', methods=['GET'])
def export_combined_pdf(patient_id):
    try:
        patient_id_obj = ObjectId(patient_id)
    except Exception:
        return jsonify({"error": "Invalid patient ID format"}), 400

    patient = mongo.db.patients.find_one({"_id": patient_id_obj})
    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    diagnostics = list(mongo.db.diagnostics.find({"patient_id": patient_id_obj}))
    consultations = list(mongo.db.consultations.find({"patient_id": patient_id_obj}))
    prescriptions = list(mongo.db.prescriptions.find({"patient_id": patient_id_obj}))
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, height - 50, f"Patient Report for {patient['first_name']} {patient['last_name']}")
    p.setFont("Helvetica", 12)
    p.drawString(100, height - 70, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    y = height - 100

    def add_section_header(title):
        nonlocal y
        p.setFont("Helvetica-Bold", 14)
        p.drawString(100, y, title)
        y -= 20
        p.setFont("Helvetica", 12)

    # Helper function to add data or "No data" message
    def add_data_or_empty(items, format_fn, label):
        nonlocal y
        if items:
            for item in items:
                if y < 50:
                    p.showPage()
                    y = height - 50
                p.drawString(120, y, format_fn(item))
                y -= 20
        else:
            p.drawString(120, y, f"No {label} available")
            y -= 20
        y -= 10

    add_section_header("Patient Details")
    p.drawString(120, y, f"Email: {patient.get('email', 'N/A')}")
    y -= 20
    p.drawString(120, y, f"Date of Birth: {patient.get('birth_date', 'N/A')}")
    y -= 20
    if patient.get('phone'):
        p.drawString(120, y, f"Phone: {patient['phone']}")
        y -= 20
    if patient.get('address'):
        p.drawString(120, y, f"Address: {patient['address']}")
        y -= 20
    y -= 10

    add_section_header("Diagnostics")
    add_data_or_empty(
        diagnostics,
        lambda d: f"Date: {d['date']} - Result: {d['result']}",
        "diagnostics"
    )

    add_section_header("Consultations")
    add_data_or_empty(
        consultations,
        lambda c: f"Date: {c['date']} - Notes: {c['notes']}",
        "consultations"
    )

    add_section_header("Prescriptions")
    add_data_or_empty(
        prescriptions,
        lambda p: f"Date: {p['date']} - Medication: {p['medication']}",
        "prescriptions"
    )

    # Finalize PDF
    p.showPage()
    p.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"patient_report_{patient['first_name']}_{patient['last_name']}.pdf",
        mimetype='application/pdf'
    )

def send_fcm_notification(fcm_token, title, body, data=None):
    """Send an FCM notification to the specified token."""
    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body
            ),
            token=fcm_token,
            data=data or {}
        )
        response = messaging.send(message)
        logger.info(f"Successfully sent FCM notification: {response}")
        return True
    except Exception as e:
        logger.error(f"Error sending FCM notification: {str(e)}")
        return False

@app.route('/tester-notification', methods=['POST'])
def tester_notification():
    """Test FCM notification by sending a test message to the provided FCM token."""
    try:
        data = request.json
        if not data or 'fcm_token' not in data:
            logger.error("Missing fcm_token in request")
            return jsonify({"erreur": "Token FCM requis"}), 400

        fcm_token = data['fcm_token']
        logger.info(f"Received test notification request for token: {fcm_token}")

        result = send_fcm_notification(
            fcm_token=fcm_token,
            title="Notification Test",
            body="Ceci est une notification de test",
            data={"type": "test"}
        )

        if result:
            logger.info("Test notification sent successfully")
            return jsonify({"message": "Notification envoyée avec succès"}), 200
        else:
            logger.error("Failed to send test notification")
            return jsonify({"erreur": "Échec de l'envoi de la notification"}), 500

    except Exception as e:
        logger.error(f"Server error in tester_notification: {str(e)}")
        return jsonify({"erreur": f"Erreur serveur: {str(e)}"}), 500


def create_notification(user_id, title, body, data=None):
    notification = {
        "_id": ObjectId(),
        "user_id": ObjectId(user_id),
        "title": title,
        "body": body,
        "data": data or {},
        "is_read": False,
        "timestamp": datetime.utcnow()
    }
    mongo.db.notifications.insert_one(notification)
    return notification

@app.route('/notifications', methods=['POST'])
def create_notification_endpoint():
    try:
        data = request.json
        if not data or 'user_id' not in data or 'title' not in data or 'body' not in data:
            return jsonify({"error": "user_id, title, and body are required"}), 400

        notification = create_notification(
            user_id=data['user_id'],
            title=data['title'],
            body=data['body'],
            data=data.get('data', {})
        )
        return jsonify({"message": "Notification created successfully", "notification": notification}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/notifications/count/<user_id>', methods=['GET'])
def get_notification_count(user_id):
    try:
        user_id_obj = ObjectId(user_id)
        count = mongo.db.notifications.count_documents({
            "user_id": user_id_obj,
            "is_read": False
        })
        return jsonify({"count": count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/notifications/<user_id>', methods=['GET'])
def get_notifications(user_id):
    try:
        user_id_obj = ObjectId(user_id)
        page = int(request.args.get("page", 1))
        per_page = 10
        notifications = list(mongo.db.notifications.find({"user_id": user_id_obj})
                            .sort("timestamp", -1)
                            .skip((page - 1) * per_page)
                            .limit(per_page))
        for notif in notifications:
            notif["_id"] = str(notif["_id"])
            notif["user_id"] = str(notif["user_id"])
        return jsonify({"notifications": notifications, "page": page}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/notifications/<notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    try:
        result = mongo.db.notifications.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"is_read": True}}
        )
        if result.matched_count == 1:
            return jsonify({"message": "Notification marked as read"}), 200
        else:
            return jsonify({"error": "Notification not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)
@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    if not data or 'sender_id' not in data or 'receiver_id' not in data or 'content' not in data:
        return jsonify({"error": "Données incomplètes"}), 400

    # Validate ObjectIds before creating the message
    try:
        # Check if IDs are valid ObjectIds
        if not data["sender_id"] or not ObjectId.is_valid(data["sender_id"]):
            return jsonify({"error": "sender_id invalide"}), 400
        if not data["receiver_id"] or not ObjectId.is_valid(data["receiver_id"]):
            return jsonify({"error": "receiver_id invalide"}), 400

        message_obj = Message(
            sender_id=ObjectId(data["sender_id"]),
            receiver_id=ObjectId(data["receiver_id"]),
            content=data["content"]
        )
        result = mongo.db.messages.insert_one(message_obj.to_dict())
        message = mongo.db.messages.find_one({"_id": result.inserted_id})
        return JSONEncoder().encode(message), 201, {'Content-Type': 'application/json'}

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/get_messages', methods=['GET'])
def get_user_messages():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "ID utilisateur requis"}), 400

    # Validate ObjectId
    if not ObjectId.is_valid(user_id):
        return jsonify({"error": "ID utilisateur invalide"}), 400

    messages = list(mongo.db.messages.find({
        "$or": [
            {"sender_id": ObjectId(user_id)},
            {"receiver_id": ObjectId(user_id)}
        ]
    }).sort("timestamp", -1))

    return JSONEncoder().encode(messages), 200, {'Content-Type': 'application/json'}


@app.route('/conversation/<sender_id>/<receiver_id>', methods=['GET'])
def get_conversation(sender_id, receiver_id):
    # Validate ObjectIds
    if not ObjectId.is_valid(sender_id):
        return jsonify({"error": "sender_id invalide"}), 400
    if not ObjectId.is_valid(receiver_id):
        return jsonify({"error": "receiver_id invalide"}), 400

    messages = list(mongo.db.messages.find({
        "$or": [
            {"sender_id": ObjectId(sender_id), "receiver_id": ObjectId(receiver_id)},
            {"sender_id": ObjectId(receiver_id), "receiver_id": ObjectId(sender_id)}
        ]
    }).sort("timestamp", 1))

    return JSONEncoder().encode(messages), 200, {'Content-Type': 'application/json'}


@app.route('/mark_read/<message_id>', methods=['PUT'])
def mark_as_read(message_id):
    # Validate ObjectId
    if not ObjectId.is_valid(message_id):
        return jsonify({"error": "ID message invalide"}), 400

    try:
        result = mongo.db.messages.update_one(
            {"_id": ObjectId(message_id)},
            {"$set": {"read": True}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Message non trouvé"}), 404

        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/get_username/<user_id>', methods=['GET'])
def get_username(user_id):
    # Validate ObjectId
    if not ObjectId.is_valid(user_id):
        return jsonify({"error": "ID utilisateur invalide"}), 400

    try:
        object_id = ObjectId(user_id)

        doctor = mongo.db.doctors.find_one({"_id": object_id})
        if doctor and 'name' in doctor:
            return jsonify({"name": doctor['name']}), 200

        patient = mongo.db.patients.find_one({"_id": object_id})
        if patient and 'first_name' in patient and 'last_name' in patient:
            full_name = f"{patient['first_name']} {patient['last_name']}"
            return jsonify({"name": full_name}), 200

        return jsonify({"error": "Utilisateur introuvable"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        # Validation de l'ID utilisateur
        user_id_obj = ObjectId(user_id)
    except:
        return jsonify({'error': 'Invalid user ID format'}), 400

    # Recherche de l'utilisateur dans les collections
    user = None
    for collection in [mongo.db.patients, mongo.db.doctors, mongo.db.administrators]:
        user = collection.find_one({"_id": user_id_obj})
        if user:
            break

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Conversion de l'ObjectId en chaîne pour JSON
    user['_id'] = str(user['_id'])

    return jsonify(user), 200

@app.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        user_id_obj = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID format"}), 400

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    allowed_fields = ["first_name", "last_name", "birth_date", "email", "password"]
    update_data = {key: data[key] for key in allowed_fields if key in data}

    if "password" in update_data:
        update_data["password"] = bcrypt.hashpw(update_data["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = None
    collection = None
    role = None
    for col, r in [
        (mongo.db.patients, 'patient'),
        (mongo.db.doctors, 'doctor'),
        (mongo.db.administrators, 'admin')
    ]:
        user = col.find_one({"_id": user_id_obj})
        if user:
            collection = col
            role = r
            break

    if not user:
        return jsonify({"error": "User not found"}), 404

    if "email" in update_data and update_data["email"] != user["email"]:
        if mongo.db.patients.find_one({"email": update_data["email"]}) or \
           mongo.db.doctors.find_one({"email": update_data["email"]}) or \
           mongo.db.administrators.find_one({"email": update_data["email"]}):
            return jsonify({"error": "Email already exists"}), 409

    result = collection.update_one(
        {"_id": user_id_obj},
        {"$set": update_data}
    )

    if result.matched_count == 1:
        if "email" in update_data or "password" in update_data:
            send_email(
                recipient=user["email"],
                subject="Account Details Updated",
                body=f"Dear {user.get('first_name', 'User')},\n\nYour account details have been updated successfully.\n\nBest regards,\nMedical Team"
            )
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update user"}), 500