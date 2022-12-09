import React from 'react'
import { HeaderComponent } from './HeaderComponent';
import UserProfile from './Userprofile';
import './css/SearchComponent.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
            url = url + "courses/" + search_val + '/' + this.state.page;
        }
        else {
            url = url + "users_friends/" + UserProfile.checkCookie() + "/" + search_val;
        }
        fetch(url, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            var more = false;
            if (data.results.length > (this.state.page*16) + 16) {
                more = true;
            }
            this.setState({results: data.results, search: search_val, hasMore: more, hasLess: false});
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
            hasLess: false
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
        var less = true;
        if (this.state.page - 1 == 0) {
            less = false
        }
        this.setState({page: this.state.page - 1, hasMore: true, hasLess: less})
    }

    showNext(event) {
        event.preventDefault();
        var more = false;
        if (this.state.results.length > ((this.state.page + 1)*16) + 16) {
            more = true;
        }
        this.setState({page: this.state.page + 1, hasLess: true, hasMore: more})
    }

    render() {
        return (
            <div style={{position: 'absolute'}}>
                <HeaderComponent hide_search={true}/>
                <body style={{marginBottom: '10px', width: '90%', marginLeft: '5%', height: '10vh'}}>
                    <input class="input" type="text" style={{float: 'left', width: '75%'}} placeholder="Search for a user/course" defaultValue={this.state.search} onKeyUp={(event) => this.changeSearch(event)}></input><br></br>
                    <button class={this.getButton(false)} style={{float: 'left', width: '10%'}} disabled={this.state.user_selected} onClick={(event) => this.changeResults(event)}>Golfers</button>
                    <button class={this.getButton(true)} style={{float: 'left', width: '10%'}} disabled={this.state.course_selected} onClick={(event) => this.changeResults(event)}>Courses</button>
                </body>
                <div>
                {this.state.results.slice(this.state.page*16, this.state.page*16 + 16).map((result, index) => {
                    var url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                    return (
                    <div style={{border: 'thin solid black', width: '80%', margin: 'auto'}}>
                        <a class='button2' style={{fontWeight: 'bold'}} href={url}>{result[1]}</a>
                        <a class='button2' style={{fontSize: '12px'}} href={url}>{result[0]}</a>
                    </div>
                    )
                    })}
                </div>
                <div style={{display: 'flex', float: 'left', marginLeft: '1100px'}}>
                    <div style={{float: 'left', width: '100px'}}>
                        <div hidden={!this.state.hasLess}>
                            <button class='small_button' onClick={(event) => this.showPrev(event)}>Prev Page</button>
                        </div>
                    </div>
                    <div style={{float: 'left', width: '100px', marginLeft: '10px'}}>
                        <div hidden={!this.state.hasMore}>
                            <button class='small_button' onClick={(event) => this.showNext(event)}>Next Page</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}