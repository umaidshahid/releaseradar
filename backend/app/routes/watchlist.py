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
