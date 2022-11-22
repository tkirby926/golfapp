import React from "react"
import { HeaderComponent } from "./HeaderComponent"
import { PostViewComponent } from "./PostViewComponent"
import UserProfile from "./Userprofile"

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
                <HeaderComponent/>
                <div style={{width: '80%', margin: '0 auto', overflow: 'auto'}} onClick={(event) => this.hideSearch(event)}>
                    <PostViewComponent all_posts={true} more_posts={false}/>
                </div>
            </div>
        )
    }
}