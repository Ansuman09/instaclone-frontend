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
    
    const nav = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch user info
            const userid = localStorage.getItem('id')
            const token = localStorage.getItem('token')
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
        
      }, []); 
    
    
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
                <img src={user.profile_image}></img>
                
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
                    <div className="post-container">   
                        <img  src={post.image_url}></img>
                      </div>    
                ))}
            </div> 
            
         </div>
    )
}}

// w
export default HomePage;