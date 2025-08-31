# DataViz Pro Backend

FastAPI-based backend server providing data processing, machine learning, and visualization APIs.

## 🏗️ Architecture

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── database/              # Database models and setup
│   ├── __init__.py
│   └── models.py          # SQLAlchemy models
├── routers/               # API route handlers
│   ├── data.py           # Data management endpoints
│   ├── visualization.py  # Chart generation endpoints
│   ├── ml.py             # Machine learning endpoints
│   ├── reports.py        # Report generation endpoints
│   ├── sessions.py       # Session management endpoints
│   └── recommendations.py # Smart recommendations
└── services/              # Business logic services
    ├── data_processing.py    # Data manipulation
    ├── chart_generator.py    # Chart creation
    ├── ml_service.py         # ML model training
    ├── report_generator.py   # Report creation
    ├── session_service.py    # Session management
    └── recommendation_service.py # AI recommendations
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip package manager

### Installation
```bash
cd backend
pip install -r requirements.txt
```

### Run Development Server
```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Access API
- **Server**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📦 Dependencies

### **Core Framework**
- `fastapi` - Modern web framework
- `uvicorn` - ASGI server
- `python-multipart` - File upload support

### **Data Processing**
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `openpyxl` - Excel file support
- `xlrd` - Excel reading

### **Machine Learning**
- `scikit-learn` - ML algorithms
- `scipy` - Scientific computing

### **Visualization**
- `matplotlib` - Chart generation
- `seaborn` - Statistical visualization

### **Database**
- `sqlalchemy` - ORM and database toolkit

## 🛠️ API Endpoints

### **Data Management** (`/api/data`)
```python
POST /upload          # Upload CSV/XLSX files
POST /clean           # Clean data operations
GET  /info/{session}  # Get dataset information
```

### **Visualization** (`/api/charts`)
```python
POST /generate        # Generate charts
```

### **Machine Learning** (`/api/ml`)
```python
POST /train          # Train supervised models
POST /cluster        # Clustering algorithms
POST /pca           # PCA analysis
```

### **Reports** (`/api/reports`)
```python
POST /generate       # Generate analysis reports
```

### **Sessions** (`/api/sessions`)
```python
GET    /             # List all sessions
GET    /{id}         # Get specific session
POST   /save         # Save current session
DELETE /{id}         # Delete session
```

### **Recommendations** (`/api/recommendations`)
```python
GET /ml/{session}            # ML column recommendations
GET /visualization/{session} # Chart recommendations
```

## 🗄️ Database Schema

### **DataSession**
```sql
session_id    VARCHAR PRIMARY KEY
name          VARCHAR NOT NULL
created_at    DATETIME
updated_at    DATETIME
file_name     VARCHAR
data_shape    TEXT (JSON)
columns       TEXT (JSON)
data_info     TEXT (JSON)
status        VARCHAR DEFAULT 'active'
```

### **SessionActivity**
```sql
id            INTEGER PRIMARY KEY
session_id    VARCHAR NOT NULL
activity_type VARCHAR NOT NULL
activity_data TEXT (JSON)
timestamp     DATETIME
```

## 🔧 Services

### **DataProcessor**
- File upload handling
- Data cleaning operations
- Type conversion
- Missing value handling
- Outlier detection

### **ChartGenerator**
- 7 chart types support
- Base64 image generation
- Matplotlib/Seaborn integration
- Customizable styling

### **MLService**
- 5 supervised algorithms
- Clustering (K-Means, DBSCAN)
- PCA dimensionality reduction
- Model evaluation metrics
- Cross-validation

### **ReportGenerator**
- Data summary reports
- Quality assessment
- Statistical analysis
- Visualization recommendations

### **SessionService**
- Persistent session storage
- Activity logging
- Session management
- Data restoration

### **RecommendationService**
- ML column analysis
- Visualization suggestions
- Data quality scoring
- Smart recommendations

## 🧪 Testing

### **Run Tests**
```bash
pytest
```

### **Test Coverage**
```bash
pytest --cov=.
```

### **API Testing**
- Use `/docs` for interactive testing
- Postman collection available
- Unit tests for all services

## 🔒 Security

### **CORS Configuration**
```python
origins = [
    "http://localhost:3000",  # Frontend development
    "https://yourdomain.com", # Production
]
```

### **File Upload Security**
- File type validation
- Size limits
- Secure file handling
- Temporary file cleanup

## 📊 Performance

### **Optimization Features**
- In-memory data processing
- Efficient pandas operations
- Lazy loading for large datasets
- Connection pooling

### **Monitoring**
- Request logging
- Error tracking
- Performance metrics
- Health checks

## 🚀 Deployment

### **Production Setup**
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=sqlite:///sessions.db
export CORS_ORIGINS=https://yourdomain.com

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### **Docker Deployment**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔧 Configuration

### **Environment Variables**
```bash
DATABASE_URL=sqlite:///sessions.db
CORS_ORIGINS=http://localhost:3000
MAX_FILE_SIZE=100MB
UPLOAD_DIR=./uploads
```

### **Settings**
```python
# main.py
app = FastAPI(
    title="DataViz Pro API",
    description="Data visualization and ML backend",
    version="1.0.0"
)
```

## 🐛 Debugging

### **Logging**
```python
import logging
logging.basicConfig(level=logging.INFO)
```

### **Error Handling**
- Comprehensive exception handling
- Detailed error messages
- HTTP status codes
- Error logging

## 📈 Monitoring

### **Health Check**
```python
@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

### **Metrics**
- Request count
- Response times
- Error rates
- Resource usage

---

**Backend Server** - Powering intelligent data analysis! 🚀