import io
import polars as pl
from models import TaskInput


def parse_manual_inputs(task_list: list[TaskInput]) -> dict[str, dict]:
    """
    Transforms the raw Pydantic task list from the UI into the
    standard mathematical dictionary format.
    """
    processed_tasks = {}

    for task in task_list:
        expected_duration = round(
            (task.optimistic + (4 * task.most_likely) + task.pessimistic) / 6, 2
        )

        # predecessors is already a list of strings from the frontend
        preds = [p.strip() for p in task.predecessors] if task.predecessors else []

        processed_tasks[task.id.strip()] = {
            "name": task.name,
            "duration": expected_duration,
            "predecessors": preds,
            "es": 0.0,
            "ef": 0.0,
            "ls": 0.0,
            "lf": 0.0,
            "float": 0.0,
        }

    return processed_tasks


def parse_excel_to_tasks(file_contents: bytes) -> dict[str, dict]:
    """
    Parses a standardized template Excel binary stream using Polars expressions.
    """
    df = pl.read_excel(io.BytesIO(file_contents)).fill_null("")

    df = df.with_columns(
        duration=(
            (pl.col("Optimistic") + (4 * pl.col("Most_Likely")) + pl.col("Pessimistic"))
            / 6
        ).round(2)
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
