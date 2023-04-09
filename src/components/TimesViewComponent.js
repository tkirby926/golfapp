import React from "react"
import './css/MessagingComponent.css'
import TimeBox from './TeeTimeBox';
import UserProfile from './Userprofile';

export class TimesViewComponent extends React.Component {

    getFriendTimeSearch() {
        const url = "/api/v1/search/friend_times/" + this.state.user + "/" + this.state.search;
        fetch(UserProfile.getUrl() + url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({friends_times: data.good_user_times, friends_in_time: data.user_friends});
        })
    }

    getFriendTeeTimes() {
        const url = "/api/v1/friend_times/" + this.state.user;
        fetch(UserProfile.getUrl() + url, { credentials: 'same-origin', method: 'GET' })
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
            friends_times: this.props.times,
            friends_in_time: this.props.friends_in_time,
            search: "",
            user: this.props.user,
            personalized: this.props.personalized_user != undefined,
            personalized_user: this.props.personalized_user
        }
        if (this.state.friends_times === undefined) {
            this.state.personalized = false;
            this.state.friends_times = [];
            this.state.friends_in_time = [];
            this.getFriendTeeTimes();
        }
    }

    showJoinButton(i, id) {
        if (i === 0) {
            return "";
        }
        else {
            var url = "/tee_time/" + id;
            return (
                <div>
                    <a class="button4" href={url}>Join This Time</a>
                </div>
            )
        }
    }

    directToURL(e, url) {
        e.preventDefault();
        window.location.assign(url)
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
                            if (index1 === 0) {
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
                    <div style={{marginTop: '2%'}}>
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
            return (<form class='form'><h4>Sorry, no friends have upcoming times. Use the search bar to friend new users, 
                             or book your own time on the homepage!</h4></form>)
        }
    }

    changeSearch(e) {
        e.preventDefault();
        this.state.search = e.target.value;
        if (this.state.search === "") {
            this.getFriendTeeTimes();
        }
        else if (this.state.search.length > 2) {
            this.getFriendTimeSearch();
        }
    }

    render() {
        var text = 'Friends with upcoming tee times:';
        if (this.state.personalized) {
            text = this.state.personalized_user + "'s upcoming tee times:"
        }
        return (
            <div>
                <input hidden={!this.props.all_component} class="input" type="text" placeholder="Filter by Specific Friends" onKeyUp={(event) => this.changeSearch(event)}></input>
                <div style={{ display: 'block', float: 'none', minHeight: '60vh'}}>
                    <p style={{marginLeft: '3vw', fontWeight: 'bold'}}>{text}</p>
                    {this.showFriendsTimes()}
                </div>
            </div>
        )
    }
}