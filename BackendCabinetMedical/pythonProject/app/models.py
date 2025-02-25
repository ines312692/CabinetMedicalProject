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