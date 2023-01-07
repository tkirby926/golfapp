import React from "react"
import UserProfile from "./Userprofile";
import './css/MessagingComponent.css'
import TimeBox from './TeeTimeBox';

export class TimesViewComponent extends React.Component {

    getFriendTimeSearch() {
        const url = "api/v1/search/friend_times/" + this.state.user + "/" + this.state.search;
        fetch(url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({friends_times: data.good_user_times, friends_in_time: data.user_friends});
        })
    }

    getFriendTeeTimes() {
        const url = "api/v1/friend_times/" + this.state.user;
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
            friends_in_time: [],
            search: "",
            user: this.props.user
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

    showMore() {
        if (this.state.friends_times.length > 4) {
            return (<div>
                <a href='/friends_times' class='button4' style={{padding: '5px', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>See all Friends' Times</a>
            </div>)
        }
    }

    showFriendsTimes() {
        if (this.state.friends_times.length > 0) {
            var class_box = "course_box1";
            if (this.props.all_component) {
                class_box = "course_box2";
            }
            return (
            <div>
            {this.state.friends_times.map((time, index) => {
                const url = '/tee_time/' + time[4];
                return(
                <div class={class_box} onClick={(event) => this.directToURL(event, url)}>
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
            {this.showMore()}
            </div>
            )
        }
        else {
            return (<div><h4>Sorry, no friends have upcoming times. Use the search bar to friend new users, 
                             or book your own time on the homepage!</h4></div>)
        }
    }

    changeSearch(e) {
        e.preventDefault();
        this.state.search = e.target.value;
        if (this.state.search == "") {
            this.getFriendTeeTimes();
        }
        else {
            this.getFriendTimeSearch();
        }
    }

    render() {
        return (
            <div>
                <input hidden={!this.props.all_component} class="input" type="text" placeholder="Filter by Specific Friends" onKeyUp={(event) => this.changeSearch(event)}></input>
                <div style={{border: 'thick solid black', borderRadius: '40px', display: 'block', float: 'none', minHeight: '60vh'}}>
                    <p style={{marginLeft: '3vw'}}>Friends with upcoming tee times:</p>
                    {this.showFriendsTimes()}
                </div>
            </div>
        )
    }
}