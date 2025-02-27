import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "./NavBar";
import "./UserProfile.css";
import { useNavigate } from "react-router";
import { useSelector,useDispatch } from "react-redux";
import { setFollowers,setFollowing,doFollow,doUnFollow } from "./features/Subscriptions";
import UserProfilePosts from "./UserProfilePosts";

const UserProfile=()=>{
    const [user,setUser]=useState();
    const {username} = useParams();
    const [loading,setLoading] = useState(true);               
    const [followResponse,setFollowResponse] = useState(false);
    
    const subs=useSelector(state=>state.subs);
    const subsDispatch=useDispatch();

    
    const [userLoading,setUserLoading]=useState(true);
    const [userProfileImage,setUserProfileImage]=useState();
    
    const token = localStorage.getItem('token')
            
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchImageUrl = async (imageName) => {
        console.log("Called image data");
        try {
          const response = await fetch(`${apiUrl}/get-images/images/${imageName}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          console.log(`Got image data: ${imageUrl}`);
          return imageUrl;
        } catch (error) {
          console.log("Unable to get image:", error);
        }
      };
      

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user info
                const responseToGetProfileUserData = await fetch(`${apiUrl}/userinfo/info/${username}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!responseToGetProfileUserData.ok) {
                    throw new Error("Failed to load user info");
                }

                const userData = await responseToGetProfileUserData.json();
                setUser(userData);
                console.log(userData);
                setFollowResponse(userData.is_following)

            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserData();
        setUserLoading(false);
    }, [token]);
    
    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (!user) return; // Wait until user is set

            try {
            
                // Fetch followers data
                const responseToGetFollowers = await fetch(`${apiUrl}/followers/userfollowers/${username}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!responseToGetFollowers.ok) {
                    throw new Error("Failed to load followers");
                }

                const followersData = await responseToGetFollowers.json();
                subsDispatch(setFollowers(followersData));

                // Fetch following data
                const responseToGetFollowing = await fetch(`${apiUrl}/followers/following/${username}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!responseToGetFollowing.ok) {
                    throw new Error("Failed to load following");
                }

                const followingData = await responseToGetFollowing.json();
                subsDispatch(setFollowing(followingData));

            } catch (error) {
                console.error("Error fetching additional data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdditionalData();
    }, [user]);
    


        
    "----"
    
    const handleFollow=async()=>{
        const data={
            following_id:user.userid,
        };
        console.log(data)
        try{
        await fetch(`${apiUrl}/followers/add`,{
            method:'POST',
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify(data)
        
        })
        setFollowResponse(!followResponse);
        subsDispatch(doFollow())
        
        
    } catch(e){
        throw new Error("Unable to update followers");
    }
    
    }

    const handleUnfollow=async()=>{
        const data={
            following_id:user.userid,
        };
        console.log(data)
        try{
        await fetch(`${apiUrl}/followers/delete`,{
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${token}`
            },
            body:JSON.stringify(data)
        
        })
        setFollowResponse(!followResponse);
        subsDispatch(doUnFollow())
        
        
    } catch(e){
        console.log(e);
        throw new Error("Unable to update followers");
    }
        
    }

    
    useEffect(()=>{
      if (!user || !user.profile_image) return;
      const getUserProfileImage= async ()=>{
        const ProfileImageUrl=await fetchImageUrl(user.profile_image);
        setUserProfileImage(ProfileImageUrl)
      }
      getUserProfileImage()
    },[userLoading,user])


    if (loading){
        return (<h1>...Loading</h1>)
    }
    else {
        console.log(user);
        return (
        <div>
            <div style={{paddingBottom:'120px'}}>
              <NavBar />
              
            </div>
            <div className="home-username">
                <h4>{user.username}</h4>
                <a className={followResponse ? "unfollow-button" : "follow-button"}onClick={followResponse ? handleUnfollow : handleFollow}>{followResponse ? "Unfollow" : "Follow"}</a>
              </div>  
              <div className="userinfo-container">
                <div className="userimg-container">
                <img src={userProfileImage}></img>
                
              </div>
              <div className="userinfo-followers">
                <h1>{subs.followersCount}</h1>
                <h2>followers</h2>
              </div>

              <div className="userinfo-followers">
                <h1>{subs.followingCount}</h1>
                <h2>following</h2>
              </div>

            </div>

            <UserProfilePosts username={username} />
         </div>
    )}
}


export default UserProfile;