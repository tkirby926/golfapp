import React from "react"
import UserProfile from "./Userprofile";
import './css/LoginComponent.css'
export class CourseLogoutComponent extends React.Component {

    logout() {
        fetch(UserProfile.getUrl() + "/api/v1/course_logout", { credentials: 'include', method: 'GET' })
        window.location.assign('/')
    }

    constructor(props) {
        super(props);
        const params = (new URL(document.location)).searchParams;
        this.state = {
            return_url: params.get('return_url'),
        }
    }
    render() {     
        if (window.confirm("Are you sure you want to log out?")) {
            this.logout();
        }
        else {
            window.location.assign(this.state.return_url)
        }
        return (0);
    }
}