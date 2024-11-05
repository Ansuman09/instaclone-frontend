import React from "react";
import NavBar from "./NavBar";
import { useState,useEffect } from "react";
import "./EditProfile.css";
import { useNavigate } from "react-router";

const editProfile=()=>{

    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');

    const nav= useNavigate();
    const [user,setUser] = useState({});
    const [userProfileImage,setUserProfileImage]=useState();
    const [changeProfileImage,setChangeProfileImage]=useState(false);
    const [userDataToSend,setUserDataToSend]=useState({});

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
    
    useEffect(()=>{
        const fetchUserInfo= async()=> {
          try {
          const response=await fetch(`${apiUrl}/userinfo/image`,{
            method:"GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
  
          });
  
          const userData=await response.json();
          setUser(userData);
          setUserDataToSend(userData);
          console.log(userData);
        }catch(error){
          console.log(error);
        } }
  
        fetchUserInfo();
      },[])
  
    useEffect(()=>{
        if (!user || !user.profile_image) return;
        const getUserProfileImage= async ()=>{
          const ProfileImageUrl=await fetchImageUrl(user.profile_image);
          setUserProfileImage(ProfileImageUrl)
        }
        getUserProfileImage()
      },[user])
  
    const handleFileUpload=(imageFile)=>{
        const image=URL.createObjectURL(imageFile);
        console.log(imageFile.name);
        setUserProfileImage(image);
        setUserDataToSend({...userDataToSend,profile_image:imageFile.name})    
        console.log(userDataToSend);
    }

    const handleUsernameUpdate = async () => {
      
      try {
        const response = await fetch(`${apiUrl}/userinfo/update/name`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({username:userDataToSend.username,profile_image:userDataToSend.profile_image}),  // Ensure that the body is properly serialized
        });

        if (response.ok) {
          console.log('User name updated successfully:');
          localStorage.clear();
          nav("/");
        } else {
          const errorData = await response.json();
          console.error('Error updating name:', errorData);
        }
      } catch (e) {
        console.error('Unable to update name:', e);
      }
    };



    return(
    <div>
         <div style={{'padding-bottom':'120px'}}>
              <NavBar />
              
        </div>
        <div style={{paddingLeft:300}}>
        <div className="edit-profile-form">
            {!changeProfileImage && <button type="button" onClick={()=>{setChangeProfileImage(true)}}>Change Profile Pic</button>}
            {changeProfileImage && <input type="file" onChange={(e)=>handleFileUpload(e.target.files[0])} />}
            <p></p>
            <img src={userProfileImage} alt="Profile image"></img>
            <p>Username: </p>
            <input value={userDataToSend.username} onChange={(e)=>setUserDataToSend({...userDataToSend,username:e.target.value})}></input>
            <button type="button" onClick={handleUsernameUpdate}>update</button>
        </div>
        <p>edit profile here</p>
        </div>
    </div>)
}


export default editProfile;