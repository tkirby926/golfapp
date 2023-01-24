import React from 'react'
import UserProfile from './Userprofile';

export class WebsiteAdminComponent extends React.Component {

    checkAdmin() {
        fetch(UserProfile.getUrl() + '/api/v1/admininfo/' + this.state.admin_cookie, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            if (!data.is_admin) {
                window.location.assign('/')
            }
            else {
                this.setState({info: data.info})
            }
        })
    }

    constructor() {
        this.state = {
            admin_cookie: UserProfile.checkAdminCookie(),
            has_rendered: false,
            info: []
        }
    }

    componentDidMount() {
        this.state.has_rendered = true;
        this.checkAdmin();
    }

    render() {
        if (!this.state.has_rendered) {
            return ('');
        }
        else {
            return (
                <div>
                    <h2>Stats:</h2>
                    <h3>Number of Users: </h3>
                    <h3> </h3>
                </div>
            )
        }
        
    }
}