from sqlalchemy import Column, String, DateTime, Text, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime

Base = declarative_base()

class DataSession(Base):
    __tablename__ = "data_sessions"
    
    session_id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    file_name = Column(String)
    data_shape = Column(String)  # JSON string: [rows, cols]
    columns = Column(Text)  # JSON string
    data_info = Column(Text)  # JSON string
    status = Column(String, default="active")

class SessionActivity(Base):
    __tablename__ = "session_activities"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, nullable=False)
    activity_type = Column(String, nullable=False)
    activity_data = Column(Text)  # JSON string
    timestamp = Column(DateTime, default=datetime.utcnow)

# Database setup
engine = create_engine('sqlite:///sessions.db')
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)