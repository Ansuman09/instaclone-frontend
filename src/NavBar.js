import React, { useState } from "react";
import { useNavigate } from "react-router";
import { faBars, faCamera, faRightFromBracket, faSquareRss, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBar = () => {
    const [searchString, setSearchString] = useState("");
    const nav = useNavigate();
    const userid = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const [showNav,setShowNav]=useState(false);
    const currentPath = location.pathname;
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

    const handleShowLink=()=>{
        setShowNav(!showNav);
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

    return (
        <div className="navbar">
        <div className="nav-container">
            <div className="nav-home-link">
                <button type="button" name="Home" onClick={handleHomeNavigation}>Home</button>
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
                <button type="button" name="Logout" onClick={handleEditProfile}><FontAwesomeIcon icon={faUserCircle}/> Profile</button>

            </ul>
        </div>
        </div>
    );
};

export default NavBar;
