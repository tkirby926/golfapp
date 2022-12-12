import React from 'react'
import { HeaderComponent } from './HeaderComponent';
import UserProfile from './Userprofile';
import './css/SearchComponent.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import EventEmitter from 'events';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './photos/live-chat.jpeg'


export class UserLookupComponent extends React.Component {


    getRequests() {
        fetch("/api/v1/friend_requests/" + UserProfile.checkCookie(), { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            var less = false;
            var more = false;
            if (data.results.length > (this.state.page*8) + 8) {
                more = true;
            }
            if (this.state.page != 0) {
                less = true;
            }
            this.setState({requests: data.results, hasMoreRequests: more, hasLessRequests: less});
        })
    }


    getData(search_val) {
        if (search_val != "") {
            const url = "api/v1/search/users_friends/" + UserProfile.checkCookie() + '/' + search_val;
            fetch(url, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
            var less = false;
            var more = false;
            if (data.results.length > (this.state.page*5) + 5) {
                more = true;
            }
            if (this.state.page != 0) {
                less = true;
            }
                this.setState({results: data.results, search: search_val, index: data.index, hasMore: more, hasLess: less});
            })
        }
    }

    getFriendTeeTimes() {
        const url = "api/v1/friend_times/" + UserProfile.checkCookie();
        fetch(url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({friends_times: data.good_user_times, friends_in_time: data.user_friends});
        })
    }

    getFriends() {
        const url = "api/v1/search/friends/" + UserProfile.checkCookie();
        fetch(url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
        var less = false;
        var more = false;
        if (data.results.length > (this.state.page*8) + 8) {
            more = true;
        }
            this.setState({results: data.results, index: data.index, hasMore: more, hasLess: less});
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            search: "",
            results: [],
            requests: [],
            show_requests: false,
            page: 0,
            request_page: 0,
            last: false,
            hasMore: false,
            hasLess: false,
            hasLessRequests: false,
            hasMoreRequests: false,
            friends_times: [],
            friends_in_time: [],
            under_width: false,
            show_user_window: true,
            show_req_window: false
        }
        this.getData = this.getData.bind(this);
        this.getRequests();
        this.getFriends();
        this.getFriendTeeTimes();
    }


    // componentDidMount() {
    //     this.getData(this.state.search);
    //     console.log('mounted')
    // }
    

    getName(name) {
        return name.split('/').pop();
    }
    
    changeSearch(event) {
        event.preventDefault();
        this.setState({page: 0})
        this.getData(event.target.value)
    }

    showFriendRequests(event) {
        event.preventDefault();
        this.setState({show_requests: !this.state.show_requests})
    }

    addFriend(event, username, index) {
        event.preventDefault();
        fetch("/api/v1/accept_request/" + UserProfile.checkCookie() + "/" + username, { credentials: 'same-origin', method: 'POST' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.state.requests.splice(index, 1);
            this.forceUpdate();
        })
    }

    declineFriend(event, username, index) {
        event.preventDefault();
        fetch("/api/v1/deny_request/" + UserProfile.checkCookie() + "/" + username, { credentials: 'same-origin', method: 'DELETE' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({requests: this.state.requests.splice(index, 1)});
            this.forceUpdate();
        })
    }

    showArrow() {
        if (!this.state.show_requests) {
            return <div>&#8674;</div>
        }
        else {
            return <div>&#8675;</div>
        }
    }

    getNumber() {
        if (this.state.requests.length == 0) {
            return '';
        }
        else if (this.state.requests.length == 1) {
            return <div>&#9312;</div>
        }
        else if (this.state.requests.length == 2) {
            return <div>&#9313;</div>
        }
        else if (this.state.requests.length == 3) {
            return <div>&#9314;</div>
        }
        else if (this.state.requests.length == 4) {
            return <div>&#9315;</div>
        }
        else {
            return <div>&#9316;+</div>
        }

    }

    showNext(event) {
        event.preventDefault();
        var more = false;
        if (this.state.results.length > ((this.state.page + 1)*8) + 8) {
            more = true;
        }
        this.setState({page: this.state.page + 1, hasLess: true, hasMore: more})
    }

    showPrev(event) {
        event.preventDefault();
        var less = true;
        if (this.state.page - 1 == 0) {
            less = false
        }
        this.setState({page: this.state.page - 1, hasMore: true, hasLess: less})
    }

    showNoRequestsMesssage() {
        if (this.state.requests.length == 0) {
            return <div class="requests" style={{marginTop: '15px'}}>No new requests at the moment</div>
        }
        else {
            return null;
        }
    }

    showPrevRequest(event) {
        event.preventDefault();
        var less = true;
        if (this.state.request_page - 1 == 0) {
            less = false
        }
        this.setState({request_page: this.state.request_page - 1, hasMoreRequests: true, hasLessRequests: less})
    }
    showNextRequest(event) {
        event.preventDefault();
        var more = false;
        if (this.state.requests.length > ((this.state.request_page + 1)*5) + 5) {
            more = true;
        }
        this.setState({request_page: this.state.request_page + 1, hasLessRequests: true, hasMoreRequests: more})
    }

    directToMessanger(event, user) {
        event.preventDefault();
        window.location.assign('/messages/' + user)
    }

    showJoinButton(i, id) {
        if (i == 0) {
            return "";
        }
        else {
            var url = "/tee_time/" + id;
            return (
                <div>
                    <a class="button2" href={url}>Join This Time</a>
                </div>
            )
        }
    }

    showFriendsTimes() {
        if (this.state.friends_times.length > 0) {
            return (
            <div>
            {this.state.friends_times.map((time, index) => {
                const url = '/tee_time/' + time[0];
                return(
                <div class='course_box1'>
                    <div>
                    <h3 style={{marginBottom: '1px'}}>{time[4]}</h3>
                    </div>
                    <div>
                        <a style={{}}href={url}>{time[2]}</a>
                    </div>
                    <div>
                        <h3 style={{margin: '0', paddingTop: '0'}}>Cost: ${time[1]}</h3>
                    </div>
                    <div>
                        <h3 style={{margin: '0', paddingTop: '0', marginBottom: '10px'}}>Spots: {time[3]}</h3>
                    </div>
                    <div>
                        {this.state.friends_in_time[index].map((friend, index1) => {
                            console.log(friend)
                            var name = friend[0] + " " + friend[1];
                            if (index1 == 0) {
                                return (
                                    <p style={{display: 'inline'}}>{name}</p>
                                )
                            }
                            else {
                                return (
                                    <p style={{display: 'inline'}}>, {name}</p>
                                )
                            }
                        })}
                        <p style={{display: 'inline'}}> is booked for this time</p>
                    </div>
                    <div>
                        {this.showJoinButton(index, time[0])}
                    </div>
                </div>
                )
            })}
            </div>
            )
        }
        else {
            return (<div><h4>Sorry, no friends have upcoming times. Use the search bar to friend new users, 
                             or book your own time on the homepage!</h4></div>)
        }
    }

    changeView(e, user) {
        e.preventDefault();
        if (user) {
            this.setState({show_user_window: true, show_req_window: false});
        }
        else {
            this.setState({show_user_window: false, show_req_window: true});
        }
    }

    showTimes(){
        if (!this.state.under_width || (this.state.under_width && this.state.show_user_window)) {
            return (<div style={{border: 'thick solid black', borderRadius: '40px', display: 'block', float: 'none'}}>
                        <p style={{marginLeft: '3vw'}}>Friends with upcoming tee times:</p>
                        {this.showFriendsTimes()}
                    </div>)
        }
    }

    showReqs() {
        console.log(this.state.requests)
        if (!this.state.under_width || (this.state.under_width && this.state.show_req_window)) {
            return (<div style={{display: 'block', marginBottom: '5vh'}}>
                        <button class="button" style={{width: '30%', marginLeft: '33%'}} onClick={(event) => this.showFriendRequests(event)}>{this.getNumber()}Friend Requests{this.showArrow()}</button>
                        <div hidden={!this.state.show_requests}>
                        {this.showNoRequestsMesssage()}
                        {this.state.requests.slice(this.state.page*5, this.state.page*5 + 5).map((request, index) => {
                        var url = "/user?return_url=" + window.location.pathname + "&user=" + request[0];
                        return (
                        <div class="user_button_biege" style={{border: 'thin solid black', width: '95%', height: '5vh'}}>
                            <div style={{float: 'left', width: '80%', height: "100%"}}>
                                <a style={{fontWeight: 'bold', fontSize: 'medium'}} href={url}>{request[1]} {request[2]}</a>
                                <a style={{fontSize: 'medium'}} href={url}>{request[0]}</a>
                            </div>
                            <div style={{width: '10%', float: 'left', height: '100%', backgroundColor: 'biege'}}>
                                <span onClick={(event) => this.addFriend(event, request[0], index)} style={{cursor: 'pointer', height: '40px', width: '30px', display: 'table-cell', borderRadius: '400px', backgroundColor: 'green', verticalAlign: 'middle', textAlign: 'center'}}>&#10003;</span>
                            </div>
                            <div style={{float: 'left', width: '10%', height: '100%', backgroundColor: 'biege'}}>
                                <span onClick={(event) => this.declineFriend(event, request[0], index)} style={{cursor: 'pointer', height: '40px', width: '30px', display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', backgroundColor: 'red'}}>&#10006;</span>
                            </div>
                        </div>
                        )
                        })}
                        </div>
                        <div style={{display: 'flex', float: 'left', marginLeft: '500px'}}>
                            <div style={{float: 'left', width: '100px'}}>
                                <div hidden={!this.state.hasLessRequests}>
                                    <button class='small_button' onClick={(event) => this.showPrevRequest(event)}>Prev Page</button>
                                </div>
                            </div>
                            <div style={{float: 'left', width: '100px', marginLeft: '10px'}}>
                                <div hidden={!this.state.hasMoreRequests}>
                                    <button class='small_button' onClick={(event) => this.showNextRequest(event)}>Next Page</button>
                                </div>
                            </div>
                        </div>
                    </div>)
        }
    }

    showLookup() {
        if (!this.state.under_width || (this.state.under_width && this.state.show_user_window)) {
        return (<div style={{height: 'fit-content'}}><input class="input" style={{width: '90%', marginLeft: '5%', marginBottom: '50px'}} type="text" placeholder="Search for people" defaultValue={this.state.search} onKeyUp={(event) => this.changeSearch(event)}></input><br></br>
                    <div style={{height: '60vh', border: 'thick solid gray', borderRadius: '40px', paddingTop: '10px', paddingBottom: '10px'}}>
                    {this.state.results.slice(this.state.page*8, this.state.page*8 + 8).map((result, index) => {
                        var url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                        var name = result[1] + " " + result[2];
                        if (this.state.page*8 + index < this.state.index) {
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
                        }
                        else {
                            var name = result[1] + " " + result[2];
                            return (
                                <div class="user_button" style={{width: '80%', marginLeft: '7%', height: '4vh'}}>
                                    <div style={{float: 'left', width: '82%', height: "100%"}}>
                                        <a style={{fontWeight: 'bold', fontSize: 'medium', color: '#5469d4'}} href={url}>{name}<br></br></a>
                                        <a style={{fontWeight: 'normal', fontSize: 'medium', color: '#5469d4'}} href={url}>{result[0]}</a>
                                    </div>
                                    <div style={{float: 'left', height: '100%', width:'12%', backgroundColor: 'white'}}>
                                        <a href={url} style={{cursor: 'pointer', height: '40px', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%',  verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'lightgreen'}}>View Profile</a>
                                </div>
                                </div>
                                )
                        }
                            })}
                        </div>
                    <div style={{display: 'flex', float: 'left', marginLeft: '500px'}}>
                        <div style={{float: 'left', width: '100px'}}>
                            <div hidden={!this.state.hasLess}>
                                <button class='small_button' onClick={(event) => this.showPrev(event)}>Prev Page</button>
                            </div>
                        </div>
                        <div style={{float: 'left', width: '100px', marginLeft: '10px'}}>
                            <div hidden={!this.state.hasMore}>
                                <button class='small_button' onClick={(event) => this.showNext(event)}>Next Page</button>
                            </div>
                        </div>
                    </div></div>)
        }
    }

    render() {
        var x = this.state.results;
        console.log(this.state.requests);
        var width_form = "49%";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form = "100%";
        }
        return (
            <div style={{position: 'absolute', backgroundSize: 'cover', width: '100%'}}>
                <div>
                <div style={{width: '100%', justifyContent: 'center', display: 'flex'}}>
                    <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginRight: '8vw', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, true)}>Users</button>
                    <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: 'green', padding: '5px', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, false)}>Requests</button>
                </div>
                        <div style={{width: width_form, backgroundColor: 'transparent', float: 'left', border: '5px grey'}}>
                            {this.showReqs()}
                            {this.showTimes()}
                        </div>
                        <div style={{width: width_form, float: 'left', marginBottom: '8vh'}}>
                            {this.showLookup()}
                        </div>
                </div>
            </div>
        )
    }
}