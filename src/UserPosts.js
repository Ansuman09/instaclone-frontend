import React from "react";
import "./UserPosts.css";
import { useState,useEffect } from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {  setPosts, updateHasLikedPost, updateHasUnlikedPost, updatePostLikeCount } from "./features/Posts";
import PostComment from "./PostComment";

const UserPosts=()=>{

    const posts = useSelector(state=>state.posts.value);
    const postDispatch = useDispatch();
    const [loading,setLoading]=useState(true);
    
    const [enhance,setEnhance]=useState(false);
    const {username,q}=useParams();
    const [currPost,setCurrPost]=useState(q);
    
    const visitor=localStorage.getItem("visitor");

    const token = localStorage.getItem('token')
    const visitorName=localStorage.getItem('visitor');

    const apiUrl = process.env.REACT_APP_API_URL;



    const handleNextPost=(index)=>{
      if (index<posts.length-1){
        console.log(`next post is ${posts[index+1]}`);
        setCurrPost(posts[index+1].post_id);
      }
      // setCurrPost(posts.post_id)

    }  

    const handlePreviousPost=(index)=>{
      if (index>0){
        console.log(`next post is ${posts[index-1]}`);
        setCurrPost(posts[index-1].post_id);
      }
      // setCurrPost(posts.post_id)


    }  

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
        const fetchData = async () => {
          try {

            // Fetch posts data
            const responseToGetPostsData = await fetch(`${apiUrl}/posts/home/${username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
    
            if (!responseToGetPostsData.ok) {
              throw new Error("Failed to load posts data");
            }
            
            const postsData = await responseToGetPostsData.json();
            /// setLoading(true)

            const postsDataWithImageUrl = await Promise.all(
              postsData.map(async (post) => {
                const imageUrl = await fetchImageUrl(post.image.imageName); // Ensure this is a valid async function
                const profileImageUrl=await fetchImageUrl(post.userinfo.profile_image)
                console.log(`Got image_url as ${imageUrl}`);
                console.log(`Got profile image url as ${profileImageUrl}`)
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
            console.log("fetched posts data")
            console.log(posts)
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        
        fetchData().then(()=>{
            // setLikeStatus()
            // console.log(posts)
        }); 
        
      }, []); 

    

    if (loading===true)
        return(<>loading...</>)
    else
        // console.log(posts);
        // console.log(userProfileId);
        return(
            
            <div className="user-posts-container">
            <div >
                {posts.map((post,index)=>{
                  console.log(post)
                  return (<div key={post.post_id}>{post.post_id===parseInt(currPost,10) ? 
                <div>
                <div className="post-container">
                  {/* <p>{}</p> */}
                  <img src={post.imageUrl}></img>
                  <div className="post-actions">
                          <button id={post.post_id} className={post.hasLiked? "liked-button":"unliked-button"} onClick={post.hasLiked ? ()=>handleUnlike(post.post_id) : ()=>handleLike(post.post_id)}><FontAwesomeIcon icon={faHeart}/></button>
                          <p>  {post.likeCount}</p>
                          <button id={post.post_id} type="button" className={`comment-btn`} onClick={()=>{setEnhance(!enhance)}}> <FontAwesomeIcon icon={faComment}/></button>
                        </div>
                        
                        <div className="post-description">
                          <p><b>{post.userinfo.username} </b>{post.description}</p>
                        </div>
                  
                  {enhance && <PostComment  post_id={post.post_id}/>}
                                               
                  </div>
                  <button name="prev" className="prev-button" onClick={()=>handlePreviousPost(index)}>Prev</button>
                  <button name="next" className="next-button" onClick={()=>handleNextPost(index)}>Next</button>
                </div>: null}      
                
            
                </div>)})}
                {/* <p onClick={}></p> */}
                         
            </div>
            </div>    
        )
}


export default UserPosts;