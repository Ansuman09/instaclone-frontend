import React from "react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import "./HomePage.css";

const HomePage=()=>{

    const [posts,setPosts] = useState([]);
    const [user,setUser] = useState(null);
    const [loading,setloading] = useState(true);
    const [followers,setFollowers]=useState([]);
    const [following,setFollowing]=useState([]);

    const [userLoading,setUserLoading]=useState(true);
    const [userProfileImage,setUserProfileImage]=useState();
    const [postsLoading,setPostsLoading]=useState(true);
    const [postImages,setPostImages]=useState([]);    
    const userid = localStorage.getItem('id')
    const token = localStorage.getItem('token')
            
    const nav = useNavigate();
    
    useEffect(()=>{
      const fetchUserData = async () => {
        try {
          // Fetch user info
          const response1 = await fetch(`http://localhost:8080/userinfo/${userid}`, {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!response1.ok) {
            throw new Error("Failed to load user info");
          }  
          const userData = await response1.json();
          setUser(userData);
          console.log(userData)  
          setUserLoading(false)
          
        }catch(error){
          console.log(error)
        }}
        fetchUserData();
    },[])

    useEffect(() => {
        const fetchData = async () => {
          try {   
            
            // Fetch posts data
            const response2 = await fetch(`http://localhost:8080/posts/home/${userid}/${userid}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
    
            if (!response2.ok) {
              throw new Error("Failed to load posts data");
            }
    
            const postsData = await response2.json();
            setPosts(postsData);
            
            const responseToGetFollowers= await fetch(`http://localhost:8080/followers/userfollowers/${userid}`,{
              method:'GET',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });

            if (!responseToGetFollowers.ok){
              throw new Error("Failed to load followers");
            }
            
            const followersData = await responseToGetFollowers.json();
            setFollowers(followersData)

            // console.log(responseToGetFollowers)

            const responseToGetFollowing= await fetch(`http://localhost:8080/followers/following/${userid}`,{
              method:'GET',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });

            if (!responseToGetFollowing.ok){
              throw new Error("Failed to load followers");
            }
            
            const followingData = await responseToGetFollowing.json();
            setFollowing(followingData)

            // console.log(responseToGetFollowing)

          } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors (e.g., show error message to user, retry logic, etc.)
          }
        };

        fetchData().then(()=>{
            setloading(false)
        }); // Invoke the async function
        
      }, [user]); 

      useEffect(() => {
        const fetchImageData = async () => {
          try {
            const responseToGetImagesByOwner = await fetch(`http://localhost:8080/postimages/all/${user.username}`, {
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
    
      }, [token,user]); // Dependency on token to ensure this runs when the token is available
      
      const fetchImageUrl = async (imageName) => {
        console.log("Called image data");
        try {
          const response = await fetch(`http://localhost:8080/get-images/images/${imageName}`, {
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
        if (postsLoading) return; // Exit early if loading is not finished
  
        const update_posts = async () => {
          const postsDataWithImageUrl = await Promise.all(
            postImages.map(async (postImage) => {
              // const setUserProfileImage=setUserProfileImage
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
  
        update_posts(); // Call the async f/unction
        // setLoading(false);
  
      }, [postsLoading]); // Trigger when postImages or postsLoading changes
      
    const handleViewPost=(e,post_id)=>{
        e.preventDefault()
        nav(`/userposts/${user.username}/${post_id}`)
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
        return (<div>
            <h3>loading...</h3>
        </div>)
    }else{
        return (
        <div>
            <div style={{'padding-bottom':'120px'}}>
              <NavBar />
              
            </div>
            <div className="home-username">
                <h4>{user.username}</h4>
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
    )
}}
//-------------------
// w
export default HomePage;