#web.models
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, TIMESTAMP
from .database import db

class Meeting(db.Model):
    __tablename__ = 'meeting'
    
    mId = Column(String(255), primary_key=True)
    hash1 = Column(String(255), nullable=True)
    hash2 = Column(String(255), nullable=True)