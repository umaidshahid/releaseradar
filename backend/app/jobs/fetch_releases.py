import httpx
from sqlmodel import Session, select
from app.models.repo import Repo
from app.db import engine

async def fetch_github_releases():
    print("🕒 Checking GitHub releases...")
    with Session(engine) as session:
        repos = session.exec(select(Repo)).all()
        for repo in repos:
            repo_name = repo.repo_name
            url = f"https://api.github.com/repos/{repo_name}/releases/latest"
            try:
                async with httpx.AsyncClient() as client:
                    res = await client.get(url, timeout=10)
                    if res.status_code == 200:
                        data = res.json()
                        tag = data.get("tag_name")
                        print(f"✅ {repo_name}: latest release {tag}")
                    else:
                        print(f"⚠️  {repo_name}: no releases or not found ({res.status_code})")
            except Exception as e:
                print(f"❌ Error fetching {repo_name}: {e}")
