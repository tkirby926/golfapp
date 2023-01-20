import React from "react"
import "./css/MyProfileComponent.css";
import { PostViewComponent } from "./PostViewComponent";
import Chat from './photos/live-chat.jpeg'
import TimeBox from './TeeTimeBox';

export class MyProfileComponent extends React.Component {

    getProfileData() {
        fetch("/api/v1/my_prof/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ my_times: data.my_times, my_posts: data.my_posts, my_friends: data.my_friends});
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            my_times: [],
            my_posts: [],
            my_friends: [],
            user: this.props.user,
            under_width: false,
            show_time_window: true,
            show_posts_window: false,
            did_mount: false
        }
    }

    componentDidMount() {
        this.getProfileData();
        this.state.did_mount = true;
    }

    showJoinButton(post) {
        console.log(post)
        if (post[3] !== null && post[3] !=="") {
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
        if (this.state.times_booked.length === 0 && !this.state.show_linkable_times) {
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

    changeView(e, times) {
        e.preventDefault();
        if (times) {
            this.setState({show_time_window: true, show_posts_window: false});
        }
        else {
            this.setState({show_time_window: false, show_posts_window: true});
        }
    }

    directToURL(e, url) {
        e.preventDefault();
        window.location.assign(url);
    }

    directToMessanger(event, user) {
        event.preventDefault();
        window.location.assign('/messages/' + user)
    }

    showTimesWindow(width_form_a) {
        if (!this.state.under_width || (this.state.under_width && this.state.show_time_window)) {
            var box_class = 'course_box2';
            if (this.state.under_width) {
                box_class = 'course_box1';
            }
            return (
                <div style={{width: '100%', display: 'table', border: '5px solid black', borderRadius: '25px', float: 'left'}}>
                    <h3 style={{overflow: 'auto', marginLeft: '5vw'}}>My Upcoming Tee Times: </h3>
                    <div style={{display: 'block'}} hidden={this.state.my_times.length === 0}>
                    {this.state.my_times.map((time, index) => {
                        var url = '/tee_time/' + time[4];
                        console.log(time)
                        return (
                        <div onClick={(event) => this.directToURL(event, url)} class={box_class} style={{display: 'block', cursor: 'pointer', float: 'left', height: 'fit-content'}}>
                            {TimeBox.render(time)}
                        </div>
                        )
                    })}
                    </div>
                    <div style={{textAlign: 'center'}} hidden={this.state.my_times.length !== 0}>
                        <p>You have no upcoming tee times, use the below button to book a time on our homepage!</p>
                    </div>
                    <div style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center', marginBottom: '4vh'}}>
                        <a class="button4" href="/friends_times">View Friend Times/Book</a>
                    </div>
                </div>
            )
        }
    } 

    showPostsWindow() {
        if (!this.state.under_width || (this.state.under_width && this.state.show_posts_window)) {
            return (
                <div>
                    <div>
                        <PostViewComponent posts={this.state.my_posts} all_posts={false} more_posts={true} force_button={true} user = {this.state.user}/>
                    </div>
                </div>
            )
        }
    }

    showFriendsWindow(width_form_a) {
        return (
            <div style={{borderRadius: '25px', border: '5px solid black', display: 'inline-block', float:'left', width: '100%'}}>
                <h3 style={{marginLeft: '4%'}}>My Friends:</h3>
                <div hidden={this.state.my_friends.length === 0}>
                {this.state.my_friends.map((result, index) => {
                    var url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                    var name = result[1] + " " + result[2];
                        return (
                        <div class="user_button" style={{width: '80%', marginLeft: '7%', height: '4vh'}}>
                            <div style={{float: 'left', width: '72%', height: "100%"}}>
                                <a style={{fontWeight: 'bold', fontSize: 'medium', color: '#5469d4'}} href={url}>{name}<br></br></a>
                                <a style={{fontWeight: 'normal', fontSize: 'medium', color: '#5469d4'}} href={url}>{result[0]}</a>
                            </div>
                            <div style={{float: 'left', height: '100%', backgroundColor: 'white', width: '10%'}}>
                                <img src={Chat} onClick={(event) => this.directToMessanger(event, result[0])} style={{margin: 'auto', fontSize: '25px', cursor: 'pointer', height: '40px', display: 'table-cell', borderRadius: '400px', verticalAlign: 'middle', textAlign: 'center'}}></img>
                            </div>
                            <div style={{float: 'left', height: '100%', width:'12%', backgroundColor: 'white'}}>
                                <a href="/" style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'green'}}>Book Time</a>
                            </div>
                        </div>
                        )
                    })}
                    </div>
                    <div hidden={this.state.my_friends.length !== 0}>
                        <p style={{textAlign: 'center'}}>You have not added friends yet. Book tee times to meet new users, or use the search bar above to search for users!</p>
                    </div>
                <div style={{marginBottom: '4vh', width: '100%', marginTop: '10%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                    <a class="button4" style={{fontWeight: 'bold'}} href="/see_friends">See All Friends/Users</a>
                </div>    
            </div>
        )
    }

    render() {
        var width_form_a = "51%";
        var width_form_b = "47%";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form_a = "auto";
            width_form_b = "100%"
        }
        if (this.state.did_mount) {
            return (
                <div>
                    <div style={{width: '100%', justifyContent: 'center', display: 'flex'}}>
                        <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginRight: '8vw', marginBottom: '3vh'}} onClick={(event) => this.changeView(event, true)}>Tee Times</button>
                        <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginBottom: '3vh'}} onClick={(event) => this.changeView(event, false)}>My Posts/Friends</button>
                    </div>
                    <div style={{float: 'left', width: width_form_a}}>
                        {this.showTimesWindow(width_form_a)}
                        {this.showFriendsWindow(width_form_a)}
                    </div>
                    <div style={{width: width_form_b, float: 'right', display: 'block'}}>
                        {this.showPostsWindow()}
                        
                    </div>
                </div>
            )
        }
        else {
            return (0);
        }
    }
}