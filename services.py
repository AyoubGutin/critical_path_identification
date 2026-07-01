import openpyxl
import io
import ingestion
from engine import calc_forward_pass, calc_backward_pass
from models import TaskInput


def process_manual_analysis(
    task_list: list[TaskInput],
) -> tuple[float, list[str], dict]:
    """Orchestrates the CPM pipeline for UI entries."""
    processed_tasks = ingestion.parse_manual_inputs(task_list)

    total_duration = calc_forward_pass(processed_tasks)
    critical_path_chain = calc_backward_pass(processed_tasks, total_duration)

    return total_duration, critical_path_chain, processed_tasks


def process_excel_upload(file_contents: bytes) -> tuple[float, list[str], dict]:
    """Orchestrates the CPM pipeline for Excel uploads."""
    processed_tasks = ingestion.parse_excel_to_tasks(file_contents)

    total_duration = calc_forward_pass(processed_tasks)
    critical_path_chain = calc_backward_pass(processed_tasks, total_duration)

    return total_duration, critical_path_chain, processed_tasks


def generate_blank_template() -> bytes:
    """Generates an in-memory stream of the Excel template."""
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "PERT Template"

    headers = ["ID", "Name", "Optimistic", "Most_Likely", "Pessimistic", "Predecessors"]
    ws.append(headers)
    ws.append(["A", "Sample Task", 2, 4, 6, ""])

    file_stream = io.BytesIO()
    wb.save(file_stream)
    file_stream.seek(0)
    return file_stream.read()
