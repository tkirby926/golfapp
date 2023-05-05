import React from "react"
import { BrowserRouter as Link } from 'react-router-dom';
import HomePhoto from './photos/HomePage_Cover_Photo.jpeg'
import "./css/HomeComponent.css";
import { PostViewComponent } from "./PostViewComponent";
import UserProfile from './Userprofile';
import ProfHelper from "./ProfHelper";
//API Key: AIzaSyASFQfAjmrVFmZ1-64DRxSUhsmgI8dp6Jk



export class HomeComponent extends React.Component {

    hideUserAttributes(gtu) {
        var is_showing_attribute = [];
        for (let i = 0; i < gtu.length; i++) {
            if (gtu[i] !== null) {
                is_showing_attribute.push(true);
            }
            else {
                is_showing_attribute.push(false);
            }
        }
    }

    hasTimes() {
            if (this.state.cur_time.length == 0) {
                return (<div><h3>Sorry, no tee times with other golfers available in your area. 
                    Please navigate to our tee time selector page to book your own time, 
                    and allow other users to join it there.</h3>
                    <button type='button' href='/times'></button></div> )
            }
            return (<div>
                        <div style={{alignContent: 'center', justifyContent: 'center', textAlign: 'center'}}>
                            <img style={{borderRadius: '5px'}} src={this.state.cur_time[3]}></img>
                            <h3>{this.state.cur_time[2]}</h3>
                            <h3>${this.state.cur_time[1]}</h3>
                        </div>
                        <div style={{margin: '0 auto',  textAlign: 'center'}}>
                {this.state.good_time_users.map((good_user, index) => {  
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
                                <button type='button' onClick={(event) => (this.get_next_time(event, this.state.index, this.state.picked_date, true))}>Show me the next time</button>
                                <button type='button' onClick={(event) => (this.get_next_time(event, this.state.index, this.state.picked_date, false))}>Show me the last time</button>
                                <a class='button_home' href={this.state.cur_time[0]} >Book now</a>
        </div>)
            
    }

    get_next_time(e, index, date, go_next) {
        e.preventDefault();
        this.setState({is_visible: false, spinner: true, good_time_users: [], cur_time: []});
        var next_index = index - 1;
        if (go_next) {
            next_index = index + 1;
        }
        fetch(UserProfile.getUrl() + "/api/v1/swipetimes/" + this.state.cid_string + "/" + date + "/" + next_index, { credentials: 'include', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ index: next_index, good_time_users: data.good_time_users, cur_time: data.swipe_course, picked_date: date, more_times: data.more, is_visible: true, spinner: false});
        })
    }

    render_loc(word, date) {
        this.setState({spinner: true, good_courses: []})
        fetch(UserProfile.getUrl() + "/api/v1/teetimes/" + word + "/" + date + "/0", { credentials: 'include', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data.good_times);
            this.setState({good_courses: data.good_courses, index: 0, zip: word, cur_time: data.time, good_time_users: data.time_users, cid_string: data.cids, more_times: data.more, spinner: false});  
        })
        
        
    }

    showCourses(e) {
        e.preventDefault();
        var word = document.getElementById("loc").value;
        if (this.state.input !== word) {
            this.render_loc(word, this.state.picked_date)
            this.setState({input: word})
        }
        this.setState({course_mode: true})
    }
    showSwiper(e) {
        e.preventDefault();
        var word = document.getElementById("loc").value;
        if (this.state.input !== word) {
            this.render_loc(word, this.state.picked_date)
            this.setState({input: word})
        }
        this.setState({course_mode: false})
    }

    changeInp(e) {
        e.preventDefault();
        this.setState({show_dropdown: true})
        if (e.target.value.length < 3) {
            this.setState({location_search_results: []})
            return;
        }
        if (e.target.value !== "" && (/[a-zA-Z]/).test(e.target.value[0])) {
            var url = "http://api.geonames.org/searchJSON?q=" + e.target.value + "&maxRows=5&username=tkirby926&country=US&featureCode=PPL"
            fetch(url, { credentials: 'same-origin', method: 'GET'})
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({ location_search_results: data.geonames, input: e.target.value  });
            })
            fetch(UserProfile.getUrl() + "/api/v1/search/courses/" + e.target.value +  "/0/3", { credentials: 'include', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                this.setState({courses_like_string: data.results});  
            })
        }
    }
    getThreeWeeks() {
        const split = this.state.today.split('-');
        var day = split[2];
        var month = split[1];
        var year = split[0];
        if (month === '4' || month === '6' || month === '9' || month === '11') {
            if (parseInt(day) + 21 > 30) {
                month = parseInt(month) + 1
            }
            day = (parseInt(day) + 21) % 30;
        }
        else if (month === '2') {
            if (parseInt(day) + 21 > 28) {
                month = parseInt(month) + 1
            }
            day = (parseInt(day) + 21) % 28;
        }
        else if (month === '12') {
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
        this.get_next_time(event, -1, event.target.value, true)
        this.setState({picked_date: event.target.value})
    }

    showSwipeWindow() {
        if (!this.state.course_mode && this.state.input !== "") {
            return (
                <div style={{marginTop: '15px', display: "inline-block"}}>
                    <p>Amigolf will show tee times in your area with booked users on the date below, choose to either book the time or move to the next one</p>
                    <div>
                        <input hidden={this.state.course_mode || this.state.input === ""} style={{fontSize: 'large', margin: '0 auto', display: 'flex'}} type="date" defaultValue={this.state.today} min={this.state.today} 
                            max={this.getThreeWeeks()} onChange={(event) => this.getSwipeTimes(event)}></input>
                         <p style={{textAlign: 'center'}} hidden={this.state.course_mode || this.state.input === ""}>(Click the date above to change it)</p>
                        {/* <button hidden={this.state.course_mode || this.state.input === ""} style={{marginLeft: '50px'}} class="button4">Get Started</button> */}
                    </div>
                </div>
            )
        }
    }

    getPosts() {
        fetch(UserProfile.getUrl() + "/api/v1/posts", { credentials: 'include', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ posts: data.posts, has_more_posts: data.has_more_posts});
        })
    }

    enterButton(e, zip_field) {
        e.preventDefault();
        if (zip_field && e.key === "Enter") {
            this.showCourses(e);
        }
        else if (e.key === "Enter") {
            this.postPost(e);
        }
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
            cur_time: [],
            good_time_users: [],
            index: 0,
            no_times_available: false,
            course_mode: true,
            input: "",
            today: today_readable,
            picked_date: today_readable,
            user: this.props.user,
            error: "",
            linked_time: "",
            times_booked: [],
            under_width: false,
            show_dropdown: true,
            location_search_results: [],
            message: '',
            tutorial: this.props.tut,
            steps: [],
            cid_string: '',
            more_times: false,
            is_visible: false,
            message: this.props.message != undefined ? this.props.message : '',
            spinner: false,
            courses_like_string: []
          };
          this.showTeeTimes = this.showTeeTimes.bind(this);
          this.showCourses = this.showCourses.bind(this);
          this.showSwiper = this.showSwiper.bind(this);
          if (this.state.user === 'null') {
              this.state.message = 'Welcome to GolfTribe! Get Started by signing up or logging in if you have an account!'
          }
    }

    setSearch(e, lat, lon, name) {
        e.preventDefault();
        this.setState({show_dropdown: false})
        document.getElementById("loc").value = name;
        fetch(UserProfile.getUrl() + "/api/v1/location_city/" + lat + "/" + lon + "/" + this.state.today, { credentials: 'include', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data.good_times);
            this.setState({good_courses: data.good_courses, index: 0, cur_time: data.time, good_time_users: data.time_users, cid_string: data.cids, more_times: data.more, spinner: false});    
        })

    }

    directToURL(e, url) {
        e.preventDefault();
        window.location.assign(url);
    }

    showTeeTimes() {
        if (!this.state.under_width || (this.state.under_width && this.state.show_time_window)) {
            var date_string = '';
            var time_string = '';
            if (this.state.cur_time.length > 0) {
                var date = new Date(this.state.cur_time[7])
                date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
                date_string = date.toLocaleDateString();
                time_string = date.toLocaleString([], {hour: '2-digit', minute:'2-digit'});
            }
        return (<div><form id="times_form" class="form" style={{minHeight: '22vh', paddingBottom: '8vh', marginTop: '15px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} onSubmit={(event) => {const buttonName = event.nativeEvent.submitter.name;
                                                                                                         if (buttonName === "button1") this.showCourses(event);
                                                                                                         if (buttonName === "button2") this.showSwiper(event);
                                                                                                    }}>
                Search for courses/users in the search bar above, or enter a zip code or town to see tee times near you: <input style={{width: '100%', marginTop: '4vh'}} type="text" name="zips" id="loc" onKeyUp={(event) => this.changeInp(event)}></input>
                {this.state.show_dropdown && this.state.location_search_results.length != 0 
                && this.state.courses_like_string.length != 0 && 
                <div class="user_button" style={{position: 'absolute', overflow: 'visible', width: '50%', bottom: 'auto'}}>
                {this.state.location_search_results.map((result, index) => {
                    var name = result['name'] + ", " + result['adminCode1'];
                    return (<div class="user_button" style={{cursor: 'pointer', width: '90%', fontSize: '14px', marginTop: '0', marginBottom: '0', display: 'inherit'}} onClick={(event) => this.setSearch(event, result['lat'], result['lng'], name)}>
                                {name}
                            </div>)
                })}
                <div hidden={this.state.courses_like_string.length == 0}>
                    <h4>Courses:</h4>
                    {this.state.courses_like_string.map((result, index) => {
                        const url_course = '/course/' + result[0];
                    return (<div class="user_button" style={{cursor: 'pointer', width: '90%', fontSize: '14px', marginTop: '0', marginBottom: '0', display: 'inherit'}} onClick={(event) => this.directToURL(event, url_course)}>
                                {result[1]}
                            </div>)
                })}
                </div>
                </div>}
                <div style={{marginTop: '40px', padding: '10px'}}>
                    <button class="button" name='button1' style={{float: 'left', width: '48%'}}>Show Courses Near Me</button>
                    <button class="button" name='button2' style={{float: 'left', marginLeft: '4%', width: '48%'}}>Use Swiper Service</button>
                </div>
                {this.showSwipeWindow()}
                </form> 
                <div class="loading-spinner" style={{margin: '0 auto', clear: 'both', marginTop: '50px'}} hidden={!this.state.spinner}></div>
                <div hidden={!this.state.course_mode}>
                    {this.state.good_courses.map((good_course, index) => {
                        var src = good_course[5];
                        if (src === null || src === '') {
                            src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';
                        }
                        const course_url = '/course/' + good_course[6];
                                return (<div onClick={(event) => this.directToURL(event, course_url)} class="user_button" style={{cursor: 'pointer', marginTop: '10px', borderBottom: 'solid thin gray', overflow: 'auto', display: 'block', marginLeft: 'auto', width: '85%'}}>
                                            <div style={{float: 'left', width: '15%', marginLeft: '2%', marginRight: '3%'}}>
                                                <img src={src} style={{width: '100%', border: 'thin solid black', margin: '0 auto', borderRadius: '5px'}}></img><br></br>
                                            </div>
                                            <div style={{float: 'left', width: '75%'}}>
                                                <a style={{fontSize: '20px', fontWeight: 'bold', color: '#080B3E'}}>{good_course[0]}</a><br></br>
                                                <p>{good_course[1]}, {good_course[2]}, {good_course[3]} {good_course[4]}</p>
                                            </div>
                                    </div>)
                            })}
                </div>
                <div hidden={this.state.course_mode}>
                    {/* {this.hasTimes()} */}
                    <div hidden={this.state.cur_time.length != 0 || this.state.spinner}>
                        <h3 style={{textAlign: 'center'}}>Sorry, no tee times with other golfers available in your area for the selected date. 
                        Please choose another date or click the "Show Courses Near Me" button to book your own tee times, 
                        and allow other users to join it there.</h3>
                    </div>
                    <div hidden={this.state.cur_time.length == 0} style={{marginTop: '2vh'}}>
                        <button class='button4_inv' style={{float: 'right'}} onClick={(event) => (this.get_next_time(event, this.state.index, this.state.picked_date, true))} disabled={!this.state.more_times}>Show me the next time</button>
                        <button class='button4_inv' style={{float: 'right'}} onClick={(event) => (this.get_next_time(event, this.state.index, this.state.picked_date, false))} disabled={this.state.index == 0}>Show me the last time</button>
                        <div style={{alignContent: 'center', justifyContent: 'center', textAlign: 'center', clear: 'both'}}>
                            <img style={{height: '80px', borderRadius: '5px', border: 'thin solid black'}} src={this.state.cur_time[5] == '' ? 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg' : this.state.cur_time[5]}></img>
                            <h3 style={{textAlign: 'center', marginTop: '0', marginBottom: '4px'}}>{this.state.cur_time[0]}</h3>
                            <h3 style={{textAlign: 'center', marginTop: '0', marginBottom: '4px'}}>{date_string}, {time_string}</h3>
                            <h3 style={{textAlign: 'center', marginTop: '0', marginBottom: '4px'}}>${this.state.cur_time[9]}</h3>
                            <h4 style={{textAlign: 'center', marginTop: '0', marginBottom: '4px'}}>{this.state.cur_time[1]}, {this.state.cur_time[2]}, {this.state.cur_time[3]}, {this.state.cur_time[4]}</h4>
                        </div>
                        <div style={{margin: '0 auto',  textAlign: 'center'}}>
                        <div style={{clear: 'both'}}>
                        <a class='button4' style={{clear: 'both', display: 'inherit', marginRight: 'auto', marginLeft: 'auto', textAlign: 'center', width: '20%', marginBottom: '2vh'}} href={'/tee_time/' + this.state.cur_time[8]} >Book now</a>
                        </div>
                        <div style={{width: '100%', height: '2px', clear: 'both'}}></div>
                {this.state.good_time_users.map((good_user, index) => {  
                        var user = "/user/" + good_user[0];
                        return (<div>
                                {this.state.is_visible && <div class="fade_form" style={{width: "29%", padding: '2%', borderRadius: '25px', textAlign: 'left', float: 'left', marginBottom: '2vh'}}>
                                    {ProfHelper.getProf(good_user)}
                                    {/* <button type='button' onClick={}>Book me in for this time!</button> */}

                                </div>}
                                </div>
                                )
                                
                                })}
                                </div>
                                
        </div>
                </div>
                </div>)
        }
    }

    showPosts() {
        if (!this.state.under_width) {
            return (<PostViewComponent all_posts={true} more_posts={true} user={this.state.user}/>)
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

    render() {
        // const has_times = (this.state.good_tee_times.length !== 0)
        // const hide_back = (this.state.index === 0);
        // const hide_next = (this.state.index === (this.state.good_tee_times.length - 1));
        var width_form_a = "58%";
        var width_form_b = "42%";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form_a = "100%";
        }
        return (
        <div id="whole_page" style={{position: "relative", backgroundSize: 'cover', width: '100%'}}>
            <p style={{textAlign: 'center', fontWeight: 'bold'}}>{this.state.message}</p>
            <img class='photo' src={HomePhoto} id="home_photo" style={{zIndex: '-100'}}></img> 
            {/* <div style={{width: '100%', justifyContent: 'center', display: 'flex'}}>
                <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginRight: '8vw', marginTop: '3vh'}} onClick={(event) => this.changeView(event, true)}>Tee Times</button>
                <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginTop: '3vh'}} onClick={(event) => this.changeView(event, false)}>Posts</button>
            </div> */}
            <div style={{marginTop: '10px', width: width_form_a, float: 'left', display: 'block'}}>
            {this.showTeeTimes(true, false, false)}
            </div>
            <div style={{marginTop: '20px', width: width_form_b, float: 'left', display: 'block'}}>
                {this.showPosts()}
            </div>
        
        </div>
        )}
}