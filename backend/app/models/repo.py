from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Repo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_uid: str
    repo_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
