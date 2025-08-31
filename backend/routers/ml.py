from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Literal
from services.data_processing import data_processor
from services.ml_service import ml_service

router = APIRouter()

class SupervisedMLRequest(BaseModel):
    session_id: str
    model_type: Literal["linear", "random_forest", "svm", "knn", "decision_tree"]
    target_column: str
    feature_columns: List[str]
    test_size: Optional[float] = 0.2

class ClusteringRequest(BaseModel):
    session_id: str
    algorithm: Literal["kmeans", "dbscan"]
    feature_columns: List[str]
    n_clusters: Optional[int] = 3

class PCARequest(BaseModel):
    session_id: str
    feature_columns: List[str]
    n_components: Optional[int] = 2

@router.post("/train")
async def train_model(request: SupervisedMLRequest):
    try:
        df = data_processor.get_dataframe(request.session_id)
        if df is None:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate columns exist
        missing_cols = [col for col in request.feature_columns + [request.target_column] 
                       if col not in df.columns]
        if missing_cols:
            raise HTTPException(status_code=400, detail=f"Columns not found: {missing_cols}")
        
        result = ml_service.train_supervised_model(
            df, request.model_type, request.target_column, 
            request.feature_columns, request.test_size
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cluster")
async def train_clustering(request: ClusteringRequest):
    try:
        df = data_processor.get_dataframe(request.session_id)
        if df is None:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate columns exist
        missing_cols = [col for col in request.feature_columns if col not in df.columns]
        if missing_cols:
            raise HTTPException(status_code=400, detail=f"Columns not found: {missing_cols}")
        
        result = ml_service.train_clustering(
            df, request.algorithm, request.feature_columns, request.n_clusters
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pca")
async def apply_pca(request: PCARequest):
    try:
        df = data_processor.get_dataframe(request.session_id)
        if df is None:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Validate columns exist
        missing_cols = [col for col in request.feature_columns if col not in df.columns]
        if missing_cols:
            raise HTTPException(status_code=400, detail=f"Columns not found: {missing_cols}")
        
        result = ml_service.apply_pca(
            df, request.feature_columns, request.n_components
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/confusion-matrix/{model_type}")
async def get_confusion_matrix(model_type: str):
    try:
        chart_data = ml_service.generate_confusion_matrix(model_type)
        return {"chart_data": chart_data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))