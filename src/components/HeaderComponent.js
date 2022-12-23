import React from "react"
import UserProfile from "./Userprofile"
import "./css/HeaderComponent.css";
import Logo from './photos/Logogood.jpeg';
import cookies from "react-cookie";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dropbox } from "dropbox";

export class HeaderComponent extends React.Component {

    checkLength() {
        if (this.state.results.length > 5) {
            const search_url = "/search/" + this.state.search;
            return (
                <div style={{width: '80%', border: '1px solid grey'}}>
                    <a class='button' style={{fontWeight: 'bold', color: 'blue', background: 'lightgray', width: '40vw'}} href={search_url}>See more results</a>
                </div>
            )
        }
    }

//     redirect() {
//         return (
//         <Redirect to={{
//             pathname: '/order',
//             state: { id: '123' }
//         }}
// />
//         )
//     }

    showDropDown(event) {
        event.preventDefault();
        var change = !this.state.hide_dropdown;
        this.setState({hide_dropdown: change})
    }

    checkNotifs() {
        fetch("/api/v1/notifications/" + this.state.username, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.state.notifications = data.notifications;
            this.forceUpdate();
        })
    }

    showNotifs() {
        if (this.state.notifications == 0) {
            return '';
        }
        else if (this.state.notifications == 1) {
            return <div style={{display: 'inline'}}>&#9312;</div>
        }
        else if (this.state.notifications == 2) {
            return <div style={{display: 'inline'}}>&#9313;</div>
        }
        else if (this.state.notifications == 3) {
            return <div style={{display: 'inline'}}>&#9314;</div>
        }
        else if (this.state.notifications == 4) {
            return <div style={{display: 'inline'}}>&#9315;</div>
        }
        else if (this.state.notifications >= 5) {
            return <div>&#9316;+</div>
        }
    }

    directToURL(e, url) {
        e.preventDefault();
        window.location.assign(url)
    }

    isloggedin() {
        if (this.props.course_prof) {
            return (
            <div style={{textAlign:'center', height: '40px'}}>
                    <div class="button1" style={{maxWidth: '200px'}}>
                        <button class='inner-button' onClick={(event) => this.showDropDown(event)}> Tools </button>
                        <div style={{position: 'absolute', overflow: 'visible', textAlign: 'center'}} hidden={this.state.hide_dropdown}>
                            {this.state.course_dropdown.map((result, index) => {
                                var url = result[0] + "/" + UserProfile.checkCourseCookie();
                                return (
                                        <div style={{border: '1px solid grey', backgroundColor: 'white', width: '14vw'}}>
                                            <a style={{fontWeight: 'bold'}} href={url}>{result[1]}</a>
                                        </div>
                                            )
                            })}
                        </div>
                    </div>
                </div>
            )
        }
        if (this.state.username == 'null') {
            const url = '/login?return_url=' + window.location.pathname + window.location.search;
          return (<div style={{textAlign:'center', height: '3vh', }}>
                    <div class='top_button'>
                <a href={url}>Login</a>
                  </div>
                  <div class='top_button'>
                    <a href="/create_profile"> Sign Up </a>
                  </div>
                  </div>)
        }
        else {
          const userlink = "/user/" + this.state.username + "/profile";
          return (<div style={{textAlign:'center', height: '3vh'}}>
                    <div class="button1" id="poop">
                        <button style={{fontSize: '15px'}} class='inner-button' onClick={(event) => this.showDropDown(event)}> Profile {this.showNotifs()} </button>
                    <div style={{position: 'absolute', overflow: 'visible !important'}} hidden={this.state.hide_dropdown}>
                        <div onClick={(event) => this.directToURL(event, '/edit_profile')} style={{border: '1px solid grey', backgroundColor: 'white', width: '14vw'}}>
                            <a class="user_button" style={{fontWeight: 'bold', padding: '0', display: 'revert'}}>Edit Profile</a>
                        </div>
                        <div onClick={(event) => this.directToURL(event, '/see_friends')} style={{border: '1px solid grey', backgroundColor: 'white', width: '14vw'}}>
                            <a class="user_button" style={{fontWeight: 'bold', padding: '0', display: 'revert'}}>Friends {this.showNotifs()}</a>
                        </div>
                        <div onClick={(event) => this.directToURL(event, '/my_profile')} style={{border: '1px solid grey', backgroundColor: 'white', width: '14vw', position: 'absolute', zIndex: '100'}}>
                            <a class="user_button" style={{fontWeight: 'bold', padding: '0', display: 'revert'}}>My Profile</a>
                        </div>
                    </div>
                  </div>
                  <div class='top_button'>
                    <a style={{fontSize: '15px'}} href='/logout'> Logout </a>
                  </div>
                  </div>)
        }
    }

    getName(result) {
        if (result[0].split('/')[1] == 'user') {
            return result[0].split('/').pop();
        }
        else {
            return "Golf Course";
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            search: "",
            results: [],
            hide_search: this.props.hide_search,
            dropdown: [['/edit_profile', 'Edit Info'], ['/see_friends', 'Friends'], ['/my_profile', 'My Profile']],
            hide_dropdown: true,
            notifications: 0,
            username: UserProfile.checkCookie(),
            show_search: !this.props.hide_results,
            course_dropdown: [['/edit_course_profile', 'Edit Course Profile'], ['/revenue', 'See Revenue Flows'], ['/cprofile/tee_sheet', 'View Tee Sheet']],
            pics: []
        }
        this.checkNotifs();
    }
    render_change(event) {
        event.preventDefault();
        this.setState({show_search: true})
        if (event.target.value == '') {
            this.setState({ search: event.target.value, results: []});
            return;
        }
        fetch("/api/v1/search/" + event.target.value, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data)
            this.setState({ search: event.target.value, pics: data.files, results: data.results});
            
        })

    }

    // handleClick(e) {
    //     e.preventDefault();
    //     if (e.target.name != "user_button" && e.target.name != "user_button1" && e.target.name != "search") {
    //         this.setState({show_search: false})
    //     }
    // }

    goToProf(e, url) {
        e.preventDefault();
        window.location.assign(url);
    }

    closeDrops(e) {
        console.log('hi')
    }

    searchComp() {
        if (this.state.show_search) {
            return (<div>{this.state.results.slice(0, 5).map((result, index) => {
                var url = "";
                var name = result[1] + " " + result[2];
                if (result[0][0] != "/") {
                    url = "/user?user=" + result[0];
                }
                else {
                    url = result[0];
                    result[0] = "Golf Course";
                }
            return (
                    <div class="user_button_black" style={{border: '2px solid grey', cursor: 'pointer'}} onClick={(event) => this.goToProf(event, url)}>
                        <span style={{width: '80%', fontWeight: 'bold', color: 'white'}} name='user_button'>{name}</span>
                        <span style={{width: '80%', fontSize: '12px', color: 'white', display: 'block'}} name='user_button1'>{result[0]}</span>
                    </div>
                        )
          })}{this.checkLength()}</div>)
        }
    }

    render() {
        if (this.props.hide_dropdowns) {
            this.state.hide_dropdown = true;
        }
        return (
           <div class = "root" style={{width: '100vw'}}>
            <div style={{width: '18vw', float: 'left'}}>
                    <a href="/">
                        <img src={Logo} alt="logo" style={{borderRadius: '25px', maxWidth: '100%', height: '5vh', border: '5px solid green'}}></img>
                    </a>
                </div>
                <div class="dropdown-content" style={{ width: '43vw', float: 'left', marginLeft: '4vw', overflow: 'visible'}}>
                    <input class="input1" type="text" id='search' name="search" placeholder="Search For a Course or User" hidden={this.state.hide_search} onKeyUp={(event) => (this.render_change(event))} />
                    {this.searchComp()}
                </div>
                <div style={{width: '35vw', float: 'left'}}>
                    {this.isloggedin()}
                </div>
            </div>
            
            
        )
    }
}