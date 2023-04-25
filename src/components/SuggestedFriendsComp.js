import React from "react"
import './css/ProfileComponent.css';
import { PostViewComponent } from "./PostViewComponent";
import { TimesViewComponent } from "./TimesViewComponent";
import ProfHelper from "./ProfHelper";
import UserProfile from './Userprofile';


export class SuggestedFriendsComponent extends React.Component {

    getUsers(page) {
        fetch(UserProfile.getUrl() + "/api/v1/suggested_friends/" + page, { credentials: 'include', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                this.setState({suggested_users: data.suggested_friends, page: page});
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
        this.getUsers(this.state.page);
    }

    render() {
        var display = 'flex';
        if (window.innerWidth < 850) {
            display = 'block';
        }
        return (
        <div>
            <div class="user_button_biege" style={{textAlign: 'center', margin: '0 auto', width: '80%', color: 'black', paddingTop: '20px', paddingBottom: '20px'}}>
                <h3>Friend Suggestions: </h3>
                <h4>Based on your profile preferences and location setting, here are some suggestions for people you might like to book teetimes with!</h4>
            </div>
            <div style={{float: 'left', display: display, marginBottom: '5vh', marginTop: '3vh'}}>
                {this.state.suggested_users.map((user, index) => {
                    return ProfHelper.getProf(user, 'n');
                })}
            </div>
            <div class="button4" onClick={(event) => this.getUsers(this.state.page + 1)} style={{clear: 'both', width: '20%', display: 'flex', flex: 1, justifyContent: 'center', margin: '20px auto'}}>Refresh Users</div>
        </div>)
    }

}