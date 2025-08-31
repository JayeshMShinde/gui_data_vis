from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import data, visualization, ml

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

app.include_router(data.router, prefix="/api/v1/data", tags=["Data"])
app.include_router(visualization.router, prefix="/api/v1/charts", tags=["Visualization"])
app.include_router(ml.router, prefix="/api/v1/0ml", tags=["Machine Learning"])