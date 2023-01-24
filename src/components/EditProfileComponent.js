import React from 'react'
import './css/EditProfileComponent.css';
import Avatar from "react-avatar-edit";

export class EditProfileComponent extends React.Component {
    getPriorData() {
        fetch(UserProfile.getUrl() + "/api/v1/users/" + this.state.user, { credentials: 'same-origin', method: 'GET' })
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
            pic: null,
            image: ""
        }
        console.log(Promise.resolve(this.state.user))
        // if (this.state.user === "null") {
        //     window.location.assign('/');
        // }
        if (typeof this.state.user !== undefined && this.state.user !== 'null') {
            this.getPriorData();
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
        formData.append('oldusername', this.state.user)

        const requestOptions = {
            method: 'PUT',
            body: formData 
        };
        fetch(UserProfile.getUrl() + '/api/v1/edit', requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data)
                if (data.error === "") {
                    window.location.assign("/");
                }
                else {
                    this.setState({error: data.error})
                }
            });
    }

    onCrop(event) {
        this.setState({image: event})
        console.log(event)
    }

    returnToHome(e) {
        e.preventDefault();
        window.location.assign('/')
    }

    render () {
        if (this.state.prior_data !== []) {
            console.log(this.state.prior_data)
            const x = this.state.error;
            console.log(x)
            var name = this.state.prior_data[2] + " " + this.state.prior_data[3];
            var src = this.state.prior_data[10]
                if (src === null) {
                    src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
                }
            return (
            <div>
                <button style={{marginTop: '5vh', width: '100px', marginLeft: '15vw', marginBottom: '5vh'}} onClick={(event) => this.returnToHome(event)} class="button">Cancel</button>
                <body>
                    <form class="form" style={{height: '100%', width: '70%'}} onSubmit={(event) => this.formSubmit(event)} method="post">
                    <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}>
                        <Avatar exportAsSquare onCrop={(event) => this.onCrop(event)} width={150} label="Choose a New Photo" 
                    labelStyle={{fontSize: 'small', fontWeight: 'bold', cursor: 'pointer'}} height={200} src={this.state.pic}></Avatar>
                    <div style={{marginLeft: '15%', width: 'auto'}}>
                        <h3>Current Profile Picture:</h3>
                        <img src={src} style={{height: '100px', borderRadius: '50%', display: 'flex', margin: '0 auto'}}></img>
                    </div>
                    </div>
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
                        <option value="none" selected={this.state.prior_data[5] === "none"}>Do not show this question</option>
                        <option value="a" selected={this.state.prior_data[5] === "a"}>Always</option>
                        <option value="s" selected={this.state.prior_data[5] === "s"}>Sometimes</option>
                        <option value="n" selected={this.state.prior_data[5] === "n"}>Never</option></select>
                    <br></br>
                    What is your usual score on 18 holes on an average course?
                    <select style={{marginBottom: '1.5vh'}} name="score">
                        <option value="a" selected={this.state.prior_data[6] === "a"}>Do not show this question</option>
                        <option value="b" selected={this.state.prior_data[6] === "b"}>Less Than 75</option>
                        <option value="c" selected={this.state.prior_data[6] === "c"}>75-85</option>
                        <option value="d" selected={this.state.prior_data[6] === "d"}>85-95</option>
                        <option value="e" selected={this.state.prior_data[6] === "e"}>95-105</option>
                        <option value="f" selected={this.state.prior_data[6] === "f"}>105-115</option>
                        <option value="g" selected={this.state.prior_data[6] === "g"}>115+</option></select>
                    <br></br>
                    What school did you attend? <input style={{marginBottom: '1.5vh'}} type="text" defaultValue={this.state.prior_data[7]} name="college"></input>
                    <br></br>
                    How serious of a golfer are you?
                    <select style={{marginBottom: '1.5vh'}} name="playstyle">
                        <option value="a" selected={this.state.prior_data[8] === "a"}>Do not show this question</option>
                        <option value="b" selected={this.state.prior_data[8] === "b"}>Stickler for the game and want to win</option>
                        <option value="c" selected={this.state.prior_data[8] === "c"}>Follow rules but not incredibly serious</option>
                        <option value="d" selected={this.state.prior_data[8] === "d"}>Will keep score but fun comes first</option>
                        <option value="e" selected={this.state.prior_data[8] === "e"}>Here for a good time</option>
                        <option value="f" selected={this.state.prior_data[8] === "f"}>105-115</option>
                        <option value="g" selected={this.state.prior_data[8] === "g"}>115+</option></select>
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