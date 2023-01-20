import React from "react"
import './css/MessagingComponent.css'

export class PostViewComponent extends React.Component {

    componentWillReceiveProps(props) {
        if (!props.all_posts) {
            this.setState({all_posts: props.all_posts, posts: props.posts, more_posts: props.more_posts, 
            force_button: props.force_button, hide_bar: props.hide_bar});
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            linked_time: "",
            times_booked: [],
            has_linked_time: false,
            show_linkable_times: false,
            user: this.props.user,
            posts: [],
            has_more_posts: false,
            all_posts: this.props.all_posts,
            more_posts: this.props.more_posts,
            force_button: this.props.force_button,
            page: 0,
            user_readable: '',
            hide_bar: this.props.hide_bar
        }
        if (!this.state.all_posts) {
            this.state.posts = this.props.posts;
        }
        else {
            this.getPosts()
        }
        
    }

    showJoinButton(post) {
        if (post[3] !== null && post[3] !=="") {
            return (<div><a class="button" style={{fontSize: 'small', width: '100%'}} href={post[3]}>Join Their Time</a></div>)
        }
    }

    postPost(e) {
        if (this.state.user === "null") {
            this.setState({error: "Sign in to post"})
            return;
        }
        e.preventDefault();
        var content = document.getElementById("post").value;
        if (content === "") {
            return;
        }
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
            this.state.posts.unshift([content, this.state.user_readable, data.curtime, this.state.linked_time])
            if (this.state.more_posts && this.state.posts.length === 6) {
                this.state.posts.pop();
            }
            document.getElementById("post").value = '';
            this.forceUpdate();
        })
    }

    removeLinkedTime(e) {
        e.preventDefault();
        this.setState({linked_time: "", has_linked_time: false, show_linkable_times: false})
    }

    showUndoButton() {
        if (this.state.linked_time !== "") {
            return (<div>
                <button style={{width: '100%', height: 'auto', color: 'white'}} class='user_button_black' onClick={(event) =>this.removeLinkedTime(event)}>Remove Linked Time</button>
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
                            <button style={{width: '100%', color: 'black', padding: '0', border: 'thin solid black', cursor: 'pointer'}} class='user_button_biege' onClick={(event) =>this.changeLinkedTime(event, time_url)}>{time[1]}<br></br> {time[2]}</button>
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

    enterButton(e, zip_field) {
        e.preventDefault();
        if (e.key === "Enter") {
            this.postPost(e);
        }
    }

    getPosts() {
        if (this.state.all_posts && this.state.user !== 'null') {
            fetch("/api/v1/posts/" + this.state.user + "/" + this.state.page, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({ posts: data.posts.slice(0, 5), has_more_posts: data.has_more_posts, user_readable: data.user});
            })
        }
        else if (this.state.user !== 'null') {
            fetch("/api/v1/my_posts/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                this.setState({ posts: data.my_posts.slice(0, 5), has_more_posts: data.has_more_posts});
            })
        } 
    }

    showPosts() {
        if (this.state.posts.length > 0) {
            return (
                <div>
                <div style={{overflow: 'auto', marginBottom: '2vh', height: '65%'}}>
                    {this.state.posts.map((post, index) => {
                        var date = new Date(post[2]).toLocaleString();
                        return (
                            <form class="form_post" style={{height: '13%'}}>
                                <div style={{width: '100%', display: 'table'}}>
                                    <div style={{display: 'table-row', height: '100px'}}>
                                        <div style={{width: '70%', display: 'table-cell'}}>
                                            <p style={{lineHeight:'0', marginLeft: '15%', fontWeight: 'bold'}}>{date}</p>
                                            <p style={{fontWeight: 'bold', height: '5px'}}>{post[1]}</p>
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
                
                </div>
                )
        }
        else {
            return (
                <div>
                    <p style={{marginLeft: '4%', textAlign: 'center', fontWeight: 'bold'}}>{this.chooseMessage()}</p>
                </div>
            )
        }
    }

    chooseMessage() {
        if (this.state.user === 'null') {
            return "Sign up or log in to see posts and other GolfTribe Features!"
        }
        else if (this.state.all_posts) {
            return "No friends have posted recently. Post yourself, and add friends using the above search bar or My Friends tab in Profile!";
        }
        else if (this.state.hide_bar) {
            return "This user has not posted yet";
        }
        else {
            return "You have not posted yet. Use the above bar to post for your friends!"
        }
    }

    changeRequest(e, next) {
        if (next) {
            this.state.page = this.state.page + 1;
        }
        else {
            this.state.page = this.state.page - 1;
        }
        this.getPosts();
    }

    showMore() {
        if ((this.state.has_more_posts && this.state.more_posts) || this.state.force_button) {
            return (<div style={{marginBottom: '4vh', marginTop: '3vh', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                        <a class="button4" style={{fontWeight: 'bold'}} href="/posts">Look at all posts</a>
                    </div>)
        }
        else if (!this.state.more_posts) {
            return (<div>
                        <div style={{float: 'right', width: '10%', height: '5%'}}>
                            <div hidden={!this.state.has_more_posts}>
                                <button class='small_button' onClick={(event) => this.changeRequest(event, true)}>Next Page</button>
                            </div>
                        </div>
                        <div style={{float: 'right', width: '10%', height: '5%'}}>
                            <div hidden={this.state.page === 0}>
                                <button class='small_button' onClick={(event) => this.changeRequest(event, false)}>Prev Page</button>
                            </div>
                        </div>
                    </div>)
        }
    }

    render() {
        var bar_disp = 'block';
        var marg_top = '12vh';
        if (this.state.hide_bar) {
            bar_disp = 'none';
            marg_top = '3vh';
        }
        return (
            <div style={{borderRadius: '25px', border: '5px solid black', overflow: 'auto', minHeight: '22vh', paddingBottom: '70px', overflowX: 'hidden'}}>
            <div style={{marginTop: '5px', width: '90%', marginLeft: 'auto', marginRight: 'auto', display: bar_disp}}>
                <p style={{textAlign: 'center', fontWeight: 'bold'}}>{this.state.error}</p>
                <div style={{float: 'left', width: '11%'}}>
                    <button class='button4' style={{display: 'block', marginTop: '3px', fontSize: 'small', padding: '5px'}} onClick={(event) =>this.linkTime(event)}>
                        <button onClick={(event) => this.alertLinkedTime(event)}>&#x3f;</button><br></br> {this.isLinked()}</button>
                    <div hidden={!this.state.show_linkable_times}>
                        {this.showBookedTimes()}
                    </div>
                </div>
                <textarea maxLength="280" onKeyUp={(event) => this.enterButton(event, false)} style={{float: 'left', marginLeft: '2%', width: '70%'}} class="input2" type="text" id="post" 
                placeholder='Write A Post for Your Friends Like "Looking for a fourth player for my tee time..."' hidden={this.state.hide_search} />
                <button class='button4' style={{float: 'left', width: '11%', marginLeft: '2%', marginTop: '2%', padding: '1%'}} onClick={(event) =>this.postPost(event)}>Post</button>
            </div>
                <h4 style={{width: '100%', marginLeft: '4%', marginTop: marg_top}}>Recent Posts:</h4>
                {this.showPosts()}
            </div>
        )
    }
}