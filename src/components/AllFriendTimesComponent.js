import React from "react"
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
            courses: []
        }
        this.getCourses('')
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
                            <h3>Courses Offered on GolfTribe:</h3>
                            <input class="input" type="text" placeholder="Find a Course" onKeyUp={(event) => this.changeSearch(event)}></input>
                            {this.state.courses.map((result, index) => {
                                var url = result[0];
                                var name = result[1];
                                var review_url = '/reviews' + result[0];
                                return (
                                    <div class="user_button" style={{cursor: 'pointer', width: '80%', marginLeft: '7%', height: '4vh', paddingBottom: '30px'}}>
                                        <div onClick={(event) => this.directToProf(event, url)} style={{float: 'left', width: '42%', height: "100%"}}>
                                            <span style={{fontWeight: 'bold', fontSize: 'medium', color: '#5469d4'}}>{name}<br></br></span>
                                        </div>
                                        <div>
                                            <div style={{float: 'left', height: '100%', width:'25%', backgroundColor: 'white'}}>
                                                <a href={result[0]} style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'green'}}>Book Here</a>
                                            </div>
                                            <div style={{float: 'left', height: '100%', width:'27%', backgroundColor: 'white'}}>
                                                <a href={review_url} style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'lightgreen'}}>See Reviews</a>
                                            </div>
                                        </div>
                                    </div>
                                    )
                            })}
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