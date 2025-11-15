import asyncio
import httpx
from datetime import datetime
from sqlmodel import Session, select
from app.models.repo import Repo
from app.db import engine

async def fetch_github_releases_async():
    print("🕒 Checking GitHub releases...")

    with Session(engine) as session:
        repos = session.exec(select(Repo)).all()

        async with httpx.AsyncClient() as client:
            for repo in repos:
                repo_name = repo.repo_name
                url = f"https://api.github.com/repos/{repo_name}/releases/latest"
                try:
                    res = await client.get(url, timeout=10)
                    if res.status_code == 200:
                        data = res.json()
                        tag = data.get("tag_name")

                        print(f"✅ {repo_name}: latest release {tag}")

                        repo.latest_tag = tag
                        repo.last_checked = datetime.utcnow()
                        session.add(repo)
                        session.commit()

                    else:
                        print(f"⚠️ {repo_name}: no releases or not found ({res.status_code})")

                except Exception as e:
                    print(f"❌ Error fetching {repo_name}: {e}")


def fetch_github_releases():
    asyncio.run(fetch_github_releases_async())
