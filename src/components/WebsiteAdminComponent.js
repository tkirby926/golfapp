import React from 'react'
import UserProfile from './Userprofile';

export class WebsiteAdminComponent extends React.Component {

    getListOfAdmins() {
        var list = []
        fetch('/api/v1/admins', { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            list = data.admin_list;
        })
        return list;
    }

    constructor() {
        if (!this.getListOfAdmins().includes(UserProfile.checkAdminCookie())) {
            window.location.assign('/');
        }
        this.state = {
            
        }
    }
    render() {
        return (
            <p>Thank you so much for registering. A team member will reach out shortly to set up all 
                necessary components of your registration and ensure a smooth process throughout. 
                We appreciate you choosing Golfbuddies!</p>
        )
    }
}