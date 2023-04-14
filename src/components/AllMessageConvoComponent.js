import React from "react"
import { CoursesOfferedComponent } from "./CoursesOfferedComponent"
import UserProfile from './Userprofile';
import Chat from './photos/live-chat.jpeg'

export class AllMessagesComponent extends React.Component {

    getData() {
        fetch(UserProfile.getUrl() + "/api/v1/message_previews", { credentials: 'include', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ messages_list: data.last_messages, matching_users: data.matching_users, my_friends: data.my_friends});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            messages_list: [],
            matching_users: [],
            has_rendered: false,
            under_width: false,
            message_view: true,
            my_friends: []
        }
        this.getData();
    }

    directToUrl(e, url) {
        e.preventDefault();
        window.location.assign(url);
    }

    changeView(e, messages) {
        if (messages) {
            this.setState({message_view: true})
        }
        else {
            this.setState({message_view: false})
        }
    }

    showFriendsWindow() {
        return (
            <div style={{display: 'inline-block', float:'left', width: '100%'}}>
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
                        <p style={{textAlign: 'center'}}>You have no friends that you have not already started a conversation with. Use the below button to find new users, or if you have conversations open, use the left panel to interact with those users.</p>
                    </div>
                <div style={{marginBottom: '4vh', width: '100%', marginTop: '10%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                    <a class="button4" style={{fontWeight: 'bold'}} href="/see_friends">See All Friends/Users</a>
                </div>    
            </div>
        )
    }

    render() {
        var width_form_a = "50%";
        var width_form_b = "40%";
        var m_height = "80vh";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form_a = "100%";
            width_form_b = "90%";
            m_height = "50vh";
        }
        return (<div>
            {/* <div style={{width: '100%', justifyContent: 'center', display: 'flex', marginBottom: '2%'}}>
                    <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginRight: '8vw', marginTop: '3vh'}} onClick={(event) => this.changeView(event, true)}>Conversations</button>
                    <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginTop: '3vh'}} onClick={(event) => this.changeView(event, false)}>Friends to Message</button>
            </div> */}
            <div hidden={this.state.under_width && !this.state.message_view} style={{width: width_form_a, float: 'left'}}>
                <div style={{border: 'thick solid gray', minHeight: m_height, borderRadius: '25px'}}>
                <h3 style={{textAlign: 'center'}}>Message Conversations</h3>
                {this.state.messages_list.map((user, index) => {
                    var url = '/messages?id=' + this.state.matching_users[index];
                    console.log(user)
                    return (
                        <div onClick={(event) => this.directToUrl(event, url)} class="user_button" style={{padding: '15px', margin: '0 auto', marginBottom: '1vh', cursor: 'pointer', height: 'fit-content', width: '90%'}}>
                            <div style={{float: 'left', width: '50%'}}>
                                <p style={{lineHeight: '.5'}}>{this.state.matching_users[index]}</p>
                            </div>
                            <div style={{float: 'left', width: '50%'}}>
                                <p style={{lineHeight: '.5'}}>{new Date(user[0]).toLocaleString()}</p>
                            </div>
                            <p style={{clear: 'both', color: 'gray', overflowWrap: 'break-word', display: 'inline', verticalAlign: 'top', paddingTop: '0'}}>{user[1]}</p>
                        </div>
                    );
                    })}
                    <div hidden={this.state.messages_list.length > 4 || this.state.messages_list.length == 0}>
                        <p style={{textAlign: 'center', fontWeight: 'bold'}}>You have no other text conversations</p>
                    </div>
                    <div hidden={this.state.messages_list.length != 0}>
                        <p style={{textAlign: 'center', fontWeight: 'bold'}}>You have no text conversations. </p>
                    </div>
                </div>
            </div>
            <div style={{width: width_form_b, float: 'left', marginLeft: '3%', padding: '2%', border: 'thick solid black', borderRadius: '25px', minHeight: '30vh'}}>
                {this.showFriendsWindow()}
            </div>
            <div hidden={this.state.under_width} style={{width: width_form_b, float: 'left', marginLeft: '3%', padding: '2%', border: 'thick solid black', borderRadius: '25px', minHeight: '35vh'}}>
                <CoursesOfferedComponent />
            </div>
        </div>)
    }
}