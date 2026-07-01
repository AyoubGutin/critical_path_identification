from pydantic import BaseModel


# What a single task object looks like
class TaskInput(BaseModel):
    id: str
    name: str
    optimistic: float
    most_likely: float
    pessimistic: float
    predecessors: list[str] = []


# Project Payload schema
class ProjectPayload(BaseModel):
    tasks: list[TaskInput]
