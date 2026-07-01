from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from models import ProjectPayload
import services

app = FastAPI(title="Critical Path Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/download-excel")
def download_excel():
    template_bytes = services.generate_blank_template()
    return Response(
        content=template_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=pert_project_template.xlsx"
        },
    )


@app.post("/api/upload-excel")
def upload_excel(file: UploadFile = File(...)):
    contents = file.file.read()
    duration, path, tasks = services.process_excel_upload(contents)
    return {
        "status": "success",
        "total_duration": duration,
        "critical_path": path,
        "tasks": tasks,
    }


@app.post("/api/analyse")
def analyse_project(payload: ProjectPayload):
    duration, path, tasks = services.process_manual_analysis(payload.tasks)
    return {
        "status": "success",
        "total_duration": duration,
        "critical_path": path,
        "tasks": tasks,
    }
