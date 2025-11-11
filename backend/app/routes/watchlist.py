from fastapi import APIRouter, Depends, HTTPException
from app.utils.firebase_verify import verify_token

router = APIRouter()

# Temporary in-memory store
watchlist = []

@router.get("/")
def get_watchlist(user=Depends(verify_token)):
    return {"repos": watchlist}

@router.post("/")
def add_repo(data: dict, user=Depends(verify_token)):
    repo = data.get("repo")
    if not repo:
        raise HTTPException(status_code=400, detail="Repo name required")
    watchlist.append({"repo": repo, "user": user})
    return {"message": f"Added {repo} to watchlist"}
