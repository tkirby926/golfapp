import React from "react"
import { CoursesOfferedComponent } from "./CoursesOfferedComponent"
import { PostViewComponent } from "./PostViewComponent"

export class AllPostsComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hide_results: false
        }
    }

    hideSearch(e) {
        e.preventDefault();
        this.setState({hide_results: true})
    }

    render() {
        return (
            <div>
                <div style={{width: '50%', float: 'left'}} onClick={(event) => this.hideSearch(event)}>
                    <PostViewComponent all_posts={true} more_posts={false} user = {this.props.user}/>
                </div>
                <div style={{width: '40%', float: 'left', marginLeft: '3%', padding: '2%', border: 'thick solid gray', borderRadius: '25px', height: '51vh'}}>
                    <CoursesOfferedComponent />
                </div>
            </div>
        )
    }
}