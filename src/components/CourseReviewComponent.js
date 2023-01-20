import React from "react"
import './css/LoginComponent.css'
import StarRating from "./StarRating";

export class CourseReviewComponent extends React.Component {

    getCourseInfo() {
        fetch("/api/v1/course_info/" + this.state.courseid, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data.course_info)
            this.setState({course_info: data.course_info, reviews: data.reviews, avg_rating: data.rating});
        })
    }

    render() {
        if (this.state.has_rendered) {
            return (
                <div>
                    <div style={{width: '100%', overflow: 'auto'}}></div>
                    <StarRating course_review={true} rating={this.state.avg_rating} course={this.state.course_info} user = {this.state.user} reviews = {this.state.reviews}/>
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
            has_rendered: false,
            reviews: [],
            avg_rating: 0
        }
        if (this.state.user === "null") {
            window.location.assign('/login?return_url=/add_review');
        }
    }

    componentDidMount() {
        this.state.has_rendered = true;
        this.getCourseInfo();
    }
}