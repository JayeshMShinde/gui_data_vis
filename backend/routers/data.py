import io
import pandas as pd
import uuid
import time
import os

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Literal, Dict, Any
from services.data_processing import data_processor
from utils.validators import DataValidator
from utils.error_handlers import ErrorHandler, safe_execute, log_api_call, log_performance

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    start_time = time.time()
    log_api_call("/upload", "POST", {"filename": file.filename, "content_type": file.content_type})
    
    try:
        # Validate file
        contents = await file.read()
        file_size = len(contents)
        
        is_valid, error_msg = DataValidator.validate_file_upload(file.filename or "unknown", file_size)
        if not is_valid:
            raise ErrorHandler.handle_validation_error(error_msg)
        
        # Read file based on extension
        try:
            if file.filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(contents))
            elif file.filename.endswith(('.xlsx', '.xls')):
                df = pd.read_excel(io.BytesIO(contents))
            else:
                raise ValueError("Unsupported file type")
        except Exception as e:
            raise ErrorHandler.handle_file_error("read", file.filename, e)
        
        # Sanitize column names
        original_columns = df.columns.tolist()
        df.columns = [DataValidator.sanitize_column_name(col) for col in df.columns]
        
        # Validate DataFrame after sanitization
        is_valid, error_msg = DataValidator.validate_dataframe(df)
        if not is_valid:
            raise ErrorHandler.handle_validation_error(error_msg)
        
        # Generate session ID and store dataframe
        session_id = str(uuid.uuid4())
        data_processor.store_dataframe(session_id, df)
        
        preview_data = df.head(10).fillna("").to_dict(orient="records")
        
        duration = time.time() - start_time
        log_performance("file_upload", duration, {
            "file_size": file_size, 
            "rows": len(df), 
            "columns": len(df.columns)
        })
        
        return JSONResponse({
            "session_id": session_id,
            "columns": df.columns.tolist(),
            "shape": list(df.shape),
            "preview": preview_data,
            "data_info": data_processor.get_data_info(session_id)
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise ErrorHandler.handle_internal_error(e, "file upload")

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
    start_time = time.time()
    log_api_call("/clean", "POST", {"session_id": request.session_id, "action": request.action})
    
    try:
        # Validate session ID
        if not DataValidator.validate_session_id(request.session_id):
            raise ErrorHandler.handle_validation_error("Invalid session ID format")
        
        # Check if session exists
        df = data_processor.get_dataframe(request.session_id)
        if df is None:
            raise ErrorHandler.handle_not_found_error("Session", request.session_id)
        
        # Execute cleaning operation
        result = None
        if request.action == "drop_duplicates":
            result = safe_execute(data_processor.drop_duplicates, request.session_id)
        elif request.action == "drop_columns" and request.columns:
            result = safe_execute(data_processor.drop_columns, request.session_id, request.columns)
        elif request.action == "drop_rows" and request.indices:
            result = safe_execute(data_processor.drop_rows, request.session_id, request.indices)
        elif request.action == "handle_missing" and request.strategy:
            result = safe_execute(data_processor.handle_missing_values, request.session_id, request.strategy, request.columns)
        elif request.action == "convert_types" and request.column_types:
            result = safe_execute(data_processor.convert_data_types, request.session_id, request.column_types)
        elif request.action == "detect_outliers" and request.columns:
            outliers = {}
            for col in request.columns:
                outliers[col] = safe_execute(data_processor.detect_outliers, request.session_id, col, request.outlier_method or "iqr")
            return {"outliers": outliers}
        else:
            raise ErrorHandler.handle_validation_error("Invalid action or missing parameters")
        
        if result is None:
            raise ErrorHandler.handle_processing_error("data cleaning", ValueError("No result from cleaning operation"))
        
        preview_data = result.head(50).fillna("").to_dict(orient="records")
        
        duration = time.time() - start_time
        log_performance("data_cleaning", duration, {"action": request.action, "rows": len(result)})
        
        return {
            "columns": result.columns.tolist(),
            "shape": list(result.shape),
            "preview": preview_data,
            "data_info": data_processor.get_data_info(request.session_id)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise ErrorHandler.handle_processing_error("data cleaning", e)

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