import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import FeedPage from './FeedPage';
import UserLogin from './UserLogin';
import './App.css';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import UserProfile from './UserProfile';
import SignupPage from './SignupPage';
import CreatePost from './CreatePost';
import UserPosts from './UserPosts';
import editProfile from './EditProfile';
import AdminController from './AdminController';

const App = () => {
    return (
        <Router>
            <div> 
              <Routes>
                    <Route exact path="/" Component={UserLogin} />
                    <Route path="/feedpage" Component={FeedPage} />
                    <Route path='/homepage' Component={HomePage} />
                    <Route path="/search/:q" Component={SearchPage} />
                    <Route path="/userprofile/:username" Component={UserProfile}/>
                    <Route path='/signup' Component={SignupPage} />
                    <Route path='/addpost' Component={CreatePost} />
                    <Route path='/editprofile' Component={editProfile}/>
                    <Route path='/userposts/:username/:q' Component={UserPosts} />
                    <Route path='/adminpage' Component={AdminController}/>
              </Routes>
                </div>
        </Router>
    );
};

export default App;
