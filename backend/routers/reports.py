from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
from services.report_generator import report_generator

router = APIRouter()

class ReportRequest(BaseModel):
    session_id: str
    report_type: Literal["data_summary", "data_quality", "statistical_analysis", "visualization_recommendations"]

@router.post("/generate")
async def generate_report(request: ReportRequest):
    try:
        if request.report_type == "data_summary":
            report = report_generator.generate_data_summary_report(request.session_id)
        elif request.report_type == "data_quality":
            report = report_generator.generate_data_quality_report(request.session_id)
        elif request.report_type == "statistical_analysis":
            report = report_generator.generate_statistical_report(request.session_id)
        elif request.report_type == "visualization_recommendations":
            report = report_generator.generate_visualization_report(request.session_id)
        else:
            raise HTTPException(status_code=400, detail="Invalid report type")
        
        return report
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))