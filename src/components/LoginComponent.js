import React from "react"
import UserProfile from "./Userprofile";
import './css/LoginComponent.css'
import cookie from "react-cookie";

export class LoginComponent extends React.Component {
    test_login(event) {
        event.preventDefault()
        fetch("/api/v1/login/" + event.target[0].value + '/' + event.target[1].value, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            if (data.too_many_attmpts) {
                this.setState({too_many_attmpts: true})
            }
            if (data.is_admin) {
                UserProfile.setCookie("admin", event.target[0].value, 30);
                window.location.assign("/9261999/admin")
            }
            if (data.correct_login == true) {
                UserProfile.setCookie("username", event.target[0].value, 30);
                window.location.assign(this.state.return_url);
            }
            else {
                this.setState({
                    error_message: "Invalid Username/Password combination"
                })
            }
        })
    }

    constructor(props) {
        super(props);
        const params = (new URL(document.location)).searchParams;
        this.state = {
            error_message: "",
            return_url: params.get('return_url'),
            too_many_attmpts: false
        }
    }

    goBack(e) {
        e.preventDefault();
        if (this.state.return_url != null) {
            window.location.assign(this.state.return_url)
        }
        else {
            window.location.assign('/')
        }
    }

    render() {
        return (
        <div style={{minHeight: '100vh'}}>
        <body>
        <div>
            <button class="button4" style={{padding: '10px', marginLeft: '25vw', marginTop: '10vh', marginBottom: '10vh'}} onClick={(event) => this.goBack(event)}>Back</button>
            <form class="form" style={{width: '50%', marginLeft: '25%'}} onSubmit={(event) => this.test_login(event)}>
                <div hidden={this.state.too_many_attmpts}>
                    <div style={{color: 'red'}}>
                        {this.state.error_message}
                    </div>
                    Username: <input type="text" name="username"></input><br></br><br></br>
                    Password: <input type="password" name="password"></input><br></br><br></br>
                    <input type="submit" value="Submit"></input><br></br><br></br>
                    <a href='/reset_pass'>Forgot Password</a>
                </div>
                <div hidden={!this.state.too_many_attmpts}>
                    <p style={{textAlign: 'center'}}>You have failed your login too many times. An email has been sent to reset your password</p>
                    <button class="button4" style={{width: '80%', marginLeft: '10%'}}>Resend email</button>
                </div>
            </form>
        </div>  
        <div class='bottom_text'>
            <a href="/create_profile">Don't have an account? <p style={{fontWeight: 'bold', display: 'inline'}}>Create One here</p></a><br></br>
            <p>Course Administrator? </p>
            <a style={{fontWeight: 'bold'}} href="/register_course">Register Your Course Here</a>
            <p> or </p>
            <a style={{fontWeight: 'bold'}} href="/course_login">Log in to Your Course Profile Here</a>
        </div>
        </body>
        </div>
        )
    }
}