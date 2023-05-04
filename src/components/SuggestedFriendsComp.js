import React from "react"
import './css/ProfileComponent.css';
import { PostViewComponent } from "./PostViewComponent";
import { TimesViewComponent } from "./TimesViewComponent";
import ProfHelper from "./ProfHelper";
import UserProfile from './Userprofile';


export class SuggestedFriendsComponent extends React.Component {

    addFriend(event, username, index) {
        if (this.state.logged_user === false) {
            const url = '/login?return_url=' + window.location.pathname;
            window.location.assign(url);
        }
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                                   receiver: username
            })
        };
        fetch(UserProfile.getUrl() + "/api/v1/users/add_friend", requestOptions)
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data);
            this.state.user_status[index] = 'p';
            this.forceUpdate();
        })
    }

    cancelRequest(event, username, index) {
        event.preventDefault();
        fetch(UserProfile.getUrl() + "/api/v1/cancel_request/" + username, { credentials: 'include', method: 'DELETE' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.state.user_status[index] = 'n';
            this.forceUpdate()
        })
    }

    getUsers(page) {
        this.setState({is_visible: false})
        fetch(UserProfile.getUrl() + "/api/v1/suggested_friends/" + page, { credentials: 'include', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                this.setState({suggested_users: data.suggested_friends, page: page, is_visible: true});
            })
    }


    constructor(props) {
        super(props);
        this.state = {
            suggested_users: [],
            page: 0,
            user_status: ['n', 'n', 'n'],
            is_visible: false
        }
    }

    componentDidMount() {
        this.getUsers(this.state.page);
    }

    navigate(event, url) {
        event.preventDefault();
        window.location.assign(url);
    }

    seeIfFriends(username, is_friends, index) {
        if (is_friends === "f") {
            var message_url = '/messages?id=' + username;
            return (
                <div style={{marginTop: '3vh'}}>
                    <button class="button" style={{float: 'left', width: '40%'}} onClick={(event) => this.navigate(event, '/')}>Book a time</button>
                    <button class="button" style={{float: 'left', width: '40%', marginLeft: '10%'}} onClick={(event) => this.navigate(event, message_url)}>Send Message</button>
                </div>
            )
        }
        else if (is_friends === "n") {
            return (
                <button class="button" onClick={(event) => this.addFriend(event, username, index)}>Add Friend</button>
            );
        }
        else {
            return (
                <button class="button" onClick={(event) => this.cancelRequest(event, username, index)}>Cancel Friend Request</button>
            );
        }
    }

    checkNull(user, index, preface) {
        if (user[index] === "none" || user[index] === "" || user[index] === null || user[index] === undefined) {
            return;
        }
        else {
            if (index == 4 || index == 6 || index == 7 || index == 11 || index == 13 || index == 14) {
                return (<div><h4 style={{fontWeight: 'bold', display: 'inline'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'inline'}}>{ProfHelper.getAns(index, user[index])}</h4></div>)
            }
            return (<div><h4 style={{fontWeight: 'bold', display: 'inline'}}>{preface}</h4><h4 style={{fontWeight: 'normal', display: 'inline'}}>{user[index]}</h4></div>)
        }
    } 

    getProf(user, status, index) {
        var src = user[15];
        if (user[15] === null || user[15] === '') {
            src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
        }
        return (
            <div>
        {this.state.is_visible && <form class="fade_form1" style={{lineHeight: '2', paddingBottom: '10vh'}}>
                        <img src={src} style={{borderRadius: '50%', height: '200px', margin: '0 auto', display: 'block'}}></img><br></br>
                        <h4 style={{fontWeight: 'bold', fontSize: '20px', lineHeight: '1px', textAlign: 'center'}}>{user[1] + " " + user[2]}</h4>
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
                        <div>
                            {this.seeIfFriends(user[0], status, index)}
                        </div>
                    </form>}
                    </div>
                    
        )
    }

    render() {
        var display = 'flex';
        if (window.innerWidth < 850) {
            display = 'block';
        }
        return (
        <div>
            <div class="user_button_biege" style={{textAlign: 'center', margin: '0 auto', width: '80%', color: 'black', paddingTop: '20px', paddingBottom: '20px'}}>
                <h3>Friend Suggestions: </h3>
                <h4>Based on your profile preferences and location setting, here are some suggestions for people you might like to book teetimes with!</h4>
            </div>
            <div style={{margin: '0 auto', width: '100%'}}>
                <div style={{float: 'left', display: display, marginBottom: '5vh', marginTop: '3vh'}}>
                    {this.state.suggested_users.map((user, index) => {
                        return this.getProf(user, this.state.user_status[index], index);
                    })}       
                </div>
                <div hidden={this.state.suggested_users.length > 0} style={{clear: 'both'}}>
                        <h4 style={{margin: '0 auto', display: 'block', width: '55%', textAlign: 'center'}} class="form">There's no users in your area that you are not already friends with or have requested to be friends with</h4>
                    </div>
            </div>
            <button class="button4" disabled={this.state.suggested_users.length != 3} onClick={(event) => this.getUsers(this.state.page + 1)} style={{clear: 'both', width: '20%', display: 'flex', flex: 1, justifyContent: 'center', margin: '20px auto'}}>Refresh Users</button>
        </div>)
    }

}