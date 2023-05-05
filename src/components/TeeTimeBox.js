
import React from "react"
var  TimeBox = (function() {

    function convertBool(cart) {
        if (cart == '0') {
            return "No";
        }
        else {
            return "Yes";
        }
    }
  
    function render(time, show_cost) {
        const course_time = new Date(time[1])
        course_time.setHours(course_time.getHours() + (course_time.getTimezoneOffset() / 60));
        var date_string = course_time.toLocaleDateString();
        var time_string = course_time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        if (time_string[0] == '0') time_string = time_string.substr(1);
        return (<div><div>
            <h3 style={{marginBottom: '1px'}}>{time[0]}</h3>
        </div>
        <div>
            <a>{date_string}, {time_string}</a>
        </div>
        <div hidden={!show_cost}>
            <h3 style={{margin: '0', paddingTop: '0'}}>${time[2]}</h3>
        </div>
        <div>
            <h3 style={{margin: '0', paddingTop: '0', marginBottom: '10px'}}>Spots Available: {time[3]}</h3>
        </div>
        <div>
            <h3 style={{margin: '0', paddingTop: '0', marginBottom: '10px'}}>With Cart: {convertBool(time[5])}</h3>
        </div></div>)
    }

    return {
        render: render
    }   
})();

export default TimeBox;