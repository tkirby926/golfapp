
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
        return (<div><div>
            <h3 style={{marginBottom: '1px'}}>{time[0]}</h3>
        </div>
        <div>
            <a>{new Date(time[1]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</a>
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