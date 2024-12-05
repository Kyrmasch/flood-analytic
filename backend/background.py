from celery import Celery
from background_tasks.refresh_token import delete_expired_refresh_tokens
from celery.schedules import crontab, schedule

app = Celery(
    "flood",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

app.conf.task_routes = {"tasks.*": {"queue": "flood"}}

app.conf.beat_schedule = {
    "delete-expired-refresh-tokens": {
        "task": "delete_expired_tokens",
        "schedule": schedule(5.0),
        "options": {"queue": "flood"},
    },
}

app.conf.timezone = "UTC"


@app.task(name="delete_expired_tokens")
def delete_expired_tokens():
    count = delete_expired_refresh_tokens()
    return count
