import React from "react"
import UserProfile from './Userprofile';
import "./css/TeeTimeComponent.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HeaderComponent } from "./HeaderComponent";

export class MyProfileComponent extends React.Component {

    render() {
        return (
            <div>
                <h3>My Upcoming Tee Times: </h3>
            </div>
        )
    }
}