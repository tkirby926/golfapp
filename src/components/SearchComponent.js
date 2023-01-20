import React from 'react'
import { HeaderComponent } from './HeaderComponent';
import UserProfile from './Userprofile';
import './css/SearchComponent.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chat from './photos/live-chat.jpeg';
import EventEmitter from 'events';

export class SearchComponent extends React.Component {

    getButton(course_var) {
        if (course_var) {
            if (this.state.course_selected) {
                return "selected_button";
            }
            else {
                return "unselected_button";
            }
        }
        else {
            if (this.state.user_selected) {
                return "selected_button";
            }
            else {
                return "unselected_button";
            }
        }
    }


    getData(search_val) {
        var url = "/api/v1/search/"
        if (this.state.course_selected) {
            if (search_val != "") {
                url = url + "courses/" + search_val + '/' + this.state.page + '/10';
            }
            else {
                url = url + "any_course/10";
            }
        }
        else {
            url = url + "users_friends/" + this.state.user + "/" + search_val + "/" + this.state.page + '/12';
            if (search_val == "") {
                this.state.search = "";
                return;
            }
        }
        fetch(url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            if (search_val != this.state.search) {
                this.state.page = 0;
            }
            this.setState({results: data.results, search: search_val, hasMore: data.more, index: data.index});
        })

    }

    constructor(props) {
        super(props)
        this.state = {
            search: window.location.href.split('/').pop(),
            course_selected: false,
            user_selected: true,
            results: [],
            page: 0,
            hasMore: false,
            index: 0,
            user: this.props.user
        }
        this.getData = this.getData.bind(this);
    }

    changeResults(event) {
        event.preventDefault()
        this.state.user_selected = !this.state.user_selected;
        this.state.course_selected = !this.state.course_selected;
        this.getData(this.state.search);
    }

    componentDidMount() {
        this.getData(this.state.search);
        console.log('mounted')
    }
    

    getName(name) {
        if (this.state.user_selected) {
            return name.split('/').pop();
        }
        else {
            return "Golf Course";
        }
    }
    
    changeSearch(event) {
        event.preventDefault();
        this.setState({page: 0})
        this.getData(event.target.value)
    }

    showPrev(event) {
        event.preventDefault();
        this.state.page = this.state.page - 1;
        this.getData(this.state.search);
    }

    showNext(event) {
        event.preventDefault();
        this.state.page = this.state.page + 1;
        this.getData(this.state.search);
    }

    directToMessanger(e, user) {
        e.preventDefault();
        window.location.assign('/messages/' + user)
    }

    directToProf(e, url) {
        e.preventDefault();
        window.location.assign(url)
    }

    showCorrectButtons(id) {
        if (this.state.user_selected) {
            return (
                <div>
                    <div style={{float: 'left', height: '100%', backgroundColor: 'white', width: '10%'}}>
                        <img src={Chat} onClick={(event) => this.directToMessanger(event, id)} style={{margin: 'auto', fontSize: '25px', cursor: 'pointer', height: '40px', display: 'table-cell', borderRadius: '400px', verticalAlign: 'middle', textAlign: 'center'}}></img>
                    </div>
                    <div style={{float: 'left', height: '100%', width:'12%', backgroundColor: 'white'}}>
                        <a href="/" style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'green'}}>Book Time</a>
                    </div>
                </div>
            )
        }
        else {
            var url = '/reviews/course/' + id;
            var course_url = '/course/' + id
            return (
                <div>
                    <div style={{float: 'left', height: '100%', width:'10%', backgroundColor: 'white'}}>
                        <a href={course_url} style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'green'}}>Book Here</a>
                    </div>
                    <div style={{float: 'left', height: '100%', width:'12%', backgroundColor: 'white'}}>
                        <a href={url} style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'lightgreen'}}>See Reviews</a>
                    </div>
                </div>
            )
        }
    }

    getCorrectImageShape(src) {
        if (this.state.user_selected) {
            return (<img src={src} style={{height: '45px', marginTop: '-6px', borderRadius: '50%', float: 'left'}}></img>)
        }
        else {
            return (<img src={src} style={{height: '45px', marginTop: '-6px', float: 'left'}}></img>)
        }
    }

    render() {
        var morestring = this.state.hasMore ? "visible" : "hidden";
        var lessstring = this.state.page != 0 ? "visible" : "hidden";
        console.log(morestring)
        return (
            <div style={{position: 'relative', width: '100%'}}>
                <body style={{marginBottom: '10px', width: '90%', marginLeft: '5%', height: '6vh', overflow: 'auto'}}>
                    <input class="input" type="text" style={{float: 'left', width: '65%'}} placeholder="Search for a user/course" defaultValue={this.state.search} onKeyUp={(event) => this.changeSearch(event)}></input>
                    <button class={this.getButton(false)} style={{float: 'left', width: '15%'}} disabled={this.state.user_selected} onClick={(event) => this.changeResults(event)}>Golfers</button>
                    <button class={this.getButton(true)} style={{float: 'left', width: '15%'}} disabled={this.state.course_selected} onClick={(event) => this.changeResults(event)}>Courses</button>
                </body>
                <div>
                {this.state.results.map((result, index) => {
                    if (this.state.user_selected) {
                        var url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                        var title = result[0]
                        var name = result[1] + " " + result[2]
                        var src = result[3];
                        if (src == null) {
                            src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
                        }
                    }
                    else {
                        var url = result[0];
                        var title = "Golf Course"
                        var name = result[1];
                        var src = result[2];
                        if (src == null) {
                            src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';
                        }
                    }
                    return (
                    <div class="user_button" style={{cursor: 'pointer', width: '80%', marginLeft: '7%', height: '4vh'}}>
                        {this.getCorrectImageShape(src)}
                        <div onClick={(event) => this.directToProf(event, url)} style={{float: 'left', width: '68%', marginLeft: '4%', height: "100%"}}>
                            <span style={{fontWeight: 'bold', fontSize: 'medium', color: '#5469d4'}}>{name}<br></br></span>
                            <span style={{fontWeight: 'normal', fontSize: 'medium', color: '#5469d4'}}>{title}</span>
                        </div>
                        {this.showCorrectButtons(result[0])}
                    </div>
                    )
                    
                    })}
                </div>
                <div style={{display: 'block', width: '80%', marginLeft: '10%', marginTop: '10px'}}>
                <div style={{float: 'right', marginLeft: '5px'}}>
                        <div style={{visibility: morestring}}>
                            <button class='small_button' onClick={(event) => this.showNext(event)}>Next Page</button>
                        </div>
                    </div>
                    <div style={{float: 'right'}}>
                        <div style={{visibility: lessstring}}>
                            <button class='small_button' onClick={(event) => this.showPrev(event)}>Prev Page</button>
                        </div>
                    </div>
                </div>
                <div style={{marginBottom: '12vh'}}></div>
            </div>
        )
    }
}