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
                    <div style={{marginTop: '5px', width: '90%', marginLeft: 'auto', marginRight: 'auto', display: 'block'}}>
                        <div style={{float: 'left', width: '11%'}}>
                            <button class='button4' style={{display: 'block', marginTop: '3px', fontSize: 'small'}} onClick={(event) =>this.linkTime(event)}>
                                <button onClick={(event) => this.alertLinkedTime(event)}>&#x3f;</button> {this.isLinked()}</button>
                            <div hidden={!this.state.show_linkable_times}>
                                {this.showBookedTimes()}
                            </div>
                        </div>
                        <textarea maxLength="280" onKeyUp={(event) => this.enterButton(event, false)} style={{float: 'left', marginLeft: '2%', width: '70%'}} class="input2" type="text" id="post" 
                        placeholder='Write A Post for Your Friends Like "Looking for a fourth player for our tee time..."' hidden={this.state.hide_search} />
                        <button class='button4' style={{float: 'left', width: '11%', marginLeft: '2%', marginTop: '2%'}} onClick={(event) =>this.postPost(event)}>Post</button>
                    </div>
                    <h3 style={{width: '100%', overflow: 'auto', marginLeft: '5vw'}}>My Most Recent Posts: </h3>
                    {this.showPosts()}
                </div>
            </div>
        )
    }
}