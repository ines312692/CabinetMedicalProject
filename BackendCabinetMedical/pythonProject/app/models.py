from bson import ObjectId

class Doctor:
    def __init__(self, id, name, specialty, description, address, phone, password, latitude, longitude, image, role="doctor"):
        self.id = id
        self.name = name
        self.specialty = specialty
        self.description = description
        self.address = address
        self.phone = phone
        self.password = password
        self.latitude = latitude
        self.longitude = longitude
        self.image = image
        self.role = role

    @staticmethod
    def from_mongo(doc):
        return Doctor(
            id=doc['_id'],
            name=doc['name'],
            specialty=doc['specialty'],
            description=doc['description'],
            address=doc['address'],
            phone=doc['phone'],
            password=doc['password'],
            latitude=doc['latitude'],
            longitude=doc['longitude'],
            image=doc['image'],
            role=doc.get('role', 'doctor')
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

class Administrator:  # Correction du nom et indentation au niveau principal
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