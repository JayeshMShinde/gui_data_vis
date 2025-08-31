from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import data, visualization, ml

# Initialize database
try:
    from database.models import Base, engine
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Database initialization warning: {e}")

app = FastAPI(
    title="Data Visualization & ML API",
    description="Backend for full-stack data visualization and machine learning app.",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Backend is running!"}


# Allow requests from your frontend (adjust the origin if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router, prefix="/api/data", tags=["Data"])
app.include_router(visualization.router, prefix="/api/charts", tags=["Visualization"])
app.include_router(ml.router, prefix="/api/ml", tags=["Machine Learning"])

# Import and include reports router
from routers import reports
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

# Import and include sessions router
from routers import sessions
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])

# Import and include recommendations router
from routers import recommendations
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["Recommendations"])