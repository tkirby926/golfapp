import React from "react"
import { CoursesOfferedComponent } from "./CoursesOfferedComponent"
import UserProfile from './Userprofile';

export class AllMessagesComponent extends React.Component {

    getData() {
        fetch(UserProfile.getUrl() + "/api/v1/message_previews/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ messages_list: data.last_messages, matching_users: data.matching_users});
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
            message_view: true
        }
    }

    componentDidMount() {
        this.state.has_rendered = true;
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

    render() {
        if (!this.state.has_rendered) {
            return (0)
        }
        var width_form_a = "50%";
        var width_form_b = "40%";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form_a = "100%";
            width_form_b = "90%";
        }
        else {
            return (<div>
                <div style={{width: '100%', justifyContent: 'center', display: 'flex'}}>
                        <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginRight: '8vw', marginTop: '3vh'}} onClick={(event) => this.changeView(event, true)}>Conversations</button>
                        <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginTop: '3vh'}} onClick={(event) => this.changeView(event, false)}>GolfTribe Courses</button>
                </div>
                <div hidden={this.state.under_width && !this.state.message_view} style={{width: width_form_a, float: 'left'}}>
                    <div style={{border: 'thick solid gray', minHeight: '80vh', borderRadius: '25px'}}>
                    <h3 style={{textAlign: 'center'}}>Message Conversations</h3>
                    {this.state.messages_list.map((user, index) => {
                        var url = '/messages?id=' + this.state.matching_users[index];
                        console.log(user)
                        return (
                            <div onClick={(event) => this.directToUrl(event, url)} class="user_button" style={{padding: '15px', margin: '0 auto', marginBottom: '1vh', cursor: 'pointer', height: 'fit-content'}}>
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
                        <div hidden={this.state.messages_list.length > 4}>
                            <p style={{textAlign: 'center', fontWeight: 'bold'}}>You have no other text conversations</p>
                        </div>
                    </div>
                </div>
                <div hidden={this.state.under_width && this.state.message_view} style={{width: width_form_b, float: 'left', marginLeft: '3%', padding: '2%', border: 'thick solid black', borderRadius: '25px', minHeight: '65vh'}}>
                    <CoursesOfferedComponent />
                </div>
            </div>)
        }
    }
}