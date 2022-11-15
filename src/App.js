import './App.css';
import UserProfile from './components/Userprofile';
import {HomeComponent} from './components/HomeComponent';
import {ProfileComponent} from './components/ProfileComponent';
import {LoggedInProfileComponent} from './components/LoggedInProfileComponent';
import {CourseComponent} from './components/CourseComponent';
import { CourseLoginComponent } from './components/CourseLoginComponent';
import { CourseProfileComponent } from './components/CourseProfileComponent';
import { LoginComponent } from './components/LoginComponent';
import { CourseRegisterComponent } from './components/CourseRegisterComponent';
import { ThankYouCourse } from './components/ThankYouCourse';
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


function App() {
  return (
    <div>
    <div class="class-app" style={{fontFamily: 'Arial, Helvetica, sans-serif', backgroundImage: "url(" + Background + ")",  
    backgroundSize: 'cover', backgroundAttachment: 'fixed', minHeight: '90vh', minWidth: '100vw', overflow: 'auto'}}>
      
    <Router>
        <div>
            {/* <li><Link to={'/swiper'} className="nav-link">Contact</Link></li>
            <li><Link to={'/'} className="nav-link">Contacts</Link></li> */}
          <Routes>
            <Route path='/create_profile' element={<CreateProfileComponent />} />
            <Route path='/edit_profile' element={<EditProfileComponent />} />
            <Route path='/user' element={<ProfileComponent />} />
            <Route path='/' element={<HomeComponent />} />
            <Route path='/login' element={<LoginComponent />} />
            <Route path='/course/:courseid' element={<CourseComponent />} />
            <Route path='/register_course' element={<CourseRegisterComponent />} />
            <Route path='/course_welcome' element={<ThankYouCourse />} />
            <Route path='/course_login' element={<CourseLoginComponent />} />
            <Route path='/course_profile/:id' element={<CourseProfileComponent />} />
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
            {/* <Route path='/edit/:userid' element={<EditProfileComponent />} /> */}
          </Routes>
        </div>
      </Router>
    </div>
    {/* <FooterComponent /> */}
    </div>
  );
}

export default App;
