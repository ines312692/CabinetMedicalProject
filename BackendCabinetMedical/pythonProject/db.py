# db.py
from flask import Flask
from pymongo import MongoClient


def init_db(app: Flask):
    client = MongoClient('mongodb://localhost:27017/')
    app.db = client.medic_db
