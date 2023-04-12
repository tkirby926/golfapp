import React from "react"
import './css/MessagingComponent.css'
import UserProfile from './Userprofile';
export class MessagingComponent extends React.Component {

    getCount() {
        fetch(UserProfile.getUrl() + "/api/v1/message_count/" + this.state.user + "/" + this.state.message_receiver, { credentials: 'same-origin', method: 'GET' })
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
        fetch(UserProfile.getUrl() + "/api/v1/messages/" + this.state.user + "/" + this.state.message_receiver + "/" + this.state.page + "/" + this.state.offset, { credentials: 'same-origin', method: 'GET' })
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
        if (this.state.linked_time !== "") {
            return (<div>
                <button style={{width: '100%'}} class='button_user3' onClick={(event) =>this.removeLinkedTime(event)}>Remove Linked Time</button>
            </div>)
        } 
    }

    constructor(props) {
        const params = (new URL(document.location)).searchParams;
        super(props);
        this.state = {
            messages: [],
            user: this.props.user,
            message_receiver: params.get('id'),
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
            logged_username: '',
            has_rendered: false
        }
        if (this.state.user === "null") {
            window.location.assign('/');
        }
    }

    componentDidMount() {
        this.getCount();
        this.getMessages(true);
        this.state.has_rendered = true;
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
        const user2 = this.state.message_receiver;
        if (event.target[0].value === "") {
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  user1: user1,
                                    user2: user2,
                                    message: event.target[0].value})
        }
        fetch(UserProfile.getUrl() + '/api/v1/send_message', requestOptions)
        .then(response => response.json())
        .then((data) => {
            if (data.error === "") {
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
        if (element.scrollTop === 0 && !this.state.last) {
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
        if (this.state.times_booked.length === 0 && !this.state.show_linkable_times) {
            fetch(UserProfile.getUrl() + "/api/v1/booked_times/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
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

    checkLength(e) {
        e.preventDefault();
        if (e.target.value.length > 250) {
            document.getElementById('inp').value = e.target.value.slice(0, 251);
        }
    }

    

    render() {  
        var url = "/user?user=" + this.state.message_receiver;
        var has_messages = this.state.messages.length > 0;
        var push_left = '8%';
        var push_right = '1%';
        if (window.innerWidth < 800) {
            push_left = '0';
            push_right = '0';
        }
        if (this.state.has_rendered) {
            return (
                <div style={{width: '100%'}}>
                    <div style={{width: '100vw', overflow: 'auto', height: '0'}}></div>
                    <div style={{height: '22px'}}><h3 onClick={(event) => this.directToUrl(event, url)} style={{textAlign: 'center', cursor: 'pointer'}}>{this.state.message_receiver}</h3></div>
                    <div id="messagebox" onScroll={(event) => this.loadMore(event)} style={{height: '60vh', width: '90vw', maxWidth: '550px', position: 'relative', border: '5px solid #0E2F04', borderRadius: '25px', margin: 'auto', overflowY: 'auto', padding: '5px'}}>
                        <div style={{borderRadius: '25px', border: '5px green'}}>
                            {this.state.messages.slice(0).reverse().map((message, index) => {
                                if (message[1] === this.state.logged_username) {
                                    return this.showYourMessage(message[0])
                                }
                                else {
                                    return this.showTheirMessage(message[0])
                                }
                            }) }
                            
                        </div>
                        <div hidden={has_messages}>
                            <h3 style={{display: 'flex', justifyContent: 'center', marginTop: '40%'}}>You currently have no messages with this user</h3>
                        </div>
                        </div>  
                            <body>
                        <form style={{maxWidth: '640px', width: '80vw', height: '12vh', position: 'relative', marginTop: '2vh', marginLeft: 'auto', marginRight: 'auto'}} onSubmit={(event) => this.sendMessage(event)}>
                            <input onChange={(event) => this.checkLength(event)} style={{marginLeft: push_left, float: 'left', width: '77%'}} class="input" type="text" id="inp" placeholder="Type a message" />
                            <button style={{fontSize: '20px', border: 'thin solid black', borderRadius: '5px', backgroundColor: 'black', width: 'fit-content', color: 'white', marginLeft: push_right, marginTop: '6px'}} type="submit">             
                                <span>&#10147;</span>
                            </button>
                            <br></br>
                            <br></br>
                            <button class="button4" style={{width: '90%', maxWidth: '300px', margin: 'auto', display: 'block'}} onClick={(event) => this.returnHome(event)}>Return and Book a Tee Time</button>
                        </form>
                    </body>
                </div>
            )
        }
        else {
            return '';
        }
    }
}