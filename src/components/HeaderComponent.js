import React from "react"
import "./css/HeaderComponent.css";
import Logo from './photos/LogoBest.jpeg';
import UserProfile from './Userprofile';

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
        if (this.state.username !== 'null') {
            fetch(UserProfile.getUrl() + "/api/v1/notifications/" + this.state.username, { credentials: 'same-origin', method: 'GET' })
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                this.state.notifications = data.notifications;
                if (data.imgurl !== null && data.imgurl !== '') {
                    this.state.img_url = data.imgurl;
                }
                else {
                    this.state.img_url = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
                }
                this.forceUpdate();
            })
        }
    }

    showNotifs() {
        if (this.state.notifications === 0) {
            return '';
        }
        else if (this.state.notifications === 1) {
            return <div style={{display: 'inline'}}>&#9312;</div>
        }
        else if (this.state.notifications === 2) {
            return <div style={{display: 'inline'}}>&#9313;</div>
        }
        else if (this.state.notifications === 3) {
            return <div style={{display: 'inline'}}>&#9314;</div>
        }
        else if (this.state.notifications === 4) {
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
        if (this.props.hide_all_buttons) {
            return '';
        }
        if (this.props.course_prof) {
            return (
            <div style={{textAlign:'center', height: '40px'}}>
                    <div class="button1" style={{maxWidth: '200px'}}>
                        <button class='inner-button' onClick={(event) => this.showDropDown(event)}> Tools </button>
                        <div style={{position: 'absolute', overflow: 'visible', textAlign: 'center'}} hidden={this.state.hide_dropdown}>
                            {this.state.course_dropdown.map((result, index) => {
                                var url = result[0];
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
        if (this.state.username === 'null') {
            var url = '/login?return_url=' + window.location.pathname + window.location.search;
            if (window.location.pathname.slice(0, 2) === '/v') {
                url = '/login?return_url=/' + window.location.search;
            }
          return (<div style={{textAlign:'center', height: '3vh', display: 'block', float: 'right'}}>
                    <div style={{display: 'block', float: 'right', marginRight: '2vw'}}>
                <button class='button4' style={{fontSize: '15px', width: '13.6vw', marginTop: '1vh'}} onClick={(event) => this.directToURL(event, url)}>Login</button>
                  </div>
                  <div style={{display: 'block', float: 'right', marginRight: '2vw'}}>
                    <button class='button4' style={{fontSize: '15px', width: '13.6vw', marginTop: '1vh'}} onClick={(event) => this.directToURL(event, '/create_profile')}> Sign Up </button>
                  </div>
                  </div>)
        }
        else {
          const userlink = "/user/" + this.state.username + "/profile";
          var font_size = "inherit";
          if (this.state.under_width) {
            font_size = "11.6px"
          }
          var url = "/logout?return_url=" + window.location.pathname;
          return (<div style={{textAlign:'center', height: '3vh'}}>
                    <div style={{display: 'block', float: 'right', marginRight: '2vw'}}>
                        <button class="button4" style={{fontSize: '15px', width: '13.6vw', marginTop: '1vh'}} onClick={(event) => this.showDropDown(event)}> Profile {this.showNotifs()} </button>
                    <div style={{position: 'absolute', overflow: 'visible !important'}} hidden={this.state.hide_dropdown}>
                        <div onClick={(event) => this.directToURL(event, '/edit_profile')} style={{border: '1px solid grey', backgroundColor: 'white', width: '13.6vw',  zIndex: '100', position: 'relative'}}>
                            <img src={this.state.img_url} style={{height: '50px', margin: '0 auto', borderRadius: '50%'}}></img><br></br>
                            <a class="user_button" id="ep" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Edit Profile</a>
                        </div>
                        <div onClick={(event) => this.directToURL(event, '/')} style={{border: '1px solid grey', backgroundColor: 'white', width: '13.6vw', zIndex: '100', position: 'relative'}}>
                            <a class="user_button" id="home" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Book Tee Times</a>
                        </div>
                        <div onClick={(event) => this.directToURL(event, '/see_friends')} style={{border: '1px solid grey', backgroundColor: 'white', width: '13.6vw', zIndex: '100', position: 'relative'}}>
                            <a class="user_button" id="friends" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>My Friends {this.showNotifs()}</a>
                        </div>
                        <div onClick={(event) => this.directToURL(event, '/my_profile')} style={{border: '1px solid grey', backgroundColor: 'white', width: '13.6vw', position: 'relative', zIndex: '100'}}>
                            <a class="user_button" id="activity" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>My Activity</a>
                        </div>
                        <div onClick={(event) => this.directToURL(event, '/messanger')} style={{border: '1px solid grey', backgroundColor: 'white', width: '13.6vw', position: 'relative', zIndex: '100'}}>
                            <a class="user_button" id="messages" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Messages</a>
                        </div>
                        <div hidden={!this.state.under_width} onClick={(event) => this.directToURL(event, '/posts')} style={{border: '1px solid grey', backgroundColor: 'white', width: '13.6vw', position: 'relative', zIndex: '100'}}>
                            <a class="user_button" id="posts" style={{fontWeight: 'bold', padding: '0', display: 'revert', fontSize: font_size}}>Posts</a>
                        </div>
                    </div>
                  </div>
                  <div style={{display: 'block', float: 'right', marginRight: '2vw'}}>
                    <button class='button4' style={{fontSize: '15px', width: '13.6vw', marginTop: '1vh'}} onClick={(event) => this.directToURL(event, url)}> Logout </button>
                  </div>
                  </div>)
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
            username: this.props.user,
            show_search: !this.props.hide_results,
            course_dropdown: [['/cprofile/edit', 'Edit Course Profile'], ['/cprofile/revenue', 'See Revenue Flows'], ['/cprofile/tee_sheet', 'View Tee Sheet']],
            pics: [],
            under_width: false,
            img_url: '',
            course_user: this.props.cid
        }
        if (!this.props.course_prof) {
            this.checkNotifs();
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
        fetch(UserProfile.getUrl() + "/api/v1/search/" + event.target.value + '/' + this.state.username, { credentials: 'same-origin', method: 'GET' })
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
            <div style={{width: '18vw', float: 'left'}}>
                    <img src={Logo} alt="logo" onClick={(event) => this.directToURL(event, url)} style={{borderRadius: '25px', maxWidth: '100%', height: height, border: '5px solid white', marginTop: marg_top}}></img>
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