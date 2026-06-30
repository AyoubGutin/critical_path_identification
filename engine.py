from models import TaskInput
from typing import List


def transform_inputs(task_list: List[TaskInput]):
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
