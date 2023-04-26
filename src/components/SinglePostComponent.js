import React from "react"
import './css/MessagingComponent.css'
import UserProfile from './Userprofile';

export class SinglePostComponent extends React.Component {

    postComment(e) {
        e.preventDefault();
        var content = document.getElementById("comment").value;
        if (content === "") {
            return;
        }
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                                    postid: this.state.pid,
                                    content: content
                                    })
        }
        fetch(UserProfile.getUrl() + '/api/v1/post_comment', requestOptions)
        .then(response => response.json())
        .then((data) => {
            // this.state.comments.unshift([content, this.state.user_readable, data.curtime])
            // if (this.state.more_posts && this.state.posts.length === 6) {
            //     this.state.posts.pop();
            // }
            document.getElementById("comment").value = '';
            this.forceUpdate();
        })
    }


    getPostInfo() {
        fetch(UserProfile.getUrl() + "/api/v1/single_post/" + this.state.pid, { credentials: 'include', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ post: data.post, comments: data.comments});
        })
    }

    showJoinButton() {
        if (this.state.post[3] !== null && this.state.post[3] !=="") {
            return (<div><a class="button" style={{fontSize: 'small', width: '100%', color: '#0E2F04', backgroundColor: 'white'}} href={this.state.post[3]}>Join Their Time</a></div>)
        }
    }

    enterButton(e, zip_field) {
        e.preventDefault();
        if (e.key === "Enter") {
            this.postComment(e);
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            post: [],
            comments: [],
            pid: window.location.href.split('/').pop()
        }
    }

    componentDidMount() {
        this.getPostInfo();
    }

    render() {
        this.state.under_width = false;
        var width = '50%';
        var wid = ['70%', '10%'];
        var wid_inp = ['']
        var date = new Date(this.state.post[2]).toLocaleString();
        var src = this.state.post[4] != '' ? this.state.post[4] : 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width = '100%';
            wid = ['65%', '15%'];
        }
        return (
        <div>
            <div style={{width: width}}>
            <form class="user_button_inv" style={{height: '13%', marginLeft: 'inherit', padding: '2%'}}>
                <div style={{display: 'table'}}>
                    <div style={{display: 'table-row', height: '100px'}}>
                        <div style={{width: wid[1], display: 'table-cell', verticalAlign: 'middle'}}>
                            <img style={{borderRadius: '50%', height: '70px', border: 'thin solid white'}} src={src}></img>
                        </div>
                        <div style={{width: wid[0], display: 'table-cell'}}>
                            <p style={{lineHeight:'0', fontWeight: 'bold'}}>{date}</p>
                            <p style={{fontWeight: 'bold', height: '5px'}}>{this.state.post[1]}</p>
                            <p>{this.state.post[0]}</p>
                        </div>
                        <div style={{display: 'table-cell', width: '10%'}}> 
                            {this.showJoinButton()}
                        </div>
                    </div>
                </div>
            </form>
            <div class="button4_inv" style={{width: '80%', marginTop: '1%'}}>
            <textarea maxLength="280" onKeyUp={(event) => this.enterButton(event, false)} style={{float: 'left', marginLeft: '2%', width: '60%'}} class="input2" type="text" id="comment" 
                placeholder="Add a comment to this user's post" hidden={this.state.hide_search} />
                <button class='button4' style={{float: 'left', width: '11%', marginLeft: '2%', marginTop: '2%', padding: '1%'}} onClick={(event) =>this.postComment(event)}>Post</button>
                <h3 style={{clear: 'both', marginTop: '12%'}}>Comments:</h3>
                <div hidden={this.state.comments.length != 0} class="button4_inv" style={{width: '60%'}}>No comments have been made on this post yet.</div>
                {this.state.comments.map((comment, index) => {
                    var src_com = comment[2] != '' ? comment[2] : 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
                    return (
                        <div style={{display: 'table-row', height: '100px'}}>
                        <div style={{width: wid[1], display: 'table-cell', verticalAlign: 'middle'}}>
                            <img style={{borderRadius: '50%', height: '70px', border: 'thin solid white'}} src={src_com}></img>
                        </div>
                        <div style={{width: wid[0], display: 'table-cell'}}>
                            <p style={{lineHeight:'0', fontWeight: 'bold'}}>{date}</p>
                            <p style={{fontWeight: 'bold', height: '5px'}}>{comment[1]}</p>
                            <p>{comment[0]}</p>
                        </div>
                    </div>
                    )
                })
                }
            </div>
            </div>
        </div>
        )
    }

}