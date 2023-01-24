import React from 'react'
import './css/CreateProfileComponent.css'
import Avatar from "react-avatar-edit";
import UserProfile from './Userprofile';

export class CreateProfileComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: "",
            image: "",
            dbx: null,
            user: this.props.user,
            image_readable: null,
            verify_email: false
        }
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
        if (this.state.image !== "") {
            imageData = this.convertBase64ToFile(this.state.image);
            has_photo = '1';
        }
        const formData = new FormData()
        formData.append('hasphoto', has_photo)
        if (has_photo === '1') {
            formData.append('file', imageData)
        }
        formData.append('username', event.target[0].value)
        formData.append('password', event.target[1].value)
        formData.append('firstname', event.target[2].value)
        formData.append('lastname', event.target[3].value)
        formData.append('email', event.target[4].value)
        formData.append('drinking', event.target[5].value)
        formData.append('score', event.target[6].value)
        formData.append('college', event.target[7].value)
        formData.append('playstyle', event.target[8].value)
        formData.append('descript', event.target[9].value)

        const requestOptions = {
            method: 'POST',
            body: formData
        };
        fetch(UserProfile.getUrl() + '/api/v1/create', requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if (data.error === "") {
                    this.setState({verify_email: true})
                }
                else {
                    this.setState({error: data.error})
                }
            });

    }

    updatePhoto(event) {
        event.preventDefault();
        const file_container = document.getElementById('inputfile');
        const container = document.getElementById('image-preview');
        const img = container.querySelector('.image-preview-image');
        const text = container.querySelector('.image-preview-text');
        const file = file_container.files[0];
        const reader = new FileReader();
        text.style.display = 'none';
        img.style.display = 'block';
        reader.addEventListener("load", function() {
            img.setAttribute("src", this.result);
        })
        reader.readAsDataURL(file);
    }

    onCrop(event) {
        this.setState({image: event})
        console.log(event)
    }

    testImage(e) {
        e.preventDefault();
        this.forceUpdate();
    }

    render () {
        const x = this.state.error;
        console.log(x)
        if (!this.state.verify_email) {
            return (
                <div>
                <body>
                    <form class="form" style={{height: '100%', width: '70%'}} onSubmit={(event) => this.formSubmit(event)} method="post">
                    <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}><Avatar exportAsSquare exportQuality={.8} exportSize={400} width={150} onCrop={(event) => this.onCrop(event)} label="Choose a Profile Photo" 
                    labelStyle={{fontSize: 'small', fontWeight: 'bold', cursor: 'pointer'}} height={200} src={this.state.pic}></Avatar></div>
                    <p style={{color: 'red'}}>{this.state.error}</p>
                    Username: <input onChange={(event) => this.testImage(event)} type="text" name="username" required></input>
                    <br></br>
                    Password: <input type="password" name="password" style={{marginRight: '10px', marginTop: '2vh'}}></input>
                    <br></br>
                    First Name: <input style={{marginTop: '1.5vh'}} type="text" name="firstname" required></input>
                    <br></br>
                    Last Name: <input style={{marginTop: '1.5vh'}} type="text" name="lastname" required></input>
                    <br></br>
                    Email: <input style={{marginTop: '1.5vh'}} type="text" name="email" required></input>
                    <br></br>
                    <h3 style={{marginTop: '1.5vh'}}>Personality Questions:</h3>
                    <p style={{marginBottom: '1.5vh'}}>No question is mandatory. If you wish to remove a question from your profile page, 
                        change it to blank</p>
                    Do you enjoy drinking on the course
                    <select style={{marginBottom: '1.5vh'}} name="drinking">
                        <option value="none">Do not show this question</option>
                        <option value="a">Always</option>
                        <option value="s">Sometimes</option>
                        <option value="n">Never</option></select>
                    <br></br>
                    What is your usual score on 18 holes on an average course?
                    <select style={{marginBottom: '1.5vh'}} name="score">
                        <option value="a">Do not show this question</option>
                        <option value="b">Less Than 75</option>
                        <option value="c">75-85</option>
                        <option value="d">85-95</option>
                        <option value="e">95-105</option>
                        <option value="f">105-115</option>
                        <option value="g">115+</option></select>
                    <br></br>
                    What school did you attend? <input style={{marginBottom: '1.5vh'}} type="text" name="college"></input>
                    <br></br>
                    How serious of a golfer are you?
                    <select style={{marginBottom: '1.5vh'}} name="playstyle">
                        <option value="a">Do not show this question</option>
                        <option value="b">Stickler for the game and want to win</option>
                        <option value="c">Follow rules but not incredibly serious</option>
                        <option value="d">Will keep score but fun comes first</option>
                        <option value="e">Here for a good time</option>
                        <option value="f">105-115</option>
                        <option value="g">115+</option></select>
                    <br></br>
                    If you would like, please share a brief description about what kind of a golfer you are:
                    <br></br>
                    <textarea name="descript" style={{height: '50px', width: '80%', marginBottom: '1.5vh'}}></textarea>
                    <br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </body>
        </div>)
        }
        else {
            return (
                <div>
                    <body>
                        <div style={{height: '50vh'}}>
                            <div class="form" style={{position: 'relative', top: '50%', marginLeft: '10%', width: '80%', textAlign: 'center'}}>
                            <h3>Thank you for registering. We have just sent an verification to the email you listed, please click the link to get started!</h3>
                            </div>
                        </div>
                    </body>
                </div>
            )
        }
    }
}
