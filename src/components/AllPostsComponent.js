import React from "react"
import { CoursesOfferedComponent } from "./CoursesOfferedComponent"
import { PostViewComponent } from "./PostViewComponent"
import UserProfile from './Userprofile';

export class AllPostsComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hide_results: false,
            under_width: false
        }
    }

    hideSearch(e) {
        e.preventDefault();
        this.setState({hide_results: true})
    }

    render() {
        this.state.under_width = false;
        var width = '50%';
        if (window.innerWidth < 950) {
            this.state.under_width = true;
            width = '100%';
        }
        return (
            <div>
                <div style={{width: width, float: 'left'}} onClick={(event) => this.hideSearch(event)}>
                    <PostViewComponent all_posts={true} more_posts={false} user = {this.props.user}/>
                </div>
                <div hidden={this.state.under_width} style={{width: '40%', float: 'left', marginLeft: '3%', padding: '2%', border: 'thick solid gray', borderRadius: '25px', height: '51vh'}}>
                    <CoursesOfferedComponent />
                </div>
            </div>
        )
    }
}