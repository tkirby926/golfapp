import React from "react"
import UserProfile from "./Userprofile";
import './css/MessagingComponent.css'
import TimeBox from './TeeTimeBox';

export class TimesViewComponent extends React.Component {

    getFriendTeeTimes() {
        const url = "api/v1/friend_times/" + UserProfile.checkCookie();
        fetch(url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({friends_times: data.good_user_times, friends_in_time: data.user_friends});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            friends_times: [],
            friends_in_time: []
        }
        this.getFriendTeeTimes()
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

    showFriendsTimes() {
        if (this.state.friends_times.length > 0) {
            return (
            <div>
            {this.state.friends_times.map((time, index) => {
                const url = '/tee_time/' + time[4];
                return(
                <div class='course_box1' onClick={(event) => this.directToURL(event, url)}>
                    {TimeBox.render(time)}
                    <div>
                        {this.state.friends_in_time[index].map((friend, index1) => {
                            console.log(friend)
                            var name = friend[0] + " " + friend[1];
                            if (index1 == 0) {
                                return (
                                    <p style={{display: 'inline'}}>{name}</p>
                                )
                            }
                            else {
                                return (
                                    <p style={{display: 'inline'}}>, {name}</p>
                                )
                            }
                        })}
                        <p style={{display: 'inline'}}> is booked for this time</p>
                    </div>
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
            return (<div><h4>Sorry, no friends have upcoming times. Use the search bar to friend new users, 
                             or book your own time on the homepage!</h4></div>)
        }
    }

    render() {
        return (
            <div style={{border: 'thick solid black', borderRadius: '40px', display: 'block', float: 'none', minHeight: '60vh'}}>
                <p style={{marginLeft: '3vw'}}>Friends with upcoming tee times:</p>
                {this.showFriendsTimes()}
            </div>
        )
    }
}