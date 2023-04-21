import React from "react";
import './css/CourseComponent.css'
import UserProfile from './Userprofile';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export class CourseComponent extends React.Component {

    getCourseTimes(event) {
        var date = event;
        if (typeof event !== "string") {
            event.preventDefault();
            date = event.target.value;
        }
        fetch(UserProfile.getUrl() + "/api/v1/courses/" + this.state.course_id + "/" + date, { credentials: 'same-origin', method: 'GET' })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          return response.json();
        })
        .then((data) => {
            console.log(data);
            this.setState({ course_info: data.course_info, tee_times: data.course_times});
        })
    }

    constructor(props) {
        super(props);
        var toDay= new Date();
        const four_weeks = new Date(toDay.getTime() + (28*86400000)).toLocaleString('en-US', { timeZone: 'America/New_York' });
        toDay = toDay.toLocaleString('en-US', { timeZone: 'America/New_York' })
        var split = toDay.split('/');
        var split_four_weeks = four_weeks.split('/');
        var today_readable = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        var four_readable = split_four_weeks[2].substring(0, 4) + '-' + split_four_weeks[0].padStart(2, '0') + '-' + split_four_weeks[1].padStart(2, '0');
        this.state = {
            course_id: window.location.href.split('/').pop(),
            course_info: [],
            tee_times: [],
            today: today_readable,
            four_weeks: four_readable,
            start_time: 21600,
            end_time: 64800
        }
    }

    getFourWeeks() {
        const four_weeks = new Date(this.state.today_raw.getTime() + (28*86400000)).toLocaleString('en-US', { timeZone: 'America/New_York' });
        var split = four_weeks.split('/');
        var x = split[2].substring(0, 4) + '-' + split[0].padStart(2, '0') + '-' + split[1].padStart(2, '0');
        console.log(x)
        return x;
    }

    componentDidMount() {
        this.getCourseTimes(this.state.today);
    }

    convertBool(num) {
        if (num == 0) return "No";
        else return "Yes";
    }

    formatMinValue() {
        return '${new Date(this.state.start_time).toTimeString()}%'
    }

    formatMaxValue() {
        return '${new Date(this.state.end_time).toTimeString()}%'
    }

    HandleChange = (newvalue) => {
        this.setState({start_time: newvalue})
        console.log(this.state.start_time)
    }


    render() {
        var src = this.state.course_info[1];
        if (src === null || src === '') {
            src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';
        }
        var font_size = 'inherit';
        var width_box = '18%'
        var steps = { 21600: '6am', 32400: '9am', 43200: '12pm', 54000: '3pm', 64800: '6pm' }
        if (window.innerWidth < 950) {
            width_box = "26%";
            font_size = 'small';
            steps = { 21600: '6am', 43200: '12pm', 64800: '6pm' }
        }
        var href = '/reviews/course/' + this.state.course_id;
        return (
            <div style={{width: '100%'}}>
            <form class='form_heavy_shadow' style={{width: '90vw', overflow: 'auto', minHeight: '75vh', padding: '15px'}}>
                <div style={{display: "grid", float: 'left'}}>
                    <img src={src} style={{float: 'left', height: '20vh'}}></img>
                    <a class="button4" style={{textAlign: 'center'}} href={href}>See course reviews</a>
                </div>
                <div style={{float: 'left', marginRight: '5%', width: '45%'}}>
                    <h3 style={{marginLeft: '4vw'}}>Tee Times For {this.state.course_info[0]}:</h3>
                    <input style={{marginLeft: '6vw', fontSize: '20px', color: 'black', fontFamily: 'Arial', borderRadius: '25px', float: 'left'}} 
                    type="date" defaultValue={this.state.today} min={this.state.today} max={this.state.four_weeks} onChange={(event) => this.getCourseTimes(event)}></input>
                </div>
                {/* <div style={{width: '35%', float: 'right'}}> */}
                    {/* <h4>Time Range:</h4> */}
                    {/* <Slider
                        style={{width: '100%'}}
                        min={21600} 
                        max={64800} 
                        range 
                        defaultValue={[21600, 64800]}
                        marks={steps}
                        step={1800}
                        handle
                        onChange={this.handleChange}
                        tipFormatter= {[this.formatMinValue, this.formatMaxValue]}
                        handleStyle={[{ backgroundColor: '#007AFF', borderColor: '#007AFF' }, { backgroundColor: '#007AFF', borderColor: '#007AFF' }]}
                        trackStyle={[{ backgroundColor: '#007AFF' }]}>
                    </Slider> */}
                {/* </div> */}
                <div style={{clear: 'both'}}></div>
                <div hidden={this.state.tee_times.length !== 0} style={{margin: 'auto'}}>
                    <br></br><br></br><br></br><br></br>
                    <h2>Sorry, no tee times available for today. Please check another date!</h2>
                </div>
                {this.state.tee_times.map((tee_time, index) => {
                    const url = '/tee_time/' + tee_time[0];
                    const course_address = this.state.course_info[2] + ", " 
                    + this.state.course_info[3] + ", " + this.state.course_info[4] + " " + this.state.course_info[5];
                    return (
                        <a href={url} class='course_box1' style={{width: width_box, fontSize: font_size}}>
                        <div>
                            <a style={{fontWeight: 'bold'}}>{new Date(tee_time[1]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</a>
                        </div>
                        <div>
                            <h3 style={{}}>${tee_time[3]}</h3>
                        </div>
                        <div>
                            <h3 style={{margin: '0', paddingTop: '0', marginBottom: '10px'}}>Spots Available: {tee_time[4]}</h3>
                        </div>
                        <div>
                            <h3 style={{margin: '0', paddingTop: '0', marginBottom: '10px'}}>With Cart: {this.convertBool(tee_time[5])}</h3>
                        </div>
                        </a>
                        )
                    })
            }
            
            </form>
            </div>
        )

    }
}