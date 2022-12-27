import React from "react"
import UserProfile from "./Userprofile";
import './css/MessagingComponent.css'

export class CProfileSideBarComponent extends React.Component {

    openHolidays(e) {
        e.preventDefault();
        this.setState({add_closure: true})
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
            add_closure: false,
            course_holidays: [],
            more_holidays: false,
            page: 0,
            course_id: props.course_id,
            revenue: 0,
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

    discardClosure(event) {
        event.preventDefault();
        this.setState({add_closure:false})
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

    render() {
        return (
            <div>
                <p>Upcoming Course Closure Days (Must be inputted 3 weeks in advance) </p>
                <button onClick={(event) => this.openHolidays(event)}>Add Holiday</button>
                <form class="form_time_block" hidden={!this.state.add_closure} onSubmit={(event) => this.addClosure(event)}>
                    <input type="date" defaultValue={this.getThreeWeeks()} min={this.getThreeWeeks()}></input>
                    <button style={{marginLeft: '40px', marginTop: '5px', marginBottom: '5px'}} type="submit" value="Submit">Submit</button>
                    <button style={{marginLeft: '40px', marginTop: '5px', marginBottom: '5px'}} onClick={(event) => this.discardClosure(event)}>Discard</button>
                </form>
                {this.state.course_holidays.map((day, index) => {
                        return (
                            <div class="form_post">
                                <p>{day[0].split(' ')[0]} {new Date(day[0]).toLocaleDateString()}</p>
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
        )
    }
}