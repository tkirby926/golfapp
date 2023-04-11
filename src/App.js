import './App.css';
import React, { useState } from 'react';
import TourSteps from './components/TourSteps';
import Joyride from 'react-joyride';
import UserProfile from './components/Userprofile';
import {HomeComponent} from './components/HomeComponent';
import {ProfileComponent} from './components/ProfileComponent';
import {LoggedInProfileComponent} from './components/LoggedInProfileComponent';
import {CourseComponent} from './components/CourseComponent';
import {PRFriendComponent} from './components/PRFriendComponent';
import { CourseLoginComponent } from './components/CourseLoginComponent';
import { CourseProfileComponent } from './components/CourseProfileComponent';
import { LoginComponent } from './components/LoginComponent';
import { CourseRegisterComponent } from './components/CourseRegisterComponent';
import { ThankYouOrder } from './components/ThankYouOrder';
import { LogoutComponent } from './components/LogoutComponent';
import {EditProfileComponent} from './components/EditProfileComponent';
import {EditCourseProfComponent} from './components/EditCourseProfComponent';
import PaymentWindowComponent from './components/PaymentWindowComponent';
import { MessagingComponent } from './components/MessagingComponent';
import { SearchComponent } from './components/SearchComponent';
import { UserLookupComponent } from './components/UserLookupComponent';
import {TeeTimeComponent} from './components/TeeTimeComponent';
import {FooterComponent} from './components/FooterComponent';
import {AllMessagesComponent} from './components/AllMessageConvoComponent';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CreateProfileComponent } from './components/CreateProfileComponent';
import Background from './components/photos/BackgroundPoss.jpeg';
import { WebsiteAdminComponent } from './components/WebsiteAdminComponent';
import { ResetPasswordComponent } from './components/ResetPasswordComponent';
import { LeaveReviewComponent } from './components/LeaveReviewComponent';
import { MyProfileComponent } from './components/MyProfileComponent';
import { AllPostsComponent } from './components/AllPostsComponent';
import { CourseReviewComponent } from './components/CourseReviewComponent';
import {HeaderComponent} from './components/HeaderComponent';
import {CourseTeeSheetComponent} from './components/CourseTeeSheetComponent';
import {CourseCashFlowComponent} from './components/CourseCashFlowComponent';
import { AllFriendTimesComponent } from './components/AllFriendTimesComponent';
import { EmailVerificationComponent } from './components/EmailVerificationComponent';
import { AdminLoginComponent } from './components/AdminLoginComponent';

function App() {
  const [, updateState] = React.useState(0);
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const headerRef = React.createRef();
  const hide_search_screens = ['/co', '/fr', '/lo', '/cp', '/se', '/cr', '/ed', '/th', '/te', '/re'];
  const hide_button_screens = ['/cp']
  const hide_all_buttons_arr = ['/lo', '/cr', '/re']
  var hide_search = false;
  var course_prof = false;
  var hide_all_buttons = false;
  var user = UserProfile.getCookie();
  var course_user = UserProfile.getCourseCookie();
  var tut = false;
  if (window.location.pathname == "/") {
    const params = (new URL(document.location)).searchParams;
    if (params.get('tut') == 'yes') {
      tut = true;
    }
  }

  // const dbx = DropBoxHelpers.getdb();

  if (window.location.pathname !== "/" && hide_search_screens.includes(window.location.pathname.slice(0,3))) {
    hide_search = true;
  }

  if (window.location.pathname !== "/" && hide_button_screens.includes(window.location.pathname.slice(0,3))) {
    course_prof = true;
  }

  if (window.location.pathname !== "/" && hide_all_buttons_arr.includes(window.location.pathname.slice(0,3))) {
    hide_all_buttons = true;
  }


  
  window.addEventListener('resize', forceUpdate)

  
  return (
    <div style={{backgroundImage: "url(" + Background + ")", backgroundSize: 'contain'}}>
    <HeaderComponent ref={headerRef} tut={tut} hide_all_buttons={hide_all_buttons} hide_search={hide_search} course_prof = {course_prof} user = {user}></HeaderComponent>
    <div class="class-app" style={{fontFamily: 'Arial, Helvetica, sans-serif',  
     backgroundAttachment: 'fixed', minHeight: '90vh', minWidth: '100vw', overflow: 'auto'}}> 
    <Router>
          <Routes>
            <Route path='/create_profile' element={<CreateProfileComponent user = {user}/>} />
            <Route path='/edit_profile' element={<EditProfileComponent user = {user}/>} />
            <Route path='/user' element={<ProfileComponent user = {user}/>} />
            <Route path='/' element={<HomeComponent user = {user} tut={tut}/>}/>
            <Route path='/login' element={<LoginComponent user = {user}/>} />
            <Route path='/course/:courseid' element={<CourseComponent user = {user}/>} />
            <Route path='/register_course' element={<CourseRegisterComponent user = {user}/>} />
            <Route path='/thank_you/:timeid' element={<ThankYouOrder user = {user}/>} />
            <Route path='/course_login' element={<CourseLoginComponent user = {user}/>} />
            <Route path='/cprofile/' element={<CourseProfileComponent cid = {course_user}/>} />
            <Route path='/cprofile/edit' element={<EditCourseProfComponent cid = {course_user}/>} />
            <Route path='/checkout/:timeid' element={<PaymentWindowComponent user = {user}/>} />
            <Route path='/logout' element={<LogoutComponent user = {user}/>} />
            <Route path='/search/:query' element={<SearchComponent user = {user}/>} />
            <Route path='/verify_email/:id' element={<EmailVerificationComponent/>} />
            <Route path='/user/:username/profile' element={<LoggedInProfileComponent user = {user}/>} />
            <Route path='/see_friends' element={<UserLookupComponent user = {user}/>} />
            <Route path='/messages' element={<MessagingComponent user = {user}/>} />
            <Route path='/messanger' element={<AllMessagesComponent user = {user}/>} />
            <Route path='/9261999/admin' element={<WebsiteAdminComponent user = {user}/>} />
            <Route path='/9261999/login' element={<AdminLoginComponent user = {user}/>} />
            <Route path='/tee_time/:timeid' element={<TeeTimeComponent user = {user}/>} />
            <Route path='/reset_pass' element={<ResetPasswordComponent user = {user}/>} />
            <Route path='/add_review' element={<LeaveReviewComponent user = {user}/>} />
            <Route path='/my_profile' element={<MyProfileComponent user = {user}/>} />
            <Route path='/posts' element={<AllPostsComponent user = {user}/>} />
            <Route path='/reviews/course/:courseid' element={<CourseReviewComponent user = {user}/>} />
            <Route path='/cprofile/tee_sheet' element={<CourseTeeSheetComponent cid = {course_user}/>} />
            <Route path='/cprofile/revenue' element={<CourseCashFlowComponent cid = {course_user}/>} />
            <Route path='/friends_times' element={<AllFriendTimesComponent user = {user}/>} />
            <Route path='/pr_users' element={<PRFriendComponent user = {user}/>} />
            {/* <Route path='/edit/:userid' element={<EditProfileComponent />} /> */}
          </Routes>
      </Router>
    </div>
    <FooterComponent />
    </div>
  );
}

export default App;
