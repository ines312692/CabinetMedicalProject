from bson import ObjectId
from typing import List, Dict
from datetime import datetime

class Doctor:

    def __init__(self, id, name, specialty, description, address, phone, latitude, longitude, image, password, email, role="doctor", availability=None, fcm_token=None):

        self.id = id
        self.name = name
        self.specialty = specialty
        self.description = description
        self.address = address
        self.phone = phone
        self.image = image
        self.password = password
        self.email = email
        self.role = role
        self.availability = availability or []
        self.fcm_token = fcm_token

    @staticmethod
    def from_mongo(doc):
        return Doctor(
            id=doc['_id'],
            name=doc['name'],
            specialty=doc['specialty'],
            description=doc['description'],
            address=doc['address'],
            phone=doc['phone'],
            availability=doc['availability'],
            image=doc['image'],
            password=doc['password'],
            email=doc['email'],
            role=doc.get('role', 'doctor'),
            fcm_token=doc.get('fcm_token', None)
        )

class Patient:
    def __init__(self, id, first_name, last_name, birth_date, email, password, role="patient", fcm_token=None):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.birth_date = birth_date
        self.email = email
        self.password = password
        self.role = role
        self.fcm_token = fcm_token

    @staticmethod
    def from_mongo(doc):
        return Patient(
            id=doc['_id'],
            first_name=doc['first_name'],
            last_name=doc['last_name'],
            birth_date=doc['birth_date'],
            email=doc['email'],
            password=doc['password'],
            role=doc.get('role', 'patient'),
            fcm_token=doc.get('fcm_token', None)
        )

class Administrator:
    def __init__(self, id, first_name, last_name, birth_date, email, password, role="admin", fcm_token=None):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.birth_date = birth_date
        self.email = email
        self.password = password
        self.role = role

    @staticmethod
    def from_mongo(doc):
        return Administrator(
            id=doc['_id'],
            first_name=doc['first_name'],
            last_name=doc['last_name'],
            birth_date=doc['birth_date'],
            email=doc['email'],
            password=doc['password'],
            role=doc.get('role', 'admin'),
            fcm_token=doc.get('fcm_token', None)
        )


from bson import ObjectId

class File:
    def __init__(self, id, filename, status, patient_id=None, doctor_id=None):
        self.id = id
        self.filename = filename
        self.status = status
        self.patient_id = patient_id
        self.doctor_id = doctor_id

    @staticmethod
    def from_mongo(doc):
        return File(
            id=doc['_id'],
            filename=doc['filename'],
            status=doc['status'],
            patient_id=doc.get('patient_id'),
            doctor_id=doc.get('doctor_id')
        )


from bson import ObjectId
from typing import List, Dict

class Appointment:
    def __init__(self, _id: ObjectId, date: str, reason: str, time: str, location: Dict[str, float], doctor_id: ObjectId, patient_id: ObjectId, status: str = "pending"):
        self._id = _id
        self.date = date
        self.reason = reason
        self.time = time
        self.location = location
        self.doctor_id = doctor_id
        self.patient_id = patient_id
        self.status = status

    @staticmethod
    def from_mongo(doc):
        return Appointment(
            _id=doc['_id'],
            date=doc['date'],
            reason=doc['reason'],
            time=doc['time'],
            location=doc['location'],
            doctor_id=doc['doctor_id'],
            patient_id=doc['patient_id'],
            status=doc.get('status', 'pending')
        )

    def to_mongo(self):
        return {
            "_id": self._id,
            "date": self.date,
            "reason": self.reason,
            "time": self.time,
            "location": self.location,
            "doctor_id": self.doctor_id,
            "patient_id": self.patient_id,
            "status": self.status
        }
class Consultation:
    def __init__(self, date: str, notes: str):
        self.date = date
        self.notes = notes

class History:
    def __init__(self, appointments: List[Appointment], consultations: List[Consultation]):
        self.appointments = appointments
        self.consultations = consultations

class Diagnostic:
    def __init__(self, date: str, result: str):
        self.date = date
        self.result = result

class Prescription:
    def __init__(self, date: str, medication: str):
        self.date = date
        self.medication = medication

# models.py
class DiagnosticsData:
    def __init__(self, diagnostics, prescriptions):
        self.diagnostics = diagnostics
        self.prescriptions = prescriptions


from bson import ObjectId
from datetime import datetime



class Advertisement:
    def __init__(self, id, title, description, image, end_date, active=True):
        self.id = id
        self.title = title
        self.description = description
        self.image = image
        self.end_date = end_date
        self.active = active


    @staticmethod
    def from_mongo(doc):
        end_date = datetime.strptime(doc['dateFin'], "%Y-%m-%d").date()
        current_date = datetime.utcnow().date()
        is_active = end_date >= current_date

        return Advertisement(
            id=doc['_id'],

            title=doc['titre'],
            description=doc['description'],
            image=doc['image'],
            dateFin=doc['dateFin'],
            active=doc.get('active', is_active),
            end_date=doc['dateFin']
        )
    def to_mongo(self):
        return {
            "_id": self.id,
            "titre": self.titre,
            "description": self.description,
            "image": self.image,
            "dateFin": self.dateFin,
            "active": self.active
        }

class Message:
    def __init__(self, sender_id, receiver_id, content, timestamp=None, read=False):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.content = content
        self.timestamp = timestamp or datetime.utcnow()
        self.read = read

    def to_dict(self):
        return {
            "sender_id": ObjectId(self.sender_id),
            "receiver_id": ObjectId(self.receiver_id),
            "content": self.content,
            "timestamp": self.timestamp,
            "read": self.read
        }

    @staticmethod
    def from_mongo(doc):
        return Message(
            sender_id=doc['sender_id'],
            receiver_id=doc['receiver_id'],
            content=doc['content'],
            timestamp=doc.get('timestamp', datetime.utcnow()),
            read=doc.get('read', False)
        )