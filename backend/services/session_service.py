import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from database.models import DataSession, SessionActivity, SessionLocal
from services.data_processing import data_processor

class SessionService:
    def __init__(self):
        pass
    
    def save_session(self, session_id: str, name: str, file_name: str, 
                    data_shape: tuple, columns: list, data_info: dict) -> bool:
        """Save session to database"""
        db = SessionLocal()
        try:
            session = DataSession(
                session_id=session_id,
                name=name,
                file_name=file_name,
                data_shape=json.dumps(list(data_shape)),
                columns=json.dumps(columns),
                data_info=json.dumps(data_info)
            )
            db.merge(session)  # Use merge to handle updates
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            return False
        finally:
            db.close()
    
    def get_all_sessions(self) -> List[Dict[str, Any]]:
        """Get all saved sessions"""
        db = SessionLocal()
        try:
            sessions = db.query(DataSession).filter(DataSession.status == "active").all()
            result = []
            for session in sessions:
                result.append({
                    "session_id": session.session_id,
                    "name": session.name,
                    "created_at": session.created_at.isoformat(),
                    "updated_at": session.updated_at.isoformat(),
                    "file_name": session.file_name,
                    "data_shape": json.loads(session.data_shape) if session.data_shape else [0, 0],
                    "columns": json.loads(session.columns) if session.columns else [],
                    "data_info": json.loads(session.data_info) if session.data_info else {}
                })
            return result
        finally:
            db.close()
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get specific session"""
        db = SessionLocal()
        try:
            session = db.query(DataSession).filter(DataSession.session_id == session_id).first()
            if session:
                return {
                    "session_id": session.session_id,
                    "name": session.name,
                    "created_at": session.created_at.isoformat(),
                    "updated_at": session.updated_at.isoformat(),
                    "file_name": session.file_name,
                    "data_shape": json.loads(session.data_shape) if session.data_shape else [0, 0],
                    "columns": json.loads(session.columns) if session.columns else [],
                    "data_info": json.loads(session.data_info) if session.data_info else {}
                }
            return None
        finally:
            db.close()
    
    def log_activity(self, session_id: str, activity_type: str, activity_data: dict):
        """Log session activity"""
        db = SessionLocal()
        try:
            activity = SessionActivity(
                session_id=session_id,
                activity_type=activity_type,
                activity_data=json.dumps(activity_data)
            )
            db.add(activity)
            db.commit()
        except Exception:
            db.rollback()
        finally:
            db.close()
    
    def delete_session(self, session_id: str) -> bool:
        """Delete session"""
        db = SessionLocal()
        try:
            session = db.query(DataSession).filter(DataSession.session_id == session_id).first()
            if session:
                session.status = "archived"
                db.commit()
                # Remove from memory
                if session_id in data_processor.session_data:
                    del data_processor.session_data[session_id]
                return True
            return False
        except Exception:
            db.rollback()
            return False
        finally:
            db.close()

# Global instance
session_service = SessionService()