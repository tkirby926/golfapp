import React from "react"
import UserProfile from './Userprofile';

export class SwiperComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            zip: "07920",
            length: 10,
            good_tee_times: [],
            good_time_users: [],
            index: 0,
            no_times_available: false
          };
          this.hasTimes = this.hasTimes.bind(this);
    }

    hasTimes(good_time, has_times, hide_next, hide_back) {
        if (this.state.no_times_available) {
            return (<div><h1>Sorry, no tee times with other golfers available in your area. 
                Please navigate to our tee time selector page to book your own time, 
                and allow other users to join it here.</h1>
                   <button type='button' href='/times'></button></div> )
        }
        else if (has_times) {
        return (<div>
            <img src={good_time[this.state.index][3]}></img>
            <li>{good_time[this.state.index][2]}</li>
            {this.state.good_time_users.map(function(good_user, index){
                    return (<div><div>
                                <div style={{width: '50%', float: 'left'}}>
                                    <img src={good_user[2]}></img>
                                </div>
                                <div style={{width: '50%', float: 'left'}}>
                                    <h3>{good_user[1]}</h3>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <h3>{good_user[3]}</h3>
                                </div>
                                <div>
                                    <h3>{good_user[4]}</h3>
                                </div>
                                <div>
                                    <h3>{good_user[5]}</h3>
                                </div>
                                <div>
                                    <h3>{good_user[6]}</h3>
                                </div>
                                </div>
                                {/* <button type='button' onClick={}>Book me in for this time!</button> */}
                                <button type='button' onClick={(event) => (this.get_next_time(event, true))} hidden={hide_next}>Show me the next time</button>
                                <button type='button' onClick={(event) => (this.get_next_time(event, false))} hidden={hide_back}>Show me the last time</button>

                                </div>
                            )
                            })}
      </div>)
        }
    }

    get_next_time(event, go_next) {
        var next_index = this.state.index - 1;
        if (go_next) {
            next_index = this.state.index + 1;
        }
        fetch(UserProfile.getUrl() + "/api/v1/swipetimes/users/" + this.state.good_tee_times[next_index][0], { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ index: this.next_index, good_time_users: data.good_users });
        })
    }

    render_loc(event) {
        event.preventDefault();
        var temp_no_times = false;

        fetch("/api/v1/swipetimes/" + event.target[0].value + "/" + event.target[1].value, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data.good_times);
            if (data.good_times.length === 0) {
                temp_no_times = true;
            }
            if (!temp_no_times) {
                fetch("/api/v1/swipetimes/users/" + data.good_times[this.state.index][0], { credentials: 'same-origin', method: 'GET' })
                .then((response2) => {
                    if (!response2.ok) throw Error(response2.statusText);
                    return response2.json();
                })
                .then((data2) => {
                    console.log(data2);
                    this.setState({ good_tee_times: data.good_times, good_time_users: data2.good_users, no_times_available: false  });
                })
            }
            else {
                this.setState({ no_times_available: true });
            }

            
        })
        
        
    }

    render() {
        const has_times = (this.state.good_tee_times.length !== 0)
        const hide_back = (this.state.index === 0);
        const hide_next = (this.state.index === (this.state.good_tee_times.length - 1))
        return (
        <div><div>
            <form onSubmit={(event) => (this.render_loc(event))}>
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
                {this.hasTimes(this.state.good_tee_times[this.state.index], has_times, hide_next, hide_back)}
        </div>
        <div>
        <ul>
        
        
                    
        </ul>
        </div>
        </div>
        )}
        
}