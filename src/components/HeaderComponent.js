import React from "react"
import "./css/HeaderComponent.css";
import Logo from './photos/LogoBest.jpeg';
import UserProfile from './Userprofile';
import Joyride, {STATUS} from 'react-joyride';
import TourSteps from "./TourSteps";

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
        fetch(UserProfile.getUrl() + "/api/v1/notifications", { credentials: 'include', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.state.notifications = data.notifications;
            this.state.unread_mess = data.unread_mess;
            if (data.user) {
                this.state.username = true;
            }
            if (data.imgurl !== null && data.imgurl !== '') {
                this.state.img_url = data.imgurl;
            }
            else {
                this.state.img_url = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
            }
            if (window.location.pathname == '/' && data.first == '0') {
                this.state.tut = true;
                this.state.hide_dropdown = false;
                this.state.steps = TourSteps.getSteps();
                fetch(UserProfile.getUrl() + "/api/v1/end_first", { credentials: 'include', method: 'GET' })
                .then((response) => {
                    if (!response.ok) throw Error(response.statusText);
                    return response.json();
                })
                .then((data) => {
                })
            }
            this.forceUpdate();
        })
    }

    showNotifs(char) {
        var sum = 0;
        if (char == 'a') {
            sum = this.state.notifications;
        }
        else if (char == 'b') {
            sum = this.state.unread_mess;
        }
        else {
            sum = this.state.notifications + this.state.unread_mess;
        }
        if (sum === 0) {
            return '';
        }
        else if (sum === 1) {
            return <div style={{display: 'inline'}}>&#9312;</div>
        }
        else if (sum === 2) {
            return <div style={{display: 'inline'}}>&#9313;</div>
        }
        else if (sum === 3) {
            return <div style={{display: 'inline'}}>&#9314;</div>
        }
        else if (sum === 4) {
            return <div style={{display: 'inline'}}>&#9315;</div>
        }
        else if (sum >= 5) {
            return <div>&#9316;+</div>
        }
    }

    directToURL(e, url) {
        e.preventDefault();
        window.location.assign(url)
    }
    componentDidMount() {
        if (!this.state.course_prof) {
            // if (this.state.first) {
            //     this.state.hide_dropdown = false;
            //     this.state.steps = TourSteps.getSteps();
            //     fetch(UserProfile.getUrl() + "/api/v1/end_first", { credentials: 'include', method: 'GET' })
            //     .then((response) => {
            //         if (!response.ok) throw Error(response.statusText);
            //         return response.json();
            //     })
            //     .then((data) => {
            //     })
            //     this.forceUpdate()
            // }
            this.checkNotifs();
            this.state.first = false;
        }
    }

    isloggedin() {
        if (this.props.hide_all_buttons) {
            return '';
        }
        if (this.props.course_prof) {
            return (
            <div style={{textAlign:'center', height: '40px'}}>
                        <div style={{display: 'block', float: 'right', marginRight: '2vw', marginTop: '.5vh'}}>
                        <button class="button4" style={{fontSize: '15px', width: '14vw', marginTop: '1vh'}} onClick={(event) => this.showDropDown(event)}> Tools </button>
                        <div style={{position: 'absolute', overflow: 'visible !important'}} hidden={this.state.hide_dropdown}>
                            {this.state.course_dropdown.map((result, index) => {
                                var url = result[0];
                                return (
                                    <div class="button6" onClick={(event) => this.directToURL(event, url)} style={{border: '1px solid grey',  width: '14vw', zIndex: '100', position: 'relative'}}>
                                        <a  id="home" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>{result[1]}</a>
                                    </div>
                                            )
                            })}
                        </div>
                </div>
                </div>
            )
        }
        if (!this.state.username && !this.state.first) {
            var url = '/login?return_url=' + window.location.pathname + window.location.search;
            if (window.location.pathname.slice(0, 2) === '/v') {
                url = '/login?return_url=/' + window.location.search;
            }
            var wid = '10vw';
            var marg_r = '2vw';
            if (this.state.under_width) {
                wid = '12.5vw';
                marg_r = '.5vw';
            }
          return (<div style={{textAlign:'center', height: '3vh', display: 'block', float: 'right'}}>
                    <div style={{display: 'block', float: 'right', marginRight: marg_r}}>
                <button class='button4' style={{fontSize: '15px', width: wid, marginTop: '1vh'}} onClick={(event) => this.directToURL(event, url)}>Login</button>
                  </div>
                  <div style={{display: 'block', float: 'right', marginRight: '2vw'}}>
                    <button class='button4' style={{fontSize: '15px', width: wid, marginTop: '1vh'}} onClick={(event) => this.directToURL(event, '/create_profile')}> Sign Up </button>
                  </div>
                  </div>)
        }
        else if (!this.state.first) {
          var font_size = "inherit";
          var wid = '20vw';
          if (this.state.under_width) {
            font_size = "11.6px";
            wid = '25vw';
          }
          var url = "/logout?return_url=" + window.location.pathname;
          return (<div style={{textAlign:'center', height: '3vh'}}>
                    <div style={{display: 'block', float: 'right', marginRight: '2vw', marginTop: '.5vh'}}>
                        <button class="button4" style={{fontSize: '15px', width: wid, marginTop: '1vh'}} onClick={(event) => this.showDropDown(event)}> Profile {this.showNotifs('c')} </button>
                    <div style={{position: 'absolute', overflow: 'visible !important'}} hidden={this.state.hide_dropdown}>
                        <div  class="button6" onClick={(event) => this.directToURL(event, '/edit_profile')} style={{border: '1px solid grey', width: wid,  zIndex: '100', position: 'relative'}}>
                            <img src={this.state.img_url} style={{height: '50px', margin: '0 auto', borderRadius: '50%'}}></img><br></br>
                            <a id="ep" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Edit Profile</a>
                        </div>
                        <div class="button6" onClick={(event) => this.directToURL(event, '/')} style={{border: '1px solid grey',  width: wid, zIndex: '100', position: 'relative'}}>
                            <a  id="home" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Book Tee Times</a>
                        </div>
                        <div class="button6" onClick={(event) => this.directToURL(event, '/see_friends')} style={{border: '1px solid grey',  width: wid, zIndex: '100', position: 'relative'}}>
                            <a id="friends" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>My Friends {this.showNotifs('a')}</a>
                        </div>
                        <div class="button6" onClick={(event) => this.directToURL(event, '/suggested_friends')} style={{border: '1px solid grey',  width: wid, zIndex: '100', position: 'relative'}}>
                            <a id="friends" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Friend Suggestions</a>
                        </div>
                        <div class="button6" onClick={(event) => this.directToURL(event, '/my_profile')} style={{border: '1px solid grey', width: wid, position: 'relative', zIndex: '100'}}>
                            <a id="activity" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>My Activity</a>
                        </div>
                        <div class="button6" onClick={(event) => this.directToURL(event, '/messanger')} style={{border: '1px solid grey', width: wid, position: 'relative', zIndex: '100'}}>
                            <a id="messages" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Messages {this.showNotifs('b')}</a>
                        </div>
                        <div class="button6" hidden={!this.state.under_width} onClick={(event) => this.directToURL(event, '/posts')} style={{border: '1px solid grey', width: wid, position: 'relative', zIndex: '100'}}>
                            <a id="posts" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Posts</a>
                        </div>
                        <div class="button6" onClick={(event) => this.directToURL(event, url)} style={{border: '1px solid grey', width: wid, position: 'relative', zIndex: '100'}}>
                            <a id="posts" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Logout</a>
                        </div>
                    </div>
                  </div>
                  </div>)
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            search: "",
            results: [],
            first: true,
            hide_search: this.props.hide_search,
            dropdown: [['/edit_profile', 'Edit Info'], ['/see_friends', 'Friends'], ['/my_profile', 'My Profile']],
            hide_dropdown: true,
            notifications: [],
            unread_mess: [],
            username: false,
            show_search: !this.props.hide_results,
            course_dropdown: [['/cprofile/edit', 'Edit Course Profile'], ['/cprofile/revenue', 'See Revenue Flows'], ['/cprofile/tee_sheet', 'View Tee Sheet'], ['/course_logout', 'Log Out']],
            pics: [],
            course_prof: this.props.course_prof,
            under_width: false,
            // img_url: this.props.img_url,
            // course_user: this.props.cid,
            // first: this.props.first,
            steps: [],
            joyrideref: React.createRef()
        }
    }
    render_change(event) {
        event.preventDefault();
        this.setState({show_search: true})
        if (event.target.value === '') {
            this.setState({ search: event.target.value, results: []});
            return;
        }
        if (event.target.value.length < 3) {
            return;
        }
        fetch(UserProfile.getUrl() + "/api/v1/search/" + event.target.value, { credentials: 'include', method: 'GET' })
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
    //     if (e.target.name !== "user_button" && e.target.name !== "user_button1" && e.target.name !== "search") {
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
        if (this.state.show_search && typeof(this.state.results) !== undefined) {
            var im_wid = '15%';
            if (this.state.under_width) {
                im_wid = '30%';
            }
            return (<table>{this.state.results.slice(0, 5).map((result, index) => {
                var url = "";
                var name = result[1];
                var tag = result[0];
                var src = result[3];
                if (result.length > 3) {
                    name = result[1] + " " + result[2];
                    url = "/user?user=" + result[0];
                    if (result[3] === null || result[3] == '') {
                        src = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
                    }
                }
                else {
                    url = result[0];
                    tag = "Book a Tee Time";
                    src = result[4];
                    if (result[2] === null || result[2] == '') {
                        src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';
                    }
                }
            return (
                    <tr class="user_button_black" style={{border: '2px solid grey', cursor: 'pointer', display: 'table', tableLayout: 'fixed'}} onClick={(event) => this.goToProf(event, url)}>
                        <td style={{width: im_wid}}>
                            <img src={src} style={{height: '35px', display: 'table-cell', borderRadius: '50%', border: 'thin solid white'}}></img>
                        </td>
                        <td style={{display: 'table-cell', verticalAlign: 'top'}}>
                            <span style={{width: '80%', fontWeight: 'bold', color: 'white'}} name='user_button'>{name}</span>
                            <span style={{width: '80%', fontSize: '12px', color: 'white', display: 'block'}} name='user_button1'>{tag}</span>
                        </td>

                    </tr>
                        )
          })}{this.checkLength()}</table>)
        }
    }

    directToURL(e, url) {
        e.preventDefault();
        window.location.assign(url)
    }

    handleStart(e) {
        if (e.action == "update") {
            this.state.joyrideref.current.helpers.open();
        }
    }

    render() {
        if (this.props.hide_dropdowns) {
            this.state.hide_dropdown = true;
        }
        var url = "/"
        if (this.props.course_prof) {
            url = "/cprofile"; 
        }
        this.state.under_width = false;
        var height = "5vh";
        var marg_top = "0";
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            height = "3vh";
            marg_top = "1vh";
        }
        return (
           <div class = "root" style={{width: '100vw'}}>
               <Joyride callback={(event) => this.handleStart(event)} ref={this.state.joyrideref} style={{zIndex: '9999'}} debug scrollToFirstStep continuous run={this.state.tut} showProgress showSkipButton steps={this.state.steps}/>
            <div style={{width: '22vw', float: 'left'}}>
                    <img src={Logo} alt="logo" onClick={(event) => this.directToURL(event, url)} style={{borderRadius: '25px', maxWidth: '100%', height: height, cursor: 'pointer', border: '5px solid white', marginTop: marg_top}}></img>
                </div>
                <div class="dropdown-content" style={{ width: '43vw', float: 'left', marginLeft: '4vw', overflow: 'visible'}}>
                    <input class="input1" type="text" id='search' name="search" placeholder="Search For a Course or User" hidden={this.state.hide_search} onKeyUp={(event) => (this.render_change(event))} />
                    {this.searchComp()}
                </div>
                <div style={{width: '31vw', float: 'left'}}>
                    {this.isloggedin()}
                </div>
            </div>
            
            
        )
    }
}