import React from "react"
import UserProfile from './Userprofile';
import "./css/TeeTimeComponent.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HeaderComponent } from "./HeaderComponent";

export class TeeTimeComponent extends React.Component {

    getTimeInfo() {
        fetch("/api/v1/teetime/" + this.state.timeid, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({tee_time_info: data.time_info});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            tee_time_info: [],
            timeid: window.location.href.split('/').pop()
        }
        this.getTimeInfo();
    }


    getUrl(url) {
        if (UserProfile.checkCookie() != "null") {
            return url
        }
        else {
            return '/login?return_url=' + window.location.pathname;
        }
    }

    showUsers() {
        if (this.state.tee_time_info[9].length > 0) {
            return (this.state.tee_time_info[9].map(function(user, index){  
                var user_link = "/user/" + user[0];
                return (
                    <form class="form3" style={{width: "280px", height: '420px', marginLeft: "10px", marginRight: "10px", borderRadius: '25px', display: 'inline-block', textAlign: 'left'}}>
                        <div>
                            <div style={{width: '50%', float: 'left'}}>
                                <img src={user[3]}></img>
                            </div>
                            <div style={{width: '50%', float: 'left'}}>
                                <a href={user_link}>{user[1]}</a>
                            </div>
                        </div>
                        <div>
                            <div>
                                <p>{user[4]}</p>
                            </div>
                            <div>
                                <p>{user[5]}</p>
                            </div>
                            <div>
                                <p>{user[6]}</p>
                            </div>
                            <div>
                                <p>{user[7]}</p>
                            </div>
                            <div>
                                <p>{user[8]}</p>
                            </div>
                        </div>
                    </form>
                )}))
        }
        else {
            return (<p style={{fontWeight: 'bold'}}>No other Users have booked this time. <br></br>Book it yourself now and allow other users to join!</p>)
        }
    }

    render() {
        if (this.state.tee_time_info.length > 0) {
            var course_address = this.state.tee_time_info[5] + ", " + this.state.tee_time_info[6] + ", " 
                                + this.state.tee_time_info[7] + " " + this.state.tee_time_info[8];
            var url = "/checkout/" + this.state.timeid
            var back_url = "/course/" + this.state.tee_time_info[9];
            return (
                <div>
                    <div>
                        <HeaderComponent hide_search={true}/>
                    </div>
                    <a style={{display: 'flex', marginBottom: '15px', width: '8%'}} class="button4" href={back_url}>Back</a>
                    <div class="big_form">
                        <p>{this.state.tee_time_info[0]}</p>
                        <p>Time: {this.state.tee_time_info[2]}</p>
                        <p>${this.state.tee_time_info[3]}</p>
                        <Link class="button4" to={this.getUrl(url)} state={{course_name: this.state.tee_time_info[0], course_address: course_address, course_time: this.state.timeid}}>Book Now
                            </Link>
                        <div style={{margin: '0 auto',  textAlign: 'center', paddingTop: '15px'}}>
                        <h3>Users Booked:</h3>
                        {this.showUsers()}
                        </div>
                    </div>
                </div>
            )
        }
    }
}
