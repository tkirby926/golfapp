import React from 'react'
import Avatar from "react-avatar-edit";

export class CourseRegisterComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: "",
            pic: null,
            image: ''
        }
    }

    onCrop(event) {
        this.setState({image: event})
        console.log(event)
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
                if (data.error === "") {
                    window.location.assign("/course_welcome");
                }
                else {
                    this.setState({error: data.error});
                }
            });

    }

    render () {
        return (<form style={{height: '100%', width: '70%'}} class="form" onSubmit={(event) => this.formSubmit(event)} method="post">
            <h3>Course Register:</h3>
            <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}><Avatar exportAsSquare exportQuality={.8} exportSize={400} width={150} onCrop={(event) => this.onCrop(event)} label="Choose a Profile Photo" 
                labelStyle={{fontSize: 'small', fontWeight: 'bold', cursor: 'pointer'}} height={200} src={this.state.pic}></Avatar></div>
            <p>{this.state.error}</p>
        Course Name: <input type="text" name="name" required></input><br></br><br></br>
        Course Address: <input type="text" name="address" required></input><br></br><br></br>
        Course Town: <input type="text" name="town" required></input><br></br><br></br>
        Course State: <input type="text" name="town" required></input><br></br><br></br>
        Course Zip Code: <input type="text" name="zip" required></input><br></br><br></br>
        Email Address (Please either use email that is present 
        on your course website to prove you are a course administator): <input type="email" name="email" required></input><br></br><br></br>
        Account Password (For After Approval): <input type="text" name="pass"></input><br></br><br></br>
        Phone Number: <input type="text" name="phone"></input><br></br><br></br>
        <input type="submit" value="Submit"></input><br></br><br></br>
        <p>Thank you for registering. Someone from our team will contact you shortly to set up further logistics</p>
    </form>)
    }
}