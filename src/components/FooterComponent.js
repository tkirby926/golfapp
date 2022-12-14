import React from "react"
import "./css/FooterComponent.css";

export class FooterComponent extends React.Component {
    render() {
        return (
            <div class="footer">
                <p>Amigolf</p>
                <a style={{color: 'white'}} href='/register_course'>Register your course</a>
                <p style={{display: 'inline'}}> | </p>
                <a style={{display: 'inline', color: 'white'}} href='/add_review'>Add Site Review</a>
            </div>
        )
    }
}