from backend import create_app
from backend.views import update_times
import threading
import time
import schedule

def run_threaded(job_func):
    job_thread = threading.Thread(target=job_func)
    job_thread.start()

app = create_app()
if __name__ == '__main__':
    app.run(debug=True)
    schedule.every(15).seconds.do(run_threaded, update_times)
    while True:
        schedule.run_pending()
        time.sleep(1) 


