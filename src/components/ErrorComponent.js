import React from 'react'
import ErrorImage from './photos/ErrorImage.jpeg'

export class ErrorComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        var pic_width = window.innerWidth < 750 ? '75vw' : '50vw';
        return (
        <div style={{width: '100%'}}>
            <h1 style={{textAlign: 'center'}}>We're Sorry, but this page cannot be found.</h1>
            <img style={{width: pic_width, display: 'flex', margin: '0 auto'}} src={ErrorImage}></img>
        </div>)
    }
}