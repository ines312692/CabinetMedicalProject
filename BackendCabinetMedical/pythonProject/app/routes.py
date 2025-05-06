from flask import current_app
from datetime import datetime, timedelta
from bson import ObjectId
from flask import jsonify, request, current_app as app
from flask import request, jsonify, current_app as app, make_response
from werkzeug.utils import secure_filename
from bson import ObjectId
from . import mongo
from .services import get_doctor_by_id
from flask_cors import CORS
import bcrypt
from bcrypt import hashpw, gensalt
from flask import send_from_directory
from datetime import datetime, timedelta  # Add this import at the top
from flask import Flask
from flask_cors import CORS
from flask import Blueprint
from .models import File, History, Appointment, Consultation, DiagnosticsData, Diagnostic, Prescription, Message
from bson import ObjectId
import os
from .services import get_doctor_by_id
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

# Create a Blueprint for admin routes
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

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
        
        # Group by file extension and count statuses
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
                    # Handle both string and datetime formats
                    created = app['created_at'] if isinstance(app['created_at'], datetime) else datetime.fromisoformat(app['created_at'].replace('Z', '+00:00'))
                    updated = app['updated_at'] if isinstance(app['updated_at'], datetime) else datetime.fromisoformat(app['updated_at'].replace('Z', '+00:00'))
                    
                    # Calculate difference in hours
                    hours = (updated - created).total_seconds() / 3600
                    response_times.append(hours)
                    
                    # Handle doctor_id format
                    doctor_id = str(app['doctor_id']['$oid']) if isinstance(app['doctor_id'], dict) else str(app['doctor_id'])
                    
                    if doctor_id not in doctor_response_times:
                        doctor_response_times[doctor_id] = []
                    doctor_response_times[doctor_id].append(hours)
                except Exception as e:
                    current_app.logger.error(f"Error processing appointment {app.get('_id', 'unknown')}: {str(e)}")
                    continue  # Skip this appointment if there's an error

        # Calculate overall average
        avg_response = sum(response_times) / len(response_times) if response_times else 0

        # Get doctor names and calculate their averages
        doctor_stats = []
        if doctor_response_times:
            try:
                # Convert string IDs to ObjectId for query
                doctor_ids = [ObjectId(id) for id in doctor_response_times.keys()]
                doctors = list(mongo.db.doctors.find({"_id": {"$in": doctor_ids}}))
                
                # Create a proper mapping
                doctor_map = {}
                for d in doctors:
                    doc_id = str(d['_id'])
                    doctor_map[doc_id] = d.get('name', f"Dr. {doc_id[:6]}")  # Fallback name
                    
                for doctor_id, times in doctor_response_times.items():
                    doctor_avg = sum(times) / len(times) if times else 0
                    doctor_stats.append({
                        "doctorId": doctor_id,
                        "doctorName": doctor_map.get(doctor_id, "Unknown Doctor"),
                        "averageTime": round(doctor_avg, 1)  # Round to 1 decimal
                    })
            except Exception as e:
                current_app.logger.error(f"Error processing doctor data: {e}")
                # Continue with empty doctor_stats if there's an error

        try:
            current_date = datetime.utcnow().date()
            advertisements = list(mongo.db.advertisments.find({}))  # Note the collection name
            ad_stats = []
            
            for ad in advertisements:
                try:
                    # Handle date format (assuming dateFin is in YYYY-MM-DD format)
                    end_date = datetime.strptime(ad['dateFin'], "%Y-%m-%d").date()
                    active = end_date >= current_date
                    
                    ad_stats.append({
                        "titre": ad['titre'],
                        "description": ad['description'],
                        "dateFin": ad['dateFin'],
                        "image": ad.get('image', 'default.jpg'),  # Fallback image
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
#=========================================================================================================================================
#=========================================================================================================================================
#=========================================================================================================================================
#=========================================================================================================================================



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
        # Convert string ID to ObjectId
        doctor_id = ObjectId(id)
    except:
        return jsonify({'error': 'Invalid ID format'}), 400

    # Find the doctor in the database
    doctor = mongo.db.doctors.find_one({"_id": doctor_id})

    if doctor:
        # Convert ObjectId to string for JSON serialization
        doctor['_id'] = str(doctor['_id'])

        # Make sure all required fields are present (with defaults if missing)
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
            "role": "doctor",
            # Add these fields
            "latitude": float(data.get('latitude', 0)),  # Default to 0 if not provided
            "longitude": float(data.get('longitude', 0)),  # Default to 0 if not provided
            "availability": data.get('availability', [])  # Default to empty list if not provided
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

@app.route('/appointments', methods=['POST'])
def add_appointment():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["date", "reason", "time", "location", "doctor_id", "patient_id"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

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

    mongo.db.appointments.insert_one(appointment)
    return jsonify({"message": "Appointment added successfully"}), 201

@app.route('/appointments/<id>', methods=['PUT'])
def update_appointment(id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    update_fields = {key: value for key, value in data.items() if key in ["date", "reason", "time", "location", "status"]}
    result = mongo.db.appointments.update_one({"_id": ObjectId(id)}, {"$set": update_fields})

    if result.matched_count == 1:
        response = jsonify({"message": "Appointment updated successfully"})
        response.status_code = 200
    else:
        response = jsonify({"error": "Appointment not found"})
        response.status_code = 404
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/appointments/<id>', methods=['DELETE'])
def delete_appointment(id):
    result = mongo.db.appointments.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 1:
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
    except Exception as e:
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

@app.route('/api/messages', methods=['POST'])
def send_message():
    """Route pour envoyer un message."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    message = {
        "_id": ObjectId(),
        "unique_id": data.get("unique_id"),
        "sender_id": ObjectId(data.get("sender_id")),
        "receiver_id": ObjectId(data.get("receiver_id")),
        "message": data.get("message"),
        "timestamp": datetime.utcnow(),
        "first_message": data.get("first_message", False)
    }

    mongo.db.messages.insert_one(message)
    return jsonify({"status": "success", "message_id": str(message["_id"])}), 201


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