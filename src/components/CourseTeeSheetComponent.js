import React from 'react'
import UserProfile from './Userprofile';
import CourseAdminProfile from "./CourseAdminProfile";
import { useCookies } from "react-cookie";
import './css/CourseProfileComponent.css';
import { CProfileSideBarComponent } from './CProfileSideBarComponent';

export class CourseTeeSheetComponent extends React.Component {

    getTimeInfo(date) {
        fetch("/api/v1/course/tee_sheet/" + this.state.course_id + "/" + date, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ tee_times: data.tee_times, time_users: data.users});
        })
    }

    constructor(props) {
        super(props)
        const toDay= new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        var split = toDay.split('/');
        var today_readable = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        this.state = {
            tee_times: [],
            course_id: this.props.cid,
            time_users: [],
            today: today_readable
        }
        if (this.state.course_id == 'null') {
            window.location.assign('/course_login')
        }
        this.getTimeInfo(today_readable)
    }

    changeTimes(e) {
        e.preventDefault()
        this.getTimeInfo(e.target.value)
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

    showSheet() {
        if (this.state.tee_times.length > 0) {
        return (<div>{this.state.tee_times.map((time, index) => {
            var name = '';
            var username = ''
            if (this.state.time_users[index].length != 0) {
                
            }
            return (
                <tr class="form_time_block" style={{textAlign: 'center'}}>
                    <td>{time[0]}</td>
                    <td>{this.state.time_users[0]}</td>
                    <td>{this.state.time_users[1] + " " + this.state.time_users[2]}</td>
                    <td>{time[2]}</td>
                </tr>
                )
            })}</div>)
        }
        else {
            return (<div style={{marginTop: '5vh', textAlign: 'center', fontWeight: 'bold'}}>You have no tee times today (due to course closure)</div>)
        }
    }


    render() {
        return (<div>
                    <div style={{width: '50%', float: 'left'}}>
                        <div>
                        <input style={{marginLeft: '6vw', fontSize: '20px', color: 'black', fontFamily: 'Arial', borderRadius: '25px'}} 
                    type="date" defaultValue={this.state.today} min={this.state.today} max={this.getThreeWeeks()} onChange={(event) => this.changeTimes(event)}></input>
                        </div>
                        <table class="form" style={{width: '100%', tableLayout: 'fixed'}}>
                            <tr style={{display: 'flex', margin: '0 auto'}}>
                                <th style={{width: '25%'}}>TeeTime</th>
                                <th style={{width: '25%'}}>Usernames</th>
                                <th style={{width: '25%'}}>Fullnames</th>
                                <th style={{width: '25%'}}>Cart Included</th>
                            </tr>
                            {this.showSheet()}
                        </table>
                    </div>
                    <div style={{width: '50%', float: 'left'}}>
                        <CProfileSideBarComponent course_id={this.state.course_id} />
                    </div>
                </div>)
    }
}