from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import watchlist
from app.db import init_db
from app.scheduler import start_scheduler

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
    start_scheduler()

@app.get("/")
def root():
    return {"message": "Welcome to ReleaseRadar API"}

app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
