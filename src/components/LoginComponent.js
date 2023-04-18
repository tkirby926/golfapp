import React from "react"
import UserProfile from "./Userprofile";
import './css/LoginComponent.css'

export class LoginComponent extends React.Component {
    test_login(event) {
        event.preventDefault()
        fetch(UserProfile.getUrl() + "/api/v1/login/" + event.target[0].value + '/' + event.target[1].value, { credentials: 'include', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          let cookieHeader = response.headers.get('set-cookie'); 
          document.cookie = cookieHeader;
          return response.json();
        })
        .then((data) => {
            if (data.too_many_attmpts) {
                this.setState({too_many_attmpts: true})
            }
            if (data.correct_login === true) {
                if (data.first) {
                    window.location.assign('/');
                }
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
            too_many_attmpts: false, 
            under_width: false
        }
    }

    goBack(e) {
        e.preventDefault();
        if (this.state.return_url !== null) {
            window.location.assign(this.state.return_url)
        }
        else {
            window.location.assign('/')
        }
    }

    render() {
        this.state.under_width = false;
        var form_wid = '50%';
        var marg_lef = '25%';
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            form_wid = '90%';
            marg_lef = '0%';
        }
        return (
        <div style={{minHeight: '100vh'}}>
        <body>
        <div>
            <button class="button4" style={{padding: '10px', marginLeft: '25vw', marginTop: '10vh', marginBottom: '10vh'}} onClick={(event) => this.goBack(event)}>Back</button>
            <form class="form" style={{width: form_wid, marginLeft: marg_lef}} onSubmit={(event) => this.test_login(event)}>
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
            <a style={{fontWeight: 'bold'}} href="/create_profile">Create Personal Account here</a><br></br><br></br>
            <a style={{fontWeight: 'bold'}} href="/course_login">Course Administrator? Log in to Your Course Profile Here</a>
            <p style={{fontSize: 'small'}}>To register your golf course with Golftribe, please email service@golftribe.com with your inquiry and our team will help you get started</p>
        </div>
        </body>
        </div>
        )
    }
}