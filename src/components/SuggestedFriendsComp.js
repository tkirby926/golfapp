import React from "react"
import './css/ProfileComponent.css';
import { PostViewComponent } from "./PostViewComponent";
import { TimesViewComponent } from "./TimesViewComponent";
import ProfHelper from "./ProfHelper";
import UserProfile from './Userprofile';


export class SuggestedFriendsComponent extends React.Component {

    getUsers() {
        fetch(UserProfile.getUrl() + "/api/v1/suggested_friends/" + this.state.page, { credentials: 'include', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                this.setState({suggested_users: data.suggested_friends});
            })
    }


    constructor(props) {
        super(props);
        this.state = {
            suggested_users: [],
            page: 0
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        var display = 'flex';
        if (window.innerWidth < 850) {
            display = 'block';
        }
        return (
        <div>
            <div>
                <h3>Friend Suggestions: </h3>
            </div>
            <div style={{float: 'left', display: display}}>
                {this.state.suggested_users.map((user, index) => {
                    return ProfHelper.getProf(user, 'n');
                })}
            </div>
        </div>)
    }

}