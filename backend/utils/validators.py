"""
Data validation utilities for input validation and sanitization
"""
import pandas as pd
from typing import List, Optional, Dict, Any, Tuple
import re
from pathlib import Path

class DataValidator:
    """Validates data inputs and file uploads"""
    
    # Supported file extensions
    SUPPORTED_EXTENSIONS = {'.csv', '.xlsx', '.xls'}
    
    # Maximum file size (100MB)
    MAX_FILE_SIZE = 100 * 1024 * 1024
    
    # Maximum number of rows/columns
    MAX_ROWS = 1_000_000
    MAX_COLUMNS = 1000
    
    @classmethod
    def validate_file_upload(cls, file_path: str, file_size: int) -> Tuple[bool, Optional[str]]:
        """
        Validate uploaded file
        
        Args:
            file_path: Path to the uploaded file
            file_size: Size of the file in bytes
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check file size
        if file_size > cls.MAX_FILE_SIZE:
            return False, f"File size ({file_size / 1024 / 1024:.1f}MB) exceeds maximum allowed size (100MB)"
        
        # Check file extension
        file_ext = Path(file_path).suffix.lower()
        if file_ext not in cls.SUPPORTED_EXTENSIONS:
            return False, f"Unsupported file type: {file_ext}. Supported types: {', '.join(cls.SUPPORTED_EXTENSIONS)}"
        
        return True, None
    
    @classmethod
    def validate_dataframe(cls, df: pd.DataFrame) -> Tuple[bool, Optional[str]]:
        """
        Validate DataFrame dimensions and content
        
        Args:
            df: DataFrame to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if DataFrame is empty
        if df.empty:
            return False, "Dataset is empty"
        
        # Check dimensions
        rows, cols = df.shape
        if rows > cls.MAX_ROWS:
            return False, f"Dataset has too many rows ({rows:,}). Maximum allowed: {cls.MAX_ROWS:,}"
        
        if cols > cls.MAX_COLUMNS:
            return False, f"Dataset has too many columns ({cols}). Maximum allowed: {cls.MAX_COLUMNS}"
        
        # Check for valid column names
        invalid_columns = []
        for col in df.columns:
            if not cls._is_valid_column_name(str(col)):
                invalid_columns.append(col)
        
        if invalid_columns:
            return False, f"Invalid column names: {invalid_columns[:5]}{'...' if len(invalid_columns) > 5 else ''}"
        
        return True, None
    
    @classmethod
    def validate_session_id(cls, session_id: str) -> bool:
        """
        Validate session ID format
        
        Args:
            session_id: Session ID to validate
            
        Returns:
            True if valid, False otherwise
        """
        if not session_id or not isinstance(session_id, str):
            return False
        
        # Session ID should be alphanumeric with hyphens, 8-64 characters
        pattern = r'^[a-zA-Z0-9\-_]{8,64}$'
        return bool(re.match(pattern, session_id))
    
    @classmethod
    def validate_column_names(cls, columns: List[str], available_columns: List[str]) -> Tuple[bool, List[str]]:
        """
        Validate that specified columns exist in the dataset
        
        Args:
            columns: List of column names to validate
            available_columns: List of available column names
            
        Returns:
            Tuple of (all_valid, missing_columns)
        """
        missing_columns = [col for col in columns if col not in available_columns]
        return len(missing_columns) == 0, missing_columns
    
    @classmethod
    def sanitize_column_name(cls, column_name: str) -> str:
        """
        Sanitize column name for safe usage
        
        Args:
            column_name: Original column name
            
        Returns:
            Sanitized column name
        """
        # Remove special characters and replace with underscores
        sanitized = re.sub(r'[^\w\s-]', '_', str(column_name))
        # Replace multiple spaces/underscores with single underscore
        sanitized = re.sub(r'[\s_]+', '_', sanitized)
        # Remove leading/trailing underscores
        sanitized = sanitized.strip('_')
        # Ensure it's not empty
        if not sanitized:
            sanitized = 'column'
        
        return sanitized
    
    @classmethod
    def _is_valid_column_name(cls, column_name: str) -> bool:
        """
        Check if column name is valid (more lenient after sanitization)
        
        Args:
            column_name: Column name to check
            
        Returns:
            True if valid, False otherwise
        """
        if not column_name or len(column_name) > 100:
            return False
        
        # After sanitization, should only contain safe characters
        pattern = r'^[a-zA-Z0-9_]+$'
        return bool(re.match(pattern, column_name))

class MLValidator:
    """Validates machine learning inputs"""
    
    @classmethod
    def validate_ml_request(cls, df: pd.DataFrame, target_column: str, 
                          feature_columns: List[str]) -> Tuple[bool, Optional[str]]:
        """
        Validate ML training request
        
        Args:
            df: DataFrame
            target_column: Target column name
            feature_columns: List of feature column names
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if target column exists
        if target_column not in df.columns:
            return False, f"Target column '{target_column}' not found"
        
        # Check if feature columns exist
        missing_features = [col for col in feature_columns if col not in df.columns]
        if missing_features:
            return False, f"Feature columns not found: {missing_features}"
        
        # Check if target column is in features (should not be)
        if target_column in feature_columns:
            return False, "Target column cannot be used as a feature"
        
        # Check minimum data requirements
        if len(df) < 10:
            return False, "Dataset too small for ML training (minimum 10 rows required)"
        
        if len(feature_columns) == 0:
            return False, "At least one feature column is required"
        
        # Check for sufficient non-null values
        target_null_ratio = df[target_column].isnull().sum() / len(df)
        if target_null_ratio > 0.5:
            return False, f"Target column has too many missing values ({target_null_ratio:.1%})"
        
        return True, None
    
    @classmethod
    def validate_clustering_request(cls, df: pd.DataFrame, 
                                  feature_columns: List[str]) -> Tuple[bool, Optional[str]]:
        """
        Validate clustering request
        
        Args:
            df: DataFrame
            feature_columns: List of feature column names
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if feature columns exist
        missing_features = [col for col in feature_columns if col not in df.columns]
        if missing_features:
            return False, f"Feature columns not found: {missing_features}"
        
        # Check minimum requirements
        if len(df) < 3:
            return False, "Dataset too small for clustering (minimum 3 rows required)"
        
        if len(feature_columns) == 0:
            return False, "At least one feature column is required"
        
        return True, None