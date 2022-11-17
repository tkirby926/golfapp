from email.policy import default
from os import curdir
from re import I
from flask import Blueprint, render_template
import flask
import sqlite3
import mysql.connector
from mysql.connector import Error
import pandas as pd
import pgeocode
from haversine import haversine, Unit
import random
import json
import stripe
from datetime import datetime
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.interval import IntervalTrigger


scheduler = BlockingScheduler()

def create_server_connection(host_name, user_name, user_password, db):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database = db
        )
        print("MySQL Database connection successful")
    except Error as err:
        print(f"Error: '{err}'")

    return connection

def run_query(connection, query):
    cursor = connection.cursor(buffered = True)
    try:
        cursor.execute(query)
        connection.commit()
        print("Database created successfully")
    except Error as err:
        print(f"Error: '{err}'")
    return cursor

def location_search_helper(loc):
    nomi = pgeocode.Nominatim('us')
    query = nomi.query_postal_code(loc)

    data = {
        "lat": str(query["latitude"]),
        "lon": str(query["longitude"])
    }
    return data['lat'], data['lon']

views = Blueprint('views', __name__)

# @views.route('/')
# def home():
#     # connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
#     # run_query(connection, """CREATE TABLE Friendships (UserId1 VARCHAR(20), UserId2 VARCHAR(20));""")
#     if flask.session.get('username'):
#         context = {'profile_link': '/user/' + flask.session['username'], 'username': flask.session['username']}
#     else:
#         context = {'profile_link': None, 'username': None}
    
#     return render_template('initial_page.html', **context)

# @views.route('/swiper/')
# def show_profiles():
#     context = {"good_times": [], "is_selected": 10, "zip": ''}
#     return render_template('tindersearch.html')

# @views.route('/times/')
# def show_times():
#     context = {"good_courses": [], "is_selected": 10, "zip": ''}
#     return render_template('teetimesearch.html')

# @views.route('/login/')
# def login():
#     context = {"showfail": "no"}
#     return render_template('login_page.html', **context)

# @views.route('/test_login/')
# def test_login():
#     connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
#     cursor = run_query(connection, "SELECT * FROM USERS WHERE username='" 
#               + flask.request.args.get('username') + "' AND password='" + flask.request.args.get('password') + "'")
#     attempt = cursor.fetchone()
#     if attempt is None:
#         context = {"showfail": "yes"}
#         return render_template('login_page.html', **context)
#     else:
#         flask.session['username'] = flask.request.args.get('username')
#         return flask.redirect(flask.url_for('views.home'))

# @views.route('/create_account/')
# def create_account():
#     return render_template('create_account.html')

# @views.route('/render_account/', methods = ["POST"])
# def render_account():
#     connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
#     # # print(flask.request.form.get('username'))
#     # # print(flask.request.args.get('password'))
#     # # print(flask.request.args.get('fullname'))
#     # x = "INSERT INTO USERS (username, firstname, lastname, password, email, filename, drinking, score, playstyle, descript, college) VALUES (" + flask.request.form.get('username') + ", " + flask.request.form.get('firstname') + ", " 
#     # + flask.request.form.get('lastname') + ", " + flask.request.form.get('password') + ", " + flask.request.form.get('email') + ", " + flask.request.form.get('filename') + ", " + flask.request.form.get('drinking') + ", " + flask.request.form.get('score') + ", " 
#     # + flask.request.form.get('playstyle') + ", " + flask.request.form.get('descript') + ", " + flask.request.form.get('college') + ")"
#     # print(x)
#     # cursor = run_query(connection, """INSERT INTO USERS (username, fullname, password,
#     #                                 email, filename, drinking, score, playstyle, descript, college) VALUES ('""" +
#     #                                 flask.request.form.get('username') + "', '" + flask.request.form.get('firstname') + "', '" + flask.request.form.get('lastname') + "', '" +
#     #                                 flask.request.form.get('password') + "', '" + flask.request.form.get('email') + "', '" +
#     #                                 flask.request.form.get('filename') + "', '" + flask.request.form.get('drinking') + "', '" +
#     #                                 flask.request.form.get('score') + "', '" + flask.request.form.get('playstyle') + "', '" +
#     #                                 flask.request.form.get('descript') + "', '" + flask.request.form.get('college') + "')")
#     # return render_template("initial_page.html")

# @views.route('/logout/')
# def logout():
#     flask.session.pop('username', None)
#     return flask.redirect(flask.url_for('views.home'))

# @views.route('/render_loc/')
# def render_loc():
#     # print(data)
#     # connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
#     # cursor = run_query(connection, "SELECT * FROM COURSES")
#     # if (data['lat'] > 0 and data['lon'] > 0):
#     #     cursor = run_query(connection, "SELECT * FROM COURSES WHERE SQRT(POWER(DIFFERENCE(latitude, " + str(data['lat']) + "), 2)" + 
#     #                                    " + POWER(DIFFERENCE(longitude," + str(data['lon']) + "), 2)) < 2;")
#     # elif (data['lat'] < 0 and data['lon'] > 0):
#     #     data['lat'] = abs(data['lat'])
#     #     cursor = run_query(connection, "SELECT * FROM COURSES WHERE SQRT(POWER(SUM(latitude, " + str(data['lat']) + "), 2)" + 
#     #                                    " + POWER(DIFFERENCE(longitude, " + str(data['lon']) + "), 2)) < 2;")
#     # elif (data['lat'] > 0 and data['lon'] < 0):
#     #     data['lon'] = abs(data['lon'])
#     #     x = "SELECT * FROM COURSES WHERE SQRT(SUM(POWER(DIFFERENCE(latitude, " + str(data['lat']) + "), 2)" + ", POWER(SUM(longitude, " + str(data['lon']) + "), 2))) < 2;"
#     #     print(x)
#     #     cursor = run_query(connection, "SELECT * FROM COURSES WHERE SQRT(SUM(POWER(DIFFERENCE(latitude, " + str(data['lat']) + "), 2)" + 
#     #                                    ", POWER(SUM(longitude, " + str(data['lon']) + "), 2))) < 2;")
#     # else:
#     #     cursor = run_query(connection, "SELECT * FROM COURSES WHERE SQRT(POWER(SUM(latitude, " + str(data['lat']) + "), 2)" + 
#     #                                    " + POWER(SUM(longitude, " + str(data['lon']) + "), 2)) < 2;")
#     course_list, lat, lon = location_search_helper(flask.request.args.get('loc'), flask.request.args.get('length'))
#     good_courses = []
#     for i in course_list:
#         coord1 = (float(i[2]), float(i[3]))
#         coord2 = (lat, lon)
#         print(haversine(coord1, coord2))
#         if (haversine(coord1, coord2)/1.609344 < float(flask.request.args.get('length'))):
#             good_courses.append([i[0], i[1], i[4]])
#     context = {"good_courses": good_courses, "is_selected": flask.request.args.get('length'), "zip": flask.request.args.get('loc')}
#     return render_template('teetimesearch.html', **context)

@views.route("""/api/v1/<int:zip_url_slug>&<int:length_url_slug>&<string:firstdate_url_slug>&<string:firsttime_url_slug>
                &<string:seconddate_url_slug>&<string:secondtime_url_slug>""")
def swiper_api(zip_url_slug, length_url_slug, firstdate_url_slug, firsttime_url_slug, 
               seconddate_url_slug, secondtime_url_slug):
    course_list, lat, lon = location_search_helper(zip_url_slug, length_url_slug)
    good_courses = []
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    for i in course_list:
        coord1 = (float(i[2]), float(i[3]))
        coord2 = (lat, lon)
        print(haversine(coord1, coord2))
        if (haversine(coord1, coord2)/1.609344 < float(length_url_slug)):
            good_courses.append([i[0], i[1], i[4]])
            cursor = run_query(connection, """SELECT T.timeid, T.teetime, T.cost FROM TEETIMES T, BOOKEDTIMES B, COURSES C, USERS U WHERE
                                              B.timeid = T.timeid AND T.uniqid = """ + i[0] + " AND T.")
    context = {'good': firsttime_url_slug, 'bad': 'no'}
    return flask.jsonify(**context)


@views.route('/api/v1/locations/<string:zip>/<int:length>')
def get_times(zip, length):
    print(zip)
    course_list, lat, lon = location_search_helper(zip, length)
    good_courses = []
    for i in course_list:
        coord1 = (float(i[2]), float(i[3]))
        coord2 = (lat, lon)
        print(haversine(coord1, coord2))
        if (haversine(coord1, coord2)/1.609344 < float(length)):
            good_courses.append([i[0], i[1], i[4]])
    context = {"good_courses": good_courses}
    return flask.jsonify(**context)

@views.route('/api/v1/search/<string:search>')
def get_search_results(search):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT username, firstname, lastname FROM USERS WHERE username LIKE '" + search + "%' OR firstname LIKE '" + search + "%' OR lastname LIKE '" + search + "%';")
    results = cursor.fetchall()
    if len(results) < 5:
        cursor = run_query(connection, "SELECT CONCAT('/course/', uniqid) AS url, coursename FROM COURSES WHERE coursename LIKE '" + search + "%';")
        results1 = cursor.fetchall()
        results = results + results1
    print(results)
    context = {"results": results} 
    return flask.jsonify(**context)

@views.route('/api/v1/search/users_friends/<string:user>/<string:search>')
def get_search_users(user, search):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT username, firstname, lastname FROM USERS U, Friendships F WHERE ((F.userid1 = U.username AND F.userid2 = '" + user + "') OR (F.userid1 = '" + user + "' AND F.userid2 = U.username)) AND (U.username LIKE '" + search + "%' OR U.firstname LIKE '"
    + search + "%' OR U.lastname LIKE '" + search + "%');")
    friends = cursor.fetchall()
    print(friends)
    index = len(friends)
    cursor = run_query(connection, "SELECT username, firstname, lastname FROM USERS WHERE (username LIKE '" + search + "%' OR firstname LIKE '"
    + search + "%' OR lastname LIKE '" + search + "%') AND username != '" + user + "' AND username NOT IN (SELECT U.username FROM USERS U, Friendships F WHERE ((F.userid1 = U.username AND F.userid2 = '" + user + "') OR (F.userid1 = '" + user + "' AND F.userid2 = U.username)) AND (U.username LIKE '" + search + "%' OR U.firstname LIKE '"
    + search + "%' OR U.lastname LIKE '" + search + "%'));")
    users = cursor.fetchall()
    print(users)
    results = friends + users
    last = False
    if len(results) < 20:
        last = True
    context = {"results": results, "last": last, "index": index} 
    return flask.jsonify(**context)

@views.route('/api/v1/send_message', methods = ["POST"])
def send_message():
    req = flask.request.json
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "INSERT INTO Messages (content, userid1, userid2, timestamp) VALUES ('" + req['message'] + "', '" + req['user1'] + "', '" + req['user2'] + "', CURRENT_TIMESTAMP);")
    cursor = run_query(connection, "UPDATE USERS SET notifications = notifications + 1 WHERE username = '" + req['user2'] + "';")
    message = ""
    context = {'error': message}
    return flask.jsonify(**context)

@views.route('/api/v1/search/friends/<string:user>')
def get_search_friends(user):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT username, firstname, lastname FROM USERS U, Friendships F WHERE ((F.userid2 = '" + user + "' AND U.Username = F.userid1) OR (F.userid1 = '" + user + "' AND U.Username = F.userid2)) LIMIT 12;")
    results = cursor.fetchall()
    last = False
    if len(results) < 20:
        last = True
    context = {"results": results} 
    return flask.jsonify(**context)

@views.route('/api/v1/notifications/<string:user>')
def get_notifications(user):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT notifications FROM USERS WHERE username = '" + user + "';")
    notifications = cursor.fetchone()
    context = {'notifications': notifications}
    return flask.jsonify(**context)

@views.route('/api/v1/booked_times/<string:user>')
def get_booked_times(user):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT T.timeid, C.Coursename, T.teetime FROM Courses C, Teetimes T, Bookedtimes B WHERE B.timeid = T.timeid AND C.uniqid = T.uniqid AND B.username = '" + user + "' ORDER BY teetime;")
    times_booked = cursor.fetchall()
    context = {'times_booked': times_booked}
    return flask.jsonify(**context)

@views.route('/api/v1/add_review', methods=["POST"])
def post_review():
    req = flask.request.json
    print(req)
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "INSERT INTO Reviews (username, content, rating, timestamp) VALUES ('" + req['user'] + "', '" + req["description"] + "', '" + req["rating"] + "', CURRENT_TIMESTAMP);")
    context = {'error': 'none'}
    return flask.jsonify(**context)

@views.route('/api/v1/post_post', methods=["POST"])
def post_post():
    req = flask.request.json
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "INSERT INTO POSTS (content, username, timestamp, link) VALUES ('" + req['content'] + "', '" + req['user'] + "', CURRENT_TIMESTAMP, '" + req['link'] + "');")
    context = {'error': 'none'}
    return flask.jsonify(**context)

@views.route('/api/v1/friend_requests/<string:user>')
def get_friend_requests(user):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "UPDATE USERS SET notifications = 0 WHERE username = '" + user + "';")
    cursor = run_query(connection, "SELECT R.username1, U.firstname, lastname FROM REQUESTEDFRIENDS R, USERS U WHERE R.username2 = '" + user + "' AND R.username1 = U.username;")
    results = cursor.fetchall()
    context = {"results": results} 
    return flask.jsonify(**context)

@views.route('/api/v1/search/courses/<string:search>/<string:page>')
def get_search_courses(search, page):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT CONCAT('/course/', uniqid) AS url, coursename, fileid FROM COURSES WHERE coursename LIKE '"
    + search + "%' LIMIT 22 OFFSET " + page*10 + ";")
    results = cursor.fetchall()
    last = False
    if len(results) < 20:
        last = True
    context = {"results": results, "last": last} 
    return flask.jsonify(**context)

@views.route('/api/v1/users/<string:user1>/<string:user2>')
def get_user_profile(user1, user2):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT username, firstname, lastname, drinking, score, playstyle, descript, college FROM USERS WHERE username='" + user2 + "';")
    user = cursor.fetchone()
    cursor = run_query(connection, "SELECT content, timestamp from POSTS where username = '" + user2 + "' ORDER BY timestamp DESC LIMIT 3;")
    posts = cursor.fetchall()
    cursor = run_query(connection, "SELECT T.timeid, T.cost, T.teetime, T.spots, C.Coursename FROM Teetimes T, Courses C WHERE C.uniqid = T.uniqid AND T.timeid" + 
                                   " IN (SELECT timeid FROM BOOKEDTIMES WHERE username = '" + user2 + "');")
    tee_times = cursor.fetchall()
    more = True
    if (len(posts) != 3):
        more = False
    cursor = run_query(connection, "SELECT COUNT(*) FROM FRIENDSHIPS WHERE (userid1 = '" + user1 + "' AND userid2 = '" + user2 + "') OR (userid2 = '"
                                    + user1 + "' AND userid1 = '" + user2 + "')")
    status = "f"
    count = cursor.fetchone()[0]
    print(count)
    if (count == 0):
        status = "p"
        cursor = run_query(connection, "SELECT COUNT(*) FROM REQUESTEDFRIENDS WHERE (Username1 = '" + user1 + "' AND username2 = '" + user2 + "') OR (username2 = '"
                                    + user1 + "' AND username1 = '" + user2 + "')")
        if (cursor.fetchone()[0] == 0):
            status = "n"
        
    context = {"user": user, "status": status, "posts": posts, "has_more_posts": more, 'tee_times': tee_times}
    return flask.jsonify(**context)

@views.route('/api/v1/teetimes/<string:zip>/<string:date>')
def get_swipe_times(zip, date):
    lat, lon = location_search_helper(zip)
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT *, SQRT(POWER(('" + lat + "' - latitude), 2) + POWER(('" + lon + "' - longitude), 2)) AS X FROM COURSES ORDER BY X LIMIT 5;")
    good_courses = cursor.fetchall()
    good_times = []
    cursor = run_query(connection, "DELETE FROM TEETIMES WHERE teetime > CURRENT_TIMESTAMP")
    for i in good_courses:
        cursor = run_query(connection, "SELECT t.timeid, t.cost, c.coursename FROM TEETIMES t, COURSES c WHERE c.coursename='" 
                                        + i[4] + "' AND c.uniqid = t.uniqid AND CAST(teetime AS DATE) = '" + date + "' AND t.timeid IN (SELECT DISTINCT timeid FROM BOOKEDTIMES);")
        good_times = cursor.fetchall()
        print(good_times)
        random.shuffle(good_times)
    print(good_courses)
    context = {'good_courses': good_courses, 'good_times': good_times}
    return flask.jsonify(**context)

@views.route('/api/v1/posts/<string:user>')
def get_all_posts(user):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT * FROM Posts WHERE username = '" + user + "' OR username IN (SELECT U.username FROM USERS U, Friendships F WHERE ((F.userid2 = '"
                                    + user + "' AND U.Username = F.userid1) OR (F.userid1 = '" + user + "' AND U.Username = F.userid2))) ORDER BY timestamp DESC LIMIT 6;")
    posts = cursor.fetchall()
    more = False
    if (len(posts) == 6):
        more = True
    context = {'posts': posts, 'has_more_posts': more}
    return flask.jsonify(**context)

@views.route('/api/v1/email/<string:email>')
def check_email(email):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT COUNT(*) FROM USERS WHERE email = '" + email + "';")
    is_account = cursor.fetchone()[0]
    context = {'is_account': is_account}
    return flask.jsonify(**context)

@views.route('/api/v1/friend_times/<string:userid>')
def get_friends_times(userid):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT T.timeid, T.cost, T.teetime, T.spots, C.Coursename FROM Teetimes T, Courses C WHERE C.uniqid = T.uniqid AND T.timeid" + 
                                   " IN (SELECT timeid FROM BOOKEDTIMES WHERE username IN (SELECT U.username FROM USERS U, Friendships F WHERE ((F.userid2 = '"
                                    + userid + "' AND U.Username = F.userid1) OR (F.userid1 = '" + userid + "' AND U.Username = F.userid2)))) LIMIT 2;")
    good_user_times = list(cursor.fetchall())
    friends_in_time = []
    for i in good_user_times:
        print(i)
        cursor = run_query(connection, "SELECT U.firstname, U.lastname FROM USERS U, BOOKEDTIMES B WHERE B.timeid = '" + i[0] + "' AND B.username = U.username AND B.username in (SELECT U.username FROM USERS U, Friendships F WHERE ((F.userid2 = '"
                                        + userid + "' AND U.Username = F.userid1) OR (F.userid1 = '" + userid + "' AND U.Username = F.userid2)));")
        user_friends = list(cursor.fetchall())
        friends_in_time.append(user_friends)
    print(user_friends)
    context = {'good_user_times': good_user_times, 'user_friends': friends_in_time}
    return flask.jsonify(**context)



@views.route('/api/v1/swipetimes/users/<string:timeid>')
def get_time_users(timeid):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, """SELECT U.username, U.firstname, U.lastname, U.drinking, U.score, U.playstyle, U.descript, 
                                    U.college FROM USERS U, BOOKEDTIMES B WHERE B.timeid = '""" + timeid + "' AND U.username = B.username;")
    good_users = cursor.fetchall()
    context = {'good_users': good_users}
    return flask.jsonify(**context)

@views.route('/api/v1/courses/<string:courseid>/<string:date>')
def get_courses_times(courseid, date):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "DELETE FROM TEETIMES WHERE teetime > CURRENT_TIMESTAMP")
    cursor = run_query(connection, "SELECT * FROM COURSES WHERE uniqid = '" + courseid + "';")
    course_info = cursor.fetchone()
    cursor = run_query(connection, "SELECT teetime, cost, timeid, spots FROM TEETIMES WHERE spots > 0 AND uniqid = '"
                       + courseid + "' AND CAST(teetime AS DATE) = '" + date + "';")
    course_times = cursor.fetchall()
    context = {'course_info': course_info, 'course_times': course_times}
    return flask.jsonify(**context)

@views.route('/api/v1/login/<string:username>/<string:password>')
def validate_user(username, password):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT COUNT(*) FROM USERS WHERE username = '" + username + "' AND password = '" + password + "';")
    is_user = False
    is_admin = False
    if cursor.fetchone()[0] == 1:
        is_user = True
        cursor = run_query(connection, "SELECT COUNT(*) FROM ADMINS WHERE username = '" + username + "';")
        if cursor.fetchone()[0] == 1:
            is_admin = True
    context = {'is_user': is_user, 'is_admin': is_admin}
    return flask.jsonify(**context)

@views.route('/api/v1/create', methods =["POST"])
def create_user():
    req = flask.request.json
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT COUNT(*) FROM USERS WHERE username = '" + req['username'] + "';")
    if cursor.fetchone()[0] == 1:
        context = {'error': 'Username taken, please try another'}
        return flask.jsonify(**context)
    cursor = run_query(connection, """INSERT INTO USERS (username, password, firstname, lastname, 
    email, drinking, score, playstyle, descript, college) VALUES ('""" + req['username'] + "', '"
    + req['password'] + "', '" + req['firstname'] + "', '" + req['lastname'] + "', '" + req['email'] + "', '"
    + req['drinking'] + "', '" + req['score'] + "', '" + req['playstyle'] + "', '" + req['descript'] + "', '"
    + req['college'] + "');")
    context = {'error': ''}
    return flask.jsonify(**context)
    
@views.route('/api/v1/register_course', methods =["POST"])
def register_course():
    req = flask.request.json
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT COUNT(*) FROM COURSES WHERE coursename = '" + req['name'] + "' AND town = '" + req['town'] + "' AND state = '" + req['state'] + "';")
    count = cursor.fetchone()[0]
    if count == 1:
        context = {'error': 'Course has already been registered'}
        return flask.jsonify(**context)
    cursor = run_query(connection, "SELECT COUNT(*) FROM PENDINGCOURSES WHERE coursename = '" + req['name'] + "' AND town = '" + req['town'] + "' AND state = '" + req['state'] + "';")
    count = cursor.fetchone()[0]
    if count == 1:
        context = {'error': 'Course has already been submitted as is waiting approval. We will contact you shortly and thank you for your patience'}
        return flask.jsonify(**context)
    course_list, lat, lon = location_search_helper(req['zip'], 25)
    cursor = run_query(connection, """INSERT INTO PENDINGCOURSES (coursename, latitude, longitude, street, town, state, 
    zip, adminemail, adminpassword, adminphone) VALUES ('""" + req['name'] + "', '"
    + str(lat) + "', '" + str(lon) + "', '" + req['address'] + "', '" + req['town'] + "', '" + req['state'] + "', '"
    + req['zip'] + "', '" + req['email'] + "', '" + req['password'] + "', '"
    + req['phone'] + "');")
    context = {'error': ''}
    return flask.jsonify(**context)

def calculate_order_amount(timeid):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT cost FROM TEETIMES WHERE timeid = '" + timeid + "';")
    cost = float(cursor.fetchone()[0])
    return cost

stripe.api_key = 'sk_test_51LIIQAG2PmM18WKObcR2HE4AzVIwEZ1vwp75XdDi6IawslHyWzVtJXLmKILzRLYFEr8xY3yXXJRGJSWcIdduPJ5n001apPDssN'

@views.route('/create-payment-intent', methods=['POST'])
def create_payment():
    data = json.loads(flask.request.data)
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT C.coursename, C.street, C.state, C.zip, T.teetime FROM COURSES C, TEETIMES T WHERE T.timeid = '" + data['timeid'] 
                       + "' AND T.uniqid = C.uniqid;")
    # Create a PaymentIntent with the order amount and currency
    course_info = cursor.fetchone()
    cost = calculate_order_amount(data['timeid'])
    print(round((cost + (cost*.0816)), 2))
    intent = stripe.PaymentIntent.create(
        amount= int(round((cost + (cost*.0816)), 2) * 100),
        currency='usd',
        payment_method_types=["card"],
    )
    return flask.jsonify({
        'clientSecret': intent['client_secret'],
        'cost': cost,
        'course_info': course_info
    })

@views.route('/api/v1/users/<string:username>')
def get_single_user(username):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT username, password, firstname, lastname, email, drinking, score, college, playstyle, descript FROM USERS WHERE username='" + username + "';")
    return flask.jsonify({'user': cursor.fetchone()})

@views.route('/api/v1/edit', methods=["PUT"])
def edit_user(user):
    req = flask.request.json
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "UPDATE USERS SET username = " + req['username'] + ", password = " + req['password'] + ", firstname = "
    + req['firstname'] + ", lastname = " + req['lastname'] + ", email = " + req['email'] + ", drinking = " + req['drinking'] + ", score = "
    + req['score'] + ", playstyle = " + req['playstyle'] + ", descript = " + req['descript'] + ", college = " + req['college'] + " WHERE username = " + req['oldusername'] + ";") 
    user = cursor.fetchone()
    context = {'user': user}
    return flask.jsonify(**context)

@views.route('/api/v1/course_schedule/<string:courseid>/<string:day>')
def course_profile_data(courseid, day):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT * FROM COURSES WHERE uniqid = '" + courseid + "';")
    course_info = cursor.fetchone()
    cursor = run_query(connection, "SELECT days, time, cost FROM TEETIMESCHEDULE WHERE course_id = '" + courseid + "' AND days = " + day + " ORDER BY time;")
    tee_time_sched = list(cursor.fetchall())
    context = {"course_info": course_info, "tee_sched": tee_time_sched}
    return json.dumps(context, default=str)

@views.route('/api/v1/course_schedule/add/<string:courseid>', methods=["POST"])
def course_add_sched(courseid):
    req = flask.request.json
    print(req)
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    for i in req['days']:
        cursor = run_query(connection, "INSERT INTO TEETIMESCHEDULE (course_id, days, time, cost) VALUES ('" + courseid + "', '" + i
                        + "', '" + req["time"] + "', '" +  req['cost'] + "');")
    message = cursor.fetchone()
    context = {"message": message}
    return flask.jsonify(**context)

@views.route('/api/v1/course_schedule/check_day/<string:courseid>/<string:time>')
def course_check_days(courseid, time):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT days FROM TEETIMESCHEDULE WHERE course_id = " + courseid + "AND time = " + time +  ";")
    checked_days = cursor.fetchall()
    is_checked = [False, False, False, False, False, False, False]
    for i in checked_days:
        is_checked[i] = True
    context = {"checked_days": is_checked}
    return flask.jsonify(**context)

@views.route('/api/v1/course_schedule/pop_times/<string:courseid>')
def course_pop_times(courseid):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, """SELECT * FROM TEETIMES WHERE (teetime = CURDATE() OR teetime = DATE_ADD(CURDATE(),INTERVAL 1 DAY)
                                      OR teetime = DATE_ADD(CURDATE(),INTERVAL 2 DAY)) AND uniqid = '""" + courseid + "' AND timeid in (SELECT timeid FROM BookedTimes);")
    pop_times = cursor.fetchall()
    context = {'pop_times': pop_times}
    return flask.jsonify(**context)

@views.route('/api/v1/course_login/<string:email>/<string:password>')
def validate_course_admin(email, password):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT uniqid FROM COURSES WHERE adminemail = '" + email + "' AND adminpassword = '" + password + "';")
    is_user = False
    course_id = ""
    if cursor.rowcount == 1:
        is_user = True
        course_id = cursor.fetchone()
    context = {'is_user': is_user,
                'course_id': course_id}
    return flask.jsonify(**context)

@views.route('/api/v1/users/add_friend', methods=["POST"])
def create_friend_req():
    req = flask.request.json
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "INSERT INTO REQUESTEDFRIENDS (username1, username2) VALUES ('" + req['poster'] + "', '" + req['receiver']
                        + "');")
    cursor = run_query(connection, "UPDATE USERS SET notifications = notifications + 1 WHERE username = '" + req['receiver'] + "';")
    message = "completed"
    context = {'message': message}
    return flask.jsonify(**context)

@views.route('/api/v1/accept_request/<string:accepting_user>/<string:accepted_user>', methods=["POST"])
def accept_friend_req(accepting_user, accepted_user):
    users = sorted(accepting_user, accepted_user)
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "INSERT INTO FRIENDSHIPS (userid1, userid2) VALUES ('" + users[0] + "', '" + users[1]
                        + "');")
    cursor = run_query(connection, "DELETE FROM REQUESTEDFRIENDS WHERE username1 = '" + accepted_user + "' AND username2 = '" + accepting_user + "';")
    message = "completed"
    context = {'message': message}
    return flask.jsonify(**context)

@views.route('/api/v1/deny_request/<string:accepting_user>/<string:accepted_user>', methods=["DELETE"])
def deny_friend_req(accepting_user, accepted_user):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "DELETE FROM REQUESTEDFRIENDS WHERE username1 = '" + accepted_user + "' AND username2 = '" + accepting_user + "';")
    message = "completed"
    context = {'message': message}
    return flask.jsonify(**context)

def getThreeWeeks():
    today = datetime.date.today()
    split = today.split('-')
    year = split[0]
    month = split[1]
    day = split[2]
    if month == '4' or month == '6' or month == '9' or month == '11':
        if day + 21 > 30:
            month = month + 1
        day = day % 30
    if month == '2':
        if day + 21 > 28:
            month = month + 1
        day = day % 28
    if month == '12':
        if day + 21 > 31:
            month = month + 1
            year = year + 1
        day = day % 31
    else:
        if day + 21 > 31:
            month = month + 1
        day = day % 31
    return year + '-' + month + '-' + day

@views.route('/api/v1/messages/<string:user1>/<string:user2>/<string:page>/<string:offset>')
def get_messages(user1, user2, page, offset):
    print(offset)
    x = 20*int(page) + int(offset)
    off = str(x)
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT * FROM Messages WHERE (userid1 = '" + user1 + "' AND userid2 = '" 
                       + user2 + "') OR (userid2 = '" + user1 + "' AND userid1 = '" + user2 
                       + "') ORDER BY timestamp DESC LIMIT 21 OFFSET " + off + ";")
    messages = cursor.fetchall()
    print(len(messages))
    last = False
    print(len(messages) < 21)
    if len(messages) < 21:
        last = True
    messages = messages[0:20]
    context = {'messages': messages, 'last': last}
    return flask.jsonify(**context)

@views.route('/api/v1/posts/<string:user>')
def get_posts(user):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT * FROM Posts WHERE username = '" + user + "' ORDER BY timestamp DESC LIMIT 3;")
    posts = cursor.fetchall()
    more = True
    if (len(posts) != 3):
        more = False
    context = {'has_more': more, 'posts': posts}
    return flask.jsonify(**context)

@views.route('/api/v1/message_count/<string:user1>/<string:user2>')
def get_message_count(user1, user2):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT COUNT(*) FROM Messages WHERE (userid1 = '" + user1 + "' AND userid2 = '" 
                       + user2 + "') OR (userid2 = '" + user1 + "' AND userid1 = '" + user2 
                       + "');")
    count = cursor.fetchone()[0]
    context = {'count': count}
    return flask.jsonify(**context)

@views.route('/api/v1/admins/')
def get_admins():
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT username FROM ADMINS")
    admins = cursor.fetchall()
    context = {'admins': admins}
    return flask.jsonify(**context)

@views.route('/api/v1/my_times/<string:user>')
def get_my_times(user):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT C.coursename, T.teetime, T.cost, T.spots FROM Courses C, Teetimes T, BookedTimes B WHERE B.username = '" + user + "' AND B.timeid = T.timeid AND C.uniqid = T.uniqid;")
    my_times = cursor.fetchall()
    context = {'my_times': my_times}
    return flask.jsonify(**context)

@views.route('/api/v1/teetime/<string:timeid>')
def get_time_info(timeid):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT C.coursename, T.teetime, T.cost, T.spots, C.street, C.town, C.state, C.zip, C.uniqid FROM Courses C, Teetimes T WHERE T.timeid = '"
                                    + timeid + "' AND C.uniqid = T.uniqid;")
    time_info = list(cursor.fetchone())
    cursor = run_query(connection, "SELECT U.username, U.firstname, U.lastname, U.email, U.drinking, U.score, U.playstyle, U.descript, U.college FROM Users U, BookedTimes B WHERE U.username = B.username AND B.timeid = '"
                                    + timeid + "';")
    print(time_info)
    time_users = cursor.fetchall()
    time_info.append(time_users)
    context = {"time_info": time_info}
    return flask.jsonify(**context)

@views.route('/api/v1/payment_confirmed/<string:timeid>', methods = ["PUT"])
def change_spots(timeid):
    connection = create_server_connection('localhost', 'root', 'playbutton68', 'golfbuddies_data')
    cursor = run_query(connection, "SELECT spots FROM teetimes WHERE timeid = '" + timeid + "';")
    if (cursor.fetchone() != 0):
        cursor = run_query(connection, "UPDATE teetimes SET spots = spots - 1 WHERE timeid = '" + timeid + "';")
        context = {'message': ''}
    else:
        context = {'message': 'error'}
    return flask.jsonify(**context)



@scheduler.scheduled_job(IntervalTrigger(hours=24), methods=["POST"])
def update_times():
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
