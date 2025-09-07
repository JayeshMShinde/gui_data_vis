"""
Centralized error handling utilities
"""
from fastapi import HTTPException
from typing import Dict, Any, Optional
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class APIError(Exception):
    """Custom API exception"""
    def __init__(self, message: str, status_code: int = 500, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ErrorHandler:
    """Centralized error handling"""
    
    @staticmethod
    def handle_validation_error(error: str, field: Optional[str] = None) -> HTTPException:
        """Handle validation errors"""
        details = {"error_type": "validation_error"}
        if field:
            details["field"] = field
        
        logger.warning(f"Validation error: {error}")
        return HTTPException(
            status_code=400,
            detail=error,
            headers={"X-Error-Type": "validation_error"}
        )
    
    @staticmethod
    def handle_not_found_error(resource: str, identifier: str) -> HTTPException:
        """Handle resource not found errors"""
        message = f"{resource} with ID '{identifier}' not found"
        logger.warning(message)
        return HTTPException(
            status_code=404,
            detail=message,
            headers={"X-Error-Type": "not_found"}
        )
    
    @staticmethod
    def handle_processing_error(operation: str, error: Exception) -> HTTPException:
        """Handle data processing errors"""
        error_message = f"Failed to {operation}: {str(error)}"
        logger.error(f"Processing error: {error_message}")
        logger.error(traceback.format_exc())
        
        return HTTPException(
            status_code=422,
            detail=error_message,
            headers={"X-Error-Type": "processing_error"}
        )
    
    @staticmethod
    def handle_internal_error(error: Exception, context: str = "") -> HTTPException:
        """Handle internal server errors"""
        error_message = f"Internal server error{': ' + context if context else ''}"
        logger.error(f"Internal error: {str(error)}")
        logger.error(traceback.format_exc())
        
        return HTTPException(
            status_code=500,
            detail=error_message,
            headers={"X-Error-Type": "internal_error"}
        )
    
    @staticmethod
    def handle_file_error(operation: str, filename: str, error: Exception) -> HTTPException:
        """Handle file operation errors"""
        error_message = f"Failed to {operation} file '{filename}': {str(error)}"
        logger.error(error_message)
        
        return HTTPException(
            status_code=422,
            detail=error_message,
            headers={"X-Error-Type": "file_error"}
        )
    
    @staticmethod
    def handle_ml_error(model_type: str, error: Exception) -> HTTPException:
        """Handle machine learning errors"""
        error_message = f"ML training failed for {model_type}: {str(error)}"
        logger.error(error_message)
        logger.error(traceback.format_exc())
        
        return HTTPException(
            status_code=422,
            detail=error_message,
            headers={"X-Error-Type": "ml_error"}
        )

def safe_execute(func, *args, **kwargs):
    """
    Safely execute a function with error handling
    
    Args:
        func: Function to execute
        *args: Function arguments
        **kwargs: Function keyword arguments
        
    Returns:
        Function result or raises HTTPException
    """
    try:
        return func(*args, **kwargs)
    except ValueError as e:
        raise ErrorHandler.handle_validation_error(str(e))
    except FileNotFoundError as e:
        raise ErrorHandler.handle_not_found_error("File", str(e))
    except Exception as e:
        raise ErrorHandler.handle_internal_error(e, f"executing {func.__name__}")

def log_api_call(endpoint: str, method: str, params: Dict[str, Any] = None):
    """Log API call for debugging"""
    logger.info(f"API Call: {method} {endpoint}")
    if params:
        logger.debug(f"Parameters: {params}")

def log_performance(operation: str, duration: float, details: Dict[str, Any] = None):
    """Log performance metrics"""
    logger.info(f"Performance: {operation} took {duration:.2f}s")
    if details:
        logger.debug(f"Details: {details}")