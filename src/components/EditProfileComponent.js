import React from 'react'
import './css/EditProfileComponent.css';
import Avatar from "react-avatar-edit";
import UserProfile from './Userprofile';

export class EditProfileComponent extends React.Component {
    getPriorData() {
        fetch(UserProfile.getUrl() + "/api/v1/users", { credentials: 'include', method: 'GET' })
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
            pic: null,
            image: ""
        }
        // if (this.state.user === "null") {
        //     window.location.assign('/');
        // }
        this.getPriorData();
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
            imageData = this.convertBase64ToFile(this.state.image);
            has_photo = '1';
            i = 0;
        }
        const formData = new FormData()
        formData.append('hasphoto', has_photo)
        if (has_photo === '1') {
            formData.append('file', imageData)
        }
        formData.append('firstname', event.target[i + 2].value)
        formData.append('lastname', event.target[i + 3].value)
        formData.append('zip', event.target[i + 5].value)
        formData.append('score', event.target[i + 6].value)
        formData.append('age', event.target[i + 7].value)
        formData.append('favcourse', event.target[i + 8].value)
        formData.append('drinking', event.target[i + 9].value)
        formData.append('music', event.target[i + 10].value)
        formData.append('college', event.target[i + 11].value)
        formData.append('favgolf', event.target[i + 12].value)
        formData.append('favteam', event.target[i + 13].value)
        formData.append('playstyle', event.target[i + 14].value)
        formData.append('wager', event.target[i + 15].value)
        formData.append('cart', event.target[i + 16].value)
        formData.append('descript', event.target[i + 17].value)
        const requestOptions = {
            method: 'PUT',
            body: formData,
            // headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
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
            var src = this.state.prior_data[15]
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
                    Username: <input type="text" defaultValue={this.state.prior_data[0]} disabled={true} name="username" required></input>
                    <br></br>
                    Password: <input type="password" defaultValue="passwordshowerdoesntmatter" name="password" disabled={true} style={{marginRight: '10px', marginTop: '2vh'}}></input>
                    <br></br>
                    <a href='/pass_reset'>(To reset your password, click here)</a>
                    <br></br>
                    First Name: <input style={{marginTop: '1.5vh'}} type="text" defaultValue={this.state.prior_data[1]} name="firstname" required></input>
                    <br></br>
                    Last Name: <input style={{marginTop: '1.5vh'}} type="text" defaultValue={this.state.prior_data[2]} name="lastname" required></input>
                    <br></br>
                    Email Address: <input style={{marginTop: '1.5vh'}} type="text" defaultValue={this.state.prior_data[3]} disabled={true} name="email" required></input>
                    <br></br>
                    Zip Code (for friend suggestions): <input style={{marginTop: '1.5vh'}} type="text" pattern="[0-9]{5}" defaultValue={this.state.prior_data[17]} name="zip" required></input>
                    <br></br>
                    <h3 style={{marginTop: '1.5vh'}}>Personality Questions:</h3>
                    <p style={{marginBottom: '1.5vh', fontWeight: 'bold'}}>**No question is mandatory. Leave Questions blank or selected as "Do Not Show this Question" to omit those from your profile, 
                        you can change your answers at any time after submitting**</p>
                    What is your usual score on 18 holes (handicap)?
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="score">
                        <option value={2.5} selected={this.state.prior_data[4] == 2.5}>Do not show this question</option>
                        <option value={0} selected={this.state.prior_data[4] == 0}>Less Than 75</option>
                        <option value={1} selected={this.state.prior_data[4] == 1}>75-85</option>
                        <option value={2} selected={this.state.prior_data[4] == 2}>85-95</option>
                        <option value={3} selected={this.state.prior_data[4] == 3}>95-105</option>
                        <option value={4} selected={this.state.prior_data[4] == 4}>105-115</option>
                        <option value={5} selected={this.state.prior_data[4] == 5}>115+</option></select>
                    <br></br>
                    How old are you?
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="age">
                        <option value={2.5} selected={this.state.prior_data[16] == 2.5}>Do not show this question</option>
                        <option value={0} selected={this.state.prior_data[16] == 0}>Under 20</option>
                        <option value={1} selected={this.state.prior_data[16] == 1}>20-30</option>
                        <option value={2} selected={this.state.prior_data[16] == 2}>30-40</option>
                        <option value={3} selected={this.state.prior_data[16] == 3}>40-50</option>
                        <option value={4} selected={this.state.prior_data[16] == 4}>50-60</option>
                        <option value={5} selected={this.state.prior_data[16] == 5}>60+</option></select>
                    <br></br>
                    What is your favorite golf course you have ever played? <input style={{marginBottom: '1.5vh', marginLeft: '1vw'}} defaultValue={this.state.prior_data[5]} type="text" name="favcourse"></input><br></br>
                    Do you enjoy drinking on the course? 
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="drinking">
                        <option value={1.1} selected={this.state.prior_data[6] == 1.1}>Do not show this question</option>
                        <option value={0} selected={this.state.prior_data[6] == 0}>Always</option>
                        <option value={1} selected={this.state.prior_data[6] == 1}>Sometimes</option>
                        <option value={2} selected={this.state.prior_data[6] == 2}>Never</option></select>
                    <br></br>
                    Do you like playing music on the course? 
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="music">
                        <option value={1.1} selected={this.state.prior_data[7] == 1.1}>Do not show this question</option>
                        <option value={0} selected={this.state.prior_data[7] == 0}>Always</option>
                        <option value={1} selected={this.state.prior_data[7] == 1}>Sometimes</option>
                        <option value={2} selected={this.state.prior_data[7] == 2}>Never</option></select>
                    <br></br>
                    What college/school did you attend/support? <input defaultValue={this.state.prior_data[10]} style={{marginBottom: '1.5vh', marginLeft: '1vw'}} type="text" name="college"></input>
                    <br></br>
                    Who's your favorite professional golfer? <input defaultValue={this.state.prior_data[8]} style={{marginBottom: '1.5vh', marginLeft: '1vw'}} type="text" name="favgolf"></input><br></br>
                    What's your favorite team (any sport)? <input defaultValue={this.state.prior_data[9]} style={{marginBottom: '1.5vh', marginLeft: '1vw'}} type="text" name="favteam"></input><br></br>
                    Would you describe yourself more as a competitive, serious golfer or someone out there for a good time?
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="playstyle">
                        <option value={.5} selected={this.state.prior_data[11] == .5}>Do not show this question</option>
                        <option value={0} selected={this.state.prior_data[11] == 0}>Serious</option>
                        <option value={1} selected={this.state.prior_data[11] == 1}>Here to have fun</option></select>
                    <br></br>
                    Do you enjoy wagering on the round? <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="wager">
                        <option value={1.1} selected={this.state.prior_data[13] == 1.1}>Do not show this question</option>
                        <option value={0} selected={this.state.prior_data[13] == 0}>Just want to have fun</option>
                        <option value={1} selected={this.state.prior_data[13] == 1}>Occassionally will wagering</option>
                        <option value={2} selected={this.state.prior_data[13] == 2}>Frequently wagering</option>
                        </select><br></br>
                    Do you tend to walk or take a golf cart more? <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="cart">
                        <option value={2.1} selected={this.state.prior_data[14] == 2.1}>Do not show this question</option>
                        <option value={0} selected={this.state.prior_data[14] == 0}>Always Walk</option>
                        <option value={1} selected={this.state.prior_data[14] == 1}>Most of the time Walk</option>
                        <option value={2} selected={this.state.prior_data[14] == 2}>Half and Half</option>
                        <option value={3} selected={this.state.prior_data[14] == 3}>Most of the time Cart</option>
                        <option value={4} selected={this.state.prior_data[14] == 4}>Always Cart</option>
                        </select><br></br>
                    If you would like, please share a brief description about what kind of a golfer you are:
                    <br></br>
                    <textarea name="descript" defaultValue={this.state.prior_data[12]} style={{height: '50px', width: '80%', marginBottom: '1.5vh'}}></textarea>
                    <br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </body>
        </div>)
        }
    }
}