import React from 'react'
import './css/EditProfileComponent.css';

export class EmailVerificationComponent extends React.Component {

    verifyEmail() {
        fetch("/api/v1/verify_email/" + window.location.href.split('/').pop(), { credentials: 'same-origin', method: 'PUT' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            if (!data.valid_link) {
                this.setState({ invalid: true});
            }
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            is_user: false,
            has_rendered: false,
            invalid: false
        }
    }

    componentDidMount() {
        this.state.has_rendered = true;
        this.verifyEmail();
    }


    render() {
        if (!this.state.has_rendered) {
            return (0);
        }
        else if (this.state.invalid) {
            return (<div style={{height: '50vh'}}><div class="form" style={{position: 'relative', top: '50%', marginLeft: '10%', width: '80%', textAlign: 'center'}}>
                        <h3>This link is no longer valid. 
                            Please attempt to sign into your account again to regenerate the email verification link.</h3>
                    </div></div>)
        }
        else {
            return (<div style={{height: '50vh'}}><div class="form" style={{position: 'relative', top: '50%', marginLeft: '10%', width: '80%', textAlign: 'center'}}>
                        <h3>Thank you for verifying your email address. You can now log in to access your account.</h3>
                    </div></div>)
        }
    }
}