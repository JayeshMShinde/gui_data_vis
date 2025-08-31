import io
import pandas as pd

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List, Literal

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

        # Store the dataframe in memory or session (for now, just return columns and shape)
        return JSONResponse({
            "columns": df.columns.tolist(),
            "shape": df.shape,
            "preview": df.head(10).to_dict(orient="records")
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



class CleanRequest(BaseModel):
    action: Literal[
        "drop_duplicates", "drop_columns", "fillna", "convert_type"
    ]
    columns: Optional[List[str]] = None
    strategy: Optional[str] = None  # e.g. "mean", "median", "mode", "zero", "ffill", "bfill"
    dtype: Optional[str] = None     # for convert_type

# Keep dataset in memory (later we’ll use DB / session storage)
session_df = {}

@router.post("/clean")
async def clean_data(request: CleanRequest):
    global session_df

    if "data" not in session_df:
        raise HTTPException(status_code=400, detail="No dataset uploaded")

    df = session_df["data"]

    if request.action == "drop_duplicates":
        df = df.drop_duplicates()
    elif request.action == "drop_columns" and request.columns:
        df = df.drop(columns=request.columns)
    elif request.action == "fillna":
        if request.strategy == "mean":
            df = df.fillna(df.mean(numeric_only=True))
        elif request.strategy == "median":
            df = df.fillna(df.median(numeric_only=True))
        elif request.strategy == "mode":
            df = df.fillna(df.mode().iloc[0])
        elif request.strategy == "zero":
            df = df.fillna(0)
        elif request.strategy in ("ffill", "bfill"):
            df = df.fillna(method=request.strategy)
    elif request.action == "convert_type" and request.columns and request.dtype:
        for col in request.columns:
            try:
                df[col] = df[col].astype(request.dtype)
            except Exception:
                pass

    # Save back into memory
    session_df["data"] = df

    return {
        "columns": df.columns.tolist(),
        "preview": df.head(50).to_dict(orient="records"),
    }
