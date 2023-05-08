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
import { CourseLogoutComponent } from './components/CourseLogoutComponent';
import { ChangePasswordComponent } from './components/ChangePassComponent';
import { PaymentContainerComponent } from './components/PaymentWindowContainer';
import { SuggestedFriendsComponent } from './components/SuggestedFriendsComp';
import { SinglePostComponent } from './components/SinglePostComponent';
import { ErrorComponent } from './components/ErrorComponent';

function App() {
  const [, updateState] = React.useState(0);
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const headerRef = React.createRef();
  const [hide_drops, updateHideDrops] = React.useState(0);
  const hide_search_screens = ['/co', '/fr', '/lo', '/cp', '/se', '/cr', '/ed', '/th', '/te', '/re'];
  const hide_button_screens = ['/cp']
  const [hide_home_drop, updateHideHomeDrop] = React.useState(0);
  const [hide_search_results, updateHideSearchResults] = React.useState(0);
  const hide_all_buttons_arr = ['/lo', '/cr', '/re']
  var hide_search = false;
  var course_prof = false;
  var hide_all_buttons = false;
  var course_user = null;
  
  const checkClick = function(event) {
    updateHideDrops(event.target.getAttribute('id') != "drops_button" ? true : false)
    updateHideHomeDrop(window.location.pathname == '/' && event.target.getAttribute('id') != "loc" ? true : false)
    updateHideSearchResults(event.target.getAttribute('id') != "search" ? true : false)
  }

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
  window.addEventListener('click', checkClick)

  
  return (
    <div style={{backgroundImage: "url(" + Background + ")", backgroundSize: 'contain'}}>
    <HeaderComponent ref={headerRef} hide_search_results={hide_search_results} hide_drops={hide_drops} hide_all_buttons={hide_all_buttons} hide_search={hide_search} course_prof = {course_prof}></HeaderComponent>
    <div class="class-app" style={{fontFamily: 'Arial, Helvetica, sans-serif',  
     backgroundAttachment: 'fixed', minHeight: '90vh', minWidth: '100vw', overflow: 'auto', fontWeight: '600'}}> 
    <Router>
          <Routes>
            <Route path='/create_profile' element={<CreateProfileComponent/>} />
            <Route path='/edit_profile' element={<EditProfileComponent/>} />
            <Route path='/user' element={<ProfileComponent/>} />
            <Route path='/' element={<HomeComponent hide_drop={hide_home_drop} />}/>
            <Route path='/login' element={<LoginComponent/>} />
            <Route path='/course/:courseid' element={<CourseComponent/>} />
            <Route path='/register_course' element={<CourseRegisterComponent/>} />
            <Route path='/thank_you/:timeid' element={<ThankYouOrder/>} />
            <Route path='/course_login' element={<CourseLoginComponent/>} />
            <Route path='/cprofile/' element={<CourseProfileComponent cid = {course_user}/>} />
            <Route path='/cprofile/edit' element={<EditCourseProfComponent cid = {course_user}/>} />
            <Route path='/checkout/:timeid' element={<PaymentContainerComponent/>} />
            <Route path='/logout' element={<LogoutComponent/>} />
            <Route path='/search' element={<SearchComponent/>} />
            <Route path='/verify_email/:id' element={<EmailVerificationComponent/>} />
            <Route path='/user/:username/profile' element={<LoggedInProfileComponent/>} />
            <Route path='/see_friends' element={<UserLookupComponent/>} />
            <Route path='/messages' element={<MessagingComponent/>} />
            <Route path='/messanger' element={<AllMessagesComponent/>} />
            <Route path='/9261999/admin' element={<WebsiteAdminComponent/>} />
            <Route path='/9261999/login' element={<AdminLoginComponent/>} />
            <Route path='/tee_time/:timeid' element={<TeeTimeComponent/>} />
            <Route path='/reset_pass' element={<ResetPasswordComponent/>} />
            <Route path='/pass_reset/:sessionid' element={<ChangePasswordComponent/>} />
            <Route path='/add_review' element={<LeaveReviewComponent/>} />
            <Route path='/my_profile' element={<MyProfileComponent/>} />
            <Route path='/posts' element={<AllPostsComponent/>} />
            <Route path='/post/:pid' element={<SinglePostComponent/>} />
            <Route path='/reviews/course/:courseid' element={<CourseReviewComponent/>} />
            <Route path='/cprofile/tee_sheet' element={<CourseTeeSheetComponent cid = {course_user}/>} />
            <Route path='/cprofile/revenue' element={<CourseCashFlowComponent cid = {course_user}/>} />
            <Route path='/friends_times' element={<AllFriendTimesComponent/>} />
            <Route path='/pr_users' element={<PRFriendComponent/>} />
            <Route path='/course_logout' element={<CourseLogoutComponent/>} />
            <Route path='/suggested_friends' element={<SuggestedFriendsComponent/>} />
            <Route path='*' element={<ErrorComponent/>} />
            {/* <Route path='/edit/:userid' element={<EditProfileComponent />} /> */}
          </Routes>
      </Router>
    </div>
    <FooterComponent />
    </div>
  );
}

export default App;
