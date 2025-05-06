from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId

client = MongoClient('mongodb://localhost:27017/')
db = client.medic_db

# Clear existing test data
db.appointments.delete_many({})
db.documents.delete_many({})

# Create test appointments
for i in range(15):
    status = "accepted" if i < 10 else "pending" if i < 13 else "rejected"
    days_ago = 30 - i  # Varies from 30 days ago to 15 days ago
    
    db.appointments.insert_one({
        "date": (datetime.now() - timedelta(days=days_ago)).strftime("%Y-%m-%d"),
        "time": f"{10 + (i % 6)}:00",  # Between 10:00-15:00
        "doctor_id": ObjectId("507f1f77bcf86cd799439011"),
        "patient_id": ObjectId(),
        "status": status,
        "created_at": datetime.now() - timedelta(days=days_ago + 1),
        "updated_at": datetime.now() - timedelta(days=days_ago + 0.5) if status == "accepted" 
                  else datetime.now() - timedelta(days=days_ago + 1)
    })

# Create test documents
doc_types = ["pdf", "jpg", "png", "docx"]
for i in range(20):
    db.documents.insert_one({
        "filename": f"document_{i}.{doc_types[i % 4]}",
        "status": "viewed" if i % 3 == 0 else "pending",
        "patient_id": ObjectId(),
        "uploaded_at": datetime.now() - timedelta(days=i)
    })

print("Test data created successfully!")