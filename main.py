from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ProjectPayload
from engine import transform_inputs

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
    return {"status": "success", "data": processed_tasks}
