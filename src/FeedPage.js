import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
// import /
import { useEffect,useState } from "react";
// import { faArrowRight, faHeart, faHeartPulse } from "@fortawesome/free-solid-svg-icons";
// import { faComment} from "@fortawesome/free-solid-svg-icons"
import { useSelector,useDispatch } from "react-redux";
import { setPosts,updatePostLikeCount,updateHasLikedPost,updateHasUnlikedPost,addUserComment } from "./features/Posts";

import NavBar from "./NavBar";
import PostComponent from "./PostComponent";
import HomeLoading from "./loadingComponents/HomeLoading";
const FeedPage=()=>{
    const postDispatch=useDispatch();
    const posts=useSelector(state=>state.posts.value);
    const [loading,setLoading] = useState(true);
    const token = localStorage.getItem('token');

    
    const apiUrl = process.env.REACT_APP_API_URL;

    //this function gets images from names
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
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          
          return imageUrl;
           } catch (error) {
          console.log("Unable to get image:", error);
        }
      };
      

    useEffect(()=>{

        // const token = sessionStorage.getItem('token')

        const getPostsData=async()=>{
            try{
            
            const postsResponse=await fetch(`${apiUrl}/posts/feed`,{
                method: 'GET',
                headers:{
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if(!postsResponse.ok){
                throw "Unable to get posts";
            }

        const postsData = await postsResponse.json();
        
        
        const postsDataWithImageUrl = await Promise.all(
            postsData.map(async (post) => {
                const imageUrl = await fetchImageUrl(post.image.imageName);
                const profileImageUrl=await fetchImageUrl(post.userinfo.profile_image); 
                return {
                    ...post,
                    userinfo: {
                        ...post.userinfo,
                        profileImageUrl
                    },
                    imageUrl,
                };
            })
            );

        
        postDispatch(setPosts(postsDataWithImageUrl));
        postDispatch(updatePostLikeCount(postsDataWithImageUrl));
        // postDispatch(updateActivePost(postsDataWithImageUrl));
        setLoading(false);
        }
        catch(error){
            console.log(error)
        }
    }
        
        getPostsData();
    },[])
  
  
    

    if (loading){
        return (<HomeLoading/>);
    }
    else{
        return(
            <div>
                <div style={{'paddingBottom':'120px'}}>
                <NavBar/>
                </div>
                <div className="posts-container">
                {posts.map(post=>(
                    <PostComponent post={post}/>
                ))}
                </div>
            </div>
        );
    }
}


export default FeedPage;