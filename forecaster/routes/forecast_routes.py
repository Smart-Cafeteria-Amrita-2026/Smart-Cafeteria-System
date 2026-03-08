"""
Forecast API routes.
"""

from fastapi import APIRouter, HTTPException

from services.data_service import fetch_historical_consumption, fetch_menu_item_names
from services.forecast_service import get_trending_items

router = APIRouter(prefix="/api/forecast", tags=["Forecast"])


@router.get("/debug")
def debug_data():
    df = fetch_historical_consumption()
    names = fetch_menu_item_names()

    if df.empty:
        return {
            "message": "No rows returned from data extraction.",
            "hint": "Check that booking_menu_items rows exist with bookings "
            "whose booking_status is NOT 'cancelled' or 'expired', "
            "and that the related bookings have a meal_slots row.",
            "menu_items_found": len(names),
            "rows": [],
        }

    return {
        "total_rows": len(df),
        "menu_items_found": len(names),
        "sample": df.head(20).to_dict(orient="records"),
    }


@router.get("/trending-items")
def trending_items():
    try:
        results = get_trending_items(top_n=5)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Forecasting failed: {exc}",
        ) from exc

    if not results:
        return {
            "message": "No forecast data available. Ensure there is historical booking data.",
            "trending_items": [],
        }

    return {"trending_items": results}
