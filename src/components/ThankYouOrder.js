import React from 'react'
import { HeaderComponent } from './HeaderComponent';
import UserProfile from './Userprofile';

export class ThankYouOrder extends React.Component {

    checkID() {
        fetch("/api/v1/in_time/" + this.state.user + "/" + this.state.timeid, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            if (data.in_time != true) {
                window.location.assign('/')
            }
            this.setState({time: data.time_info})
        })
    }

    getData(search_val) {
        var url = "/api/v1/search/only_friends/" + this.state.user + "/" + search_val + "/" + this.state.page;
        fetch(url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            this.setState({results: data.results, search: search_val, hasMore: data.more, hasLess: false});
        })

    }

    changeSearch(event) {
        event.preventDefault();
        this.setState({page: 0})
        this.getData(event.target.value)
    }

    showPrev(event) {
        event.preventDefault();
        var less = true;
        if (this.state.page - 1 == 0) {
            less = false
        }
        this.setState({page: this.state.page - 1, hasMore: true, hasLess: less})
    }

    showNext(event) {
        event.preventDefault();
        var more = false;
        if (this.state.results.length > ((this.state.page + 1)*5) + 5) {
            more = true;
        }
        this.setState({page: this.state.page + 1, hasLess: true, hasMore: more})
    }

    updateFInv(e, uname) {
        e.preventDefault();
        var index = this.state.users_invited.indexOf(uname);
        if (index == -1) {
            this.state.users_invited.push(uname)
        }
        else {
            this.state.users_invited.splice(index, 1)
        }
    }

    getInitialFriends() {
        fetch("/api/v1/my_friends/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ results: data.my_friends});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            user: UserProfile.checkCookie(),
            timeid: window.location.href.split('/').pop(),
            page: 0,
            results: [],
            hasMore: false,
            hasLess: false,
            spots: 0,
            users_invited: [],
            time: []
        }
        this.getInitialFriends()
        this.checkID()
    }

    doSomething() {
        return 0;
    }

    render() {
        return (
            <div>
                <HeaderComponent hide_search={true}/>
            <h2 style={{width: '100%', overflow: 'auto', textAlign: 'center'}}>Thank you so much for booking your teetime with Amigolf!</h2>
            <h4 style={{width: '60vw', marginLeft: '20vw', textAlign: 'center'}}>Use the search bar to filter your friends below and invite them to join your time. However, this does not save their spot, and they will need to accept their email invite before other users join!</h4>
                <body style={{marginBottom: '10px'}}>
                    <input class="input" type="text" style={{width: '60vw', marginLeft: '20vw', display: 'flex', justifyContent: 'center', alignContent: 'center'}} placeholder="Search for a user/course" defaultValue={this.state.search} onKeyUp={(event) => this.changeSearch(event)}></input><br></br>
                </body>
                <div style={{height: '675px'}}>
                {this.state.results.slice(this.state.page*5, this.state.page*5 + 5).map((result, index) => {
                    var uname = result[0];
                    return (
                    <div style={{width: '60vw', marginLeft: '20vw'}}>
                        <div class="user_button" style={{border: 'thin solid black', width: '80%', margin: 'auto', float: 'left'}}>
                            <span class='button2' style={{fontWeight: 'bold'}}>{result[1]}</span>
                            <span class='button2' style={{fontSize: '12px'}}>{result[0]}</span>
                        </div>
                        <input class="user_button" type="checkbox" style={{border: 'thin solid black', width: '4%', margin: 'auto', float: 'left', height: '15%'}} onClick={(event) => this.updateFInv(event, uname)}></input>
                    </div>
                    )
                    })}
                </div>
                <div style={{display: 'flex', float: 'left', marginLeft: '1100px'}}>
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
                </div>
            </div>
        )
    }
}
