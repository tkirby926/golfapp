
import React, { useState } from "react"
var  TimeBox = (function() {
  
    function render(time) {
        return (<div><div>
            <h3 style={{marginBottom: '1px'}}>{time[0]}</h3>
        </div>
        <div>
            <a>{new Date(time[1]).toLocaleString()}</a>
        </div>
        <div>
            <h3 style={{margin: '0', paddingTop: '0'}}>Cost: ${time[2]}</h3>
        </div>
        <div>
            <h3 style={{margin: '0', paddingTop: '0', marginBottom: '10px'}}>Spots: {time[3]}</h3>
        </div></div>)
    }

    return {
        render: render
    }   
})();

export default TimeBox;