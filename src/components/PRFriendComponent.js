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
            if (data.error == "Y") {
                throw(404);
            }
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

    showUsers() {
        if (this.state.tee_time_info[11].length > 0) {
            var width = (100/this.state.tee_time_info[11].length).toString() + "%";
            return (
                <div style={{width: '100%', display: 'table'}}>
                    <div>
                        <h3>{this.state.gen_time_data[0]}</h3><br></br>
                        <h3>{this.state.gen_time_data[1]}</h3>
                    </div>
                    <div style={{display: 'table-row', height: '40vh'}}>
                        {this.state.tee_time_info[11].map((user, index) => { 
                        console.log(user)
                        var user_link = "/user/" + user[0];
                        var src = user[9];
                        if (src === null) {
                            src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';;
                        }
                        return (
                            <form class="user_button" style={{width: {width}, display: 'table-cell', borderRadius: '50px'}}>
                                <div>
                                    <h4 style={{fontWeight: 'bold', textAlign: 'center', marginBottom:'0'}}>{user[0]}</h4>
                                    <div style={{width: '100%', float: 'left', marginTop:'5%'}}>
                                        <img src={src} style={{height: '50px', margin: '0 auto', borderRadius: '50%'}}></img>
                                    </div>
                                    
                                </div>
                                <div>
                                
                                    <div style={{color: '#080B3E'}}>Name: {user[1] + " " + user[2]}</div>
                                    {this.checkNull(3, "Usual Score: ")}
                                    {this.checkNull(4, "Favorite golf course played: ")}
                                    {this.checkNull(5, "Drinking on the course: ")}
                                    {this.checkNull(6, "Music on the course: ")}
                                    {this.checkNull(7, "College/School: ")}
                                    {this.checkNull(8, "Favorite Golfer: ")}
                                    {this.checkNull(9, "Favorite Team: ")}
                                    {this.checkNull(10, "Serious or casual golfer: ")}
                                    {this.checkNull(11, "Wagering on the course: ")}
                                    {this.checkNull(12, "Golf Cart or Walking: ")}
                                    {this.checkNull(13, "Description: ")}
                                </div>
                            </form>
                        )})}
                    </div>
                </div>)
        }
    }

    render() {
        return (
            <div>
                {this.showUsers()}
            </div>
        )
    }
}