import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "./NavBar";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setFollowers, setFollowing, doFollow, doUnFollow } from "./features/Subscriptions";
import UserProfilePosts from "./UserProfilePosts";
import UserProfileFollowers from "./UserProfileFollowers";
import UserProfileFollowing from "./UserProfileFollowing";
import "./UserProfile.css";
import HomeLoading from "./loadingComponents/HomeLoading";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followResponse, setFollowResponse] = useState(false);
  
  const { username } = useParams();
  const token = localStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_API_URL;
  const subsDispatch = useDispatch();
  const subs = useSelector((state) => state.subs);

  //Need to add feature to unrequest
  const [requestFollow,setRequestFollow] = useState(false);

  const fetchImageUrl = async (imageName) => {
    try {
      const response = await fetch(`${apiUrl}/get-images/images/${imageName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image for ${imageName}`);
      }

      const imageBlob = await response.blob();
      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.error("Unable to get image:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user info
        const response = await fetch(`${apiUrl}/userinfo/info/${username}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load user info");
        }

        const userData = await response.json();
        
        console.log(userData)
        setUser(userData);
        setFollowResponse(userData.is_following);
        setRequestFollow(userData.has_requested);
        // Fetch profile image URL
        if (userData.profile_image) {
          const imageUrl = await fetchImageUrl(userData.profile_image);
          setUserProfileImage(imageUrl);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, token, apiUrl]);

  const handleFollow = async () => {
    const data = {
      following_id: user.userid,
    };
      try {
      await fetch(`${apiUrl}/followers/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
         setFollowResponse(true);
        subsDispatch(doFollow());
        } catch (error) {
      console.error("Unable to follow user:", error);
    } 
   
    
  };

  const handleRequestToFollow = async ()=>{
       const data = {
      following_id: user.userid,
    };
      try{
        const response= await fetch(`${apiUrl}/followers/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        
      }
    )
    console.log(data)
    setRequestFollow(true)}
      catch(e){
        console.log(e);
      }
    
      
  }
  const handleUnfollow = async () => {
    const data = {
      following_id: user.userid,
    };

    try {
      await fetch(`${apiUrl}/followers/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      setFollowResponse(false);
      
      subsDispatch(doUnFollow());
    } catch (error) {
      console.error("Unable to unfollow user:", error);
    }
  };

  const handleRecallRequest=async()=>{
    //should be in same queue as follow requests
    

    try {
      const response = await fetch(`${apiUrl}/followers/delete/follow-request/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
        });
      
      if (response.ok){
        setRequestFollow(false)
      }
       } catch (error) {
      console.error("Unable to unfollow user:", error);
    } 
  }

  
  if (loading) {
    return <HomeLoading/>;
  }

  return (
    <div className="user-profile-contents">
      <div style={{ paddingBottom: '120px' }}>
        <NavBar />
      </div>

      {user.private_account=="no" && <div className="user-profile-username-and-follow">
        <h4>{user.username}</h4>
        <a
          className={followResponse ? "unfollow-button" : "follow-button"}
          onClick={followResponse ? handleUnfollow : handleFollow}
        >
       {followResponse ? "Unfollow":"Follow"}
        </a>
      </div>}

      {user.private_account=="yes" && <div className="user-profile-username-and-follow">
        <h4>{user.username}</h4>
        <a
          className={followResponse ? "unfollow-button": requestFollow ? "unfollow-button" : "follow-button"}
          onClick={ followResponse ? handleUnfollow : requestFollow ? handleRecallRequest:handleRequestToFollow}
        >
       {followResponse? "Unfollow": requestFollow ? "Requested":"Follow"}
        </a>
      </div>}

      <div className="userinfo-container">
        <div className="userimg-container">
          <img src={userProfileImage} alt="User profile" />
        </div>

        <UserProfileFollowers username={username} />
        <UserProfileFollowing username={username} />
      </div>

      {user.private_account==="yes" ? followResponse && <UserProfilePosts username={username}/> :<UserProfilePosts username={username} />}
    </div>
  );
};

export default UserProfile;
