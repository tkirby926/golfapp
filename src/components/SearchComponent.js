import React from 'react'
import './css/SearchComponent.css';
import Chat from './photos/live-chat.jpeg';
import UserProfile from './Userprofile';

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
            if (search_val !== "") {
                url = url + "courses/" + search_val + '/' + this.state.page + '/10';
            }
            else {
                url = url + "any_course/10";
            }
        }
        else {
            url = url + "users_friends/" + search_val + "/" + this.state.page + '/12';
            if (search_val === "") {
                this.state.search = "";
                return;
            }
        }
        fetch(UserProfile.getUrl() + url, { credentials: 'include', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            if (search_val !== this.state.search) {
                this.state.page = 0;
            }
            this.setState({results: data.results, search: search_val, hasMore: data.more, index: data.index});
        })

    }

    constructor(props) {
        super(props)
        const params = (new URL(document.location)).searchParams;
        this.state = {
            search: params.get('query'),
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
        e.stopPropagation();
        window.location.assign('/messages?id=' + user)
    }

    directToURL(e, url) {
        e.stopPropagation();
        window.location.assign(url)
    }

    showCorrectButtons(id) {
            return (
                <div>
                    <div style={{float: 'left', height: '100%', backgroundColor: 'white', width: '10%'}}>
                        <img src={Chat} onClick={(event) => this.directToMessanger(event, id)} style={{margin: 'auto', fontSize: '25px', cursor: 'pointer', height: '40px', display: 'table-cell', borderRadius: '400px', verticalAlign: 'middle', textAlign: 'center'}}></img>
                    </div>
                    <div style={{float: 'left', height: '100%', width:'12%', backgroundColor: 'white'}}>
                        <button onClick={(event) => this.directToURL(event, '/')} style={{cursor: 'pointer', height: '40px', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: 'green'}}>Book Time</button>
                    </div>
                </div>
            )
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
        var lessstring = this.state.page !== 0 ? "visible" : "hidden";
        console.log(morestring)
        var inp_wid = '65%';
        var button_wid = '12%';
        if (window.innerWidth < 850) {
            inp_wid = '40%';
            button_wid = '24%';
        }
        var separation = ['51%', '10%'];
        return (
            <div style={{position: 'relative', width: '100%'}}>
                <div style={{marginBottom: '10px', marginLeft: '5%', height: '6vh', overflow: 'auto'}}>
                    <input class="input" type="text" style={{float: 'left', width: inp_wid}} placeholder="Search for a user/course" defaultValue={this.state.search} onKeyUp={(event) => this.changeSearch(event)}></input>
                    <button class={this.getButton(false)} style={{float: 'left', width: button_wid}} disabled={this.state.user_selected} onClick={(event) => this.changeResults(event)}>Golfers</button>
                    <button class={this.getButton(true)} style={{float: 'left', width: button_wid}} disabled={this.state.course_selected} onClick={(event) => this.changeResults(event)}>Courses</button>
                </div>
                <div>
                {this.state.results.map((result, index) => {
                    if (!this.state.course_selected) {
                        var url = "/user?return_url=" + window.location.pathname + "&user=" + result[0];
                        var name = result[1] + " " + result[2];
                        var img_url = result[3];
                        if (img_url === null || img_url == '') {
                            img_url = 'https://i.ibb.co/VBGR7B0/6d84a7006fbf.jpg';
                        }
                    }
                    else {
                        var name = result[1];
                        var url = '/course/' + result[0];
                        var url_rev = '/reviews/course/' + result[0];
                        var img_url = result[2];
                        if (img_url === null || img_url == '') {
                            img_url = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';
                        }
                        var p_height = '40px';
                        var f_size = 'medium';
                        if (window.innerWidth < 850) {
                            p_height = '30px';
                            f_size = 'small';
                        }
                    }
                    if (this.state.course_selected) {
                        return (
                            <div onClick={(event) => this.directToURL(event, result[0])} class="user_button" style={{width: '80%', cursor: 'pointer', marginLeft: '7%'}}>
                                <img src={img_url} style={{float: 'left', height: p_height, marginRight: '3%', borderRadius: '50%', border: 'thin solid white'}}></img>
                                <div style={{float: 'left', width: '45%', height: "100%"}}>
                                    <a style={{fontWeight: 'bold', fontSize: f_size, color: '#0E2F04'}}>{name}<br></br></a>
                                    <a style={{fontWeight: 'normal', fontSize: f_size, color: '#0E2F04'}}>{result[3]}, {result[4]}, {result[5]} {result[6]}</a>
                                </div>
                                <div style={{float: 'left', height: '100%', backgroundColor: 'white', width: '18%'}} button onClick={(event) => this.directToURL(event, url)}>
                                    <a style={{cursor: 'pointer', height: '40px', fontSize: f_size, color: 'white', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', borderRadius: '4px', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: '#0E2F04'}}>Book Time</a>
                                </div>
                                <div button onClick={(event) => this.directToURL(event, url_rev)} style={{float: 'left', height: '100%', width:'20%', marginLeft: '2%', backgroundColor: 'white'}}>
                                    <a style={{cursor: 'pointer', height: '40px', fontSize: f_size,  color: 'white', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', borderRadius: '4px', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: '#0E2F04'}}>See Reviews</a>
                                </div>
                            </div>
                        )
                    }
                        if (index < this.state.index) {
                            return (
                            <div onClick={(event) => this.directToURL(event, url)} class="user_button" style={{width: '80%', cursor: 'pointer', marginLeft: '7%', height: '4vh'}}>
                                <img src={img_url} style={{float: 'left', height: '40px', marginRight: '3%', borderRadius: '50%', border: 'thin solid white'}}></img>
                                <div style={{float: 'left', width: separation[0], height: "100%"}}>
                                    <a style={{fontWeight: 'bold', fontSize: 'medium', color: '#0E2F04'}}>{name}<br></br></a>
                                    <a style={{fontWeight: 'normal', fontSize: 'medium', color: '#0E2F04'}}>{result[0]}</a>
                                </div>
                                <div style={{float: 'left', height: '100%', backgroundColor: 'white', width: separation[1]}} onClick={(event) => this.directToMessanger(event, result[0])}>
                                    <img src={Chat} style={{margin: 'auto', fontSize: '25px', cursor: 'pointer', height: '40px', display: 'table-cell', borderRadius: '400px', verticalAlign: 'middle', textAlign: 'center'}}></img>
                                </div>
                                <div style={{float: 'left', height: '100%', width:'20%', backgroundColor: 'white'}}>
                                    <a href="/" style={{cursor: 'pointer', height: '40px', color: 'white', width: '100%', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', borderRadius: '4px', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: '#0E2F04'}}>Book Time</a>
                                </div>
                            </div>
                            )
                        }
                        else {
                            var name = result[1] + " " + result[2];
                            return (
                                <div onClick={(event) => this.directToURL(event, url)} class="user_button" style={{width: '80%', cursor: 'pointer', marginLeft: '7%', height: '4vh'}}>
                                    <img src={img_url} style={{float: 'left', height: '40px', marginRight: '3%', borderRadius: '50%', border: 'thin solid white'}}></img>
                                    <div style={{float: 'left', width: '61%', height: "100%"}}>
                                        <a style={{fontWeight: 'bold', fontSize: 'medium', color: '#0E2F04'}} href={url}>{name}<br></br></a>
                                        <a style={{fontWeight: 'normal', fontSize: 'medium', color: '#0E2F04'}} href={url}>{result[0]}</a>
                                    </div>
                                    <div style={{float: 'left', height: '100%', width:'20%', backgroundColor: 'white'}}>
                                        <a style={{cursor: 'pointer', color: 'white', height: '40px', display: 'table-cell', paddingLeft: '5%', paddingRight: '5%', borderRadius: '4px', verticalAlign: 'middle', textAlign: 'center', backgroundRadius: '25px', backgroundColor: '#0E2F04'}}>View Profile</a>
                                </div>
                                </div>
                                )
                        }

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