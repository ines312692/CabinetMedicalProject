from app.models import Doctor


def get_doctor_by_id(db, doctor_id):
    doc = db.find_one({"id": doctor_id})
    if doc:
        return Doctor.from_mongo(doc)
    return None