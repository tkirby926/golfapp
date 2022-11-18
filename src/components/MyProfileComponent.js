import React from "react"
import UserProfile from './Userprofile';
import "./css/MyProfileComponent.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HeaderComponent } from "./HeaderComponent";

export class MyProfileComponent extends React.Component {

    getTimes() {
        fetch("/api/v1/my_times/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ my_times: data.my_times});
        })
    }

    getPosts() {
        fetch("/api/v1/my_posts/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ my_posts: data.my_posts});
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            my_times: [],
            my_posts: [],
            user: UserProfile.checkCookie()
        }
        this.getTimes();
        this.getPosts();
    }

    render() {
        return (
            <div>
                <HeaderComponent />
                <div style={{width: '62%', display: 'table', border: '5px solid black', borderRadius: '25px', height: '65vh', float: 'left'}}>
                    <h3 style={{width: '100%', overflow: 'auto', marginLeft: '5vw'}}>My Upcoming Tee Times: </h3>
                    <div style={{display: 'block'}}>
                    {this.state.my_times.map(function(time, index){
                        var url = '/tee_time/' + time[2];
                        return (
                        <div class="course_box2" style={{display: 'block', float: 'left'}}>
                            <div>
                                <h3 style={{marginBottom: '1px'}}>{time[4]}</h3>
                            </div>
                            <div>
                                <a href={url}>{time[2]}</a>
                            </div>
                            <div>
                                <h3 style={{margin: '0', paddingTop: '0'}}>Cost: ${time[1]}</h3>
                            </div>
                            <div>
                                <h3 style={{margin: '0', paddingTop: '0', marginBottom: '10px'}}>Spots: {time[3]}</h3>
                            </div>
                        </div>
                        )
                    })}
                    </div>
                </div>
                <div style={{width: '36%', border: '5px solid gray', borderRadius: '25px', float: 'right', display: 'block'}}>
                    <h3 style={{width: '100%', overflow: 'auto', marginLeft: '5vw'}}>My Most Recent Posts: </h3>
                </div>
            </div>
        )
    }
}