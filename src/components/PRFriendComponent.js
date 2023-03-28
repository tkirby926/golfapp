import React from "react"
import './css/ProfileComponent.css';
import { PostViewComponent } from "./PostViewComponent";
import { TimesViewComponent } from "./TimesViewComponent";
import UserProfile from './Userprofile';


export class PRFriendComponent extends React.Component {

    getTimeUsers() {
        fetch(UserProfile.getUrl() + "/api/v1/pr_users/" + this.state.user + "/" + this.state.timeid, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({ time_user_info: data.time_users, time_info: data.time_info});
        })
    }

    constructor(props) {
        super(props);
        const params = (new URL(document.location)).searchParams;
        this.state = {
            user: this.props.user,
            time_user_info: [],
            gen_time_data: [],
            timeid: params.get('timeid')
        }
        this.getTimeUsers();
    }

    render() {
        
    }
}