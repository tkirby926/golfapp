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

    getFlows(date) {
        var sunday = new Date(date);
        sunday.setDate(sunday.getDate() - sunday.getDay());
        var saturday = new Date(date);
        saturday.setDate(sunday.getDate() + 6);
        console.log(sunday.getMonth())
        console.log(sunday.getDate())
        sunday = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate();
        saturday = saturday.getFullYear() + "-" + (saturday.getMonth() + 1) + "-" + saturday.getDate();
        console.log(saturday)
        console.log(sunday)
        fetch("/api/v1/course_revenue/" + this.state.course_id + "/" + sunday + "/" + saturday, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            var max_val = 0;
            for (var i = 0; i < 7; i++) {
                if (data.revenue_by_day[i][1] > max_val) {
                    max_val = data.revenue_by_day[i][1];
                }
            }
            this.setState({
                revenue_by_day: data.revenue_by_day,
                max_rev: max_val
            })
        })
    }

    constructor(props) {
        super(props);
        const toDay= new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        var split = toDay.split('/');
        var today_readable = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        this.state = {
            revenue_by_day: [],
            max_rev: 0,
            course_id: window.location.href.split('/').pop()
        }
        if (UserProfile.checkCourseCookie() != window.location.href.split('/').pop()) {
            window.location.assign('/');
        }
        this.getFlows(today_readable)
        
    }

    render() {
        var height_arr = []
        return (<div>
                    <ResponsiveContainer width="100%" aspect={3}>
                        <LineChart data={this.state.revenue_by_day} margin={{ right: 300 }}>
                            <CartesianGrid />
                            <XAxis dataKey="name" 
                                interval={'preserveStartEnd'} />
                            <YAxis></YAxis>
                            <Legend />
                            <Tooltip />
                            <Line dataKey="student"
                                stroke="black" activeDot={{ r: 8 }} />
                            <Line dataKey="fees"
                                stroke="red" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>)
    }
}
