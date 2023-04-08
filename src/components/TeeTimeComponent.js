import React from "react"
import "./css/TeeTimeComponent.css";
import { BrowserRouter as Link } from 'react-router-dom';
import UserProfile from './Userprofile';

export class TeeTimeComponent extends React.Component {

    getTimeInfo() {
        fetch(UserProfile.getUrl() + "/api/v1/teetime/" + this.state.timeid + '/' + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data)
            this.setState({tee_time_info: data.time_info, in_time: data.in_time});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            tee_time_info: [],
            timeid: window.location.href.split('/').pop(),
            user: this.props.user,
            in_time: false
        }
        this.getTimeInfo();
    }


    getUrl(url) {
        if (this.state.user !== "null") {
            return url
        }
        else {
            return '/login?return_url=' + window.location.pathname;
        }
    }

    checkNull(answer, preface) {
        if (answer === "none" || answer === "") {
            return;
        }
        else {
            return (<div style={{color: '#080B3E'}}>{preface}{answer}<br></br></div>)
        }
    } 

    showUsers() {
        if (this.state.tee_time_info[11].length > 0) {
            var width = (100/this.state.tee_time_info[11].length).toString() + "%";
            return (
                <div style={{width: '100%', display: 'table'}}>
                    <div style={{display: 'table-row', height: '40vh'}}>
                        {this.state.tee_time_info[11].map((user, index) => { 
                        console.log(user)
                        var user_link = "/user/" + user[0];
                        var src = user[9];
                        if (src === null) {
                            src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';;
                        }
                        return (
                            <form class="user_button" style={{width: {width}, display: 'table-cell', borderRadius: '50px'}}>
                                <div>
                                    <h4 style={{fontWeight: 'bold', textAlign: 'center', marginBottom:'0'}}>{user[0]}</h4>
                                    <div style={{width: '100%', float: 'left', marginTop:'5%'}}>
                                        <img src={src} style={{height: '50px', margin: '0 auto', borderRadius: '50%'}}></img>
                                    </div>
                                    
                                </div>
                                <div>
                                
                                    <div style={{color: '#080B3E'}}>Name: {user[1] + " " + user[2]}</div>
                                    {this.checkNull(3, "Usual Score: ")}
                                    {this.checkNull(4, "Favorite golf course played: ")}
                                    {this.checkNull(5, "Drinking on the course: ")}
                                    {this.checkNull(6, "Music on the course: ")}
                                    {this.checkNull(7, "College/School: ")}
                                    {this.checkNull(8, "Favorite Golfer: ")}
                                    {this.checkNull(9, "Favorite Team: ")}
                                    {this.checkNull(10, "Serious or casual golfer: ")}
                                    {this.checkNull(11, "Wagering on the course: ")}
                                    {this.checkNull(12, "Golf Cart or Walking: ")}
                                    {this.checkNull(13, "Description: ")}
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
        if (this.state.tee_time_info[4] === 0) {
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
            var back_url = "/course/" + this.state.tee_time_info[9];
            var time_readable = new Date(this.state.tee_time_info[1]).toLocaleString();
            var src = this.state.tee_time_info[10];
            if (src === null || src == '') {
                src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';;
            }
            return (
                <div>
                    <div style={{width: '100%', overflow: 'auto'}}>
                        <a style={{display: 'flex', marginBottom: '15px', width: '8%', marginLeft: '15%', padding: '5px', justifyContent: 'center'}} class="button4" href={back_url}>Back</a>
                    </div>
                    <div class="big_form" style={{height: 'fit-content'}}>
                        <div style={{width:'100%', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                            <div style={{float: 'left', marginRight: '5%'}}>
                                <img src={src} style={{height: '200px', margin: '0 auto'}}></img>
                            </div>
                            <div style={{float: 'left', textAlign: 'left'}}>
                                <h3>{this.state.tee_time_info[0]}</h3>
                                <h3>Time: {time_readable}</h3>
                                <h3>${this.state.tee_time_info[2]}</h3>
                                <h3>Cart Included: {this.convertBool()}</h3>
                            </div><br></br>
                        </div>
                        <div style={{clear: 'both', marginTop: '4%'}} hidden={this.state.in_time}>
                            <a class="button4" href={this.getUrl(url)} state={{user: this.state.user, course_name: this.state.tee_time_info[0], course_address: course_address, course_time: this.state.timeid}}>Book Now
                                </a>
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
