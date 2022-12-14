import React from "react"
import {SwiperComponent} from './SwiperComponent';
import UserProfile from './Userprofile';
import {ApplicableCourseComponent} from './ApplicableCourseComponent';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {HeaderComponent} from './HeaderComponent';
import HomePhoto from './photos/HomePage_Cover_Photo.jpeg'
import { ReactDOM } from "react";
import "./css/HomeComponent.css";
import { FooterComponent } from "./FooterComponent";
import { PostViewComponent } from "./PostViewComponent";
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

    render_loc(word, date) {
        this.state.index = 0;
        fetch("/api/v1/teetimes/" + word + "/" + date, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data.good_times);
            this.setState({good_courses: data.good_courses, zip: word});
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
            this.render_loc(word, this.state.picked_date)
            this.setState({input: word})
        }
        this.setState({course_mode: true})
    }
    showSwiper(e) {
        e.preventDefault();
        var word = document.getElementById("loc").value;
        if (this.state.input != word) {
            this.render_loc(word, this.state.picked_date)
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

    showJoinButton(post) {
        console.log(post)
        if (post[3] != null && post[3] !="") {
            return (<div><a class="button" style={{fontSize: 'small', width: '100%'}} href={post[3]}>Join Their Time</a></div>)
        }
    }

    showPosts() {
        if (this.state.posts.length > 0) {
            return (
                <div>
                    {this.state.posts.map((post, index) => {
                        return (
                            <form class="form_post">
                                <div style={{width: '100%', display: 'table'}}>
                                    <div style={{display: 'table-row', height: '100px'}}>
                                        <div style={{width: '70%', display: 'table-cell'}}>
                                            <p style={{fontWeight: 'bold'}}>{post[1]}</p>
                                            <p>{post[0]}</p>
                                        </div>
                                        <div style={{display: 'table-cell', width: '10%'}}> 
                                            {this.showJoinButton(post)}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )
                    })}
                </div>
                )
        }
        else {
            return (
                <div>
                    <p style={{marginLeft: '4%'}}>No friends have posted recently. Post yourself, and add friends using the above search bar!</p>
                </div>
            )
        }
    }

    getPosts() {
        fetch("/api/v1/posts/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ posts: data.posts, has_more_posts: data.has_more_posts});
        })
    }

    postPost(e) {
        if (this.state.user == "null") {
            this.setState({error: "Sign in to post"})
        }
        e.preventDefault();
        var content = document.getElementById("post").value;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  user: this.state.user,
                                    content: content,
                                    link: this.state.linked_time})
        }
        fetch('/api/v1/post_post', requestOptions)
        .then(response => response.json())
        .then((data) => {
            this.setState({posts: this.state.posts.slice().unshift([this.state.user, content])})
            this.forceUpdate();
        })
    }

    enterButton(e, zip_field) {
        e.preventDefault();
        if (zip_field && e.key == "Enter") {
            this.showCourses(e);
        }
        else if (e.key == "Enter") {
            this.postPost(e);
        }
    }

    alertLinkedTime(e) {
        e.preventDefault();
        alert("The Link Time Feature allows your posts to include a button linking to the tee time you are talking about in your post." + 
        "That way you can ask your friends about a particular time while allowing them to immediately click a button and join it. Posts can be made without a linked teetime.")
    }

    linkTime(e) {
        e.preventDefault();
        if (this.state.times_booked.length == 0 && !this.state.show_linkable_times) {
            fetch("/api/v1/booked_times/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({ times_booked: data.times_booked});
            })
        }
        this.setState({ show_linkable_times: !this.state.show_linkable_times});
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
            posts: [],
            has_more_posts: false,
            user: UserProfile.checkCookie(),
            error: "",
            linked_time: "",
            times_booked: [],
            has_linked_time: false,
            show_linkable_times: false,
            under_width: false,
            show_time_window: true,
            show_posts_window: false,
            hide_dropdowns: false
          };
          this.hasTimes = this.hasTimes.bind(this);
          this.showCourses = this.showCourses.bind(this);
          this.showSwiper = this.showSwiper.bind(this);
          this.getPosts();
    }

    isLinked() {
        if (this.state.has_linked_time) {
            return (<p style={{display: 'inline'}}>Linked &#x2713;</p>)
        }
        else {
            return (<p style={{display: 'inline'}}>Link Time</p>)
        }
    }

    changeLinkedTime(e, time_url) {
        e.preventDefault();
        this.setState({linked_time: time_url, has_linked_time: true, show_linkable_times: false})
    }

    showBookedTimes() {
        if (this.state.times_booked.length > 0) {
            return (
            <div style={{position: 'absolute', overflow: 'visible'}}>
            {this.state.times_booked.map((time, index) => {
                const time_url = '/tee_time/' + time[0];
                return (<div>
                            <button style={{width: '100%'}} class='button_user3' onClick={(event) =>this.changeLinkedTime(event, time_url)}>{time[1]}<br></br> {time[2]}</button>
                        </div>)
            })}
            </div>
            )
        }
        else {
            return <div class="requests" style={{marginTop: '15px'}}>No upcoming times booked</div>
        }
    }

    showTeeTimes(has_times, hide_back, hide_next) {
        if (!this.state.under_width || (this.state.under_width && this.state.show_time_window)) {
        return (<div><form class="form" style={{minHeight: '22vh', marginTop: '15px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} onSubmit={(event) => {const buttonName = event.nativeEvent.submitter.name;
                                                                                                         if (buttonName === "button1") this.showCourses(event);
                                                                                                         if (buttonName === "button2") this.showSwiper(event);}}>
                Search for courses/users in the search bar above, or <br></br><br></br> Enter a zip code or town to see tee times near you: <input onKeyUp={(event) => this.enterButton(event, true)} type="text" name="zips" id="loc" onKeyUp={(event) => this.changeInp(event)}></input>
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
                                return (<div style={{marginTop: '10px', borderBottom: 'solid thin gray', overflow: 'auto', marginRight: 'auto', marginLeft: 'auto', width: '100%'}}>
                                            <div style={{float: 'left', width: '25%'}}>f
                                            </div>
                                            <div style={{float: 'left', width: '75%'}}>
                                                <Link to={course_url} style={{fontSize: '20px', fontWeight: 'bold'}}>{good_course[3]}</Link><br></br>
                                                <p>{good_course[4]}, {good_course[5]}, {good_course[7]} {good_course[6]}</p>
                                            </div>
                                    </div>)
                            })}
                </div>
                <div hidden={this.state.course_mode}>
                    {this.hasTimes(this.state.good_tee_times[this.state.index], has_times, hide_next, hide_back)}
                </div></div>)
        }
    }

    showPosts() {
        if (!this.state.under_width || (this.state.under_width && this.state.show_posts_window)) {
            return (<PostViewComponent all_posts={true} more_posts={true}/>)
        }
    }

    changeView(e, times) {
        e.preventDefault();
        if (times) {
            this.setState({show_time_window: true, show_posts_window: false});
        }
        else {
            this.setState({show_time_window: false, show_posts_window: true});
        }
    }

    hideDrops(e) {
        e.preventDefault();
        if (e.target.id != "poop") {
            this.setState({hide_dropdowns: true})
        }
        else {
            this.setState({hide_dropdowns: false})
        }
    }

    render() {
        const has_times = (this.state.good_tee_times.length != 0)
        const hide_back = (this.state.index == 0);
        const hide_next = (this.state.index == (this.state.good_tee_times.length - 1));
        var width_form = "49%";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form = "100%";
        }
        return (
        <div style={{position: "absolute", backgroundSize: 'cover', width: '100%'}}>
            <img class='photo' src={HomePhoto}></img> 
            <div style={{width: '100%', justifyContent: 'center', display: 'flex'}}>
                <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginRight: '8vw', marginTop: '3vh'}} onClick={(event) => this.changeView(event, true)}>Tee Times</button>
                <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginTop: '3vh'}} onClick={(event) => this.changeView(event, false)}>Posts</button>
            </div>
            <div style={{marginTop: '10px', width: width_form, float: 'left', display: 'block'}}>
            {this.showTeeTimes(has_times, hide_back, hide_next)}
            </div>
            <div style={{marginTop: '20px', width: width_form, float: 'left', display: 'block'}}>
                {this.showPosts()}
            </div>
        
        </div>
        )}
}