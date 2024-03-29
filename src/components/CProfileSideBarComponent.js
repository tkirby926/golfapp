import React from "react"
import './css/MessagingComponent.css'
import UserProfile from './Userprofile';

export class CProfileSideBarComponent extends React.Component {

    openHolidays(e) {
        e.preventDefault();
        this.setState({add_closure: true})
    }

    addClosure(e) {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({  user: this.state.course_id,
                                    date: e.target[0].value})
        }
        fetch(UserProfile.getUrl() + '/api/v1/course_schedule/holidays/add', requestOptions)
        .then(response => response.json())
        .then((data) => {
            if (data.error === "") {
                this.state.course_holidays.unshift([e.target[0].value, this.state.course_id])
            }
            else {
                this.setState({error: data.error})
            }
        });
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
            course_id: this.props.course_id,
            revenue: 0,
            today: today_readable
        }
        this.grabHolidays()
    }

    getThreeWeeks() {
        var today = new Date(this.state.today)
        today.setDate(today.getDate() + 21)
        var month = '' + (today.getMonth() + 1)
        var year = today.getFullYear()
        var day = '' + today.getDate();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        var threeweeks = [year, month, day].join('-')
        return threeweeks;
    }

    showMore() {
        return (<div style={{display: 'block', width: '80%', marginLeft: '10%', marginTop: '10px'}}>
                    <div style={{float: 'right', width: '10%', height: '5%'}}>
                        <div hidden={!this.state.more_holidays}>
                            <button class='small_button' onClick={(event) => this.changeRequest(event, true)}>Next Page</button>
                        </div>
                    </div>
                    <div style={{float: 'right', width: '10%', height: '5%'}}>
                        <div hidden={this.state.page === 0}>
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
        fetch(UserProfile.getUrl() + "/api/v1/course_schedule/holidays/" + this.state.page, { credentials: 'include', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            this.setState({
                course_holidays: data.closures,
                more_holidays: data.closures.length == 6
            });
        })
    }

    render() {
        return (
            <div>
                <p style={{textAlign: 'center'}}>Upcoming Course Closure Days (Must be inputted 3 weeks in advance) </p>
                <button class="button4" style={{padding: '5px', textAlign: 'center', display: 'flex', margin: '0 auto'}} onClick={(event) => this.openHolidays(event)}>Add Holiday</button>
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
                <div style={{width: '100%', height: '4vh'}}></div>
                <div style={{textAlign: 'center'}}>
                    <h3>Revenue Accrued for Week of 12/28</h3>
                    <h2>${this.state.revenue}</h2>
                    <a href='/cprofile/revenue' class="button4" style={{padding: '5px'}}>See Full Revenue Breakdown</a>
                </div>
            </div>
        )
    }
}