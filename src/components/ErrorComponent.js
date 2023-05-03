import React from 'react'
import './css/EditProfileComponent.css';

export class ErrorComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (<div>Poop! You reached a page of Poop!</div>)
    }
}