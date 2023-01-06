import React from "react"
import UserProfile from "./Userprofile";
import './css/LoginComponent.css'
import cookie from "react-cookie";
import StarRating from "./StarRating";
import { HeaderComponent } from "./HeaderComponent";
import { FooterComponent } from "./FooterComponent";

export class LeaveReviewComponent extends React.Component {
    render() {
        return (
            <div>
                <div style={{width: '100%', overflow: 'auto'}}></div>
                <StarRating />
            </div>
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user
        }
        if (this.state.user == "null") {
            window.location.assign('/login?return_url=/add_review');
        }

    }
}