import React from "react"
import './css/ProfileComponent.css';
import { PostViewComponent } from "./PostViewComponent";
import { TimesViewComponent } from "./TimesViewComponent";
import UserProfile from './Userprofile';


export class PRFriendComponent extends React.Component {

    getTimeUsers() {

    }

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            time_user_info: []
        }
        this.getTimeUsers();
    }

    render() {
        
    }
}