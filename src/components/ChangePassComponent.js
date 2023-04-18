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
        const formData = new FormData();
        formData.append('new_pass', event.target[0].value)
        formData.append('sessionid', this.state.sessionid)
        const requestOptions = {
            method: 'PUT',
            body: formData 
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
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            sessionid: window.location.href.split('/').pop(),
            expired: false
        }
        this.checkID();
    }

    render() {
        return (
        <div style={{minHeight: '100vh'}}>
        <div hidden={this.state.expired}>
            <button class="button4" style={{marginLeft: '15vw', marginTop: '10vh', marginBottom: '10vh'}} onClick={(event) => this.goBack(event)}>Back</button>
            <div>
                <form class="form" onSubmit={(event) => this.setNewPassword(event)}>
                    <div style={{color: 'red'}}>
                        {this.state.error_message}
                    </div>
                    Enter new password: <input type="password" name="username"></input><br></br><br></br>
                    Confirm new password: <input type="password" name="username"></input><br></br><br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
            <h3 class='form_hidden' hidden={this.state.show_window} style={{textAlign: 'center', margin: '0 auto'}}>Thank you! If this account exists, an email has been sent to reset your password</h3>
        </div>  
        <div hidden={!this.state.expired}>
            <h3 class="form_hidden">This link is not active. Please try resetting your password again from the login page.</h3>
        </div>
        </div>
        )
    }
}