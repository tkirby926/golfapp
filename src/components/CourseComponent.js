import React from "react";
import UserProfile from './Userprofile';
import { useCookies } from "react-cookie";
import './css/CourseComponent.css'
import { HeaderComponent } from "./HeaderComponent";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TimeBox from "./TeeTimeBox";


export class CourseComponent extends React.Component {

    getCourseTimes(event) {
        var date = event;
        if (typeof event !== "string") {
            event.preventDefault();
            date = event.target.value;
        }
        fetch("/api/v1/courses/" + this.state.course_id + "/" + date, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ course_info: data.course_info, tee_times: data.course_times});
        })
    }

    constructor(props) {
        super(props);
        const toDay= new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        var split = toDay.split('/');
        var today_readable = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        this.state = {
            course_id: window.location.href.split('/').pop(),
            course_info: [],
            tee_times: [],
            today: today_readable
        }
    }

    getThreeWeeks() {
        const split = this.state.today.split('-');
        var day = split[2];
        var month = split[1];
        var year = split[0];
        if (month == '4' || month == '6' || month == '9' || month == '11') {
            if (parseInt(day) + 21 > 30) {
                month = parseInt(month) + 1
            }
            day = (parseInt(day) + 21) % 30;
        }
        else if (month == '2') {
            if (parseInt(day) + 21 > 28) {
                month = parseInt(month) + 1
            }
            day = (parseInt(day) + 21) % 28;
        }
        else if (month == '12') {
            if (parseInt(day) + 21 > 31) {
                month = 1;
                year = parseInt(year) + 1;
            }
            day = (parseInt(day) + 21) % 31;
        }
        else {
            if (parseInt(day) + 21 > 31) {
                month = parseInt(month) + 1;
            }
            day = (parseInt(day) + 21) % 31;
        }
        var x = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        console.log(x)
        return x;
    }

    componentDidMount() {
        this.getCourseTimes(this.state.today);
    }

    render() {
        var src = this.state.course_info[11];
        if (src == null) {
            src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';;
        }
        var width_box = '18%'
        if (window.innerWidth < 950) {
            width_box = "26%";
        }
        return (
            <div style={{width: '100%'}}>
            <form class='form_heavy_shadow' style={{width: '90vw', overflow: 'auto', minHeight: '75vh'}}>
                <img src={src} style={{float: 'left', height: '20vh'}}></img>
                <h3 style={{marginLeft: '4vw'}}>Tee Times For {this.state.course_info[3]}:</h3>
            <input style={{marginLeft: '6vw', fontSize: '20px', color: 'black', fontFamily: 'Arial', borderRadius: '25px'}} 
                type="date" defaultValue={this.state.today} min={this.state.today} max={this.getThreeWeeks()} onChange={(event) => this.getCourseTimes(event)}></input>
                <div style={{clear: 'both'}}></div>
                <div hidden={this.state.tee_times.length != 0} style={{margin: 'auto'}}>
                    <br></br><br></br><br></br><br></br>
                    <h2>Sorry, no tee times available for today. Please check another date!</h2>
                </div>
                {this.state.tee_times.map((tee_time, index) => {
                    const url = '/tee_time/' + tee_time[2];
                    const course_address = this.state.course_info[5] + ", " 
                    + this.state.course_info[6] + ", " + this.state.course_info[7] + " " + this.state.course_info[8];
                    const c_name = this.state.course_info[4];
                    console.log(this.state.course_info[4]);
                    return (
                        <div class='course_box1' style={{width: width_box}}>
                        <div>
                            <a style={{fontWeight: 'bold'}}>{new Date(tee_time[1]).toLocaleTimeString()}</a>
                        </div>
                        <div>
                            <h3 style={{}}>Cost: ${tee_time[3]}</h3>
                        </div>
                        <div>
                            <h3 style={{margin: '0', paddingTop: '0', marginBottom: '10px'}}>Spots: {tee_time[4]}</h3>
                        </div>
                        </div>
                        )
                    })
            }
            
            </form>
            </div>
        )

    }
}