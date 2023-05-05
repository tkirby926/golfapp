import React from "react"
import './css/ProfileComponent.css';
import { PostViewComponent } from "./PostViewComponent";
import { TimesViewComponent } from "./TimesViewComponent";
import ProfHelper from "./ProfHelper";
import UserProfile from './Userprofile';


export class ProfileComponent extends React.Component {

    addFriend(event) {
        if (this.state.logged_user === false) {
            const url = '/login?return_url=' + window.location.pathname;
            window.location.assign(url);
        }
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ poster: this.state.logged_user,
                                   receiver: this.state.user[0]
            })
        };
        fetch(UserProfile.getUrl() + "/api/v1/users/add_friend", requestOptions)
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
        fetch(UserProfile.getUrl() + "/api/v1/users/friendship/" + this.state.username, { credentials: 'include', method: 'GET'})
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            if (data.logged_user === true) {
                window.location.assign('/my_profile');
            }
            var checker = data.status;
            if (data.logged_user === false) {
                checker = 'l';
            }
            this.setState({ logged_user: data.logged_user, user: data.user, status: checker, tee_times: data.tee_times, posts: data.posts, has_more_posts: data.has_more_posts});
            console.log(this.state.user[2])
        })
    }

    navigate(event, url) {
        event.preventDefault();
        window.location.assign(url);
    }

    acceptFriend(event) {
        event.preventDefault();
        fetch(UserProfile.getUrl() + "/api/v1/accept_request/" + this.state.username, { credentials: 'include', method: 'POST' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({status: 'f'})
        })
    }

    cancelRequest(event) {
        event.preventDefault();
        fetch(UserProfile.getUrl() + "/api/v1/cancel_request/" + this.state.username, { credentials: 'include', method: 'DELETE' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({status: 'n'})
        })
    }

    goToLogin(e) {
        e.preventDefault();
        var url = 'login?return_url=' + window.location.pathname + window.location.search;
        window.location.assign(url)
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
            logged_user: this.props.user,
        }
        this.getUserData();
    }

    return() {
        window.location.assign(this.state.return_url);
    }

    showPosts() {
        var show_message = this.state.is_friends != 'f';
        var is_logged = this.state.status != 'l';
        return (
            <div>
                <PostViewComponent user={is_logged} show_not_friends = {show_message} all_posts = {false} more_posts = {true} posts = {this.state.posts} hide_bar={true} force_button = {true}/>
            </div>
            )
    }

    showJoinButton(i, id) {
        if (i === 0) {
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

    seeIfFriends(is_friends) {
        if (is_friends === "f") {
            var message_url = '/messages?id=' + this.state.user[0];
            return (
                <div style={{marginTop: '3vh'}}>
                    <button class="button" style={{float: 'left', width: '40%'}} onClick={(event) => this.navigate(event, '/')}>Book a time</button>
                    <button class="button" style={{float: 'left', width: '40%', marginLeft: '10%'}} onClick={(event) => this.navigate(event, message_url)}>Send Message</button>
                </div>
            )
        }
        else if (is_friends === "n") {
            return (
                <button class="button" onClick={(event) => this.addFriend(event, this.state.user[0])}>Add Friend</button>
            );
        }
        else if (is_friends === "r") {
            return (
                <button class="button" onClick={(event) => this.acceptFriend(event)}>Accept Friend Request</button>
            );
        }
        else if (is_friends === "l") {
            return (
                <button class="button" onClick={(event) => this.goToLogin(event)}>Login Here to Check Friendship Status!</button>
            );
        }
        else {
            return (
                <button class="button" onClick={(event) => this.cancelRequest(event)}>Cancel Friend Request</button>
            );
        }
    }

    showTimes() {
        if (this.state.is_friends != 'f') {
            <div style={{border: 'thick solid black', borderRadius: '40px', display: 'block', float: 'none', minHeight: '60vh'}}>
                    <p style={{marginLeft: '3vw', fontWeight: 'bold'}}>{this.state.username}'s upcoming tee times:</p>
                    <h3 style={{textAlign: 'center'}}>Add this user as a friend to see their upcoming tee times</h3>
                </div>
        }
        if (this.state.tee_times.length > 0) {
            return (
                <div>
                    <TimesViewComponent times={this.state.tee_times} friends_in_time={null} personalized_user = {this.state.username}/>
                </div>
                )
        }
        else {
            return (
                <div style={{border: 'thick solid black', borderRadius: '40px', display: 'block', float: 'none', minHeight: '60vh'}}>
                    <p style={{marginLeft: '3vw', fontWeight: 'bold'}}>{this.state.username}'s upcoming tee times:</p>
                    <h3 hidden={this.state.status == 'l'}style={{textAlign: 'center'}}>This user has no upcoming tee times</h3>
                    <h3 hidden={this.state.status != 'l'} style={{textAlign: 'center'}}>Login to check friendship status</h3>
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
            var src = this.state.user[15];
            if (this.state.user[15] === null || this.state.user[15] === '') {
                src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
            }
            return (
            <form class="form1" style={{lineHeight: '2', paddingBottom: '10vh'}}>
                            <img src={src} style={{borderRadius: '50%', height: '200px', margin: '0 auto', display: 'block'}}></img><br></br>
                            <h4 style={{fontWeight: 'bold', fontSize: '20px', lineHeight: '1px', textAlign: 'center'}}>{this.state.user[1] + " " + this.state.user[2]}</h4>
                            {this.checkNull(this.state.user, 4, "Usual Score: ")}
                            {this.checkNull(this.state.user, 5, "Favorite golf course played: ")}
                            {this.checkNull(this.state.user, 6, "Drinking on the course: ")}
                            {this.checkNull(this.state.user, 7, "Music on the course: ")}
                            {this.checkNull(this.state.user, 8, "Favorite Golfer: ")}
                            {this.checkNull(this.state.user, 9, "Favorite Team: ")}
                            {this.checkNull(this.state.user, 10, "College/School: ")}
                            {this.checkNull(this.state.user, 11, "Serious or casual golfer: ")}
                            {this.checkNull(this.state.user, 13, "Wagering on the course: ")}
                            {this.checkNull(this.state.user, 14, "Golf Cart or Walking: ")}
                            {this.checkNull(this.state.user, 12, "Description: ")}
                            <div>
                                {this.seeIfFriends(this.state.status)}
                            </div>
                        </form>
            )
        }
    }

    navigate(event, url) {
        event.preventDefault();
        window.location.assign(url);
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

    showActivity() {
        if (!this.state.under_width || (this.state.under_width && this.state.show_posts_window)) {
            return (<div><div style={{minHeight: '30vh'}}>
                        {this.showPosts()}
                    </div>
                    <div style={{minHeight: '30vh'}}>
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
                <button hidden={!this.state.under_width} class="button4" style={{float: 'left', padding: '5px', marginRight: '8vw', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, true)}>Profile</button>
                <button hidden={!this.state.under_width} class="button4" style={{float: 'left', padding: '5px', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, false)}>Posts/Times</button>
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

