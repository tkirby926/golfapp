import React from 'react'
import UserProfile from './Userprofile';
import CourseAdminProfile from "./CourseAdminProfile";
import { useCookies } from "react-cookie";
import './css/CourseProfileComponent.css';

export class CourseProfileComponent extends React.Component {
    
    grabTimes(day) {
        fetch("/api/v1/course_schedule/" + this.state.course_id + "/" + day, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            this.setState({
                course_info: data.course_info,
                tee_sched: data.tee_sched
            })
        })
    }

    grabHolidays() {
        fetch("/api/v1/course_schedule/holidays/" + this.state.course_id + "/" + this.state.page, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            this.setState({
                course_holidays: data.closures,
                more_holidays: data.more
            });
        })
    }

    addClosure(e) {
        e.preventDefault()
        fetch("/api/v1/course_schedule/holidays/add/" + this.state.course_id + "/" + e.target[0].value, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({
                course_holidays: data.closures,
                more_holidays: data.more
            });
        })
    }

    constructor(props) {
        super(props);
        const toDay= new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        var split = toDay.split('/');
        var today_readable = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        this.state = {
            add_time: false,
            tee_sched: [],
            course_info: [],
            cost: 0,
            error: "",
            pop_tee_times: [],
            course_id: window.location.href.split('/').pop(),
            hide_dropdown: true,
            dropdown: [['/edit_course_profile', 'Edit Course Profile'], ['/revenue', 'See Revenue Flows']],
            current_time: "",
            edit_index: -1,
            today: today_readable,
            add_closure: false,
            course_holidays: [],
            more_holidays: false,
            page: 0,
            revenue: 0
        }
        if (UserProfile.checkCourseCookie() != this.state.course_id) {
            window.location.assign('/');
        }
    }

    componentDidMount() {
        this.grabTimes("6");
        this.grabHolidays();
    }

    openTime(event) {
        event.preventDefault();
        this.setState({add_time: true})
    }
    closeTime(event) {
        event.preventDefault();
        this.setState({add_time: false})
    }

    addTime(event) {
        event.preventDefault()
        var days = [];
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        var checkedOne = Array.prototype.slice.call(checkboxes).some(x => x.checked);
        if (!checkedOne) {
            this.setState({error: "At least one day must be selected"});
            return;
        }
        for (var i = 0; i < 7; i++) {
            if (event.target[i].checked) {
                days.push(event.target[i].value);
            }
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({  days: days,
                                    time: event.target[8].value,
                                    cost: event.target[7].value
                                    })
        };
        fetch("/api/v1/course_schedule/add/" + this.state.course_id, requestOptions)
        .then(response => response.json())
        .then((data) => {
            this.setState({add_time: false});
            this.state.tee_sched.push([days, event.target[8].value, event.target[7].value]);
            this.forceUpdate()
        })
    }

    getDays(days) {
        days = days.replace(/m/, 'Monday');
        days = days.replace(/t/, 'Tuesday')
        days = days.replace(/w/, 'Wednesday')
        days = days.replace(/th/, 'Thursday')
        days = days.replace(/f/, 'Friday')
        days = days.replace(/s/, 'Saturday')
        days = days.replace(/su/, 'Sunday')
        return days;
    }

    changeToCurrency(event, value) {
        event.preventDefault();
        document.getElementById("cost").value = parseFloat(event.target.value).toFixed(2);
        if (document.getElementById("cost").value == "NaN") {
            document.getElementById("cost").value = 0;
        }
    }

    changeDay(e) {
        e.preventDefault();
        this.grabTimes(e.target.value);
    }

    openEdit(e, index) {
        e.preventDefault();
        this.state.edit_index = index;
        this.openTime(e);
    }

    showDropDown(event) {
        event.preventDefault();
        var change = !this.state.hide_dropdown;
        this.setState({hide_dropdown: change})
    }

    addClosure(event) {
        event.preventDefault();

    }

    discardClosure(event) {
        this.setState({add_closure:false})
    }

    openHolidays(e) {
        e.preventDefault();
        this.setState({add_closure: true})
    }

    changeRequest(e, next) {
        if (next) {
            this.state.page = this.state.page + 1;
        }
        else {
            this.state.page = this.state.page - 1;
        }
        this.grabHolidays();
    }

    showMore() {
        return (<div>
                    <div style={{float: 'right', width: '10%', height: '5%'}}>
                        <div hidden={!this.state.more_holidays}>
                            <button class='small_button' onClick={(event) => this.changeRequest(event, true)}>Next Page</button>
                        </div>
                    </div>
                    <div style={{float: 'right', width: '10%', height: '5%'}}>
                        <div hidden={this.state.page == 0}>
                            <button class='small_button' onClick={(event) => this.changeRequest(event, false)}>Prev Page</button>
                        </div>
                    </div>
                </div>)
    }

    render() {
        return (
            <div>
                <h3>Viewing Course Profile for {this.state.course_info[4]}</h3>
                <body>
                <div style={{float: 'left', width: '48%'}}>
                    <p>Showing schedule for:<select id="day" onChange={(event) => this.changeDay(event)}>
                        <option value="6">Sunday</option>
                        <option value="0">Monday</option>
                        <option value="1">Tuesday</option>
                        <option value="2">Wednesday</option>
                        <option value="3">Thursday</option>
                        <option value="4">Friday</option>
                        <option value="5">Saturday</option>
                    </select></p>
                    
                    <div style={{float: 'left', marginTop: '5px'}}>        
                        <button onClick={(event) => this.openTime(event)}>Add Time</button>
                    </div>
                    <div style={{marginLeft: '150px', borderBottom: "thick solid gray"}}>
                        <p>Tee Times:</p>
                    </div>
                    <div hidden={!this.state.add_time}>
                    <p style={{color: 'red', marginLeft: '15px'}}>{this.state.error}</p>
                        <form class="form" style={{height: '160px'}} onSubmit={(event) => this.addTime(event)}>
                            <div style={{float: 'left', marginRight: '50px'}}>
                            Days offered:<br></br>
                                Monday<input type="checkbox" value="0"></input><br></br>
                                Tuesday<input type="checkbox" value="1"></input><br></br>
                                Wednesday<input type="checkbox" value="2"></input><br></br>
                                Thursday<input type="checkbox" value="3"></input><br></br>
                                Friday<input type="checkbox" value="4"></input><br></br>
                                Saturday<input type="checkbox" value="5"></input><br></br>
                                Sunday<input type="checkbox" value="6"></input>
                            </div>
                            Cost: $<input type="text" id="cost" min="0" onBlur={(event) => this.changeToCurrency(event)}/><br></br>
                                Time (Format hh:mm): <input type="time" name="time"></input><br></br>
                            <button style={{marginLeft: '40px', marginTop: '40px'}} type="submit" value="Submit">Submit</button>
                            <button style={{marginLeft: '40px', marginTop: '10px'}} onClick={(event) => this.closeTime(event)}>Discard Changes</button>
                            <button hidden={this.state.edit_index == -1} style={{marginLeft: '40px', marginTop: '10px'}} onClick={(event) => this.removeTime(event)}>Delete Time</button>
                        </form>
                    </div>
                    <div>
                        <table style={{borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed'}}>
                            <tr>
                                <th style={{}}>Time</th>
                                <th style={{}}>Cost</th>
                                <th style={{}}>Edit</th>
                            </tr>
                        {this.state.tee_sched.map((time, index) => {
                            return (
                                    <tr class="form_time_block" style={{textAlign: 'center'}}>
                                        <td style={{borderRight: "2px solid black"}}>{time[1]}</td>
                                        <td style={{borderRight: "2px solid black"}}>${time[2]}</td>
                                        <td style={{cursor: 'pointer'}} onClick={(event) => this.openEdit(event, index)}>&#x270E;</td>
                                    </tr>
                            )
                        })}
                        </table>
                    </div>
                </div>
                <div style={{float: 'left', marginLeft: '2%', width: '48%', borderRadius: '25px', border: '5px solid green', height: "700px"}}>
                    <p>Upcoming Course Closure Days (Must be inputted 3 weeks in advance) </p>
                    <button onClick={(event) => this.openHolidays(event)}>Add Holiday</button>
                    <form class="form_time_block" hidden={!this.state.add_closure} onSubmit={(event) => this.addClosure(event)}>
                        <input type="date" defaultValue={this.state.today} min={this.state.today}></input>
                        <button style={{marginLeft: '40px', marginTop: '5px', marginBottom: '5px'}} type="submit" value="Submit">Submit</button>
                        <button style={{marginLeft: '40px', marginTop: '5px', marginBottom: '5px'}} onClick={(event) => this.discardClosure(event)}>Discard</button>
                    </form>
                    {this.state.course_holidays.map((day, index) => {
                            return (
                                <div class="form_post">
                                    <p>{day[0]}</p>
                                </div>
                            );
                        })}
                    {this.showMore()}
                    <div style={{textAlign: 'center'}}>
                        <h3>Revenue Accrued for Week of 12/28</h3>
                        <h2>${this.state.revenue}</h2>
                        <a href='/cprofile/revenue' class="button4" style={{padding: '5px'}}>See Full Revenue Breakdown</a>
                    </div>
                </div>
                </body>
            </div>
        )
    }
}