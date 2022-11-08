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

    grabPopTimes() {
        fetch("/api/v1/course_schedule/pop_times/" + this.state.course_id, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            this.setState({
                pop_tee_times: data.pop_times
            });
        })
    }

    constructor(props) {
        super(props);
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
            edit_index: -1
        }
        if (UserProfile.checkCourseCookie() != this.state.course_id) {
            window.location.assign('/');
        }
    }

    componentDidMount() {
        this.grabTimes("6");
        this.grabPopTimes();
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

    editSched(index, time, cost) {
        if (this.state.edit_index == index) {
            var is_checked = []
            fetch("/api/v1/course_schedule/check_day/" + this.state.course_id + "/" + time, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                    return response.json();
            })
            .then((data) => {
                is_checked = data.checked_days;
            })
            return (
                <form onSubmit={(event) => this.addTime(event)}>
                    <div style={{float: 'left', marginRight: '50px'}}>
                    Days offered:<br></br>
                        Monday<input type="checkbox" value="0" checked={is_checked[0]}></input><br></br>
                        Tuesday<input type="checkbox" value="1" checked={is_checked[1]}></input><br></br>
                        Wednesday<input type="checkbox" value="2" checked={is_checked[2]}></input><br></br>
                        Thursday<input type="checkbox" value="3" checked={is_checked[3]}></input><br></br>
                        Friday<input type="checkbox" value="4" checked={is_checked[4]}></input><br></br>
                        Saturday<input type="checkbox" value="5" checked={is_checked[5]}></input><br></br>
                        Sunday<input type="checkbox" value="6" checked={is_checked[6]}></input>
                    </div>
                    Cost: $<input type="text" id="cost" min="0" defaultValue={cost} onBlur={(event) => this.changeToCurrency(event)}/><br></br>
                        Time (Format hh:mm): <input type="time" name="time" defaultValue={time}></input><br></br>
                    <button style={{marginLeft: '40px', marginTop: '40px'}} type="submit" value="Submit">Submit</button>
                    <button style={{marginLeft: '40px', marginTop: '10px'}} onClick={(event) => this.closeTime(event)}>Discard</button>
                    
                </form>
            )
        }

    }
    openEdit(e, index) {
        e.preventDefault();
        this.state.edit_index = index;
    }

    showDropDown(event) {
        event.preventDefault();
        var change = !this.state.hide_dropdown;
        this.setState({hide_dropdown: change})
    }

    render() {
        return (
            <div>
                <div style={{textAlign:'center', height: '40px'}}>
                    <div class="button1">
                        <button class='inner-button' onClick={(event) => this.showDropDown(event)}> Tools </button>
                        <div style={{position: 'absolute', overflow: 'visible'}} hidden={this.state.hide_dropdown}>
                            {this.state.dropdown.map((result, index) => {
                                return (
                                        <div style={{border: '1px solid grey', backgroundColor: 'white', width: '260px'}}>
                                            <a style={{fontWeight: 'bold'}} href={result[0]}>{result[1]}</a>
                                        </div>
                                            )
                            })}
                        </div>
                    </div>
                </div>
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
                        <form class="form4" onSubmit={(event) => this.addTime(event)}>
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
                            <button style={{marginLeft: '40px', marginTop: '10px'}} onClick={(event) => this.closeTime(event)}>Discard</button>
                            
                        </form>
                    </div>
                    <div>
                        <table style={{borderCollapse: 'collapse'}}>
                            <tr>
                                <th style={{paddingLeft: "100px", paddingRight: '55px', width: '10px'}}>Time</th>
                                <th style={{paddingRight: '60px'}}>Cost</th>
                                <th style={{paddingLeft: "25px"}}>Edit</th>
                            </tr>
                        {this.state.tee_sched.map((time, index) => {
                            return (
                                <div>
                                    <tr>
                                        <td style={{paddingLeft: "100px",  paddingRight: '55px', borderRight: "2px solid black"}}>{time[1]}</td>
                                        <td style={{paddingLeft: "25px",  paddingRight: '60px', borderRight: "2px solid black"}}>{time[2]}</td>
                                        <td style={{paddingLeft: "25px", cursor: 'pointer'}} onClick={(event) => this.openEdit(event, index)}>&#x270E;</td>
                                    </tr>
                                    {this.editSched(index, time[1], time[2])}
                                    </div>
                            )
                        })}
                        </table>
                    </div>
                </div>
                <div style={{float: 'left', marginLeft: '2%', width: '48%', borderRadius: '25px', border: '5px solid green', height: "700px"}}>
                    <p>Popular Upcoming Tee Times: </p>
                    {this.state.pop_tee_times.map((time, index) => {
                            var url = "/course_view/tee_times/" + this.state.course_id;
                            return (
                                <div class='course_box'>
                                <div>
                                    <a href={url}>{time[0]}</a>
                                </div>
                                <div>
                                    <h3>Cost: ${time[1]}</h3>
                                </div>
                                <div>
                                    <h3>Spots: {time[2]}</h3>
                                </div>
                                </div>
                                )
                        })}
                </div>
                </body>
            </div>
        )
    }
}