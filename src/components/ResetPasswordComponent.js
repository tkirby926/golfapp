
import React from "react"
import './css/LoginComponent.css'

export class ResetPasswordComponent extends React.Component {

    goBack(e) {
        e.preventDefault();
        window.location.assign('/login');
    }

    test_email(e) {
        e.preventDefault();
        fetch(UserProfile.getUrl() + "/api/v1/email/" + e.target[0].value, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            if (data.is_account !== 1) {
                this.setState({error_message: "No accounts with this email address"});
            }
            else {
                this.setState({error_message: "", show_window: false});
            }
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            error_message: "",
            show_window: true
        }
    }

    render() {
        return (
        <div style={{minHeight: '100vh'}}>
        <body>
        <div>
            <button class="button4" style={{marginLeft: '15vw', marginTop: '10vh', marginBottom: '10vh'}} onClick={(event) => this.goBack(event)}>Back</button>
            <div hidden={!this.state.show_window}>
                <form class="form" onSubmit={(event) => this.test_email(event)}>
                    <div style={{color: 'red'}}>
                        {this.state.error_message}
                    </div>
                    Email: <input type="text" name="username"></input><br></br><br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
            <h3 hidden={this.state.show_window} style={{textAlign: 'center', margin: '0 auto'}}>Email has been sent to reset your password</h3>
        </div>  
        </body>
        </div>
        )
    }
}