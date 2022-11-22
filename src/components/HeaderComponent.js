import React from "react"
import UserProfile from "./Userprofile"
import "./css/HeaderComponent.css";
import Logo from './photos/Logo.jpeg';
import cookies from "react-cookie";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export class HeaderComponent extends React.Component {

    checkLength() {
        if (this.state.results.length > 5) {
            const search_url = "/search/" + this.state.search;
            return (
                <div style={{width: '80%', border: '1px solid grey'}}>
                    <a class='button' style={{fontWeight: 'bold', color: 'blue', background: 'lightgray'}} href={search_url}>See more results</a>
                    <a href={search_url}></a>
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

    isloggedin() {
        if (this.state.username == 'null') {
            const url = '/login?return_url=' + window.location.pathname;
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
                    <div class="button1">
                        <button style={{fontSize: '15px'}} class='inner-button' onClick={(event) => this.showDropDown(event)}> Profile {this.showNotifs()} </button>
                    <div style={{position: 'absolute', overflow: 'visible'}} hidden={this.state.hide_dropdown}>
                        <div style={{border: '1px solid grey', backgroundColor: 'white', width: '14vw'}}>
                            <a style={{fontWeight: 'bold'}} href='/edit_profile'>Edit Profile</a>
                        </div>
                        <div style={{border: '1px solid grey', backgroundColor: 'white', width: '14vw'}}>
                            <a style={{fontWeight: 'bold'}} href='/see_friends'>Friends {this.showNotifs()}</a>
                        </div>
                        <div style={{border: '1px solid grey', backgroundColor: 'white', width: '14vw'}}>
                            <a style={{fontWeight: 'bold'}} href='/my_profile'>My Profile</a>
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
            show_search: !this.props.hide_results
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
            this.setState({ search: event.target.value, results: data.results});
        })

    }

    // handleClick(e) {
    //     e.preventDefault();
    //     if (e.target.name != "user_button" && e.target.name != "user_button1" && e.target.name != "search") {
    //         this.setState({show_search: false})
    //     }
    // }

    searchComp() {
        if (this.state.show_search) {
            return (<div>{this.state.results.slice(0, 5).map((result, index) => {
                var url = "";
                var name = result[1] + " " + result[2];
                if (result[0][0] != "/") {
                    url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                }
                else {
                    url = result[0];
                    result[0] = "Golf Course";
                }
            return (
                    <div style={{border: '2px solid grey'}}>
                        <a style={{width: '80%'}} class='button3' name='user_button' style={{fontWeight: 'bold'}} href={url}>{name}</a>
                        <a style={{width: '80%'}} class='button3' name='user_button1' style={{fontSize: '12px'}} href={url}>{result[0]}</a>
                    </div>
                        )
          })}{this.checkLength()}</div>)
        }
    }

    render() {
        return (
           <div class = "root" style={{width: '100vw'}}>
            <div style={{width: '18vw', float: 'left'}}>
                    <a href="/">
                        <img src={Logo} alt="logo" style={{borderRadius: '25px', maxWidth: '100%', height: '5vh', border: '5px solid green'}}></img>
                    </a>
                </div>
                <div class="dropdown-content" style={{ width: '43vw', float: 'left', marginLeft: '4vw', overflow: 'visible'}}>
                    <input class="input1" type="text" name="search" placeholder="Search For a Course or User" hidden={this.state.hide_search} onKeyUp={(event) => (this.render_change(event))} />
                    {this.searchComp()}
                </div>
                <div style={{width: '35vw', float: 'left'}}>
                    {this.isloggedin()}
                </div>
            </div>
            
            
        )
    }
}