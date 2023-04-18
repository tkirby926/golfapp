import React from "react"
import './css/LoginComponent.css'
import UserProfile from './Userprofile';

export class ChangePasswordComponent extends React.Component {

    checkID() {
        fetch(UserProfile.getUrl() + "/api/v1/check_reset_id/" + this.state.sessionid, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            if (data.expired) {
                this.setState({expired: true});
            }
        })
    }

    setNewPassword(event) {
        event.preventDefault();
        if (event.target[0].value != event.target[1].value) {
            this.setState({mismatch: true});
            return;
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                                    new_pass: event.target[0].value,
                                    sessionid: this.state.sessionid})
        };
        fetch(UserProfile.getUrl() + "/api/v1/set_pass", requestOptions)
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            if (data.expired) {
                this.setState({expired: true});
            }
            else {
                this.setState({set: true})
            }
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            sessionid: window.location.href.split('/').pop(),
            expired: false,
            mismatch: false,
            set: false
        }
        this.checkID();
    }

    render() {
        return (
        <div style={{minHeight: '100vh'}}>
        <div hidden={this.state.expired || this.state.set}>
            <button class="button4" style={{marginLeft: '15vw', marginTop: '10vh', marginBottom: '10vh'}} onClick={(event) => this.goBack(event)}>Back</button>
            <div>
                <form class="form" onSubmit={(event) => this.setNewPassword(event)}>
                    <div hidden={!this.state.mismatch} style={{color: 'red'}}>
                        <p>The passwords do not match. Please try again.</p>
                    </div>
                    Enter new password: <input type="password" name="username"></input><br></br><br></br>
                    Confirm new password: <input type="password" name="username"></input><br></br><br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        </div>  
        <div hidden={!this.state.expired || this.state.set}>
            <h3 class="form_hidden">This link is not active. Please try resetting your password again from the login page.</h3>
        </div>
        <div hidden={!this.state.set}>
            <h3 class="form_hidden">Your password has been reset, please navigate back to the login page.</h3>
        </div>
        </div>
        )
    }
}