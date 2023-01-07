import React from 'react'
import UserProfile from './Userprofile';
import './css/EditProfileComponent.css';
import { useCookies } from "react-cookie";
import Avatar from "react-avatar-edit";

export class EditProfileComponent extends React.Component {
    getPriorData() {
        fetch("/api/v1/users/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ prior_data: data.user});
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            prior_data: [],
            error: "",
            user: this.props.user,
            pic: null
        }
        console.log(Promise.resolve(this.state.user))
        // if (this.state.user == "null") {
        //     window.location.assign('/');
        // }
        if (typeof this.state.user != undefined && this.state.user != 'null') {
            this.getPriorData();
        }
    }

    formSubmit(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  username: event.target[1].value,
                                    firstname: event.target[3].value,
                                    lastname: event.target[4].value,
                                    email: event.target[5].value,
                                    drinking: event.target[6].value,
                                    score: event.target[7].value,
                                    college: event.target[8].value,
                                    playstyle: event.target[9].value,
                                    descript: event.target[10].value,
                                    oldusername: this.state.user})
        };
        fetch('/api/v1/edit', requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if (data.error == "") {
                    UserProfile.setName(event.target[0].value);
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

    returnToHome(e) {
        e.preventDefault();
        window.location.assign('/')
    }

    render () {
        if (this.state.prior_data != []) {
            console.log(this.state.prior_data)
            const x = this.state.error;
            console.log(x)
            var name = this.state.prior_data[2] + " " + this.state.prior_data[3];
            return (
            <div>
                <button style={{marginTop: '5vh', width: '100px', marginLeft: '15vw', marginBottom: '5vh'}} onClick={(event) => this.returnToHome(event)} class="button">Cancel</button>
                <body>
                    <form class="form" style={{height: '100%', width: '70%'}} onSubmit={(event) => this.formSubmit(event)} method="post">
                    <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}><Avatar width={150} label="Choose a New Photo" 
                    labelStyle={{fontSize: 'small', fontWeight: 'bold', cursor: 'pointer'}} height={200} src={this.state.pic}></Avatar></div>
                    <p style={{color: 'red'}}>{this.state.error}</p>
                    Username: <input type="text" defaultValue={this.state.prior_data[0]} name="username" required></input>
                    <br></br>
                    Password: <input type="password" defaultValue={this.state.prior_data[1]} name="password" disabled={true} style={{marginRight: '10px', marginTop: '2vh'}}></input>
                    <br></br>
                    <a href='/pass_reset'>(To reset your password, click here)</a>
                    <br></br>
                    First Name: <input style={{marginTop: '1.5vh'}} type="text" defaultValue={this.state.prior_data[2]} name="firstname" required></input>
                    <br></br>
                    Last Name: <input style={{marginTop: '1.5vh'}} type="text" defaultValue={this.state.prior_data[3]} name="lastname" required></input>
                    <br></br>
                    Email Address: <input style={{marginTop: '1.5vh'}} type="text" defaultValue={this.state.prior_data[4]} name="email" required></input>
                    <br></br>
                    <h3 style={{marginTop: '1.5vh'}}>Personality Questions:</h3>
                    <p style={{marginBottom: '1.5vh'}}>No question is mandatory. If you wish to remove a question from your profile page, 
                        change it to blank</p>
                    Do you enjoy drinking on the course
                    <select style={{marginBottom: '1.5vh'}} name="drinking">
                        <option value="none" selected={this.state.prior_data[5] == "none"}>Do not show this question</option>
                        <option value="a" selected={this.state.prior_data[5] == "a"}>Always</option>
                        <option value="s" selected={this.state.prior_data[5] == "s"}>Sometimes</option>
                        <option value="n" selected={this.state.prior_data[5] == "n"}>Never</option></select>
                    <br></br>
                    What is your usual score on 18 holes on an average course?
                    <select style={{marginBottom: '1.5vh'}} name="score">
                        <option value="a" selected={this.state.prior_data[6] == "a"}>Do not show this question</option>
                        <option value="b" selected={this.state.prior_data[6] == "b"}>Less Than 75</option>
                        <option value="c" selected={this.state.prior_data[6] == "c"}>75-85</option>
                        <option value="d" selected={this.state.prior_data[6] == "d"}>85-95</option>
                        <option value="e" selected={this.state.prior_data[6] == "e"}>95-105</option>
                        <option value="f" selected={this.state.prior_data[6] == "f"}>105-115</option>
                        <option value="g" selected={this.state.prior_data[6] == "g"}>115+</option></select>
                    <br></br>
                    What school did you attend? <input style={{marginBottom: '1.5vh'}} type="text" defaultValue={this.state.prior_data[7]} name="college"></input>
                    <br></br>
                    How serious of a golfer are you?
                    <select style={{marginBottom: '1.5vh'}} name="playstyle">
                        <option value="a" selected={this.state.prior_data[8] == "a"}>Do not show this question</option>
                        <option value="b" selected={this.state.prior_data[8] == "b"}>Stickler for the game and want to win</option>
                        <option value="c" selected={this.state.prior_data[8] == "c"}>Follow rules but not incredibly serious</option>
                        <option value="d" selected={this.state.prior_data[8] == "d"}>Will keep score but fun comes first</option>
                        <option value="e" selected={this.state.prior_data[8] == "e"}>Here for a good time</option>
                        <option value="f" selected={this.state.prior_data[8] == "f"}>105-115</option>
                        <option value="g" selected={this.state.prior_data[8] == "g"}>115+</option></select>
                    <br></br>
                    If you would like, please share a brief description about what kind of a golfer you are:
                    <br></br>
                    <textarea name="descript" defaultValue={this.state.prior_data[9]} style={{height: '50px', width: '80%', marginBottom: '1.5vh'}}></textarea>
                    <br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </body>
        </div>)
        }
    }
}