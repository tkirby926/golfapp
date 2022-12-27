import React from "react"
import { HeaderComponent } from "./HeaderComponent"
import { PostViewComponent } from "./PostViewComponent"
import { TimesViewComponent } from "./TimesViewComponent"
import UserProfile from "./Userprofile"

export class AllFriendTimesComponent extends React.Component {
    render() {
        return (
            <div>
                <input class="input" style={{width: '90%', marginLeft: '5%', marginBottom: '50px'}} type="text" placeholder="Filter by Specific Users" onKeyUp={(event) => this.changeSearch(event)}></input>
                <TimesViewComponent all_component={true}/>
            </div>
        )
    }
}