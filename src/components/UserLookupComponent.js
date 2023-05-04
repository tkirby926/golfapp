import React from 'react'
import './css/SearchComponent.css';
import Chat from './photos/live-chat.jpeg'
import TimeBox from './TeeTimeBox';
import { TimesViewComponent } from './TimesViewComponent';
import UserProfile from './Userprofile';


export class UserLookupComponent extends React.Component {

    getFriendData() {
        const url = "/api/v1/search/upd";
        fetch(UserProfile.getUrl() + url, { credentials: 'include', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({results: data.results, index: data.index, requests: data.requests, hasMore: false, hasLess: false, friends_times: data.good_user_times, friends_in_time: data.user_friends});
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
            mode: 'u',
            user: this.props.user
        }
        
    }


    componentDidMount() {
        this.getFriendData();
    }
    

    getName(name) {
        return name.split('/').pop();
    }
    
    changeSearch(event) {
        event.preventDefault();
        if (event.target.value.length > 2) {
            this.setState({page: 0})
            this.getData(event.target.value)
        }
        else if (event.target.value.length == 0) {
            this.setState({page: 0})
            this.getData('');
        }
    }

    showFriendRequests(event) {
        event.preventDefault();
        this.setState({show_requests: !this.state.show_requests})
    }

    addFriend(event, username, index) {
        event.stopPropagation()
        event.preventDefault();
        fetch(UserProfile.getUrl() + "/api/v1/accept_request/" + username, { credentials: 'include', method: 'POST' })
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
        event.stopPropagation();
        event.preventDefault();
        fetch(UserProfile.getUrl() + "/api/v1/deny_request/" + username, { credentials: 'include', method: 'DELETE' })
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
        if (this.state.requests.length === 0) {
            return '';
        }
        else if (this.state.requests.length === 1) {
            return <div>&#9312;</div>
        }
        else if (this.state.requests.length === 2) {
            return <div>&#9313;</div>
        }
        else if (this.state.requests.length === 3) {
            return <div>&#9314;</div>
        }
        else if (this.state.requests.length === 4) {
            return <div>&#9315;</div>
        }
        else {
            return <div>&#9316;+</div>
        }

    }

    showNext(event) {
        event.preventDefault();
        this.state.page = this.state.page + 1;
        this.getData(this.state.search);
    }

    showPrev(event) {
        event.preventDefault();
        this.state.page = this.state.page - 1;
        this.getData(this.state.search);
    }

    showNoRequestsMesssage() {
        if (this.state.requests.length === 0) {
            return <div class="requests" style={{width: '90%', marginTop: '2vh'}}>No new requests at the moment</div>
        }
        else {
            return null;
        }
    }

    showPrevRequest(event) {
        event.preventDefault();
        this.state.request_page = this.state.request_page - 1;
        this.getRequests();
    }
    showNextRequest(event) {
        event.preventDefault();
        this.state.request_page = this.state.request_page + 1;
        this.getRequests();
    }

    directToMessanger(event, user) {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign('/messages?id=' + user)
    }

    showJoinButton(i, id) {
        if (i === 0) {
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

    changeView(e, type) {
        e.preventDefault();
        this.setState({mode: type});
    }

    showTimes(){
        if (!this.state.under_width || (this.state.under_width && this.state.mode == 't')) {
            return (<TimesViewComponent style={{width: '80%', marginLeft: '10%'}} all_component={false} user={this.state.user} times={this.state.friends_times} friends_in_time={this.state.friends_in_time}/>)
        }
    }

    directToURL(e, url) {
        e.preventDefault();
        window.location.assign(url)
    }

    showReqs() {
        console.log(this.state.requests)
        console.log('poop')
        if (!this.state.under_width || (this.state.under_width && this.state.mode == 'r')) {
            return (<div style={{display: 'block', marginBottom: '15vh'}}>
                        <button class="button" style={{width: '30%', marginLeft: '33%'}} onClick={(event) => this.showFriendRequests(event)}>{this.getNumber()}Friend Requests{this.showArrow()}</button>
                        <div style={{display: this.state.show_requests ? 'flex' : 'none', justifyContent: 'center'}}>
                            {this.showNoRequestsMesssage()}
                        {this.state.requests.map((request, index) => {
                        var url = "/user?return_url=" + window.location.pathname + "&user=" + request[0];
                        return (
                        <div class="user_button_biege" onClick={(event) => this.directToURL(event, url)} style={{border: 'thin solid black', width: '95%', height: '5vh'}}>
                            <div style={{float: 'left', width: '80%', height: "100%"}}>
                                <a style={{fontWeight: 'bold', fontSize: 'medium'}}>{request[1]} {request[2]}</a><br></br>
                                <a style={{fontSize: 'medium'}}>{request[0]}</a>
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
                        <div style={{display: 'flex', float: 'left', marginLeft: '5vw'}}>
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
        if (!this.state.under_width || (this.state.under_width && this.state.mode == 'u')) {
            var separation = ['51%', '10%'];
            var borderleft = 'thick solid #0E2F04';
            if (this.state.under_width) {
                separation = ['44%', '17%'];
                borderleft = '0';
            }
                return (<div style={{height: 'fit-content'}}><input class="input" style={{width: '90%', marginLeft: '5%', marginBottom: '50px'}} type="text" placeholder="Search for people" defaultValue={this.state.search} onKeyUp={(event) => this.changeSearch(event)}></input><br></br>
                    <div style={{height: '64vh', borderLeft: borderleft, paddingTop: '10px', paddingBottom: '10px'}}>
                    {this.state.results.map((result, index) => {
                        var url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                        var name = result[1] + " " + result[2];
                        var img_url = result[3];
                        if (img_url === null || img_url == '') {
                            img_url = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
                        }
                        if (index < this.state.index) {
                            return (
                            <div onClick={(event) => this.directToURL(event, url)} class="user_button" style={{width: '80%', cursor: 'pointer', marginLeft: '7%'}}>
                                <img src={img_url} style={{float: 'left', height: '40px', marginRight: '3%', borderRadius: '50%', border: 'thin solid white'}}></img>
                                <div style={{float: 'left', width: separation[0], height: "100%"}}>
                                    <a style={{fontWeight: 'bold', fontSize: 'medium', color: '#0E2F04'}}>{name}<br></br></a>
                                    <a style={{fontWeight: 'normal', fontSize: 'medium', color: '#0E2F04'}}>{result[0]}</a>
                                </div>
                                <div style={{float: 'left', height: '100%', backgroundColor: 'white', width: separation[1]}} onClick={(event) => this.directToMessanger(event, result[0])}>
                                    <img src={Chat} style={{margin: 'auto', fontSize: '25px', cursor: 'pointer', height: '40px', display: 'table-cell', borderRadius: '400px', verticalAlign: 'middle', textAlign: 'center'}}></img>
                                </div>
                                <div style={{float: 'left', height: '100%', width:'20%', backgroundColor: 'white'}}>
                                    <a href="/" style={{cursor: 'pointer', height: '40px', color: 'white', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', borderRadius: '4px', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: '#0E2F04'}}>Book Time</a>
                                </div>
                            </div>
                            )
                        }
                        else {
                            var name = result[1] + " " + result[2];
                            return (
                                <div onClick={(event) => this.directToURL(event, url)} class="user_button" style={{width: '80%', cursor: 'pointer', marginLeft: '7%'}}>
                                    <img src={img_url} style={{float: 'left', height: '40px', marginRight: '3%', borderRadius: '50%', border: 'thin solid white'}}></img>
                                    <div style={{float: 'left', width: '61%', height: "100%"}}>
                                        <a style={{fontWeight: 'bold', fontSize: 'medium', color: '#0E2F04'}} href={url}>{name}<br></br></a>
                                        <a style={{fontWeight: 'normal', fontSize: 'medium', color: '#0E2F04'}} href={url}>{result[0]}</a>
                                    </div>
                                    <div style={{float: 'left', height: '100%', width:'20%', backgroundColor: 'white'}}>
                                        <a style={{cursor: 'pointer', color: 'white', height: '40px', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', borderRadius: '4px', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: '#0E2F04'}}>View Profile</a>
                                </div>
                                </div>
                                )
                        }
                            })}
                            <form class='form_hidden' style={{width: '80%', textAlign: 'center'}} hidden={this.state.results.length != 0}><h4>There are no users registered with your search criteria, 
                                please try another search</h4></form>
                        </div>
                    <div style={{display: 'flex', float: 'left', marginLeft: '50%'}}>
                        <div style={{float: 'left', width: '100px'}}>
                            <div hidden={!this.state.hasLess}>
                                <button class='small_button' onClick={(event) => this.showPrev(event)}>Prev Page</button>
                            </div>
                        </div>
                        <div style={{float: 'left', width: '100px', marginLeft: '5%'}}>
                            <div hidden={!this.state.hasMore}>
                                <button class='small_button' onClick={(event) => this.showNext(event)}>Next Page</button>
                            </div>
                        </div>
                    </div>
                    </div>)
        }
    }

    render() {
        var x = this.state.results;
        var width_form = "49%";
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width_form = "100%";
        }
        return (
            <div style={{position: 'relative', backgroundSize: 'cover', width: '100%'}}>
                <div>
                <div style={{width: '100%', justifyContent: 'center', display: 'flex'}}>
                    <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: '#0E2F04', padding: '5px', marginRight: '8vw', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, 'u')}>User Search</button>
                    <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: '#0E2F04', padding: '5px', marginRight: '8vw', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, 'r')}>Friend Requests</button>
                    <button hidden={!this.state.under_width} class="button4" style={{float: 'left', background: '#0E2F04', padding: '5px', marginBottom: '5vh'}} onClick={(event) => this.changeView(event, 't')}>Friend Tee Times</button>
                </div>
                <div style={{width: width_form, backgroundColor: 'transparent', float: 'left'}}>
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
