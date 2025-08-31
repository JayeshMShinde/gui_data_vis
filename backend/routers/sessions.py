from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.session_service import session_service

router = APIRouter()

class SaveSessionRequest(BaseModel):
    session_id: str
    name: str

@router.get("/")
async def get_all_sessions():
    """Get all saved sessions"""
    try:
        sessions = session_service.get_all_sessions()
        return {"sessions": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{session_id}")
async def get_session(session_id: str):
    """Get specific session"""
    try:
        session = session_service.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return session
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save")
async def save_session(request: SaveSessionRequest):
    """Save current session"""
    try:
        # Get session data from data processor
        from services.data_processing import data_processor
        df = data_processor.get_dataframe(request.session_id)
        if df is None:
            raise HTTPException(status_code=404, detail="Session data not found")
        
        data_info = data_processor.get_data_info(request.session_id)
        
        success = session_service.save_session(
            session_id=request.session_id,
            name=request.name,
            file_name="uploaded_data",  # Could be enhanced to store actual filename
            data_shape=df.shape,
            columns=df.columns.tolist(),
            data_info=data_info
        )
        
        if success:
            session_service.log_activity(request.session_id, "save", {"name": request.name})
            return {"message": "Session saved successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to save session")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{session_id}")
async def delete_session(session_id: str):
    """Delete session"""
    try:
        success = session_service.delete_session(session_id)
        if success:
            return {"message": "Session deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Session not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))