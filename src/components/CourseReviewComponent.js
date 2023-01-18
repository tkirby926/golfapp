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
            console.log(data.course_info)
            this.setState({course_info: data.course_info});
        })
    }

    render() {
        if (this.state.has_rendered) {
            return (
                <div>
                    <div style={{width: '100%', overflow: 'auto'}}></div>
                    <StarRating course_review={true} course={this.state.course_info}/>
                </div>
            )
        }
        else {
            return ('');
        }
    }

    constructor(props) {
        super(props);
        var id = window.location.href.split('/').pop()
        this.state = {
            user: this.props.user,
            courseid: id,
            course_info: [],
            has_rendered: false
        }
        if (this.state.user == "null") {
            window.location.assign('/login?return_url=/add_review');
        }
    }

    componentDidMount() {
        this.state.has_rendered = true;
        this.getCourseInfo();
    }
}