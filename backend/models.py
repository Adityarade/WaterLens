from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # In a real app, a user would have one profile
    # profile_id = Column(Integer, ForeignKey("farmer_profiles.id"))
    # profile = relationship("FarmerProfile")

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    fullName = Column(String, index=True)
    farmName = Column(String)
    location = Column(String)
    farmSize = Column(String)
    primaryCrops = Column(String)
    photoUrl = Column(String)

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    autoIrrigate = Column(Boolean, default=True)
    pushNotifications = Column(Boolean, default=True)
    highContrastMode = Column(Boolean, default=False)
    aiStrictness = Column(String, default="balanced")
    weeklyReports = Column(Boolean, default=False)

class SensorLog(Base):
    __tablename__ = "sensor_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String, index=True)
    moisture = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float, nullable=True)
    npk_n = Column(Float, nullable=True)
    npk_p = Column(Float, nullable=True)
    npk_k = Column(Float, nullable=True)
    zone = Column(String)
