import React from 'react'
import './css/CourseProfileComponent.css';
import Avatar from "react-avatar-edit";
import UserProfile from './Userprofile';

export class EditCourseProfComponent extends React.Component {

    getPriorData() {
        fetch(UserProfile.getUrl() + "/api/v1/courses/" + this.state.course, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data)
            this.setState({ prior_data: data.course_info});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            prior_data: [],
            course: this.props.cid,
            has_rendered: false
        }
    }

    componentDidMount() {
        this.state.has_rendered = true;
        this.getPriorData();
    }

    render () {
        if (this.state.has_rendered) {
            var can_edit = this.state.prior_data[12] === '0'
            return (<form style={{height: '100%', width: '70%'}} class="form" onSubmit={(event) => this.formSubmit(event)} method="post">
                <h3>Course Edit:</h3>
                <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}><Avatar exportAsSquare exportQuality={.8} exportSize={400} width={150} onCrop={(event) => this.onCrop(event)} label="Choose a Profile Photo" 
                    labelStyle={{fontSize: 'small', fontWeight: 'bold', cursor: 'pointer'}} height={200} src={this.state.pic}></Avatar></div>
                <p>{this.state.error}</p>
            Course Name: <input type="text" name="name" required disabled={can_edit}></input><br></br><br></br>
            Course Address: <input type="text" name="address" required disabled={can_edit}></input><br></br><br></br>
            Course Town: <input type="text" name="town" required disabled={can_edit}></input><br></br><br></br>
            Course State: <input type="text" name="town" required disabled={can_edit}></input><br></br><br></br>
            Course Zip Code: <input type="text" name="zip" required disabled={can_edit}></input><br></br><br></br>
            Email Address (Please either use email that is present 
            on your course website to prove you are a course administator): <input type="email" name="email" required disabled={can_edit}></input><br></br><br></br>
            Account Password (For After Approval): <input type="text" name="pass" disabled={can_edit}></input><br></br><br></br>
            Phone Number: <input type="text" name="phone" disabled={can_edit}></input><br></br><br></br>
            <input type="submit" value="Submit"></input><br></br><br></br>
            <h3 style={{color: 'red', textAlign: 'center'}} hidden={!can_edit}>You have not been cleared to make changes. Please email blahblahblah@gmail.com and we'll help you edit your account info!</h3>
        </form>)
        }
        else {
            return (0)
        }
    }
}