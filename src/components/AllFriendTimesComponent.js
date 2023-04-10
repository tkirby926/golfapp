import React from "react"
import { CoursesOfferedComponent } from "./CoursesOfferedComponent"
import { TimesViewComponent } from "./TimesViewComponent"
import UserProfile from './Userprofile';

export class AllFriendTimesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: [],
            user: this.props.user,
            under_width: false
        }
    }

    render() {
        this.state.under_width = false;
        if (window.innerWidth < 950) {
            this.state.under_width = true;
        }
        return (
            <div>
                <div style={{width: '66%', marginLeft: '2%', marginBottom: '50px', float: 'left'}}>
                    <TimesViewComponent all_component={true} user={this.state.user}/>
                </div>
                <div style={{width: '26%', marginLeft: '4%', marginRight: '2%', float: 'right', marginBottom: '50px'}}>
                    <div hidden={this.state.under_width} style={{border: 'thick solid gray', borderRadius: '50px', padding: '15px', minHeight: '60vh'}}>
                        <div style={{height: '51vh'}}>
                            <CoursesOfferedComponent />
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}