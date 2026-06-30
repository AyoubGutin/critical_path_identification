import io
import polars as pl
from typing import Dict


def parse_excel_to_tasks(file_contents: bytes) -> Dict[str, dict]:
    """
    Parses a standardized template Excel binary stream using Polars expressions.
    """
    df = pl.read_excel(io.BytesIO(file_contents)).fill_null("")

    df = df.with_columns(
        duration=round(
            (pl.col("Optimistic") + (4 * pl.col("Most_Likely")) + pl.col("Pessimistic"))
            / 6,
            2,
        )
    )

    processed_tasks = {}

    # Map into the final execution dictionary structure
    for row in df.to_dicts():
        task_id = str(row["ID"]).strip()
        if not task_id:
            continue

        # Parse predecessor string into a list
        pred_str = str(row["Predecessors"]).strip()
        preds = [p.strip() for p in pred_str.split(",")] if pred_str else []

        processed_tasks[task_id] = {
            "name": str(row["Name"]).strip(),
            "duration": row["duration"],
            "predecessors": preds,
            "es": 0.0,
            "ef": 0.0,
            "ls": 0.0,
            "lf": 0.0,
            "float": 0.0,
        }

    return processed_tasks
