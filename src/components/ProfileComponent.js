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
            this.setState({ logged_user: data.logged_user, user: data.user, status: checker, tee_times: data.tee_times, friends_in_time: data.friends_in_time, posts: data.posts, has_more_posts: data.has_more_posts});
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
            friends_in_time: []
        }
        this.getUserData();
    }

    return() {
        window.location.assign(this.state.return_url);
    }

    showPosts() {
        var show_message = this.state.is_friends != 'f';
        return (
            <div>
                <PostViewComponent show_not_friends = {show_message} all_posts = {false} more_posts = {true} posts = {this.state.posts} hide_bar={true} force_button = {true}/>
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
                    <TimesViewComponent times={this.state.tee_times} friends_in_time={this.state.friends_in_time} personalized_user = {this.state.username}/>
                </div>
                )
        }
        else {
            return (
                <div style={{border: 'thick solid black', borderRadius: '40px', display: 'block', float: 'none', minHeight: '60vh'}}>
                    <p style={{marginLeft: '3vw', fontWeight: 'bold'}}>{this.state.username}'s upcoming tee times:</p>
                    <h3 style={{textAlign: 'center'}}>This user has no upcoming tee times</h3>
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
            
            return (ProfHelper.getProf(this.state.user, this.state.status))
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

