import React from 'react'
import Avatar from "react-avatar-edit";
import UserProfile from './Userprofile';

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

    convertBase64ToFile = function (image) {
        const byteString = atob(image.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i += 1) {
          ia[i] = byteString.charCodeAt(i);
        }
        const newBlob = new Blob([ab], {
          type: 'image/jpeg',
        });
        return newBlob;
      };

    formSubmit(event) {
        event.preventDefault();
        var imageData = null;
        var has_photo = '0';
        var i = 1;
        if (this.state.image !== "") {
            i = 0;
            imageData = this.convertBase64ToFile(this.state.image);
            has_photo = '1';
        }
        const formData = new FormData()
        formData.append('hasphoto', has_photo)
        if (has_photo === '1') {
            formData.append('file', imageData)
        }
        formData.append('name', event.target[i].value)
        formData.append('address', event.target[i + 1].value)
        formData.append('town', event.target[i + 2].value)
        formData.append('state', event.target[i + 3].value)
        formData.append('zip', event.target[i + 4].value)
        formData.append('email', event.target[i + 5].value)
        formData.append('password', event.target[i + 6].value)
        formData.append('phone', event.target[i + 7].value)
        console.log(formData);
        console.log('hello')
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:  formData
        };
        fetch(UserProfile.getUrl() + '/api/v1/register_course', requestOptions)
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