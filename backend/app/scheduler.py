from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from app.jobs.fetch_releases import fetch_github_releases

scheduler = BackgroundScheduler()

def start_scheduler():
    print(">>> starting scheduler…")
    
    scheduler.add_job(
        fetch_github_releases,            # PURE SYNC CALL
        trigger=IntervalTrigger(seconds=30),
        id="release_fetcher",
        replace_existing=True
    )
    
    scheduler.start()
    print("✅ Scheduler started (runs every 30 sec)")
