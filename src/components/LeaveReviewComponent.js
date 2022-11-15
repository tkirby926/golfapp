import React from "react"
import UserProfile from "./Userprofile";
import './css/LoginComponent.css'
import cookie from "react-cookie";
import StarRating from "./StarRating";

export class LeaveReviewComponent extends React.Component {
    render() {
        return (
            <div>
                <h3 style={{textAlign: 'center'}}>Leave a Review</h3>
                <form style={{width: '50%', minHeight: '20vh'}} class='form' onSubmit={(event) => this.leaveReview(event)}>
                    <div style={{float: 'left'}}>
                        <h4>Rating: </h4>
                        <div>
                            <StarRating />
                        </div>
                    </div>
                    <div style={{float: 'right'}}>
                        <textarea name="descript" style={{height: '50px', width: '60%', marginBottom: '1.5vh'}}></textarea>
                    </div>
                </form>
            </div>
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