import React from "react"
import { CoursesOfferedComponent } from "./CoursesOfferedComponent"
import { HeaderComponent } from "./HeaderComponent"
import { PostViewComponent } from "./PostViewComponent"
import { TimesViewComponent } from "./TimesViewComponent"
import UserProfile from "./Userprofile"

export class AllFriendTimesComponent extends React.Component {

    getCourses(string) {
        var fetcher = "search/courses/" + string + "/0/6";
        if (string == "") {
            fetcher = "search/any_course/5";
        }
        fetch("/api/v1/" + fetcher, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            this.setState({courses: data.results});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            user: this.props.user
        }
    }

    changeSearch(e) {
        e.preventDefault();
        if (e.target.value == '' || e.target.value.length > 2) {
            this.getCourses(e.target.value)
        }
    }

    showMore() {
        if (this.state.more)
        return (<div style={{marginBottom: '4vh', marginTop: '3vh', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                        <a class="button4" style={{fontWeight: 'bold'}} href="/posts">Look at all posts</a>
                    </div>)
    }

    render() {
        return (
            <div>
                <div style={{width: '66%', marginLeft: '2%', marginBottom: '50px', float: 'left'}}>
                    <TimesViewComponent all_component={true} user={this.state.user}/>
                </div>
                <div style={{width: '26%', marginLeft: '4%', marginRight: '2%', float: 'right', marginBottom: '50px'}}>
                    <div style={{border: 'thick solid gray', borderRadius: '50px', padding: '15px', minHeight: '60vh'}}>
                        <div style={{height: '51vh'}}>
                            <CoursesOfferedComponent />
                        </div>
                        <div style={{marginBottom: '4vh', marginTop: '3vh', marginLeft: 'auto', marginRight: 'auto', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                            <a class="button4" style={{fontWeight: 'bold', cursor: 'pointer'}} href="/posts">View All Courses</a>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}