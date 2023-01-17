import React from "react"
import { CoursesOfferedComponent } from "./CoursesOfferedComponent"
import { HeaderComponent } from "./HeaderComponent"
import { PostViewComponent } from "./PostViewComponent"
import { TimesViewComponent } from "./TimesViewComponent"
import UserProfile from "./Userprofile"

export class AllFriendTimesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            user: this.props.user
        }
    }

    render() {
        return (
            <div>
                <div style={{width: '66%', marginLeft: '2%', marginBottom: '50px', float: 'left'}}>
                    <TimesViewComponent all_component={true} user={this.state.user}/>
                </div>
                <div style={{width: '26%', marginLeft: '4%', marginRight: '2%', float: 'right', marginBottom: '50px'}}>
                    <div style={{border: 'thick solid gray', borderRadius: '50px', padding: '15px', minHeight: '60vh'}}>
                        <div style={{height: '51vh'}}>
                            <CoursesOfferedComponent />
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}