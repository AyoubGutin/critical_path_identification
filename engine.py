from models import TaskInput
from typing import List


def transform_inputs(task_list: List[TaskInput]) -> dict:
    """
    Takes a list of tasks, that adhere to the TaskInput schema.

    It calculates the expected duration using PERT, for the task and its predecessors
    """

    processed_tasks = {}

    for task in task_list:
        expected_duration = (
            task.optimistic + (4 * task.most_likely) + task.pessimistic
        ) / 6

        expected_duration = round(expected_duration, 2)

        pred_string = task.predecessors.strip() if task.predecessors else ""
        preds = [p.strip() for p in pred_string.split(",")] if pred_string else []

        processed_tasks[task.id.strip()] = {
            "name": task.name,
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

    def process_task(task_id: str):
        if task_id in visited or task_id not in tasks:
            return

        task = tasks[task_id]

        for pred in task["predecessors"]:
            if pred in tasks and pred not in visited:
                process_task(pred)

        if not task["predecessors"]:
            task["es"] = float(0)
        else:
            valid_preds = [p for p in task["predecessors"] if p in tasks]
            task["es"] = (
                max(tasks[p]["ef"] for p in valid_preds) if valid_preds else float(0)
            )

        task["ef"] = round(task["es"] + task["duration"], 2)
        visited.add(task_id)

    for task_id in list(tasks.keys()):
        process_task(task_id)

    project_duration = max([task["ef"] for task in tasks.values()]) if tasks else 0.0
    return round(project_duration, 2)


def calc_backward_pass(tasks: dict, project_duration: float):
    """
    Calcs the backward pass (LS+LF) for all tasks in the network

    Isolates the Total Float and identifies the critical path chain
    """

    # To move backward, look at what tasks follow a given task
    successors = {task_id: [] for task_id in tasks}

    for task_id, task in tasks.items():
        for pred in task["predecessors"]:
            if pred in successors:
                successors[pred].append(task_id)

    visited = set()

    def process_task_backward(task_id: str):
        if task_id in visited or task_id not in tasks:
            return

        task = tasks[task_id]

        for successor in successors[task_id]:
            if successor not in visited:
                process_task_backward(successor)

        if not successors[task_id]:
            # if an activity has no successors, it is the last nodes
            task["lf"] = project_duration
        else:
            # for upstream tasks, LF is the minimum LS of all immediate successors
            task["lf"] = min([tasks[s]["ls"] for s in successors[task_id]])

        # LS is the latest finish deadline minus the PERT duration
        task["ls"] = round(task["lf"] - task["duration"], 2)

        # Total float is the difference between late boundaries and early boundaries
        task["float"] = round(task["ls"] - task["es"], 2)

        if abs(task["float"]) < 0.01:
            task["float"] = 0.0

        visited.add(task_id)

    for task_id in list(tasks.keys()):
        process_task_backward(task_id)

    critical_path = [
        task_id for task_id, task in tasks.items() if task["float"] == float(0)
    ]

    critical_path.sort(key=lambda x: tasks[x]["es"])

    return critical_path
