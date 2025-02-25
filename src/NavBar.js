import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import { faBars, faBell, faBellConcierge, faBellSlash, faCamera, faClose, faCross, faRightFromBracket, faSquareRss, faUserAlt, faUserCircle, faUserGroup, faUserLock, faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications,updateNotifications } from "./features/Notifications";
import FollowTrending from "./FollowTrending";

const NavBar = (props) => {
    const [searchString, setSearchString] = useState("");
    const nav = useNavigate();
    const userid = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const [showNav,setShowNav]=useState(false);

    const [showNotification,setShowNotifications] = useState(false);
    
    const notificationDispatch=useDispatch();
    const notifications=useSelector(state=>state.notifications.value);
    
    const currentPath = location.pathname;
    const [showFollowerSlide,setShowFollowerSlide]=useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;

    
    useEffect(()=>{const fetchNotifications=async()=>{
        const response = await fetch(`${apiUrl}/api/notifications/user`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        })

        if(response.ok){
            const data = await response.json();
            notificationDispatch(setNotifications(data));
            console.log(data);
        }}

        fetchNotifications();
    },{});

    const handleHomeNavigation = () => {
        nav('/homepage');
    };


    const handleSearch = (e) => {
        if (currentPath==`/search/${encodeURIComponent(searchString)}`){
            window.location.reload();
        }else{
            nav(`/search/${encodeURIComponent(searchString)}`);
        }
        
    };

    const handleReadNotification=async(id)=>{
        const notificationId = parseInt(id);
        
        notificationDispatch(updateNotifications(id))
        const response = await fetch(`${apiUrl}/api/notifications/read/${notificationId}`,{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${token}`
            }
        })

        if(response.ok){
            console.log("notification update request sent")
        }


    }
    const handleShowLink=()=>{
        setShowNav(!showNav);
    }

    const handleShowNotifications=()=>{
        setShowNotifications(!showNotification);
    }

    const handleFeedsView=()=>{
        nav("/feedpage")
    }

    const handlePostView=()=>{
        nav("/addpost")
    }

    const handleEditProfile=()=>{
        nav("/editprofile")
        
    }
    
    const handleLogout=()=>{
        localStorage.clear()
        nav('/');
    }

    const handleAdminPage=()=>{
        nav('/adminpage')}

    return (
        <div className="navbar">
        <div className="nav-container">
            <div className="nav-home-link">
                <button type="button" name="Home" onClick={handleHomeNavigation}>Home</button>
            </div>
            <div className="nav-notification-button">
            {notifications.filter(notification => notification.status === 'unread').length !==0 ?  <button type="button" className="notification-icon-unread" onClick={handleShowNotifications}><FontAwesomeIcon icon={faBell} /></button> : <button type="button" className="notification-icon-read" onClick={handleShowNotifications}><FontAwesomeIcon icon={faBell} /></button> }
            {<span>{notifications.filter(notification => notification.status === 'unread').length}</span>}
            </div>
            <div >
                <form onSubmit={handleSearch} className="nav-search-bar">
                    <input type="text" value={searchString} onChange={(e) => setSearchString(e.target.value)} />
                    <button type="submit">Search</button>
                </form>
            </div>
            <div>
                <button type="button" className="nav-button" onClick={handleShowLink}><FontAwesomeIcon icon={faBars}/></button>
            </div>
        </div>
        <div className={`nav-links ${showNav ? 'active':''}`} >
            <ul>
                <button type="button" onClick={handleFeedsView}><FontAwesomeIcon icon={faSquareRss}/> Feed</button>
                <br />
                <button type="button" onClick={handlePostView}><FontAwesomeIcon icon={faCamera}/> Post</button>
                <br />
                <button type="button" name="Logout" onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket}/> Logout</button>
                <br />
                <button type="button"  onClick={handleEditProfile}><FontAwesomeIcon icon={faUserCircle}/> Profile</button>
                <br/>

                {props.role=="ROLE_ADMIN" && <button type="button" onClick={handleAdminPage}><FontAwesomeIcon icon={faUserLock}/> Secure</button>}
            </ul>
        </div>
        <div className={`notification-tiles ${showNotification ? 'active':''}`}>
            {notifications.map(notification=>(
                <div  className={`notification-message-${notification.status}`} onClick={()=>handleReadNotification(notification.id)}>
                    <b>{notification.actinguser} </b> {notification.message}
                </div>
            ))}
        </div>
        {showFollowerSlide===true ? <FollowTrending apiUrl={apiUrl} token={token}/>: <div className="follower-slide-icon" onClick={()=>{setShowFollowerSlide(true)}}><FontAwesomeIcon icon={faUserGroup}/></div>}
        {showFollowerSlide && <div className="follower-slide-icon" onClick={()=>{setShowFollowerSlide(false)}}><FontAwesomeIcon icon={faClose} style={{"padding-left":"2.5px","padding-right":"2.5px"}}/></div>}
        </div>
    );
};

export default NavBar;
 