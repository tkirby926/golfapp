import React from "react"
import {SwiperComponent} from './SwiperComponent';
import UserProfile from './Userprofile';
import {ApplicableCourseComponent} from './ApplicableCourseComponent';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {HeaderComponent} from './HeaderComponent';
import HomePhoto from './photos/HomePage_Cover_Photo.jpeg'
import { ReactDOM } from "react";
import "./css/HomeComponent.css";
//API Key: AIzaSyASFQfAjmrVFmZ1-64DRxSUhsmgI8dp6Jk



export class HomeComponent extends React.Component {

    hideUserAttributes(gtu) {
        var is_showing_attribute = [];
        for (let i = 0; i < gtu.length; i++) {
            if (gtu[i] != null) {
                is_showing_attribute.push(true);
            }
            else {
                is_showing_attribute.push(false);
            }
        }
    }

    hasTimes(good_time, has_times, hide_next, hide_back) {
        if (typeof good_time != "undefined") {
            var time_url = "/tee_time/" + good_time[this.state.index][0];
            var has_data = (good_time != []);
            if (this.state.no_times_available) {
                return (<div><h3>Sorry, no tee times with other golfers available in your area. 
                    Please navigate to our tee time selector page to book your own time, 
                    and allow other users to join it there.</h3>
                    <button type='button' href='/times'></button></div> )
            }
            else if (has_times) {
                console.log(good_time)
            return (<div>
                        <div style={{alignContent: 'center', justifyContent: 'center', textAlign: 'center'}}>
                            <img src={good_time[3]}></img>
                            <h3>{good_time[2]}</h3>
                            <h3>${good_time[1]}</h3>
                        </div>
                        <div style={{margin: '0 auto',  textAlign: 'center'}}>
                {this.state.good_time_users.map(function(good_user, index){  
                        var user = "/user/" + good_user[0];
                        return (
                                    <div class="form" style={{width: "280px", height: '420px', marginLeft: "10px", marginRight: "10px", borderRadius: '25px', display: 'inline-block', textAlign: 'left'}}>
                                    <div>
                                        <div style={{width: '50%', float: 'left'}}>
                                            <img src={good_user[3]}></img>
                                        </div>
                                        <div style={{width: '50%', float: 'left'}}>
                                            <a href={user}>{good_user[1]} {good_user[2]}</a>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <p>{good_user[4]}</p>
                                        </div>
                                        <div>
                                            <p>{good_user[5]}</p>
                                        </div>
                                        <div>
                                            <p>{good_user[6]}</p>
                                        </div>
                                        <div>
                                            <p>{good_user[7]}</p>
                                        </div>
                                    </div>
                                    {/* <button type='button' onClick={}>Book me in for this time!</button> */}

                                </div>
                                )
                                
                                })}
                                </div>
                                <button type='button' onClick={(event) => (this.get_next_time(event, true))} style={{ display: hide_next ? 'none' : undefined }}>Show me the next time</button>
                                <button type='button' onClick={(event) => (this.get_next_time(event, false))} style={{ display: hide_back ? 'none' : undefined }}>Show me the last time</button>
                                <a class='button_home' href={time_url} >Book now</a>
        </div>)
            }
        }
        else if (this.state.input != "") {
            return (<div style={{margin: '0 auto', display: 'flex', width: '60%', textAlign: 'center'}}><h3>Sorry, no tee times with other golfers available in your area on this date. 
                Please try another, or select "Show Courses Near Me" to book your own time</h3></div> )
        }
    }

    get_next_time(event, go_next) {
        var next_index = this.state.index - 1;
        if (go_next) {
            next_index = this.state.index + 1;
        }
        fetch("/api/v1/swipetimes/users/" + this.state.good_tee_times[next_index][0], { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ index: this.next_index, good_time_users: data.good_users });
        })
    }

    render_loc(event, date) {
        event.preventDefault();
        this.state.index = 0;
        fetch("/api/v1/teetimes/" + event.target[0].value + "/" + date, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data.good_times);
            this.setState({good_courses: data.good_courses, zip: event.target[0].value});
            if (data.good_times.length != 0) {
                fetch("/api/v1/swipetimes/users/" + data.good_times[this.state.index][0], { credentials: 'same-origin', method: 'GET' })
                .then((response2) => {
                    if (!response2.ok) throw Error(response2.statusText);
                    return response2.json();
                })
                .then((data2) => {
                    console.log(data2);
                    this.setState({ good_tee_times: data.good_times, good_time_users: data2.good_users, no_times_available: false  });
                })
            }
            else {
                this.setState({ no_times_available: true });
            }

            
        })
        
        
    }

    showCourses(e) {
        e.preventDefault();
        var word = document.getElementById("loc").value;
        if (this.state.input != word) {
            this.render_loc(e, this.state.picked_date)
            this.setState({input: word})
        }
        this.setState({course_mode: true})
    }
    showSwiper(e) {
        e.preventDefault();
        var word = document.getElementById("loc").value;
        if (this.state.input != word) {
            this.render_loc(e, this.state.picked_date)
            this.setState({input: word})
        }
        this.setState({course_mode: false})
    }

    changeInp(e) {
        e.preventDefault();
        // if (e.target.value != "" && (/[a-zA-Z]/).test(e.target.value[0])) {
        //     var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + e.target.value + "&key=AIzaSyBI7zrR9-V2pPWgiKl0T6kK8cZaWYeqb3U&language=en&components=country:us"
        //     fetch(url, { credentials: 'same-origin', method: 'GET', headers: {"Access-Control-Allow-Origin": "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + e.target.value + "&key=AIzaSyBI7zrR9-V2pPWgiKl0T6kK8cZaWYeqb3U&language=en&components=country:us"} })
        //         .then((response) => {
        //             if (!response.ok) throw Error(response.statusText);
        //             return response.json();
        //         })
        //         .then((data) => {
        //             console.log(data);
        //             this.setState({ good_tee_times: data.good_times, good_time_users: data.good_users, no_times_available: false  });
        //         })
        // }
    }
    getThreeWeeks() {
        const split = this.state.today.split('-');
        var day = split[2];
        var month = split[1];
        var year = split[0];
        if (month == '4' || month == '6' || month == '9' || month == '11') {
            if (parseInt(day) + 21 > 30) {
                month = parseInt(month) + 1
            }
            day = (parseInt(day) + 21) % 30;
        }
        else if (month == '2') {
            if (parseInt(day) + 21 > 28) {
                month = parseInt(month) + 1
            }
            day = (parseInt(day) + 21) % 28;
        }
        else if (month == '12') {
            if (parseInt(day) + 21 > 31) {
                month = parseInt(month) + 1;
                year = parseInt(year) + 1;
            }
            day = (parseInt(day) + 21) % 31;
        }
        else {
            if (parseInt(day) + 21 > 31) {
                month = parseInt(month) + 1;
            }
            day = (parseInt(day) + 21) % 31;
        }
        var x = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        return x;
    }

    getSwipeTimes(event) {
        event.preventDefault();
        this.render_loc(event, event.target.value)
    }

    showSwipeWindow() {
        if (!this.state.course_mode && this.state.input != "") {
            return (
                <div style={{marginTop: '15px', display: "inline-block"}}>
                    <p>Amigolf will show tee times in your area with booked users on the date below, choose to either book the time or move to the next one</p>
                    <div>
                        <input hidden={this.state.course_mode || this.state.input == ""} style={{fontSize: 'large', margin: '0 auto', display: 'flex'}} type="date" defaultValue={this.state.today} min={this.state.today} 
                            max={this.getThreeWeeks()} onChange={(event) => this.getSwipeTimes(event)}></input>
                         <p style={{textAlign: 'center'}} hidden={this.state.course_mode || this.state.input == ""}>(Click the date above to change it)</p>
                        {/* <button hidden={this.state.course_mode || this.state.input == ""} style={{marginLeft: '50px'}} class="button4">Get Started</button> */}
                    </div>
                </div>
            )
        }
    }

    showPosts() {
        if (this.state.posts.length > 0) {
            return (
                <div>
                    {this.state.posts.map((post, index) => {
                        <form class="form_message">
                            <p>{this.state.username}</p>
                            <p>{post[0]}</p>
                        </form>
                    })}
                </div>
                )
        }
        else {
            return (
                <div>
                    <p style={{marginLeft: '2vw'}}>No friends have posted recently. Post yourself and add friends using the above search bar!</p>
                </div>
            )
        }
    }

    getPosts() {
        fetch("/api/v1/posts/" + UserProfile.checkCookie(), { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ posts: data.posts});
        })
    }

    constructor(props) {
        super(props)
        const toDay= new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        var split = toDay.split('/');
        var today_readable = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        this.state = {
            zip: "07920",
            length: 10,
            good_courses: [],
            good_tee_times: [],
            good_time_users: [],
            index: 0,
            no_times_available: false,
            course_mode: false,
            input: "",
            today: today_readable,
            picked_date: today_readable,
            posts: []
          };
          this.hasTimes = this.hasTimes.bind(this);
          this.showCourses = this.showCourses.bind(this);
          this.showSwiper = this.showSwiper.bind(this);
          this.getPosts();
    }

    render() {
        const has_times = (this.state.good_tee_times.length != 0)
        const hide_back = (this.state.index == 0);
        const hide_next = (this.state.index == (this.state.good_tee_times.length - 1));
        return (
        <div style={{position: "absolute", backgroundRepeat: "repeat-y"}}>
            <HeaderComponent hide_search={false}/>
            <img class='photo' src={HomePhoto}></img> 
            <body>
            <div style={{marginTop: '10px', width: '50%', float: 'left'}}>
            <form style={{minHeight: '30vh', marginTop: '15px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} onSubmit={(event) => {const buttonName = event.nativeEvent.submitter.name;
                                                                                                         if (buttonName === "button1") this.showCourses(event);
                                                                                                         if (buttonName === "button2") this.showSwiper(event);}}>
                Search for courses/users in the search bar above, or <br></br><br></br> Enter a zip code or town to see tee times near you: <input type="text" name="zips" id="loc" onKeyUp={(event) => this.changeInp(event)}></input>
                <div style={{marginTop: '40px', padding: '10px'}}>
                    <button class="button" name='button1' style={{float: 'left', width: '48%'}}>Show Courses Near Me</button>
                    <button class="button" name='button2' style={{float: 'left', marginLeft: '4%', width: '48%'}}>Use Swiper Service</button>
                </div>
                {this.showSwipeWindow()}
                </form> 
                <div hidden={!this.state.course_mode}>
                    {this.state.good_courses.map(function(good_course, index){
                        console.log(good_course)
                        const course_url = '/course/' + good_course[0];
                                return (<div style={{marginTop: '10px', borderBottom: 'solid thin gray', overflow: 'auto', marginRight: 'auto', marginLeft: 'auto', width: '50%'}}>
                                            <div style={{float: 'left', width: '25%'}}>
                                            </div>
                                            <div style={{float: 'left', width: '75%'}}>
                                                <Link to={course_url} style={{fontSize: '20px', fontWeight: 'bold'}}>{good_course[3]}</Link><br></br>
                                                <p>{good_course[4]}, {good_course[5]}, {good_course[7]} {good_course[6]}</p>
                                            </div>
                                    </div>)
                            })}
                    </div>
        </div>
        <div style={{marginTop: '20px', width: '50%', float: 'right'}}>
            <div style={{borderRadius: '25px', border: '5px solid black', minHeight: '30vh'}}>
            <div style={{marginTop: '5px', width: '90%', marginLeft: 'auto', marginRight: 'auto', display: 'block'}}>
                <input style={{float: 'left', width: '83%'}} class="input1" type="text" placeholder='Write A Post for Your Friends Like "Looking for a fourth for our tee time..."' hidden={this.state.hide_search} />
                <button class='button4' style={{float: 'left', width: '13%', marginLeft: '2%', marginTop: '3px'}}>Post</button>
            </div>
                <h4 style={{width: '100%', marginLeft: '2vw', overflow: 'auto', marginTop: '10vh'}}>Recent Posts:</h4>
                {this.showPosts()}
            </div>
        </div>
        </body>
        <div hidden={this.state.course_mode}>
                    {this.hasTimes(this.state.good_tee_times[this.state.index], has_times, hide_next, hide_back)}
                    </div>
        
        </div>
        )}
}