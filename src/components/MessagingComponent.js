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
            if (!first) {
                this.state.new_render = false;
                this.forceUpdate();
            }
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            user: UserProfile.checkCookie(),
            message_receiver: window.location.href.split('/').pop(),
            page: 0,
            last: true,
            error: "",
            offset: 0,
            prev_height: 0,
            new_render: true
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
        const user1 = UserProfile.checkCookie();
        const user2 = window.location.href.split('/').pop()
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
                this.state.messages.unshift([event.target[0].value, user1, user2])
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

    render() {  
    return (
        <div>
            <div><HeaderComponent/></div>
            <div style={{width: '100vw', overflow: 'auto', height: '0'}}></div>
            <div style={{height: '22px'}}><h3 style={{textAlign: 'center'}}>{this.state.message_receiver}</h3></div>
            <div id="messagebox" onScroll={(event) => this.loadMore(event)} style={{height: '60vh', width: '90vw', maxWidth: '550px', position: 'relative', border: '5px solid green', borderRadius: '25px', margin: 'auto', overflowY: 'auto'}}>
                <div style={{borderRadius: '25px', border: '5px green'}}>
                    {this.state.messages.slice(0).reverse().map((message, index) => {
                        if (message[1] == this.state.user) {
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
                    <input style={{float: 'left', width: '65vw', maxWidth: '600px'}} class="input" type="text" id="inp" placeholder="Type a message" />
                    <button style={{width: '10px', border: 'none', fontSize: '35px'}} type="submit">             
                        <span>&#10147;</span>
                    </button>
                    <br></br><br></br>
                    <button class="button5" style={{width: '90%', maxWidth: '300px', margin: 'auto'}} onClick={(event) => this.returnHome(event)}>Return and Book a Tee Time</button>
                </form>
            </body>
        </div>
    )
    }
}