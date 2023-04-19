import React from "react"
import "./css/TeeTimeComponent.css";
import { BrowserRouter as Link } from 'react-router-dom';
import UserProfile from './Userprofile';
import ProfHelper from "./ProfHelper";

export class TeeTimeComponent extends React.Component {

    getTimeInfo() {
        fetch(UserProfile.getUrl() + "/api/v1/teetime/" + this.state.timeid, { credentials: 'include', method: 'GET' })
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
            in_time: false,
            under_width: false
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

    checkNull(user, index, preface) {
        if (user[index] === "none" || user[index] === "" || user[index] === null || user[index] === undefined) {
            return;
        }
        else {
            if (index == 4 || index == 6 || index == 7 || index == 11 || index == 13 || index == 14) {
                return (<div><h4 style={{fontWeight: 'bold', display: 'inline'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'inline'}}>{ProfHelper.getAns(index, user[index])}</h4><br></br></div>)
            }
            return (<div><h4 style={{fontWeight: 'bold', display: 'inline'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'inline'}}>{user[index]}</h4><br></br></div>)
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
                        var src = user[15];
                        if (src === null) {
                            src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
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
                                    {this.checkNull(user, 4, "Usual Score: ")}
                                    {this.checkNull(user, 5, "Favorite golf course played: ")}
                                    {this.checkNull(user, 6, "Drinking on the course: ")}
                                    {this.checkNull(user, 7, "Music on the course: ")}
                                    {this.checkNull(user, 8, "Favorite Golfer: ")}
                                    {this.checkNull(user, 9, "Favorite Team: ")}
                                    {this.checkNull(user, 10, "College/School: ")}
                                    {this.checkNull(user, 11, "Serious or casual golfer: ")}
                                    {this.checkNull(user, 13, "Wagering on the course: ")}
                                    {this.checkNull(user, 14, "Golf Cart or Walking: ")}
                                    {this.checkNull(user, 12, "Description: ")}
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
        var form_wid = '60%';
        var pic_height = '200px';
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            form_wid = '80%';
            pic_height = '130px';
        }
        if (this.state.tee_time_info.length > 0) {
            var course_address = this.state.tee_time_info[6] + ", " + this.state.tee_time_info[7] + ", " 
                                + this.state.tee_time_info[8] + " " + this.state.tee_time_info[9];
            var url = "/checkout/" + this.state.timeid
            var back_url = "/course/" + this.state.tee_time_info[9];
            var date = new Date(this.state.tee_time_info[1])
            var date_readable = date.toLocaleDateString();
            console.log(date_readable)
            var time_readable = date.toLocaleString([], {hour: '2-digit', minute:'2-digit'});
            var src = this.state.tee_time_info[10];
            if (src === null || src == '') {
                src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';;
            }
            return (
                <div>
                    <div style={{width: '100%', overflow: 'auto'}}>
                        <a style={{display: 'flex', marginBottom: '15px', width: '8%', marginLeft: '15%', padding: '5px', justifyContent: 'center'}} class="button4" href={back_url}>Back</a>
                    </div>
                    <div class="big_form" style={{height: 'fit-content', width: form_wid}}>
                        <div style={{width:'100%', display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                            <div style={{float: 'left', marginRight: '5%'}}>
                                <img src={src} style={{height: pic_height, margin: '0 auto'}}></img>
                            </div>
                            <div style={{float: 'left', textAlign: 'left'}}>
                                <h3>{this.state.tee_time_info[0]}</h3>
                                <h3 style={{color: '#4F4F4F', display: 'inline'}}>Date: </h3><h3 style={{display: 'inline'}}>{date_readable}</h3><br></br>
                                <h3 style={{color: '#4F4F4F', display: 'inline'}}>Time: </h3><h3 style={{display: 'inline'}}>{time_readable}</h3><br></br>
                                <h3 style={{color: '#4F4F4F', display: 'inline'}}>Cost: </h3><h3 style={{display: 'inline'}}>${this.state.tee_time_info[2]}</h3><br></br>
                                <h3 style={{color: '#4F4F4F', display: 'inline'}}>Cart Included: </h3><h3 style={{display: 'inline'}}>{this.convertBool()}</h3><br></br>
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
