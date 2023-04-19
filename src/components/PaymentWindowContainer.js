import React from "react"
import './css/MessagingComponent.css'
import PaymentWindowComponent from "./PaymentWindowComponent";
import UserProfile from './Userprofile';

export class PostViewComponent extends React.Component {

    getCourseInfo() {
        
    }

    constructor(props) {
        super(props);
        this.state = {
            users: 1,
            course_info: ['']
        }
    }

    componentDidMount() {
        this.getCourseInfo()
    }

    render() {
        return (
        <div>
            <div>
                <button style={{marginTop: '5vh', width: '100px', marginLeft: '15vw', marginBottom: '5vh'}} onClick={(event) => returnToHome(event)} class="button">Cancel</button>
                </div>
                <h1>{course_info[0]}</h1><br></br>
                <h3>Number of Users Booking for:</h3>
                <div style={{textAlign: 'center'}}>
                <p style={{width: '30%', fontSize: 'small', margin: '0 auto'}}>Remember, you don't have to pay for your friends now. You will have the chance after booking to invite them to this teetime, where they will be sent an email link to join directly using their Golftribe account.</p>
            </div>
            <PaymentWindowComponent num_users={this.state.users}></PaymentWindowComponent>
        </div>
        )
    }


}