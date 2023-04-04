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
        formData.append('username', event.target[i].value)
        formData.append('password', event.target[i + 1].value)
        formData.append('firstname', event.target[i + 2].value)
        formData.append('lastname', event.target[i + 3].value)
        formData.append('email', event.target[i + 4].value)
        formData.append('score', event.target[i + 5].value)
        formData.append('favcourse', event.target[i + 6].value)
        formData.append('drinking', event.target[i + 7].value)
        formData.append('music', event.target[i + 8].value)
        formData.append('college', event.target[i + 9].value)
        formData.append('favgolf', event.target[i + 10].value)
        formData.append('favteam', event.target[i + 11].value)
        formData.append('playstyle', event.target[i + 12].value)
        formData.append('wager', event.target[i + 13].value)
        formData.append('cart', event.target[i + 14].value)
        formData.append('descript', event.target[i + 15].value)

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

    removePhoto(e) {
        if (e != null) {
            e.preventDefault();
        }
        this.setState({image: ""})
    }

    render () {
        const x = this.state.error;
        console.log(x)
        if (!this.state.verify_email) {
            return (
                <div>
                <body>
                    <form class="form" style={{height: '100%', width: '70%'}} onSubmit={(event) => this.formSubmit(event)} method="post">
                    <div style={{justifyContent: 'center', alignContent: 'center', display: 'flex'}}><Avatar exportAsSquare exportQuality={.8} exportSize={400} width={150} onClose={(event) => this.removePhoto(event)} onCrop={(event) => this.onCrop(event)} label="Choose a Profile Photo" 
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
                    Email: <input style={{marginTop: '1.5vh'}} type="text" name="email" required></input>
                    <br></br>
                    <h3 style={{marginTop: '1.5vh'}}>Personality Questions:</h3>
                    <p style={{marginBottom: '1.5vh', fontWeight: 'bold'}}>**No question is mandatory. Leave Questions blank or selected as "Do Not Show this Question" to omit those from your profile, 
                        you can change your answers at any time after submitting**</p>
                    What is your usual score on 18 holes (handicap)?
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="score">
                        <option value="">Do not show this question</option>
                        <option value="b">Less Than 75</option>
                        <option value="c">75-85</option>
                        <option value="d">85-95</option>
                        <option value="e">95-105</option>
                        <option value="f">105-115</option>
                        <option value="g">115+</option></select>
                    <br></br>
                    What is your favorite golf course you have ever played? <input style={{marginBottom: '1.5vh', marginLeft: '1vw'}} type="text" name="favcourse"></input><br></br>
                    Do you enjoy drinking on the course? 
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="drinking">
                        <option value="">Do not show this question</option>
                        <option value="a">Always</option>
                        <option value="s">Sometimes</option>
                        <option value="n">Never</option></select>
                    <br></br>
                    Do you like playing music on the course? 
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="music">
                        <option value="">Do not show this question</option>
                        <option value="a">Always</option>
                        <option value="s">Sometimes</option>
                        <option value="n">Never</option></select>
                    <br></br>
                    What college/school did you attend/support? <input style={{marginBottom: '1.5vh', marginLeft: '1vw'}} type="text" name="college"></input>
                    <br></br>
                    Who's your favorite professional golfer? <input style={{marginBottom: '1.5vh', marginLeft: '1vw'}} type="text" name="favgolf"></input><br></br>
                    What's your favorite team (any sport)? <input style={{marginBottom: '1.5vh', marginLeft: '1vw'}} type="text" name="favteam"></input><br></br>
                    Would you describe yourself more as a competitive, serious golfer or someone out there for a good time?
                    <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="playstyle">
                        <option value="">Do not show this question</option>
                        <option value="a">Serious</option>
                        <option value="b">Here to have fun</option></select>
                    <br></br>
                    Do you enjoy wagering on the round? <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="wager">
                        <option value="">Do not show this question</option>
                        <option value="a">Just want to have fun</option>
                        <option value="b">Wagering</option>
                        </select><br></br>
                    Do you tend to walk or take a golf cart more? <select style={{marginBottom: '1.5vh', marginLeft: '1vw'}} name="cart">
                        <option value="">Do not show this question</option>
                        <option value="a">Always Walk</option>
                        <option value="b">Most of the time Walk</option>
                        <option value="c">It Depends</option>
                        <option value="d">Most of the time Cart</option>
                        <option value="e">Always Cart</option>
                        </select><br></br>
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

