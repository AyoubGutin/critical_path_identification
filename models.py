from pydantic import BaseModel
from typing import List, Optional


# What a single task object looks like
class TaskInput(BaseModel):
    id: str
    name: str
    optimistic: float
    most_likely: float
    pessimistic: float
    predecessors: Optional[str] = ""


# Project Payload schema
class ProjectPayload(BaseModel):
    tasks: List[TaskInput]
