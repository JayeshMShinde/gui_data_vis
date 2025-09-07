import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any, Literal

class DataProcessor:
    def __init__(self):
        self.session_data: Dict[str, pd.DataFrame] = {}
    
    def store_dataframe(self, session_id: str, df: pd.DataFrame) -> None:
        """Store dataframe in session"""
        self.session_data[session_id] = df.copy()
    
    def get_dataframe(self, session_id: str) -> Optional[pd.DataFrame]:
        """Get dataframe from session"""
        return self.session_data.get(session_id)
    
    def drop_duplicates(self, session_id: str) -> pd.DataFrame:
        """Remove duplicate rows"""
        df = self.get_dataframe(session_id)
        if df is None:
            raise ValueError("No data found")
        
        cleaned_df = df.drop_duplicates()
        self.store_dataframe(session_id, cleaned_df)
        return cleaned_df
    
    def drop_columns(self, session_id: str, columns: List[str]) -> pd.DataFrame:
        """Drop specified columns"""
        df = self.get_dataframe(session_id)
        if df is None:
            raise ValueError("No data found")
        
        # Only drop columns that exist
        existing_cols = [col for col in columns if col in df.columns]
        cleaned_df = df.drop(columns=existing_cols)
        self.store_dataframe(session_id, cleaned_df)
        return cleaned_df
    
    def drop_rows(self, session_id: str, indices: List[int]) -> pd.DataFrame:
        """Drop specified rows by index"""
        df = self.get_dataframe(session_id)
        if df is None:
            raise ValueError("No data found")
        
        cleaned_df = df.drop(index=indices, errors='ignore')
        self.store_dataframe(session_id, cleaned_df)
        return cleaned_df
    
    def handle_missing_values(self, session_id: str, strategy: str, columns: Optional[List[str]] = None) -> pd.DataFrame:
        """Handle missing values with various strategies"""
        df = self.get_dataframe(session_id)
        if df is None:
            raise ValueError("No data found")
        
        cleaned_df = df.copy()
        target_cols = columns if columns else df.columns.tolist()
        
        for col in target_cols:
            if col not in df.columns:
                continue
                
            if strategy == "mean" and pd.api.types.is_numeric_dtype(df[col]):
                cleaned_df[col] = cleaned_df[col].fillna(cleaned_df[col].mean())
            elif strategy == "median" and pd.api.types.is_numeric_dtype(df[col]):
                cleaned_df[col] = cleaned_df[col].fillna(cleaned_df[col].median())
            elif strategy == "mode":
                mode_val = cleaned_df[col].mode()
                if not mode_val.empty:
                    cleaned_df[col] = cleaned_df[col].fillna(mode_val.iloc[0])
            elif strategy == "zero":
                cleaned_df[col] = cleaned_df[col].fillna(0)
            elif strategy == "forward_fill":
                cleaned_df[col] = cleaned_df[col].ffill()
            elif strategy == "backward_fill":
                cleaned_df[col] = cleaned_df[col].bfill()
            elif strategy == "drop":
                cleaned_df = cleaned_df.dropna(subset=[col])
        
        self.store_dataframe(session_id, cleaned_df)
        return cleaned_df
    
    def convert_data_types(self, session_id: str, column_types: Dict[str, str]) -> pd.DataFrame:
        """Convert column data types"""
        df = self.get_dataframe(session_id)
        if df is None:
            raise ValueError("No data found")
        
        cleaned_df = df.copy()
        
        for col, dtype in column_types.items():
            if col not in df.columns:
                continue
                
            try:
                if dtype == "int":
                    cleaned_df[col] = pd.to_numeric(cleaned_df[col], errors='coerce').astype('Int64')
                elif dtype == "float":
                    cleaned_df[col] = pd.to_numeric(cleaned_df[col], errors='coerce')
                elif dtype == "string":
                    cleaned_df[col] = cleaned_df[col].astype(str)
                elif dtype == "datetime":
                    cleaned_df[col] = pd.to_datetime(cleaned_df[col], errors='coerce')
                elif dtype == "category":
                    cleaned_df[col] = cleaned_df[col].astype('category')
            except Exception:
                # Skip conversion if it fails
                continue
        
        self.store_dataframe(session_id, cleaned_df)
        return cleaned_df
    
    def detect_outliers(self, session_id: str, column: str, method: str = "iqr") -> List[int]:
        """Detect outliers using IQR or Z-score method"""
        df = self.get_dataframe(session_id)
        if df is None or column not in df.columns:
            return []
        
        if not pd.api.types.is_numeric_dtype(df[column]):
            return []
        
        outlier_indices = []
        
        if method == "iqr":
            Q1 = df[column].quantile(0.25)
            Q3 = df[column].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            outlier_indices = df[(df[column] < lower_bound) | (df[column] > upper_bound)].index.tolist()
        
        elif method == "zscore":
            z_scores = np.abs((df[column] - df[column].mean()) / df[column].std())
            outlier_indices = df[z_scores > 3].index.tolist()
        
        return outlier_indices
    
    def get_data_info(self, session_id: str) -> Dict[str, Any]:
        """Get comprehensive data information"""
        df = self.get_dataframe(session_id)
        if df is None:
            return {}
        
        info = {
            "shape": list(df.shape),
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_values": {k: int(v) for k, v in df.isnull().sum().to_dict().items()},
            "memory_usage": int(df.memory_usage(deep=True).sum()),
            "numeric_columns": df.select_dtypes(include=[np.number]).columns.tolist(),
            "categorical_columns": df.select_dtypes(include=['object', 'category']).columns.tolist(),
            "datetime_columns": df.select_dtypes(include=['datetime64']).columns.tolist()
        }
        
        return info

# Global instance
data_processor = DataProcessor()