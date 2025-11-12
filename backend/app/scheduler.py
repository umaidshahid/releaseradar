from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.jobs.fetch_releases import fetch_github_releases
import asyncio

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        lambda: asyncio.run(fetch_github_releases()),
        trigger=IntervalTrigger(minutes=5),
        id="release_fetcher",
        replace_existing=True
    )
    scheduler.start()
    print("✅ Scheduler started (runs every 5 min)")
