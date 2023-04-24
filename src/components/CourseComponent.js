import React from "react";
import './css/CourseComponent.css'
import UserProfile from './Userprofile';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

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
            this.setState({ course_info: data.course_info, tee_times: data.course_times, filtered_times: data.course_times});
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
            range: [6, 18],
            filtered_times: [],
            show_dropdown: false,
            under_width: false
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

    formatValue = (value) => {
        var t1 = new Date()
        t1.setHours(value[0]);
        if (value[0] % 1 == 0) {
            t1.setMinutes(0)
        }
        else {
            t1.setMinutes(30)
        }
        var t2 = new Date()
        t2.setHours(value[1]);
        if (value[1] % 1 == 0) {
            t2.setMinutes(0)
        }
        else {
            t2.setMinutes(30)
        }
        var check1 = value[0] < 12 ? "AM" : "PM";
        var check2 = value[1] < 12 ? "AM" : "PM";
        if (t1.getHours() > 12) {
            t1.setHours(t1.getHours() % 12)
        }
        if (t2.getHours() > 12) {
            t2.setHours(t2.getHours() % 12)
        }
        return t1.getHours() + ':' + t1.getMinutes().toString().padStart(2, '0') + " " + check1
        + " - " + t2.getHours() + ':' + t2.getMinutes().toString().padStart(2, '0') + " " + check2;
    }

    filterFunc = (val) => {
        var date = new Date(val[1]);
        date.setHours(date.getHours() + (date.getTimezoneOffset() / 60));
        var x = parseInt(date.getHours());
        var y = parseInt(date.getMinutes());
        if (parseInt(date.getHours()) > Math.floor(this.state.range[0]) && parseInt(date.getHours()) < Math.floor(this.state.range[1])) {
            return true;
        }
        var min1 = this.state.range[0] % 1 == 0 ? 0 : 30;
        if (parseInt(date.getHours()) == Math.floor(this.state.range[0]) && parseInt(date.getMinutes()) >= min1) {
            return true;
        }
        var min2 = this.state.range[1] % 1 == 0 ? 0 : 30;
        if (parseInt(date.getHours()) == Math.floor(this.state.range[1]) && parseInt(date.getMinutes()) <= min2) {
            return true;
        }
        else {
            return false;
        }
    }

    handleChange = (newvalue) => {
        this.state.range = newvalue;
        this.setState({filtered_times: this.state.tee_times.filter(this.filterFunc)})
    }

    changeDrops(e) {
        e.preventDefault();
        this.setState({show_dropdown: !this.state.show_dropdown})
    }


    render() {
        var src = this.state.course_info[1];
        if (src === null || src === '') {
            src = 'https://i.ibb.co/BL7m5kk/11de0d7a11a5.jpg';
        }
        var font_size = 'inherit';
        var width_box = '18%'
        var steps = { 6: '6am', 9: '9am', 12: '12pm', 15: '3pm', 18: '6pm' }
        var datepicker_fsize = '20px';
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            width_box = "26%";
            font_size = 'small';
            steps = { 6: '6am', 12: '12pm', 18: '6pm' }
            datepicker_fsize = '15px'
            this.state.under_width = true;
        }
        var href = '/reviews/course/' + this.state.course_id;
        return (
            <div style={{width: '100%', position: 'relative'}}>
            <form class='form_heavy_shadow' style={{width: '90vw', overflow: 'auto', minHeight: '75vh', padding: '15px'}}>
                <div style={{display: "grid", float: 'left'}}>
                    <img src={src} style={{float: 'left', height: '20vh'}}></img>
                    <a class="button4" style={{textAlign: 'center'}} href={href}>See course reviews</a>
                </div>
                <div style={{float: 'left', marginRight: '5%', width: '40%'}}>
                    <h3 style={{marginLeft: '4vw'}}>Tee Times For {this.state.course_info[0]}:</h3>
                    <input style={{marginLeft: '6vw', fontSize: datepicker_fsize, color: 'black', fontFamily: 'Arial', borderRadius: '25px', float: 'left'}} 
                    type="date" defaultValue={this.state.today} min={this.state.today} max={this.state.four_weeks} onChange={(event) => this.getCourseTimes(event)}></input>
                </div>
                <div style={{width: '35%', float: 'right', opacity: '1'}} hidden={this.state.under_width}>
                    <h4>Time Range:</h4>
                    <Tooltip
                    prefixCls="rc-slider-tooltip"
                    overlay={this.formatValue(this.state.range)}
                    visible={true}
                    placement="bottom"
                    >
                    <Slider
                        style={{width: '100%'}}
                        min={6} 
                        max={18} 
                        defaultValue={[6, 18]}
                        marks={steps}
                        range
                        step={.5}
                        value={this.state.range}
                        onChange={this.handleChange}
                        tipFormatter={(value) => {return value}}
                        handleStyle={[{ backgroundColor: '#0E2F04', borderColor: '#0E2F04' }, { backgroundColor: '#0E2F04', borderColor: '#0E2F04' }]}
                        trackStyle={[{ backgroundColor: '#0E2F04' }]} />
                        </Tooltip>
                </div>
                <div style={{width: '10%', float: 'right'}}>
                    <div hidden={!this.state.under_width} style={{width: '100%', opacity: '1'}} class='button4' onClick={(event) => this.changeDrops(event)}>Filters</div>
                    <form class="button4" hidden={!this.state.show_dropdown || !this.state.under_width} style={{position: 'absolute', overflow: 'visible', width: '30%', marginRight: '5%', right: '0'}}>
                    <p>Tee Time Range:</p>
                    <Tooltip
                    style={{right: '0'}}
                    prefixCls="rc-slider-tooltip"
                    overlay={this.formatValue(this.state.range)}
                    visible={this.state.show_dropdown && this.state.under_width}
                    placement="bottom"
                    >
                    <Slider
                        
                        min={6} 
                        max={18} 
                        defaultValue={[6, 18]}
                        marks={steps}
                        range
                        step={.5}
                        value={this.state.range}
                        onChange={this.handleChange}
                        tipFormatter={(value) => {return value}}
                        handleStyle={[{ backgroundColor: 'white', borderColor: 'white' }, { backgroundColor: 'white', borderColor: 'white' }]}
                        trackStyle={[{ backgroundColor: 'gray' }]} />
                        </Tooltip>
                    </form>
                </div>
                <div style={{clear: 'both'}}></div>
                <div hidden={this.state.tee_times.length !== 0} style={{margin: 'auto'}}>
                    <br></br><br></br><br></br><br></br>
                    <h2>Sorry, no tee times available for today. Please check another date!</h2>
                </div>
                {this.state.filtered_times.map((tee_time, index) => {
                    const url = '/tee_time/' + tee_time[0];
                    const course_address = this.state.course_info[2] + ", " 
                    + this.state.course_info[3] + ", " + this.state.course_info[4] + " " + this.state.course_info[5];
                    const course_time = new Date(tee_time[1])
                    course_time.setHours(course_time.getHours() + (course_time.getTimezoneOffset() / 60));
                    const time_string = course_time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    return (
                        <a href={url} class='course_box1' style={{width: width_box, fontSize: font_size}}>
                        <div>
                            <a style={{fontWeight: 'bold'}}>{time_string}</a>
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