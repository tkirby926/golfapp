import React from "react"
import UserProfile from './Userprofile';

export class CoursesOfferedComponent extends React.Component {

    getCourses(string) {
        var fetcher = "search/courses/" + string + "/0/6";
        if (string === "") {
            fetcher = "search/any_course/5";
        }
        fetch(UserProfile.getUrl() + "/api/v1/" + fetcher, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            this.setState({courses: data.results, spinner: false});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            spinner: true
        }
        this.getCourses('');
    }

    changeSearch(e) {
        e.preventDefault();
        if (e.target.value === '' || e.target.value.length > 2) {
            this.getCourses(e.target.value)
        }
    }

    directToURL(event, url) {
        event.preventDefault();
        window.location.assign(url);
    }

    render() {
        return (
            <div>
                <h3>Courses Offered on GolfTribe:</h3>
                <input class="input" type="text" placeholder="Find a Course" onKeyUp={(event) => this.changeSearch(event)}></input>
                <div class="loading-spinner" style={{margin: '0 auto', clear: 'both', marginTop: '50px'}} hidden={!this.state.spinner}></div>
                {this.state.courses.map((result, index) => {
                    var url = "/course/" + result[0];
                    var name = result[1];
                    var review_url = '/reviews/course/' + result[0];
                    return (
                        <div class="user_button" style={{cursor: 'pointer', width: '80%', marginLeft: '7%', height: '4vh', paddingBottom: '30px'}}>
                            <div onClick={(event) => this.directToURL(event, url)} style={{float: 'left', width: '42%', height: "100%"}}>
                                <span style={{fontWeight: 'bold', fontSize: 'medium'}}>{name}<br></br></span>
                            </div>
                            <div>
                                <div style={{float: 'left', height: '100%', width:'25%', backgroundColor: 'white'}}>
                                    <div onClick={(event) => this.directToURL(event, url)} style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', color: 'white',backgroundColor: '#0E2F04'}}>Book Here</div>
                                </div>
                                <div style={{float: 'left', height: '100%', width:'27%', backgroundColor: 'white'}}>
                                    <div onClick={(event) => this.directToURL(event, review_url)} style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'beige'}}>See Reviews</div>
                                </div>
                            </div>
                        </div>
                        )
                })}
                </div>
        )
    }
}