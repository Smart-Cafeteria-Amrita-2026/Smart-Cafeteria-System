import logging
from datetime import date
from typing import Any

import pandas as pd
from prophet import Prophet

from services.data_service import fetch_historical_consumption, fetch_menu_item_names

logger = logging.getLogger(__name__)


def _fit_and_predict(
    item_df: pd.DataFrame,
    periods: int = 7,
) -> pd.DataFrame:

    model = Prophet(
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=False,
    )

    # Suppress the verbose Prophet/cmdstanpy logs
    model.fit(item_df)

    future = model.make_future_dataframe(periods=periods, freq="D")
    forecast = model.predict(future)
    return forecast


def forecast_all_items(
    periods: int = 7,
) -> tuple[dict[int, pd.DataFrame], dict[int, float]]:

    consumption_df = fetch_historical_consumption()

    if consumption_df.empty:
        logger.warning("No historical consumption data found.")
        return {}

    results: dict[int, pd.DataFrame] = {}
    single_point_items: dict[int, float] = {}

    for menu_item_id, group in consumption_df.groupby("menu_item_id"):
        prophet_df = group.rename(columns={"slot_date": "ds", "total_qty": "y"})[["ds", "y"]].copy()

        if len(prophet_df) < 2:
            avg_qty = float(prophet_df["y"].mean())
            single_point_items[int(menu_item_id)] = avg_qty
            logger.info(
                "menu_item_id=%s has only %d data point(s) – using average fallback (%.1f).",
                menu_item_id,
                len(prophet_df),
                avg_qty,
            )
            continue

        try:
            forecast = _fit_and_predict(prophet_df, periods=periods)
            results[int(menu_item_id)] = forecast
        except Exception:
            logger.exception("Prophet failed for menu_item_id=%s", menu_item_id)

    return results, single_point_items


def get_trending_items(
    top_n: int = 5,
    target_date: date | None = None,
) -> list[dict[str, Any]]:
    if target_date is None:
        target_date = date.today()

    forecasts, single_point_items = forecast_all_items(periods=7)

    if not forecasts and not single_point_items:
        return []

    item_names = fetch_menu_item_names()

    predictions: list[dict[str, Any]] = []

    target_ts = pd.Timestamp(target_date)

    for menu_item_id, forecast_df in forecasts.items():
        row = forecast_df.loc[forecast_df["ds"] == target_ts]
        if row.empty:
            continue

        yhat = float(row["yhat"].iloc[0])

        predicted_qty = max(round(yhat, 2), 0)

        predictions.append(
            {
                "menu_item_id": menu_item_id,
                "item_name": item_names.get(menu_item_id, f"Item #{menu_item_id}"),
                "predicted_demand": predicted_qty,
                "date": target_date.isoformat(),
            }
        )

    for menu_item_id, avg_qty in single_point_items.items():
        predictions.append(
            {
                "menu_item_id": menu_item_id,
                "item_name": item_names.get(menu_item_id, f"Item #{menu_item_id}"),
                "predicted_demand": max(round(avg_qty, 2), 0),
                "date": target_date.isoformat(),
            }
        )

    predictions.sort(key=lambda x: x["predicted_demand"], reverse=True)
    return predictions[:top_n]
