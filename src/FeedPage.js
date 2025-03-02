import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
// import /
import { useEffect,useState } from "react";
import { faArrowRight, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment} from "@fortawesome/free-solid-svg-icons"
import { useSelector,useDispatch } from "react-redux";
import { setPosts,updatePostLikeCount,updateHasLikedPost,updateHasUnlikedPost,addUserComment } from "./features/Posts";

import NavBar from "./NavBar";
import PostComment from "./PostComment";
import { jwtDecode } from "jwt-decode";
const FeedPage=()=>{
    const postDispatch=useDispatch();
    const posts=useSelector(state=>state.posts.value);
    const [loading,setLoading] = useState(true);
    const token = localStorage.getItem('token');
    
    const [enhance,setEnhance] = useState(false);
    const [currentlyEditingPostId,setCurrentlyEditingPostId]=useState();

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
        setLoading(false);
        }
        catch(error){
            console.log(error)
        }
    }
        
        getPostsData();
    },[])
  
  
    const handleLike=async(liked_post_id)=>{

        const json_body={
            post_id:liked_post_id,
            action:"like"
        }
        try{
            const response = await fetch(`${apiUrl}/action/queue/useraction/addLike`,{
                method:'POST',
                headers: {
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(json_body)
            })
        }catch(e){
            console.log(e)
        }
        

        postDispatch(updateHasLikedPost(json_body));
    }

    const handleUnlike=async(post_id)=>{
        const json_body={
            post_id:post_id,
            action:"like",
        }

        try {
        const response = await fetch(`${apiUrl}/action/queue/useraction/unlike`,{
        method: 'POST',
        headers : {
        'Content-type':'application/json',
        Authorization: `Bearer ${token}`},
        body: JSON.stringify(json_body)})
        
    }catch (error){
        console.log(error);
    }

    postDispatch(updateHasUnlikedPost(json_body));
    }
    
    const handleComment=(postid,currPostId)=>{
        setEnhance(true);
    }


    if (loading){
        return (<h3>Loading...</h3>);
    }
    else{
        return(
            <div>
                <div style={{'paddingBottom':'120px'}}>
                <NavBar/>
                </div>
                <div className="posts-container">
                {posts.map(post=>(
                    <div key={post.post_id} className="post-container">
                        <div className="post-ownerinfo">
                        
                        <img  src={post.userinfo.profileImageUrl}></img>
                        <h4>{post.userinfo.username}</h4>
                        </div>
                        <img  src={post.imageUrl}></img>
                        
                        <div className="post-actions" >
                          <button id={post.post_id} className={post.hasLiked? "liked-button":"unliked-button"} onClick={post.hasLiked ? ()=>handleUnlike(post.post_id) : ()=>handleLike(post.post_id)}><FontAwesomeIcon icon={faHeart}/></button>
                          <p>  {post.likeCount}</p>
                          <button id={post.post_id} type="button" className={`comment-btn`} onClick={()=>{setEnhance(!enhance),setCurrentlyEditingPostId(post.post_id)}}> <FontAwesomeIcon icon={faComment}/></button>
                        </div>
                        <div className="post-description">
                        {post.description && <p><b>{post.userinfo.username}</b>  {post.description}</p>}
                        </div>
                        {post.post_id === currentlyEditingPostId ? enhance && <PostComment post_id={post.post_id}/>:<p></p>}
                        
                    </div>
                ))}
                </div>
            </div>
        );
    }
}


export default FeedPage;