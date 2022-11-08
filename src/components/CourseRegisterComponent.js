import React from 'react'
import UserProfile from './Userprofile';
import { useCookies } from "react-cookie";

export class CourseRegisterComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: ""
        }
    }

    formSubmit(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  name: event.target[0].value,
                                    address: event.target[1].value,
                                    town: event.target[2].value,
                                    state: event.target[3].value,
                                    zip: event.target[4].value,
                                    filename: event.target[5].value,
                                    email: event.target[6].value,
                                    password: event.target[7].value,
                                    phone: event.target[8].value })
        };
        fetch('/api/v1/register_course', requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if (data.error == "") {
                    window.location.assign("/course_welcome");
                }
                else {
                    this.setState({error: data.error});
                }
            });

    }

    render () {
        return (<form onSubmit={(event) => this.formSubmit(event)} method="post">
            <p>{this.state.error}</p>
        Course Name: <input type="text" name="name" required></input>
        Course Address: <input type="text" name="address" required></input>
        Course Town: <input type="text" name="town" required></input>
        Course State: <input type="text" name="town" required></input>
        Course Zip Code: <input type="text" name="zip" required></input>
        Course Photo for Icon: <input type="file" name="filename"></input>
        Email Address (Please either use email or phone number that is present 
        on your course website for proove you are a course admin): <input type="text" name="email" required></input>
        Account Password (For After Approval): <input type="text" name="pass"></input>
        Phone Number: <input type="text" name="phone"></input>
        <input type="submit" value="Submit"></input>
        <p>Thank you for registering. Someone from our team will contact you shortly to set up further logistics</p>
    </form>)
    }
}