import React from "react"
import './css/MessagingComponent.css'
import PaymentWindowComponent from "./PaymentWindowComponent";
import UserProfile from './Userprofile';

export class PaymentContainerComponent extends React.Component {

    getTimeInfo() {
        fetch(UserProfile.getUrl() + "/api/v1/teetime/" + this.state.timeid, { credentials: 'include', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data)
            this.setState({time_info: data.time_info, in_time: data.in_time});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            users: 1,
            timeid: window.location.href.split('/').pop(),
            time_info: [null, null, null, null, null, null, null, null, null, null, null, []],
            in_time: []
        }
    }

    componentDidMount() {
        this.getTimeInfo()
    }

    returnToHome(e) {
        e.preventDefault();
        window.location.assign('/tee_time/' + this.state.timeid);
    }

    render() {
        var date = new Date(this.state.time_info[1])
        date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
        var date_readable = date.toLocaleDateString();
        console.log(date_readable)
        var time_readable = date.toLocaleString([], {hour: '2-digit', minute:'2-digit'});
        return (
        <div class="user_button_inv" style={{width: '80%', margin: '0 auto', textAlign: 'center'}}>
            <div>
                <button style={{marginTop: '5vh', width: '100px', marginBottom: '5vh', marginLeft: '5%', display: 'flex'}} onClick={(event) => this.returnToHome(event)} class="button4_inv">Cancel</button>
                </div>
                <h1>{this.state.time_info[0]}</h1><br></br>
                <h2>Time: {date_readable}, {time_readable}</h2>
                <h3>Number of Users Booking for:</h3>
                <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="users">
                        <option value="1">1</option>
                        <option hidden={this.state.time_info[11].length > 2}value="2">2</option>
                        <option hidden={this.state.time_info[11].length > 1}value="3">3</option>
                        <option hidden={this.state.time_info[11].length > 0} value="4">4</option></select>
                <div style={{textAlign: 'center'}}>
                <p style={{width: '90%', fontSize: 'small', margin: '0 auto'}}>Remember, you don't have to pay for your friends now. You will have the chance after booking to invite them to this teetime, where they will be sent an email link to join directly using their Golftribe account.</p>
            </div>
            <PaymentWindowComponent num_users={this.state.users}></PaymentWindowComponent>
        </div>
        )
    }


}