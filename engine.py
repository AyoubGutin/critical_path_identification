from models import TaskInput
from typing import List


def transform_inputs(task_list: List[TaskInput]) -> dict:
    """
    Takes a list of tasks, that adhere to the TaskInput schema.

    It calculates the expected duration using PERT, for the task and its predecessors
    """

    processed_tasks = {}

    for t in task_list:
        expected_duration = t.optimistic + (4 * t.most_likely) + t.pessimistic

        expected_duration = round(expected_duration, 2)

        pred_string = t.predecessors.strip() if t.predecessors else ""
        preds = [p.strip() for p in pred_string.split(",")] if pred_string else []

        processed_tasks[t.id.strip()] = {
            "name": t.name,
            "duration": expected_duration,
            "predecessors": preds,
            "es": 0,
            "ef": 0,
            "ls": 0,
            "lf": 0,
            "float": 0,
        }

    return processed_tasks


def calc_forward_pass(tasks: dict) -> float:
    """
    Calcs the forward pass (ES+EF) for all tasks in the network

    Returns the absolute project duration
    """
    visited = set()

    def process_task(t_id: str):
        if t_id in visited or t_id not in tasks:
            return

        task = tasks[t_id]

        for pred in task["predecessors"]:
            if pred in tasks and pred not in visited:
                process_task(pred)

        if not task["predecessors"]:
            task["es"] = float(0)
        else:
            valid_preds = [p for p in task["predecessors"] if p in tasks]
            tasks["es"] = (
                max(tasks[p]["ef"] for p in valid_preds) if valid_preds else float(0)
            )

        task["ef"] = round(task["es"] + task["duration"], 2)
        visited.add(t_id)

    for t_id in list(tasks.keys()):
        process_task(t_id)

    project_duration = max([t["ef"] for t in tasks.values()]) if tasks else 0.0
    return round(project_duration, 2)
