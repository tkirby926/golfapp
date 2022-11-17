import React from "react"
import UserProfile from './Userprofile';
import "./css/TeeTimeComponent.css";
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

    constructor(props) {
        super(props)
        this.state = {
            my_times = [],
            user: UserProfile.checkCookie()
        }
        this.getTimes();
    }

    render() {
        return (
            <div>
                <h3>My Upcoming Tee Times: </h3>
                <div style={{width: '70%', display: 'table'}}>
                    <div style={{display: 'table-row', height: '100vh'}}>
                    {this.state.my_times.map(function(time, index){
                        return (
                        <div class="course_box2" style={{display: 'table-cell'}}>
                            <div>
                                <h3 style={{marginBottom: '1px'}}>{time[4]}</h3>
                            </div>
                            <div>
                                <a style={{}}href={url}>{time[2]}</a>
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
            </div>
        )
    }
}