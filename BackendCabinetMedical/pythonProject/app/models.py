from bson import ObjectId


class Doctor:
    def __init__(self, id, name, specialty, description, address, phone, latitude, longitude, image):
        self.id = id
        self.name = name
        self.specialty = specialty
        self.description = description
        self.address = address
        self.phone = phone
        self.latitude = latitude
        self.longitude = longitude
        self.image = image

    @staticmethod
    def from_mongo(doc):
        return Doctor(
            id=doc['_id'],
            name=doc['name'],
            specialty=doc['specialty'],
            description=doc['description'],
            address=doc['address'],
            phone=doc['phone'],
            latitude=doc['latitude'],
            longitude=doc['longitude'],
            image=doc['image']
        )

class Patient:
    def __init__(self, id, first_name, last_name, birth_date, email, password, role="patient"):
        self.id = id
        self.first_name = first_name
        self.last_name = last_name
        self.birth_date = birth_date
        self.email = email
        self.password = password
        self.role = role

    @staticmethod
    def from_mongo(doc):
        return Patient(
            id=doc['_id'],
            first_name=doc['first_name'],
            last_name=doc['last_name'],
            birth_date=doc['birth_date'],
            email=doc['email'],
            password=doc['password'],
            role=doc.get('role', 'patient')
        )

class Administrator:
    def __init__(self, id, first_name, last_name, birth_date, email, password, role="admin"):
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
            role=doc.get('role', 'admin')
        )


from bson import ObjectId

class File:
    def __init__(self, id, filename, status):
        self.id = id
        self.filename = filename
        self.status = status

    @staticmethod
    def from_mongo(doc):
        return File(
            id=doc['_id'],
            filename=doc['filename'],
            status=doc['status']
        )


from typing import List, Dict

class Appointment:
    def __init__(self, date: str, reason: str):
        self.date = date
        self.reason = reason

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

class DiagnosticsData:
    def __init__(self, diagnostics: List[Diagnostic], prescriptions: List[Prescription]):
        self.diagnostics = diagnostics
        self.prescriptions = prescriptionscd