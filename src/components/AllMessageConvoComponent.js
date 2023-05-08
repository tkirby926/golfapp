import React from "react"
import { CoursesOfferedComponent } from "./CoursesOfferedComponent"
import UserProfile from './Userprofile';
import Chat from './photos/live-chat.jpeg'
import ProfHelper from "./ProfHelper";

export class AllMessagesComponent extends React.Component {

    getData() {
        fetch(UserProfile.getUrl() + "/api/v1/message_previews", { credentials: 'include', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ messages_list: data.last_messages, matching_users: data.matching_users, my_friends: data.my_friends, last_unread: data.last_unread, spinner: false});
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
            my_friends: [],
            last_unread: [],
            spinner: true
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
        if (!this.state.spinner) {
            return ProfHelper.showFriendsWindow(this.state.my_friends, this.state.under_width, this.state.user)
        }
        else {
            return (<div style={{display: 'inline-block', float:'left', width: '98%', marginLeft: '1%'}}>
                        <h3 style={{marginLeft: '4%'}}>My Friends:</h3>
                    </div>)
        }
    }

    render() {
        var width_form_a = "50%";
        var width_form_b = "48%";
        var m_height = "80vh";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form_a = "100%";
            width_form_b = "100%";
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
                <div class="loading-spinner" style={{margin: '0 auto', clear: 'both', marginTop: '50px'}} hidden={!this.state.spinner}></div>
                {this.state.messages_list.map((user, index) => {
                    var url = '/messages?id=' + this.state.matching_users[index];
                    console.log(user)
                    return (
                        <div onClick={(event) => this.directToUrl(event, url)} class="user_button" style={{padding: '15px', display: 'inherit', margin: '0 auto', marginBottom: '1vh', cursor: 'pointer', height: 'fit-content', width: '90%'}}>
                            <div style={{float: 'left', width: '10%'}}>

                            </div>
                            <div style={{float: 'left', width: '45%'}}>
                                <p style={{lineHeight: '.5', float:'left'}}>{this.state.matching_users[index]}</p>
                                <p class="button4" style={{float:'left', marginLeft: '5%'}} hidden={!this.state.last_unread[index]}>New Message</p>
                            </div>
                            <div style={{float: 'left', width: '55%'}}>
                                <p style={{lineHeight: '.5'}}>{new Date(user[0]).toLocaleString()}</p>
                            </div>
                            <p style={{clear: 'both', color: 'gray', overflowWrap: 'break-word', display: 'inline', verticalAlign: 'top', paddingTop: '0'}}>{user[1]}</p>
                        </div>
                    );
                    })}
                    <div hidden={this.state.messages_list.length > 4 || this.state.messages_list.length == 0}>
                        <p style={{textAlign: 'center', fontWeight: 'bold'}}>You have no other text conversations</p>
                    </div>
                    <div hidden={this.state.messages_list.length != 0 || this.state.spinner}>
                        <p style={{textAlign: 'center', fontWeight: 'bold'}}>You have no text conversations. </p>
                    </div>
                </div>
            </div>
            <div style={{float: 'left', width: width_form_b}}>
                {this.showFriendsWindow()}
                <div class="loading-spinner" style={{margin: '0 auto', clear: 'both', marginTop: '50px'}} hidden={!this.state.spinner}></div>
                <div hidden={this.state.under_width} style={{width: '95%', float: 'left', marginLeft: '3%', padding: '2%', minHeight: '35vh', borderTop: 'thick solid black'}}>
                <CoursesOfferedComponent />
            </div>
            </div>
            
        </div>)
    }
}