import React from "react"
import UserProfile from "./Userprofile";
import './css/MessagingComponent.css'

export class PostViewComponent extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            linked_time: "",
            times_booked: [],
            has_linked_time: false,
            show_linkable_times: false,
            user: UserProfile.checkCookie(),
            posts: [],
            has_more_posts: false,
            all_posts: this.props.all_posts,
            more_posts: this.props.more_posts,
            force_button: this.props.force_button
        }
        this.getPosts()
    }

    showJoinButton(post) {
        console.log(post)
        if (post[3] != null && post[3] !="") {
            return (<div><a class="button" style={{fontSize: 'small', width: '100%'}} href={post[3]}>Join Their Time</a></div>)
        }
    }

    postPost(e) {
        if (this.state.user == "null") {
            this.setState({error: "Sign in to post"})
        }
        e.preventDefault();
        var content = document.getElementById("post").value;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  user: this.state.user,
                                    content: content,
                                    link: this.state.linked_time})
        }
        fetch('/api/v1/post_post', requestOptions)
        .then(response => response.json())
        .then((data) => {
            this.setState({posts: this.state.posts.slice().unshift([this.state.user, content])})
            this.forceUpdate();
        })
    }

    removeLinkedTime(e) {
        e.preventDefault();
        this.setState({linked_time: "", has_linked_time: false, show_linkable_times: false})
    }

    showUndoButton() {
        if (this.state.linked_time != "") {
            return (<div>
                <button style={{width: '100%'}} class='button_user3' onClick={(event) =>this.removeLinkedTime(event)}>Remove Linked Time</button>
            </div>)
        } 
    }

    showBookedTimes() {
        if (this.state.times_booked.length > 0) {
            return (
            <div style={{position: 'absolute', overflow: 'visible'}}>
            {this.showUndoButton()}
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

    isLinked() {
        if (this.state.has_linked_time) {
            return (<p style={{display: 'inline'}}>Linked &#x2713;</p>)
        }
        else {
            return (<p style={{display: 'inline'}}>Link Time</p>)
        }
    }

    changeLinkedTime(e, time_url) {
        e.preventDefault();
        this.setState({linked_time: time_url, has_linked_time: true, show_linkable_times: false})
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

    enterButton(e, zip_field) {
        e.preventDefault();
        if (e.key == "Enter") {
            this.postPost(e);
        }
    }

    getPosts() {
        if (this.state.all_posts) {
            fetch("/api/v1/posts/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({ posts: data.posts, has_more_posts: data.has_more_posts});
            })
        }
        else {
            fetch("/api/v1/my_posts/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({ posts: data.my_posts, has_more_posts: data.has_more_posts});
            })
        } 
    }

    showPosts() {
        if (this.state.posts.length > 0) {
            return (
                <div>
                    {this.state.posts.slice(0, 5).map((post, index) => {
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
                    {this.showMore()}
                </div>
                )
        }
        else {
            return (
                <div>
                    <p style={{marginLeft: '4%'}}>{this.chooseMessage()}</p>
                </div>
            )
        }
    }

    chooseMessage() {
        if (this.state.all_posts) {
            return "No friends have posted recently. Post yourself and add friends using the above search bar!";
        }
        else {
            return "You have not posted yet. Use the above bar to post for your friends!"
        }
    }

    showMore() {
        if ((this.state.posts.length == 6 && this.state.more_posts) || this.state.force_button) {
            return (<div style={{marginBottom: '4vh', marginTop: '3vh', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                        <a class="button4" style={{fontWeight: 'bold'}} href="/posts">Look at all posts</a>
                    </div>)
        }
    }

    render() {
        return (
            <div style={{borderRadius: '25px', border: '5px solid black', minHeight: '30vh'}}>
            <div style={{marginTop: '5px', width: '90%', marginLeft: 'auto', marginRight: 'auto', display: 'block'}}>
                {this.state.error}
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
                <h4 style={{width: '100%', marginLeft: '4%', marginTop: '10vh'}}>Recent Posts:</h4>
                {this.showPosts()}
            </div>
        )
    }
}