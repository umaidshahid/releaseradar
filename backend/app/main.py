from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import watchlist

app = FastAPI(title="ReleaseRadar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to ReleaseRadar API"}

# Register routes
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
