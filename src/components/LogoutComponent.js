import React from "react"
import UserProfile from "./Userprofile";
import './css/LoginComponent.css'
import cookie from "react-cookie";
export class LogoutComponent extends React.Component {

    logout() {
        UserProfile.setCookie("username", "null", 30)
        window.location.assign('/')
    }

    constructor(props) {
        super(props);
        this.logout();
    }
    render() {     
    return window.confirm("Are you sure you want to log out?")
    }
}