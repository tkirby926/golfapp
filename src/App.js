import './App.css';
import React, { useEffect } from 'react';
import UserProfile from './components/Userprofile';
import DropBoxHelpers from './components/DropBoxHelpers';
import { Dropbox } from 'dropbox';
import {HomeComponent} from './components/HomeComponent';
import {ProfileComponent} from './components/ProfileComponent';
import {LoggedInProfileComponent} from './components/LoggedInProfileComponent';
import {CourseComponent} from './components/CourseComponent';
import { CourseLoginComponent } from './components/CourseLoginComponent';
import { CourseProfileComponent } from './components/CourseProfileComponent';
import { LoginComponent } from './components/LoginComponent';
import { CourseRegisterComponent } from './components/CourseRegisterComponent';
import { ThankYouOrder } from './components/ThankYouOrder';
import { LogoutComponent } from './components/LogoutComponent';
import {EditProfileComponent} from './components/EditProfileComponent';
import PaymentWindowComponent from './components/PaymentWindowComponent';
import { MessagingComponent } from './components/MessagingComponent';
import  CourseAdminProfile from './components/CourseAdminProfile';
import { SearchComponent } from './components/SearchComponent';
import { UserLookupComponent } from './components/UserLookupComponent';
import {TeeTimeComponent} from './components/TeeTimeComponent';
import {FooterComponent} from './components/FooterComponent';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CreateProfileComponent } from './components/CreateProfileComponent';
import Background from './components/photos/BackgroundPoss.jpeg';
import { WebsiteAdminComponent } from './components/WebsiteAdminComponent';
import { ResetPasswordComponent } from './components/ResetPasswordComponent';
import { LeaveReviewComponent } from './components/LeaveReviewComponent';
import { MyProfileComponent } from './components/MyProfileComponent';
import { AllPostsComponent } from './components/AllPostsComponent';
import { CourseReviewComponent } from './components/CourseReviewComponent';
import {HeaderComponent} from './components/HeaderComponent';

function App() {

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const headerRef = React.createRef();
  const hide_search_screens = ['/co', '/lo', '/cp', '/se', '/cr', '/ed', '/th', '/te'];
  const hide_button_screens = ['/cp']
  var hide_search = false;
  var course_prof = false;

  // const dbx = DropBoxHelpers.getdb();

  if (window.location.pathname != "/" && hide_search_screens.includes(window.location.pathname.slice(0,3))) {
    hide_search = true;
  }

  if (window.location.pathname != "/" && hide_button_screens.includes(window.location.pathname.slice(0,3))) {
    course_prof = true;
  }


  
  window.addEventListener('resize', forceUpdate)


  return (
    <div style={{backgroundImage: "url(" + Background + ")", backgroundSize: 'contain'}}>
    <HeaderComponent ref={headerRef} hide_search={hide_search} course_prof = {course_prof}></HeaderComponent>
    <div class="class-app" style={{fontFamily: 'Arial, Helvetica, sans-serif',  
     backgroundAttachment: 'fixed', minHeight: '90vh', minWidth: '100vw', overflow: 'auto'}}>
      
    <Router>
          <Routes>
            <Route path='/create_profile' element={<CreateProfileComponent />} />
            <Route path='/edit_profile' element={<EditProfileComponent />} />
            <Route path='/user' element={<ProfileComponent />} />
            <Route path='/' element={<HomeComponent url="hi"/>} />
            <Route path='/login' element={<LoginComponent />} />
            <Route path='/course/:courseid' element={<CourseComponent />} />
            <Route path='/register_course' element={<CourseRegisterComponent />} />
            <Route path='/thank_you/:timeid' element={<ThankYouOrder />} />
            <Route path='/course_login' element={<CourseLoginComponent />} />
            <Route path='/cprofile/:id' element={<CourseProfileComponent />} />
            <Route path='/checkout/:timeid' element={<PaymentWindowComponent />} />
            <Route path='/logout' element={<LogoutComponent />} />
            <Route path='/search/:query' element={<SearchComponent />} />
            <Route path='/user/:username/profile' element={<LoggedInProfileComponent />} />
            <Route path='/see_friends' element={<UserLookupComponent />} />
            <Route path='/messages/:userid' element={<MessagingComponent />} />
            <Route path='/9261999/admin' element={<WebsiteAdminComponent />} />
            <Route path='/tee_time/:timeid' element={<TeeTimeComponent />} />
            <Route path='/reset_pass' element={<ResetPasswordComponent />} />
            <Route path='/add_review' element={<LeaveReviewComponent />} />
            <Route path='/my_profile' element={<MyProfileComponent />} />
            <Route path='/posts' element={<AllPostsComponent/>} />
            <Route path='/reviews/course/:courseid' element={<CourseReviewComponent/>} />
            {/* <Route path='/edit/:userid' element={<EditProfileComponent />} /> */}
          </Routes>
       
      </Router>
    </div>
    <FooterComponent />
    </div>
  );
}

export default App;
