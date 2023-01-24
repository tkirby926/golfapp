import React from "react"
import {HeaderComponent} from './HeaderComponent';
import UserProfile from './Userprofile';

export class ApplicableCourseComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            zip: "07920",
            length: 10,
            good_courses: []
          };
    }

    render_loc(event) {
        event.preventDefault();
        console.log("/api/v1/locations/" + event.target[0].value + "/" + event.target[1].value)
        fetch(UserProfile.getUrl() + "/api/v1/locations/" + event.target[0].value + "/" + event.target[1].value, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ good_courses: data.good_courses, zip: event.target[0].value, length: event.target[1].value});
        })
    }

    render() {
        return (
        
        <div style={{marginTop: '40px'}}>
            <HeaderComponent />
            <body>
        <div style={{marginTop: '40px'}}>
            <form onSubmit={(event) => (this.render_loc(event, this))}>
                Enter a zip code to see tee times near you: <input type="text" name="zips"></input>
                <p>How far would you like course results to span from this location?</p>
                <select name="len" defaultValue={this.state.length}>
                    <option value="10">10 miles</option>
                    <option value="25">25 miles</option>
                    <option value="50">50 miles</option>
                    <option value="100">100 miles</option>
                </select>
                <input type="submit" value="Submit"></input>
                </form>
        
        {this.state.good_courses.map(function(good_course, index){
            const course_url = '/course/' + good_course[0];
                    return (<div style={{marginTop: '10px'}}>
                                <img src={good_course[1]} href={course_url}></img>
                                <a key={ index } href={course_url}>{good_course[2]}</a>
                          </div>)
                  })}
            </div>
        </body>
        </div>
        )}
}