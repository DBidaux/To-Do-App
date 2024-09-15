from apscheduler.schedulers.background import BackgroundScheduler
from .task_cleaner import clean_archived_tasks


def start_scheduler(app):
    scheduler = BackgroundScheduler()

    # Programamos la limpieza automática de tareas inactivas
    scheduler.add_job(func=clean_archived_tasks,
                      trigger="interval", hours=24, args=[app])

    # Iniciar el scheduler
    scheduler.start()

    # Verificar si el scheduler está corriendo
    if scheduler.running:
        print("Scheduler is running")
    else:
        print("Scheduler is NOT running")

    # Verificar trabajos programados
    jobs = scheduler.get_jobs()
    if jobs:
        print(f"Scheduled jobs: {jobs}")
    else:
        print("No scheduled jobs.")
