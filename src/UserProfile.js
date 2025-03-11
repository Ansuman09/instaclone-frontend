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
        setUser(userData);
        setFollowResponse(userData.is_following);
        
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

  if (loading) {
    return <HomeLoading/>;
  }

  return (
    <div className="user-profile-contents">
      <div style={{ paddingBottom: '120px' }}>
        <NavBar />
      </div>

      <div className="user-profile-username-and-follow">
        <h4>{user.username}</h4>
        <a
          className={followResponse ? "unfollow-button" : "follow-button"}
          onClick={followResponse ? handleUnfollow : handleFollow}
        >
          {followResponse ? "Unfollow" : "Follow"}
        </a>
      </div>

      <div className="userinfo-container">
        <div className="userimg-container">
          <img src={userProfileImage} alt="User profile" />
        </div>

        <UserProfileFollowers username={username} />
        <UserProfileFollowing username={username} />
      </div>

      <UserProfilePosts username={username} />
    </div>
  );
};

export default UserProfile;
