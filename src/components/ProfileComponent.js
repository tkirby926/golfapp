import React, { useState } from "react"
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserProfile from './Userprofile';
import {HeaderComponent} from './HeaderComponent';
import './css/ProfileComponent.css';
import { useCookies } from "react-cookie";
import TimeBox from "./TeeTimeBox";


export class ProfileComponent extends React.Component {

    addFriend(event) {
        if (UserProfile.checkCookie() == "null") {
            const url = '/login?return_url=' + window.location.pathname;
            window.location.assign(url);
        }
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ poster: UserProfile.checkCookie(),
                                   receiver: this.state.user[0]
            })
        };
        fetch("/api/v1/users/add_friend", requestOptions)
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ status: "p"});
        })
    }

    getUserData() {
        fetch("/api/v1/users/" + this.state.logged_user + '/' + this.state.username, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data);
            var checker = data.status;
            if (this.state.logged_user == "null") {
                checker = 'l';
            }
            this.setState({ user: data.user, status: checker, tee_times: data.tee_times, posts: data.posts, has_more_posts: data.has_more_posts});
            console.log(this.state.user[2])
        })
    }

    navigateHome(event) {
        event.preventDefault();
        window.location.assign("/")
    }

    acceptFriend(event) {
        event.preventDefault();
        fetch("/api/v1/accept_request/" + this.state.logged_user + "/" + this.state.username, { credentials: 'same-origin', method: 'POST' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({status: 'f'})
        })
    }

    goToLogin(e) {
        e.preventDefault();
        var url = 'login?return_url=' + window.location.pathname + window.location.search;
        window.location.assign(url)
    }

    seeIfFriends(is_friends) {
        if (is_friends == "f") {
            return (
                <button class="button" onClick={(event) => this.navigateHome(event)}>Book a time</button>
            )
        }
        else if (is_friends == "n") {
            return (
                <button class="button" onClick={(event) => this.addFriend(event)}>Add Friend</button>
            );
        }
        else if (is_friends == "r") {
            return (
                <button class="button" onClick={(event) => this.acceptFriend(event)}>Accept Friend Request</button>
            );
        }
        else if (is_friends == "l") {
            return (
                <button class="button" onClick={(event) => this.goToLogin(event)}>Login Here to Check Friendship Status!</button>
            );
        }
        else {
            return (
                <button class="button" disabled="true">Friend Request Pending</button>
            );
        }
    }

    constructor(props) {
        super(props)
        const params = (new URL(document.location)).searchParams;
        this.state = {
            username: params.get('user'),
            user: [],
            status: "",
            return_url: params.get('return_url'),
            posts: [],
            has_more_posts: false,
            tee_times: [],
            under_width: false,
            show_profile_window: true,
            show_posts_window: false,
            logged_user: this.props.user
        }
        this.getUserData();
    }

    checkNull(index, preface) {
        if (this.state.user[index] == "none" || this.state.user[index] == "") {
            return;
        }
        else {
            return (<div><h4 style={{fontWeight: 'bold', display: 'inline'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'inline'}}>{this.state.user[index]}</h4><br></br></div>)
        }
    } 

    return() {
        window.location.assign(this.state.return_url);
    }

    showPosts() {
        if (this.state.posts.length > 0) {
            return (
                <div>
                    {this.state.posts.map((post, index) => {
                        return (
                        <form class="form_message">
                            <p>{this.state.username}</p>
                            <p>{post[0]}</p>
                        </form>
                        )
                    })}
                </div>
                )
        }
        else {
            return (
                <div>
                    <p style={{marginLeft: '2vw'}}>This user hasn't posted yet</p>
                </div>
            )
        }
    }

    showJoinButton(i, id) {
        if (i == 0) {
            return "";
        }
        else {
            var url = "/tee_time/" + id;
            return (
                <div>
                    <a class="button2" href={url}>Join This Time</a>
                </div>
            )
        }
    }

    showTimes() {
        if (this.state.tee_times.length > 0) {
            return (
                <div>
                {this.state.tee_times.map((time, index) => {
                    const url = '/tee_time/' + time[0];
                    return (
                    <div class='course_box1'>
                        {TimeBox.render(time)}
                        <div>
                            {this.showJoinButton(index, time[0])}
                        </div>
                    </div>
                    )
                })}
                </div>
                )
        }
        else {
            return (
                <div>
                    <p style={{marginLeft: '2vw'}}>This user has no upcoming times</p>
                </div>
            )
        }
    }

    changeView(e, prof) {
        e.preventDefault();
        if (prof) {
            this.setState({show_profile_window: true, show_posts_window: false});
        }
        else {
            this.setState({show_profile_window: false, show_posts_window: true});
        }
    }

    showProf() {
        if (!this.state.under_width || (this.state.under_width && this.state.show_profile_window)) {
            return (<form class="form1" style={{lineHeight: '2'}}>
                        Name: {this.state.user[1] + " " + this.state.user[2]}
                        {this.checkNull(4, "Drinking on the course: ")}
                        {this.checkNull(5, "Usual Score: ")}
                        {this.checkNull(6, "How serious of a golfer: ")}
                        {this.checkNull(8, "School: ")}
                        {this.checkNull(7, "Description: ")}
                        {this.checkNull(8)}
                        {this.checkNull(9)}
                        <div>
                            {this.seeIfFriends(this.state.status)}
                        </div>
                    </form>)
        }
    }

    showActivity() {
        if (!this.state.under_width || (this.state.under_width && this.state.show_posts_window)) {
            return (<div><div style={{borderRadius: '25px', border: '5px solid black'}}>
                        <h4 style={{marginLeft: '2vw'}}>Recent Posts:</h4>
                        {this.showPosts()}
                    </div>
                    <div style={{borderRadius: '25px', border: '5px solid black', marginTop: '2vh'}}>
                        <h4 style={{marginLeft: '2vw'}}>Upcoming Tee Times for {this.state.username}:</h4>
                        {this.showTimes()}
                    </div></div>)
        }
    }

    render() {
        console.log(this.state.user);
        var width_form = "50%";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form = "100%";
        }
        return (
            <div style={{display: 'block'}}>
            <div>
            <div>
            <body>
                <br></br>
            <div style={{width: '100%', justifyContent: 'center', display: 'flex'}}>
                <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginRight: '8vw', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, true)}>Profile</button>
                <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, false)}>Posts/Times</button>
            </div>
            <div style={{width: width_form, float: 'left'}}>
                {this.showProf()}
            </div>
            <div style={{width: width_form, float: 'left'}}>
                {this.showActivity()}
            </div>
    </body>
                
            </div>
</div>
</div>
        )
    }

}

