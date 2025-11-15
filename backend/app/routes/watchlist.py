import asyncio
import json
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session, select
from sse_starlette.sse import EventSourceResponse
from firebase_admin import auth as firebase_auth

from app.db import get_session, engine
from app.models.repo import Repo
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.repo import Repo
from app.db import get_session
from app.utils.firebase_verify import verify_token

router = APIRouter()

@router.get("/")
def get_watchlist(
    user=Depends(verify_token),
    session: Session = Depends(get_session)
):
    repos = session.exec(select(Repo).where(Repo.user_uid == user["uid"])).all()
    return repos

@router.post("/")
def add_repo(
    data: dict,
    user=Depends(verify_token),
    session: Session = Depends(get_session)
):
    repo_name = data.get("repo")
    if not repo_name:
        raise HTTPException(status_code=400, detail="Repo name required")
    repo = Repo(repo_name=repo_name, user_uid=user["uid"])
    session.add(repo)
    session.commit()
    session.refresh(repo)
    return repo

@router.delete("/{repo_id}")
def delete_repo(
    repo_id: int,
    user=Depends(verify_token),
    session: Session = Depends(get_session),
):
    repo = session.get(Repo, repo_id)
    if not repo:
        raise HTTPException(404, "Not found")

    if repo.user_uid != user["uid"]:
        raise HTTPException(403, "Forbidden")

    session.delete(repo)
    session.commit()
    return {"message": "Deleted"}

@router.get("/stream")
async def stream_watchlist(request: Request, token: str):
    """
    SSE endpoint:
    - Client passes Firebase ID token as ?token=...
    - We verify it and then stream that user's watchlist every 10s
    """

    try:
        decoded = firebase_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_uid = decoded["uid"]

    async def event_generator():
        while True:
            # Stop if client disconnected
            if await request.is_disconnected():
                break

            # Query DB fresh each tick
            from app.models.repo import Repo  # avoid circular
            from sqlmodel import Session, select

            with Session(engine) as session:
                repos = session.exec(
                    select(Repo).where(Repo.user_uid == user_uid)
                ).all()

                payload = [repo.model_dump() for repo in repos]

            yield {
                "event": "watchlist",
                "data": json.dumps(payload, default=str),
            }

            await asyncio.sleep(10)  # stream every 10 seconds

    return EventSourceResponse(event_generator())



