from backend import create_app
from backend.views import create_server_connection, run_query, getThreeWeeks
from apscheduler.schedulers.background import BackgroundScheduler
import flask
import threading
import time
import schedule

# def run_threaded(job_func):
#     job_thread = threading.Thread(target=job_func)
#     job_thread.start()

def job():
    print("hi")
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT * FROM COURSES;")
    courses = cursor.fetchall()
    days_of_the_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    three_weeks = getThreeWeeks()
    for i in courses:
        cursor = run_query(connection, "SELECT * FROM TEETIMESCHEDULE WHERE course_id = '" + i[0] + "' AND days like '%" + days_of_the_week[datetime.today().weekday()] + "%';")
        sched = cursor.fetchall()
        for j in sched:
            cursor = run_query(connection, "INSERT INTO TEETIMES (uniqid, teetime, cost, spots) VALUES ('" + i[0] + "', '" + three_weeks + " " + i[2] + "', '" + i[3] + "', 4);")
    context = {'message': 'completed nightly batch'}
    return flask.jsonify("**context")


app = create_app()
if __name__ == '__main__':
    app.run(debug=True)
    scheduler = BackgroundScheduler()
    scheduler.start()
    scheduler.add_job(func=job, trigger='interval', seconds=5)
    while True:
        time.sleep(10)
    scheduler.shutdown()
    # schedule.every(15).seconds.do(run_threaded, update_times)
    # while True:
    #     schedule.run_pending()
    #     time.sleep(1) 


