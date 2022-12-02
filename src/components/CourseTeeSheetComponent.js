import React from 'react'
import UserProfile from './Userprofile';
import CourseAdminProfile from "./CourseAdminProfile";
import { useCookies } from "react-cookie";
import './css/CourseProfileComponent.css';

export class CourseTeeSheetComponent extends React.Component {

    getTimeInfo(date) {
        fetch("/api/v1/course/tee_sheet/" + this.state.course_id + "/" + date, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ tee_times: data.tee_times});
        })
    }

    constructor(props) {
        super(props)
        const toDay= new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        var split = toDay.split('/');
        var today_readable = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        this.state = {
            tee_times: [],
            course_id: UserProfile.checkCourseCookie()
        }
        this.getTimeInfo(today_readable)
    }

    changeTimes(e) {
        e.preventDefault()
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
                month = parseInt(month) + 1;
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
        return x;
    }


    render() {
        return (<div>
                    <div>
                    <input style={{marginLeft: '6vw', fontSize: '20px', color: 'black', fontFamily: 'Arial', borderRadius: '25px'}} 
                type="date" defaultValue={this.state.today} min={this.state.today} max={this.getThreeWeeks()} onChange={(event) => this.changeTimes(event)}></input>
                    </div>
                    <table style={{width: '50%'}}>
                        <tr>
                            <th>TeeTime</th>
                            <th>Player Usernames</th>
                            <th>Player Fullnames</th>
                        </tr>
                    </table>
                </div>)
    }
}