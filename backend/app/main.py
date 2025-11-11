from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import watchlist
from app.db import init_db

app = FastAPI(title="ReleaseRadar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Welcome to ReleaseRadar API"}

app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
