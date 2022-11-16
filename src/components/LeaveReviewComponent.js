import React from "react"
import UserProfile from "./Userprofile";
import './css/LoginComponent.css'
import cookie from "react-cookie";
import StarRating from "./StarRating";

export class LeaveReviewComponent extends React.Component {
    render() {
        return (
            <StarRating />
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            user: UserProfile.checkCookie()
        }
        if (this.state.user == "null") {
            window.location.assign('/login?return_url=/add_review');
        }

    }
}