import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "./NavBar";
import "./UserProfile.css";
import { useNavigate } from "react-router";

const UserProfile=()=>{
    const [user,setUser]=useState();
    const {username} = useParams();
    const [loading,setLoading] = useState(true);               
    const [followResponse,setFollowResponse] = useState(false);
    const [postsLoading,setPostsLoading]=useState(true);

    const [postImages,setPostImages]=useState([]);
    const [posts,setPosts] = useState([]);

    const [userLoading,setUserLoading]=useState(true);
    const [userProfileImage,setUserProfileImage]=useState();
    
    const [followers,setFollowers]=useState([]);
    const [following,setFollowing]=useState([]);
    const visitorUserId = localStorage.getItem('id')
    const token = localStorage.getItem('token')
            
    const apiUrl = process.env.REACT_APP_API_URL;

    const nav = useNavigate();

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
      

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user info
                const responseToGetProfileUserData = await fetch(`${apiUrl}/userinfo/${username}/${visitorUserId}`, {
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
                setFollowResponse(userData.is_following)

            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserData();
        setUserLoading(false);
    }, [followResponse]);
    
    useEffect(() => {
        const fetchAdditionalData = async () => {
            if (!user) return; // Wait until user is set

            try {
                // Fetch posts data
                const responseToGetPosts = await fetch(`${apiUrl}/posts/home/${username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!responseToGetPosts.ok) {
                    throw new Error("Failed to load posts data");
                }

                const postsData = await responseToGetPosts.json();
                setPosts(postsData);
                setPostsLoading(false);
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
                setFollowers(followersData);

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
                setFollowing(followingData);

            } catch (error) {
                console.error("Error fetching additional data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdditionalData();
    }, [user, followResponse]);
    


    useEffect(() => {
        const fetchImageData = async () => {
          try {
            const responseToGetImagesByOwner = await fetch(`${apiUrl}/postimages/all/${username}`, {
              method: "GET",
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
    
            if (!responseToGetImagesByOwner.ok) {
              throw new Error("Unable to retrieve post images");
            }
    
            const postImagesData = await responseToGetImagesByOwner.json();
            setPostImages(postImagesData);
            setPostsLoading(false); // Only set this after fetching is successful
            console.log(`These are all the post images: ${postImagesData}`);
            console.log(postImagesData);
            
          } catch (error) {
            console.error("Error fetching post images:", error);
          }
        };
    
        fetchImageData(); // Call the async function here
    
      }, [token,username]); // Dependency on token to ensure this runs when the token is available
    
        useEffect(() => {
          if (postsLoading) return; // Exit early if loading is not finished
    
          const update_posts = async () => {
            const postsDataWithImageUrl = await Promise.all(
              postImages.map(async (postImage) => {
                const imageUrl = await fetchImageUrl(postImage.imageName); // Ensure this is a valid async function
                console.log(`Got image_url as ${imageUrl}`);
                return {
                  ...postImage,
                  imageUrl
                };
              })
            );
            setPostImages(postsDataWithImageUrl);
          };
    
          update_posts(); // Call the async function
          setLoading(false);
    
        }, [postsLoading]); // Trigger when postImages or postsLoading changes
          
        
    "----"
    
    const handleFollow=async()=>{
        const data={
            following_id:user.userid,
            usr_id:parseInt(visitorUserId,10)
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
        
        }).then(
        setFollowResponse(!followResponse))
    } catch(e){
        throw new Error("Unable to update followers");
    }
        
    }

    const handleUnfollow=async()=>{
        const data={
            following_id:user.userid,
            usr_id:parseInt(visitorUserId,10)
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
        
        }).then(
        setFollowResponse(!followResponse))
    } catch(e){
        console.log(e);
        throw new Error("Unable to update followers");
    }
        
    }

    const handleViewPost=(e,post_id)=>{
        e.preventDefault()
        nav(`/userposts/${username}/${post_id}`)
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
            <div style={{'padding-bottom':'120px'}}>
              <NavBar />
              
            </div>
            <div className="home-username">
                <h4>{user.username}</h4>
                <a className={user.is_following ? "unfollow-button" : "follow-button"}onClick={user.is_following ? handleUnfollow : handleFollow}>{user.is_following ? "Unfollow" : "Follow"}</a>
              </div>  
              <div className="userinfo-container">
                <div className="userimg-container">
                <img src={userProfileImage}></img>
                
              </div>
              <div className="userinfo-followers">
                <h1>{followers.length}</h1>
                <h2>followers</h2>
              </div>

              <div className="userinfo-followers">
                <h1>{following.length}</h1>
                <h2>following</h2>
              </div>

            </div>

            <div className="home-posts-container">
                {posts.map(post=>(
                    <div className="post-container userprofile-posts-image">   
                    {postImages.filter(image=>image.post_id==post.post_id).map(image=>
                        <img  onClick={(e)=>handleViewPost(e,post.post_id)} src={image.imageUrl}></img>)}
                      </div>    
                ))}
            </div> 
            
         </div>
    )}
}


export default UserProfile;