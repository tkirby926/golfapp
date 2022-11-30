import React from "react"
import UserProfile from './Userprofile';
import "./css/MyProfileComponent.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HeaderComponent } from "./HeaderComponent";
import { PostViewComponent } from "./PostViewComponent";

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

    getFriends() {
        fetch("/api/v1/my_friends/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ my_friends: data.my_friends});
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            my_times: [],
            my_posts: [],
            my_friends: [],
            user: UserProfile.checkCookie()
        }
        this.getTimes();
        this.getPosts();
        this.getFriends();
    }

    showJoinButton(post) {
        console.log(post)
        if (post[3] != null && post[3] !="") {
            return (<div><a class="button" style={{fontSize: 'small', width: '100%'}} href={post[3]}>Join Their Time</a></div>)
        }
    }

    alertLinkedTime(e) {
        e.preventDefault();
        alert("The Link Time Feature allows your posts to include a button linking to the tee time you are talking about in your post." + 
        "That way you can ask your friends about a particular time while allowing them to immediately click a button and join it. Posts can be made without a linked teetime.")
    }

    linkTime(e) {
        e.preventDefault();
        if (this.state.times_booked.length == 0 && !this.state.show_linkable_times) {
            fetch("/api/v1/booked_times/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({ times_booked: data.times_booked});
            })
        }
        this.setState({ show_linkable_times: !this.state.show_linkable_times});
    }

    isLinked() {
        if (this.state.has_linked_time) {
            return (<p style={{display: 'inline'}}>Linked &#x2713;</p>)
        }
        else {
            return (<p style={{display: 'inline'}}>Link Time</p>)
        }
    }

    showPosts() {
        if (this.state.my_posts.length > 0) {
            return (
                <div>
                    {this.state.my_posts.map((post, index) => {
                        return (
                            <form class="form_post">
                                <div style={{width: '100%', display: 'table'}}>
                                    <div style={{display: 'table-row', height: '100px'}}>
                                        <div style={{width: '70%', display: 'table-cell'}}>
                                            <p style={{fontWeight: 'bold'}}>{post[1]}</p>
                                            <p>{post[0]}</p>
                                        </div>
                                        <div style={{display: 'table-cell', width: '10%'}}> 
                                            {this.showJoinButton(post)}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )
                    })}
                </div>
                )
        }
        else {
            return (
                <div>
                    <p style={{marginLeft: '4%'}}>You haven't posted yet, post using the above bar!</p>
                </div>
            )
        }
    }

    showBookedTimes() {
        if (this.state.times_booked.length > 0) {
            return (
            <div style={{position: 'absolute', overflow: 'visible'}}>
            {this.state.times_booked.map((time, index) => {
                const time_url = '/tee_time/' + time[0];
                return (<div>
                            <button style={{width: '100%'}} class='button_user3' onClick={(event) =>this.changeLinkedTime(event, time_url)}>{time[1]}<br></br> {time[2]}</button>
                        </div>)
            })}
            </div>
            )
        }
        else {
            return <div class="requests" style={{marginTop: '15px'}}>No upcoming times booked</div>
        }
    }

    render() {
        return (
            <div>
                <HeaderComponent />
                <div style={{width: '51%', display: 'table', border: '5px solid black', borderRadius: '25px', height: '65vh', float: 'left'}}>
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
                <div style={{width: '47%', float: 'right', display: 'block'}}>
                    <div>
                        <PostViewComponent all_posts={false} more_posts={true} force_button={true}/>
                    </div>
                    <div style={{borderRadius: '25px', border: '5px solid black', display: 'inline-block', width: '98%'}}>
                        <h3>My Friends:</h3>
                        {this.state.my_friends.map((result, index) => {
                            var url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                            var name = result[1] + " " + result[2];
                                return (
                                <div style={{width: '90%', margin: 'auto', marginTop: '3px', marginLeft: '6%'}}>
                                    <div style={{borderBottom: 'thick solid black', float: 'left', width: '80%'}}>
                                        <a class='button_user1' style={{fontWeight: 'bold'}} href={url}>{name}</a>
                                        <a class='button_user1' style={{fontSize: '12px'}} href={url}>{result[0]}</a>
                                    </div>
                                    <div style={{borderBottom: 'thick solid black', paddingRight: '15px', float: 'left', height: '40px', backgroundColor: 'white'}}>
                                        <img src="" onClick={(event) => this.directToMessanger(event, result[0])} style={{margin: 'auto', fontSize: '25px', cursor: 'pointer', height: '40px', width: '30px', display: 'table-cell', borderRadius: '400px', verticalAlign: 'middle', textAlign: 'center'}}></img>
                                    </div>
                                    <div style={{borderBottom: 'thick solid black', float: 'left', height: '40px', width:'12%', backgroundColor: 'white'}}>
                                        <a href="/" style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'green'}}>Book Time</a>
                                    </div>
                                </div>
                                )
                            })}
                        <div style={{marginBottom: '4vh', marginTop: '3vh', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                            <a class="button4" style={{fontWeight: 'bold'}} href="/see_friends">Search Users</a>
                        </div>    
                    </div>
                </div>
            </div>
        )
    }
}