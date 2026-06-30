from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ProjectPayload
from engine import transform_inputs, calc_forward_pass, calc_backward_pass

app = FastAPI(title="Critical Path Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/analyse")
def analyse_project(payload: ProjectPayload):
    processed_tasks = transform_inputs(payload.tasks)

    total_duration = calc_forward_pass(processed_tasks)

    critical_path = calc_backward_pass(processed_tasks, total_duration)

    return {
        "status": "success",
        "total_duration": total_duration,
        "critical_path": critical_path,
        "tasks": processed_tasks,
    }
