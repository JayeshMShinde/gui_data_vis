import io
import pandas as pd
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Literal, Dict, Any
from services.data_processing import data_processor

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if file.filename.endswith('.csv'):
            contents = await file.read()
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xlsx', '.xls')):
            contents = await file.read()
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type.")

        # Generate session ID and store dataframe
        session_id = str(uuid.uuid4())
        data_processor.store_dataframe(session_id, df)
        
        preview_data = df.head(10).fillna("").to_dict(orient="records")
        
        return JSONResponse({
            "session_id": session_id,
            "columns": df.columns.tolist(),
            "shape": list(df.shape),
            "preview": preview_data,
            "data_info": data_processor.get_data_info(session_id)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CleanRequest(BaseModel):
    session_id: str
    action: Literal[
        "drop_duplicates", "drop_columns", "drop_rows", "handle_missing", "convert_types", "detect_outliers"
    ]
    columns: Optional[List[str]] = None
    indices: Optional[List[int]] = None  # for drop_rows
    strategy: Optional[str] = None  # for handle_missing
    column_types: Optional[Dict[str, str]] = None  # for convert_types
    outlier_method: Optional[str] = "iqr"  # for detect_outliers

@router.post("/clean")
async def clean_data(request: CleanRequest):
    try:
        if request.action == "drop_duplicates":
            df = data_processor.drop_duplicates(request.session_id)
        elif request.action == "drop_columns" and request.columns:
            df = data_processor.drop_columns(request.session_id, request.columns)
        elif request.action == "drop_rows" and request.indices:
            df = data_processor.drop_rows(request.session_id, request.indices)
        elif request.action == "handle_missing" and request.strategy:
            df = data_processor.handle_missing_values(request.session_id, request.strategy, request.columns)
        elif request.action == "convert_types" and request.column_types:
            df = data_processor.convert_data_types(request.session_id, request.column_types)
        elif request.action == "detect_outliers" and request.columns:
            outliers = {}
            for col in request.columns:
                outliers[col] = data_processor.detect_outliers(request.session_id, col, request.outlier_method or "iqr")
            return {"outliers": outliers}
        else:
            raise HTTPException(status_code=400, detail="Invalid action or missing parameters")

        preview_data = df.head(50).fillna("").to_dict(orient="records")
        
        return {
            "columns": df.columns.tolist(),
            "shape": list(df.shape),
            "preview": preview_data,
            "data_info": data_processor.get_data_info(request.session_id)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/info/{session_id}")
async def get_data_info(session_id: str):
    try:
        info = data_processor.get_data_info(session_id)
        if not info:
            raise HTTPException(status_code=404, detail="Session not found")
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/preview/{session_id}")
async def get_data_preview(session_id: str, limit: int = 50):
    try:
        df = data_processor.get_dataframe(session_id)
        if df is None:
            raise HTTPException(status_code=404, detail="Session not found")
        
        preview_data = df.head(limit).fillna("").to_dict(orient="records")
        
        return {
            "columns": df.columns.tolist(),
            "shape": list(df.shape),
            "preview": preview_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))