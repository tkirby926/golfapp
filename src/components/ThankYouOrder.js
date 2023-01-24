import React from 'react'
import UserProfile from './Userprofile';

export class ThankYouOrder extends React.Component {

    checkID() {
        fetch(UserProfile.getUrl() + "/api/v1/in_time/" + this.state.user + "/" + this.state.timeid, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            if (data.in_time !== true) {
                window.location.assign('/')
            }
            this.setState({time: data.time_info})
        })
    }

    getData(search_val, same_search, forward) {
        var page = 0;
        var prev = false;
        var getter = "search/only_friends";
        if (same_search) {
            if (forward) {
                page = this.state.page + 1;
            }
            else {
                page = this.state.page - 1;
            }
        }
        if (page !== 0) {
            prev = true;
        }
        var url = "";
        if (search_val === "") {
            url = "/api/v1/my_friends/" + this.state.user + "/" + page;
        }
        else {
            url = "/api/v1/search/only_friends/" + this.state.user + "/" + search_val + "/" + page;
        }
        fetch(UserProfile.getUrl() + url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            var more = false;
            if (data.results.length === 4) {
                more = true;
            }
            this.setState({results: data.results, search: search_val, hasMore: more, hasLess: prev, page: page});
        })

    }

    changeSearch(event) {
        event.preventDefault();
        this.getData(event.target.value, false, true)
    }

    showPrev(event) {
        event.preventDefault();
        this.getData(this.state.search, true, false)
    }

    showNext(event) {
        event.preventDefault();
        this.getData(this.state.search, true, true)
    }

    updateFInv(e, uname) {
        var index = this.state.users_invited.indexOf(uname);
        if (index === -1) {
            this.state.users_invited.push(uname)
            this.forceUpdate();
            return;
        }
        else {
            this.state.users_invited.splice(index, 1);
            this.forceUpdate();
            return;
        }
    }

    getInitialFriends() {
        fetch(UserProfile.getUrl() + "/api/v1/my_friends/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ results: data.my_friends, page: 0, hasMore: data.has_more, hasLess: false});
            console.log(data.hasMore)
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            timeid: window.location.href.split('/').pop(),
            page: 0,
            results: [],
            hasMore: false,
            hasLess: false,
            spots: 0,
            users_invited: [],
            time: [],
            invites_sent: false,
            search: ''
        }
        this.getData("", false, false)
        this.checkID()
    }

    doSomething() {
        return 0;
    }

    checkChecked(uname) {
        if (this.state.users_invited.indexOf(uname) >= 0) {
            return true;
        }
        return false;
    }

    sendInvite(e) {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  user_invites: this.state.users_invited})
        }
        fetch(UserProfile.getUrl() + '/api/v1/send_invites', requestOptions)
        .then(response => response.json())
        .then((data) => {
            if (data.error === "") {
                this.setState({invites_sent: true})
            }
        });
    }

    render() {
        return (
            <div>
            <h2 style={{width: '100%', overflow: 'auto', textAlign: 'center'}}>Thank you so much for booking your teetime with Amigolf!</h2>
            <h4 style={{width: '60vw', marginLeft: '20vw', textAlign: 'center'}}>Use the search bar to filter your friends below and invite them to join your time. However, this does not save their spot, and they will need to accept their email invite before other users join!</h4>
                <body style={{marginBottom: '10px'}}>
                    <input class="input" type="text" style={{width: '60vw', marginLeft: '20vw', display: 'flex', justifyContent: 'center', alignContent: 'center'}} placeholder="Search for a user/course" defaultValue={this.state.search} onKeyUp={(event) => this.changeSearch(event)}></input><br></br>
                </body>
                <div style={{height: '40vh'}}>
                {this.state.results.slice(0, 3).map((result, index) => {
                    var uname = result[0];
                    return (
                    <div style={{width: '60vw', marginLeft: '20vw'}}>
                        <div class="user_button" style={{border: 'thin solid black', width: '80%', margin: 'auto', float: 'left'}} onClick={(event) => this.updateFInv(event, uname)}>
                            <span class='button2' style={{fontWeight: 'bold'}}>{result[1]}</span>
                            <span class='button2' style={{fontSize: '12px'}}>{result[0]}</span>
                            <input class="user_button" type="checkbox" style={{border: 'thin solid black', width: '4%', display: 'flex', margin: 'auto', float: 'right', height: '15%', zoom: '2'}} checked={this.checkChecked(uname)}></input>
                        </div>
                        
                    </div>
                    )
                    })}
                </div>
                <div style={{width: '50vw', marginLeft: '25vw', float: 'none', height: '5vh'}}>
                    <div style={{float: 'right', width: '200px'}}>
                        <div hidden={!this.state.hasLess}>
                            <button class='small_button' onClick={(event) => this.showPrev(event)}>Prev Page</button>
                        </div>
                    </div>
                    <div style={{float: 'right'}}>
                        <div hidden={!this.state.hasMore}>
                            <button class='small_button' onClick={(event) => this.showNext(event)}>Next Page</button>
                        </div>
                    </div>
                </div>
                <div hidden={this.state.invites_sent} style={{width: '100%', marginLeft: '45%', marginRight: '45%', alignContent: 'center', justifyContent: 'center'}}>
                    <button disabled={this.state.users_invited.length === 0} class="button4" style={{padding: '5px', fontSize: 'large', textAlign: 'center', display: 'flex', justifyContent: 'center'}} onClick={(event) => this.sendInvite(event)}>Send out invites!</button>
                </div>
                <div hidden={!this.state.invites_sent} style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', alignContent: 'center', justifyContent: 'center'}}>
                    <button  disabled class="button4" style={{padding: '5px', fontSize: 'large', textAlign: 'center', display: 'flex', justifyContent: 'center'}}>Invites Sent!</button>
                </div>
                <div style={{width: '20vw', marginLeft: '40vw', textAlign: 'center'}}>
                    <h2>Tee Time Details:</h2>
                    <h3>Course: {this.state.time[1]}</h3>
                    <h3>Time: {this.state.time[0]}</h3>
                    <h3>Cost: {this.state.time[3]}</h3>
                </div>
            </div>
        )
    }
}
