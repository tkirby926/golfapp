import React from 'react'
import ErrorImage from './photos/ErrorImage.jpeg'

export class ErrorComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
        <div>
            <h1 style={{textAlign: 'center'}}>We're Sorry, but this page cannot be found.</h1>
            <img style={{height: '70vh', display: 'flex', margin: '0 auto'}} src={ErrorImage}></img>
        </div>)
    }
}