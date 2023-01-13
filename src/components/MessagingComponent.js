import React from "react"
import UserProfile from "./Userprofile";
import './css/MessagingComponent.css'
import cookie from "react-cookie";
import { ChatEngine } from 'react-chat-engine';
import { HeaderComponent } from "./HeaderComponent";
export class MessagingComponent extends React.Component {

    getCount() {
        fetch("/api/v1/message_count/" + this.state.user + "/" + window.location.href.split('/').pop(), { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ count: data.count});
        })
    }

    getMessages(first) {
        var x = 0;
        if (!first) {
            var element = document.getElementById('messagebox'); 
            this.state.prev_height = element.scrollHeight;
        }
        fetch("/api/v1/messages/" + this.state.user + "/" + window.location.href.split('/').pop() + "/" + this.state.page + "/" + this.state.offset, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.state.messages = this.state.messages.concat(data.messages);
            this.state.last = (this.state.page + 1) * 20 >= this.state.count;
            this.state.page = this.state.page + 1;
            this.state.logged_username = data.logged_user;
            if (!first) {
                this.state.new_render = false;
            }
            this.forceUpdate();
        })
    }

    showUndoButton() {
        if (this.state.linked_time != "") {
            return (<div>
                <button style={{width: '100%'}} class='button_user3' onClick={(event) =>this.removeLinkedTime(event)}>Remove Linked Time</button>
            </div>)
        } 
    }

    constructor(props) {
        
        super(props);
        this.state = {
            messages: [],
            user: this.props.user,
            message_receiver: window.location.href.split('/').pop(),
            page: 0,
            last: true,
            error: "",
            offset: 0,
            prev_height: 0,
            new_render: true,
            times_booked: [],
            show_linkable_times: false,
            linked_time: "",
            has_linked_time: false,
            logged_username: ''
        }
        if (this.state.user == "null") {
            window.location.assign('/');
        }
        this.getCount();
        this.getMessages(true);
    }

    showYourMessage(message) {
        return (
            <div class="message_sent">{message}</div>
        )
    }

    showTheirMessage(message) {
        return (
            <div class = "message_received">{message}</div>
        )
    }

    sendMessage(event) {
        event.preventDefault();
        const user1 = this.state.user;
        const user2 = window.location.href.split('/').pop()
        if (event.target[0].value == "") {
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  user1: user1,
                                    user2: user2,
                                    message: event.target[0].value})
        }
        fetch('/api/v1/send_message', requestOptions)
        .then(response => response.json())
        .then((data) => {
            if (data.error == "") {
                this.state.messages.unshift([event.target[0].value, this.state.logged_username, user2])
                this.setState({offset: this.state.offset + 1, new_render: true})
                document.getElementById("inp").value = "";
            }
            else {
                this.setState({error: data.error})
            }
        });
    }

    componentDidUpdate() {
        var element = document.getElementById('messagebox');
        if (this.state.new_render) {
            element.scrollTop = element.scrollHeight;  
        }
        else {
            element.scrollTop = element.scrollHeight - this.state.prev_height;
        }
    }

    returnHome(e) {
        e.preventDefault();
        window.location.assign('/')
    }

    

    loadMore(e) {
        e.preventDefault();
        var element = document.getElementById('messagebox');
        if (element.scrollTop == 0 && !this.state.last) {
            this.getMessages(false);
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

    changeLinkedTime(e, time_url) {
        e.preventDefault();
        this.setState({linked_time: time_url, has_linked_time: true, show_linkable_times: false})
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

    directToUrl(e, url) {
        e.preventDefault();
        window.location.assign(url)
    }

    

    render() {  
        var url = "/user?user=" + window.location.href.split('/').pop();
    return (
        <div>
            <div style={{width: '100vw', overflow: 'auto', height: '0'}}></div>
            <div style={{height: '22px'}}><h3 onClick={(event) => this.directToUrl(event, url)} style={{textAlign: 'center', cursor: 'pointer'}}>{this.state.message_receiver}</h3></div>
            <div id="messagebox" onScroll={(event) => this.loadMore(event)} style={{height: '60vh', width: '90vw', maxWidth: '550px', position: 'relative', border: '5px solid green', borderRadius: '25px', margin: 'auto', overflowY: 'auto', padding: '5px'}}>
                <div style={{borderRadius: '25px', border: '5px green'}}>
                    {this.state.messages.slice(0).reverse().map((message, index) => {
                        if (message[1] == this.state.logged_username) {
                            return this.showYourMessage(message[0])
                        }
                        else {
                            return this.showTheirMessage(message[0])
                        }
                    }) }
                    
                </div>
                </div>  
                    <body>
                <form style={{maxWidth: '640px', width: '70vw', height: '12vh', position: 'relative', marginTop: '2vh', marginLeft: 'auto', marginRight: 'auto'}} onSubmit={(event) => this.sendMessage(event)}>
                    <input style={{float: 'left', width: '92%'}} class="input" type="text" id="inp" placeholder="Type a message" />
                    
                    <button style={{width: '10px', border: 'none', fontSize: '35px', background: 'none'}} type="submit">             
                        <span>&#10147;</span>
                    </button>
                    <br></br>
                    <br></br>
                    <button class="button5" style={{width: '90%', maxWidth: '300px', margin: 'auto'}} onClick={(event) => this.returnHome(event)}>Return and Book a Tee Time</button>
                </form>
            </body>
        </div>
    )
    }
}