import React from "react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "./HomePage.css";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import HomePagePosts from "./HomePagePosts";
import UserProfileFollowing from "./UserProfileFollowing";
import UserProfileFollowers from "./UserProfileFollowers";

const HomePage=()=>{

    const [user,setUser] = useState(null);
    const [loading,setloading] = useState(true);
    const [userProfileImage,setUserProfileImage]=useState();   
    const token = localStorage.getItem('token');

    const userRole=jwtDecode(token)

    const apiUrl = process.env.REACT_APP_API_URL;

    
    const visitor = localStorage.getItem('visitor');
    
    useEffect(()=>{
      const fetchUserInfo= async()=> {
        const response=await fetch(`${apiUrl}/userinfo/image`,{
          method:"GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }

        });

        const userData=await response.json();
        setUser(userData);
          
        const ProfileImageUrl=await fetchImageUrl(userData.profile_image);
        setUserProfileImage(ProfileImageUrl)
      
      }

      fetchUserInfo();
      setloading(false);
    },[token])

    

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
          // Use imageUrl to display the image, e.g., set it in an <img> element.
        } catch (error) {
          console.log("Unable to get image:", error);
        }
      };
  

    if (loading){
        return (<div>
            <h3>loading...</h3>
        </div>)
    }else{
        return (
        <div>
            <div style={{'padding-bottom':'120px'}}>
              <NavBar role={userRole.roles[0]}/>
              
            </div>
            <div className="home-username">
                <h4>{visitor}</h4>
              </div>  
              <div className="userinfo-container">
                <div className="userimg-container">
                <img src={userProfileImage}></img>
                
              </div>

              <UserProfileFollowers username={visitor}/>

              <UserProfileFollowing username={visitor}/>

            </div>

            <HomePagePosts visitor={visitor}/> 
            
         </div>
    )
}}
//-------------------
// w
export default HomePage;