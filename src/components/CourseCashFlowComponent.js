import React from 'react'
import UserProfile from './Userprofile';
import CourseAdminProfile from "./CourseAdminProfile";
import { useCookies } from "react-cookie";
import './css/CourseProfileComponent.css';
import { CProfileSideBarComponent } from './CProfileSideBarComponent';
import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

export class CourseCashFlowComponent extends React.Component {

    getFlows(days) {
        fetch("/api/v1/course_revenue/" + this.state.course_id + "/" + days[0] + "/" + days[1], { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            var revenue_readable = []
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            for (var i = 0; i < 7; i++) {
                revenue_readable.push({name: days[i], revenue: data.revenue_by_day[i], transactions: data.transactions_by_day[i]})
            }
            this.setState({
                revenue_by_day: revenue_readable
            })
        })
    }

    getSunSatRead(sunday, saturday) {
        this.state.sunday = sunday;
        this.state.saturday = saturday;
        sunday = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate();
        saturday = saturday.getFullYear() + "-" + (saturday.getMonth() + 1) + "-" + saturday.getDate();
        var days = [sunday, saturday]
        return days;
    }

    constructor(props) {
        super(props);
        const toDay= new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        var split = toDay.split('/');
        var today_readable = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        this.state = {
            revenue_by_day: [],
            max_rev: 0,
            course_id: this.props.cid, 
            sunday: null,
            saturday: null,
            days_readable: [],
            distance_from_current_week: 0,
            today: today_readable,
            transactions: []
        }
        if (this.state.course_id == 'null') {
            window.location.assign('/course_login')
        }
        var days_readable = []
        var sunday = new Date(today_readable);
        sunday.setDate(sunday.getDate() - sunday.getDay());
        var saturday = new Date(today_readable);
        saturday.setDate(sunday.getDate() + 6);
        this.state.days_readable = this.getSunSatRead(sunday, saturday);
        this.getFlows(this.state.days_readable)
    }

    changeWeek(e, forward) {
        e.preventDefault();
        if (forward) {
            this.state.sunday.setDate(this.state.sunday.getDate() - 7)
            this.state.saturday.setDate(this.state.saturday.getDate() - 7)
            this.setState({distance_from_current_week: this.state.distance_from_current_week + 1})
        }
        else {
            this.state.sunday.setDate(this.state.sunday.getDate() + 7)
            this.state.saturday.setDate(this.state.saturday.getDate() + 7)
            this.setState({distance_from_current_week: this.state.distance_from_current_week - 1})
        }
        this.state.days_readable = this.getSunSatRead(this.state.sunday, this.state.saturday);
        this.getFlows(this.state.days_readable);
    }

    getTransactionsbyDate(e) {
        e.preventDefault();
        fetch("/api/v1/course/date_transactions/" + this.state.course_id + "/" + e.target.value, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data.transactions)
            this.setState({transactions: data.transactions})
        })
    }

    showDateTransactions() {
        if (this.state.transactions.length == 0) {
            return (
                <div>
                    <h3>No transactions for this day. Check another date to see other transactions.</h3>
                </div>
            )
        }
        else {
            return (
                <div>
                    <table style={{borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed'}}>
                        <tr>
                            <th>Transaction Date</th>
                            <th>Payment</th>
                            <th>User</th>
                            <th>Tee Time</th>
                        </tr>
                        {this.state.transactions.map((transaction, index) => {
                            return (
                            <tr class="form_time_block" style={{textAlign: 'center'}}>
                                <td style={{borderRight: "2px solid black"}}>{transaction[0]}</td>
                                <td style={{borderRight: "2px solid black"}}>${transaction[1]}</td>
                                <td style={{borderRight: "2px solid black"}}>{transaction[2]}</td>
                                <td>{transaction[3]}</td>
                            </tr>
                            )
                        })}
                    </table>
                </div>
            )
        }
    }

    render() {
        console.log(this.state.revenue_by_day)
        // console.log(pdata)
        // moment( document.querySelector("#weekInput").value ).format("yyyy/MMMM/DD")
        const sign = '<'
        const sign2 = '>'
        var total_rev = 0;
        console.log(this.state.revenue_by_day)
        for (var i = 0; i < this.state.revenue_by_day.length; i++) {
            total_rev += this.state.revenue_by_day[i]['revenue']
        }
        return (<div>
                    
                    <h2 style={{display: 'block', height: '5px', width: '35%', marginBottom: '6vh'}}>Revenue by week (Date of Payment)</h2><br></br>
                    <div style={{display: 'flex', float: 'left', width: '35%', marginBottom: '6vh'}}>
                        <button class="button4" style={{fontSize: '15px', fontWeight: 'bold', marginLeft: '10%', padding: '5px', float: 'left'}} onClick={(event) => this.changeWeek(event, true)}>{sign}</button>
                        <span style={{fontSize: '20px', marginLeft: '1%', fontWeight: 'bold', float: 'left', height: '15px'}}>{this.state.days_readable[0]}-{this.state.days_readable[1]}</span>
                        <button disabled={this.state.distance_from_current_week==0} class="button4" style={{fontSize: '15px', fontWeight: 'bold', marginLeft: '1%', padding: '5px', float: 'left'}} onClick={(event) => this.changeWeek(event)}>{sign2}</button>
                    </div>
                    <div style={{width: '25%', float: 'left'}}>
                        <h3>Total Revenue for the week: ${total_rev}</h3>
                    </div>
                    <div style={{width: '100%', display: 'block', overflow: 'hidden'}}>
                    <ResponsiveContainer width="100%" aspect={3} style={{display: 'block'}}>
                        <LineChart data={this.state.revenue_by_day} margin={{ right: 300 }}>
                            <CartesianGrid />
                            <XAxis dataKey="name" 
                                interval={'preserveStartEnd'} />
                            <YAxis></YAxis>
                            <Legend />
                            <Tooltip />
                            <Line dataKey="revenue"
                                stroke="black" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                    <div>
                        <h3>Transactions by day:</h3>
                        <input style={{marginLeft: '6vw', fontSize: '20px', color: 'black', fontFamily: 'Arial', borderRadius: '25px'}} 
                            type="date" defaultValue={this.state.today} max={this.state.today} onChange={(event) => this.getTransactionsbyDate(event)}></input>
                            {this.showDateTransactions()}
                    </div>
                </div>)
    }
}
