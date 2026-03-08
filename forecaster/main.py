"""
Smart Cafeteria – Demand Forecasting Service
=============================================
Entry point for the FastAPI application.

Run with:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.forecast_routes import router as forecast_router

app = FastAPI(
    title="Smart Cafeteria Forecaster",
    description="Demand forecasting micro-service using Prophet",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast_router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "forecaster"}
