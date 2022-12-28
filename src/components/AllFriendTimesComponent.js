import React from "react"
import { HeaderComponent } from "./HeaderComponent"
import { PostViewComponent } from "./PostViewComponent"
import { TimesViewComponent } from "./TimesViewComponent"
import UserProfile from "./Userprofile"

export class AllFriendTimesComponent extends React.Component {

    getCourses(e, string) {
        if (e != "") {
            e.preventDefault()
        }
        var fetcher = "search/courses/"
        if (string == "") {
            fetcher = "search/any_course/";
        }
        fetch("/api/v1/" + fetcher + string, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            this.setState({courses: data.courses, more: data.more});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            courses: []
        }
        this.getCourses('', '')
    }

    render() {
        return (
            <div>
                <div style={{width: '66%', marginLeft: '2%', marginBottom: '50px', float: 'left'}}>
                    <input class="input" type="text" placeholder="Filter by Specific Users" onKeyUp={(event) => this.changeSearch(event)}></input>
                    <TimesViewComponent all_component={true}/>
                </div>
                <div style={{width: '26%', marginLeft: '4%', marginRight: '2%', float: 'right', marginBottom: '50px'}}>
                    <div>
                        <h3>Courses Offered:</h3>
                        <input class="input" type="text" placeholder="Find a Course" onKeyUp={(event) => this.changeSearch(event)}></input>

                    </div>
                </div>

            </div>
        )
    }
}