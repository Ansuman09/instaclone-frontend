import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedPage from './FeedPage';
import UserLogin from './UserLogin';
import './App.css';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import UserProfile from './UserProfile';
import SignupPage from './SignupPage';
import CreatePost from './CreatePost';
import UserPosts from './UserPosts';
import EditProfile from './EditProfile';
import AdminController from './AdminController';
import HomeLoading from './loadingComponents/HomeLoading';

const App = () => {
    return (
        <Router>
            <div> 
              <Routes>
                    <Route exact path="/" element={<UserLogin />} />
                    <Route path="/feedpage" element={<FeedPage />} />
                    <Route path='/homepage' element={<HomePage />} />
                    <Route path="/search/:q" element={<SearchPage />} />
                    <Route path="/userprofile/:username" element={<UserProfile />} />
                    <Route path='/signup' element={<SignupPage />} />
                    <Route path='/addpost' element={<CreatePost />} />
                    <Route path='/editprofile' element={<EditProfile />} />
                    <Route path='/userposts/:username/:q' element={<UserPosts />} />
                    <Route path='/adminpage' element={<AdminController />} />
              </Routes>
            </div>
        </Router>
    );
};

export default App;
