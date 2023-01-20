import React from "react"
import './css/LoginComponent.css'
import StarRating from "./StarRating";

export class LeaveReviewComponent extends React.Component {
    render() {
        return (
            <div>
                <div style={{width: '100%', overflow: 'auto'}}></div>
                <StarRating course_review={false} user = {this.state.user}/>
            </div>
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user
        }
        if (this.state.user === "null") {
            window.location.assign('/login?return_url=/add_review');
        }

    }
}