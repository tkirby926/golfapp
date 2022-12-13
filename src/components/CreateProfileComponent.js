import React from 'react'
import UserProfile from './Userprofile';
import './css/CreateProfileComponent.css'
import { useCookies } from "react-cookie";
import Avatar from "react-avatar-edit";

export class CreateProfileComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: ""
        }
    }

    formSubmit(event) {
        event.preventDefault();
        console.log(event.target[0])
        if (event.target[0].value.length < 6 || event.target[0].value.length > 15) {
            this.setState({error: "Username must be between 6 and 15 characters"});
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  username: event.target[0].value,
                                    password: event.target[1].value,
                                    firstname: event.target[2].value,
                                    lastname: event.target[3].value,
                                    filename: event.target[4].value,
                                    email: event.target[5].value,
                                    drinking: event.target[6].value,
                                    score: event.target[7].value,
                                    college: event.target[8].value,
                                    playstyle: event.target[9].value,
                                    descript: event.target[10].value})
        };
        fetch('/api/v1/create', requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if (data.error == "") {
                    UserProfile.setCookie('username', event.target[0].value, 30);
                    window.location.assign("/");
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

    render () {
        const x = this.state.error;
        console.log(x)
        return (
            <div>
            <body>
                <form class="form" style={{height: '100%', width: '70%'}} onSubmit={(event) => this.formSubmit(event)} method="post">
                <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}><Avatar width={150} label="Choose a Profile Photo" 
                labelStyle={{fontSize: 'small', fontWeight: 'bold', cursor: 'pointer'}} height={200} src={this.state.pic}></Avatar></div>
                <p style={{color: 'red'}}>{this.state.error}</p>
                Username: <input type="text" name="username" required></input>
                <br></br>
                Password: <input type="password" name="password" style={{marginRight: '10px', marginTop: '2vh'}}></input>
                <br></br>
                First Name: <input style={{marginTop: '1.5vh'}} type="text" name="firstname" required></input>
                <br></br>
                Last Name: <input style={{marginTop: '1.5vh'}} type="text" name="lastname" required></input>
                <br></br>
                Profile Photo: <input style={{marginTop: '1.5vh'}} type="file" name="filename" id='inputfile' onChange={(event) => this.updatePhoto(event)}></input>
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
}