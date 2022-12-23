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
            console.log(data.time_info)
            var includes = false;
            for (var i = 0; i < data.time_info[10].length; i++) {
                if (data.time_info[10][i][0].includes(this.state.user)) {
                    includes = true;
                }
            }
            this.setState({tee_time_info: data.time_info, in_time: includes});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            tee_time_info: [],
            timeid: window.location.href.split('/').pop(),
            user: UserProfile.checkCookie(),
            in_time: false
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

    checkNull(answer, preface) {
        if (answer == "none" || answer == "") {
            return;
        }
        else {
            return (<div>{preface}{answer}<br></br></div>)
        }
    } 

    showUsers() {
        if (this.state.tee_time_info[10].length > 0) {
            var width = (100/this.state.tee_time_info[10].length).toString() + "%";
            return (
                <div style={{width: '100%', display: 'table'}}>
                    <div style={{display: 'table-row', height: '40vh'}}>
                        {this.state.tee_time_info[10].map((user, index) => { 
                        var user_link = "/user/" + user[0];
                        return (
                            <form class="form3" style={{width: {width}, display: 'table-cell'}}>
                                <div>
                                    <div style={{width: '50%', float: 'left'}}>
                                        <img src={user[3]}></img>
                                    </div>
                                    <div style={{width: '50%', float: 'left'}}>
                                        <a href={user_link}>{user[1]}</a>
                                    </div>
                                </div>
                                <div>
                                    <p>Name: {user[1] + " " + user[2]}</p>
                                    {this.checkNull(user[4], "Drinking on the course: ")}
                                    {this.checkNull(user[5], "Usual Score: ")}
                                    {this.checkNull(user[6], "How serious of a golfer: ")}
                                    {this.checkNull(user[8], "School: ")}
                                    {this.checkNull(user[7], "Description: ")}
                                    {this.checkNull(user[8])}
                                    {this.checkNull(user[9])}
                                </div>
                            </form>
                        )})}
                    </div>
                </div>)
        }
        else {
            return (<p style={{fontWeight: 'bold'}}>No other Users have booked this time. <br></br>Book it yourself now and allow other users to join!</p>)
        }
    }

    convertBool() {
        if (this.state.tee_time_info[4] == 0) {
            return "No";
        }
        else {
            return "Yes"
        }
    }

    render() {
        if (this.state.tee_time_info.length > 0) {
            var course_address = this.state.tee_time_info[6] + ", " + this.state.tee_time_info[7] + ", " 
                                + this.state.tee_time_info[8] + " " + this.state.tee_time_info[9];
            var url = "/checkout/" + this.state.timeid
            var back_url = "/course/" + this.state.tee_time_info[8];
            return (
                <div>
                    <div style={{width: '100%', overflow: 'auto'}}>
                        <a style={{display: 'flex', marginBottom: '15px', width: '8%', marginLeft: '15%', padding: '5px', justifyContent: 'center'}} class="button4" href={back_url}>Back</a>
                    </div>
                    <div class="big_form">
                        <p>{this.state.tee_time_info[0]}</p>
                        <p>Time: {this.state.tee_time_info[1]}</p>
                        <p>${this.state.tee_time_info[2]}</p>
                        <p>Cart Included: {this.convertBool()}</p>
                        <div hidden={this.state.in_time}>
                            <Link class="button4" to={this.getUrl(url)} state={{course_name: this.state.tee_time_info[0], course_address: course_address, course_time: this.state.timeid}}>Book Now
                                </Link>
                        </div>
                        <div hidden={!this.state.in_time}>
                            <p>You are currently booked for this time!</p>
                        </div>
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
