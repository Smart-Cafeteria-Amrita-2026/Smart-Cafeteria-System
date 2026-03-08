from collections import defaultdict
from typing import Any

import pandas as pd

from config.supabase_client import get_supabase


def fetch_historical_consumption() -> pd.DataFrame:
    supabase = get_supabase()
    page_size = 1000
    all_rows: list[dict[str, Any]] = []
    offset = 0

    while True:
        response = (
            supabase.table("booking_menu_items")
            .select("menu_item_id, quantity, bookings!inner(booking_status, meal_slots!inner(slot_date))")
            .filter("bookings.booking_status", "not.in", '("cancelled")')
            .range(offset, offset + page_size - 1)
            .execute()
        )

        rows = response.data or []
        all_rows.extend(rows)

        if len(rows) < page_size:
            break
        offset += page_size

    aggregated: dict[tuple[int, str], int] = defaultdict(int)

    for row in all_rows:
        menu_item_id: int = row["menu_item_id"]
        quantity: int = row.get("quantity", 1)

        booking_info = row.get("bookings")
        if not booking_info:
            continue

        meal_slot_info = booking_info.get("meal_slots")
        if not meal_slot_info:
            continue

        slot_date: str = meal_slot_info.get("slot_date", "")
        if not slot_date:
            continue

        aggregated[(menu_item_id, slot_date)] += quantity

    if not aggregated:
        return pd.DataFrame(columns=["menu_item_id", "slot_date", "total_qty"])

    records = [{"menu_item_id": key[0], "slot_date": key[1], "total_qty": qty} for key, qty in aggregated.items()]

    df = pd.DataFrame(records)
    df["slot_date"] = pd.to_datetime(df["slot_date"])
    df = df.sort_values(["menu_item_id", "slot_date"]).reset_index(drop=True)
    return df


def fetch_menu_item_names() -> dict[int, str]:
    supabase = get_supabase()
    response = supabase.table("menu_items").select("menu_item_id, item_name").execute()

    return {row["menu_item_id"]: row["item_name"] for row in (response.data or [])}
