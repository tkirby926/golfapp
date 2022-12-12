import React from "react"
import UserProfile from "./Userprofile";
import './css/LoginComponent.css'
import cookie from "react-cookie";
import StarRating from "./StarRating";
import { HeaderComponent } from "./HeaderComponent";
import { FooterComponent } from "./FooterComponent";

export class CourseReviewComponent extends React.Component {

    getCourseInfo() {
        fetch("/api/v1/course_info/" + this.state.courseid, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            return data.course_info;
        })
    }

    render() {
        return (
            <div>
                <div style={{width: '100%', overflow: 'auto'}}></div>
                <div style={{textAlign: 'center'}}>
                    <p>{this.state.course_info[0]}</p>
                    <p>Time: {this.state.course_info[1]}</p>
                    <p>${this.state.course_info[2]}</p>
                </div>
                <StarRating />
            </div>
        )
    }

    constructor(props) {
        super(props);
        var id = window.location.href.split('/').pop()
        this.state = {
            user: UserProfile.checkCookie(),
            courseid: id,
            course_info: []
        }
        if (this.state.user == "null") {
            window.location.assign('/login?return_url=/add_review');
        }
        this.getCourseInfo()
    }
}