from fastapi import APIRouter, HTTPException
from services.recommendation_service import recommendation_service

router = APIRouter()

@router.get("/ml/{session_id}")
async def get_ml_recommendations(session_id: str):
    """Get ML column recommendations"""
    try:
        recommendations = recommendation_service.get_ml_recommendations(session_id)
        return recommendations
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/visualization/{session_id}")
async def get_visualization_recommendations(session_id: str):
    """Get visualization column recommendations"""
    try:
        recommendations = recommendation_service.get_visualization_recommendations(session_id)
        return recommendations
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))