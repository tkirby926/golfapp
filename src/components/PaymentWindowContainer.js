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

    updateUsers(e) {
        e.preventDefault();
        this.setState({users: e.target.value})
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
        if (time_readable[0] == '0') time_readable = time_readable.substr(1);
        var wid = window.innerWidth < 850 ? '100%' : '80%';
        return (
        <div class="user_button_inv" style={{width: wid, margin: '0 auto', textAlign: 'center'}}>
            <div>
                <button style={{marginTop: '5vh', width: '100px', marginBottom: '5vh', marginLeft: '5%', display: 'block', textAlign: 'center'}} onClick={(event) => this.returnToHome(event)} class="button4_inv">Cancel</button>
                </div>
                <h1>{this.state.time_info[0]}</h1><br></br>
                <h2>Time: {date_readable}, {time_readable}</h2>
                <h3>Number of Users Booking for:</h3>
                <select style={{marginBottom: '1.5vh', marginLeft: '1vw', fontSize: '16px', fontFamily: 'Arial, Helvetica, sans-serif'}} onChange={(event) => this.updateUsers(event)} name="users">
                        <option value="1">Just Me</option>
                        <option hidden={this.state.time_info[11].length > 2}value="2">2 Total People</option>
                        <option hidden={this.state.time_info[11].length > 1}value="3">3 Total People</option>
                        <option hidden={this.state.time_info[11].length > 0} value="4">4 Total People</option></select>
                <div style={{textAlign: 'center'}}>
                <p style={{width: '90%', fontSize: 'small', margin: '0 auto'}}>Remember, you don't have to book for your friends now. You will have the chance after booking to invite them to this teetime, where they will be sent an email link to join directly using their Golftribe account.</p>
            </div>
            <PaymentWindowComponent key={this.state.users} num_users={this.state.users}></PaymentWindowComponent>
        </div>
        )
    }


}