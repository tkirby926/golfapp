import React from "react"
import UserProfile from "./Userprofile";
import CourseAdminProfile from "./CourseAdminProfile";
import { useCookies } from "react-cookie";

export class CourseLoginComponent extends React.Component {
    test_login(event) {
        event.preventDefault()
        fetch("/api/v1/course_login/" + event.target[0].value + '/' + event.target[1].value, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            if (data.is_user == true) {
                UserProfile.setCookie("course_admin", data.cookie, 30)
                window.location.assign("/cprofile/");
            }
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            error_message: ""
        }
    }

    render() {
        return (
        <div>
        <div>
            <div>
                {this.state.error_message}
            </div>
            <form class="form" onSubmit={(event) => this.test_login(event)}>
                Email: <input type="email" name="username"></input><br></br><br></br>
                Password: <input type="password" name="password"></input><br></br><br></br>
                <input type="submit" value="Submit"></input>
            </form>
        </div>
        <div>
            <a href="/register_course">Course not registered yet? Do it here</a><br></br>
        </div>
        </div>
        )
    }
}