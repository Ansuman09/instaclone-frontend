import React from "react";
import "./UserPosts.css";
import { useState,useEffect } from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const UserPosts=()=>{

    const [posts,setPosts]=useState([]);
    const [loading,setLoading]=useState(true);
    const [postsLoading,setPostsLoading]=useState(true);
    const [postImages,setPostImages]=useState([]);
    const {username,q}=useParams();
    const [currPost,setCurrPost]=useState(q);
    const [userProfileId,setUserProfileId]=useState();
    const [likeStatus,setLikeStatus]=useState();
    const [commentStatus,setCommentStatus]=useState(false);
    const [comment,setComment]=useState();
    const [editComment,setEditComment]=useState(1000);
    const [editCommentToSend,setEditCommentToSend]=useState();
    const [displayImageData,setDisplayImageData]=useState();
    const visitorUserId = localStorage.getItem('id')
    const token = localStorage.getItem('token')
        


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

    const handleCommentSubmit=(e,visitorUserId,post_id)=>{
      e.preventDefault();
      
      console.log(e);
      console.log(comment,visitorUserId,post_id);
      
      const datatosend={
          post_id:post_id,
          usr_id:visitorUserId,
          comment:comment
      }
      const submitComment=async()=>{
          await fetch('http://localhost:8080/comment/add',{
              method:'POST',
              headers:{
                  'Content-type':'application/json',
                  Authorization:`Bearer ${token}`
              },
              body:JSON.stringify(datatosend)
          }).then(console.log('comment submitted')).then(
              response=>setCommentStatus(response)
          )
      }
      submitComment();
      setComment('');
      
    }

    const handleLike=async(user_who_liked_id,liked_post_id)=>{

      // setLikeStatus({post_id:liked_post_id,liked:true})
      const json_body={
          post_id:liked_post_id,
          action:"like"
      }

      try {
          const request = await fetch(`http://localhost:8080/action/add/${user_who_liked_id}`,{
              method:'POST',
              headers: {
                  'Content-Type':'application/json',
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(json_body)
          })
          if (!request.ok){
              throw new console.error("unable to like");
          }
          setLikeStatus(request)
        
      }catch (error){
          console.log(error);
      }
  }

    const handleUnlike=async(user_who_liked_id,liked_post_id)=>{

      // setLikeStatus({post_id:liked_post_id,liked:false})
      try {
      const request = await fetch(`http://localhost:8080/action/delete/${liked_post_id}/${user_who_liked_id}`,{
      method: 'DELETE',
      headers : {
      'Content-type':'application/json',
      Authorization: `Bearer ${token}`}
      })
      if (!request.ok){
          throw new console.error("unable to unlike");
      }
      setLikeStatus(request)
      
  }catch (error){
      console.log(error);
  }


}
    const handleEditCommentSubmit=(e,comment_id)=>{
      e.preventDefault();
      
      console.log(e);
      console.log(`updated user comment at comment id :: ${comment_id}`);
      
      const datatosend={
          comment_id:comment_id,
          comment:editCommentToSend
      }
      const submitComment=async()=>{
          await fetch(`http://localhost:8080/comment/edit_this_comment`,{
              method:'POST',
              headers:{
                  'Content-type':'application/json',
                  Authorization:`Bearer ${token}`
              },
              body:JSON.stringify(datatosend)
          }).then(console.log('comment submitted')).then(
              response=>setCommentStatus(response)
          )
      }
      submitComment();
      setEditCommentToSend('');
      setEditComment(1000);
      
      }
    
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
        const fetchData = async () => {
          try {
            // Fetch visitor info
            
            //Fetch userprofile info
            const responseToGetProfileUserId=await fetch(`http://localhost:8080/userinfo/getuserid/forHome/${username}`,{
              method: "GET",
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
              }
            });
  
            if (!responseToGetProfileUserId){
                throw new Error("Unable to retrieve user");
            }

            const profileUserIdData=await responseToGetProfileUserId.json();
            setUserProfileId(profileUserIdData);



            // Fetch posts data
            const responseToGetPostsData = await fetch(`http://localhost:8080/posts/home/${profileUserIdData.usr_id}/${visitorUserId}`, {
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

            
            setPosts(postsData);
            setPostsLoading(false);
            console.log(posts)
          } catch (error) {
            console.error("Error fetching data:", error);
            // Handle errors (e.g., show error message to user, retry logic, etc.)
          }
        };

        
        fetchData().then(()=>{
            // setLikeStatus()
            // console.log(posts)
        }); // Invoke the async function
        
      }, [likeStatus,commentStatus]); 

    useEffect(() => {
    const fetchImageData = async () => {
      try {
        const responseToGetImagesByOwner = await fetch(`http://localhost:8080/postimages/all/${username}`, {
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
         // Only set this after fetching is successful
        console.log(`These are all the post images: ${postImagesData}`);
        console.log(postImagesData);
        
      } catch (error) {
        console.error("Error fetching post images:", error);
      }
    };

    fetchImageData(); // Call the async function here

  }, [token]); // Dependency on token to ensure this runs when the token is available

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
      
    

    if (loading===true)
        return(<>loading...</>)
    else
        // console.log(posts);
        // console.log(userProfileId);
        console.log(postImages)
        return(
            
            <div className="user-posts-container">
            {/* <h3>This is  a user Posts page to view posts by per user</h3> */}
            {/* <p>{}</p> */}
            <div >
                {posts.map((post,index)=>{
                  console.log(post)
                  return (<div key={post.post_id}>{post.post_id===parseInt(currPost,10) ? 
                <div>
                <div className="post-container">
                  {/* <p>{}</p> */}
                  {postImages.filter(image=>image.post_id==post.post_id).map(image=><img src={image.imageUrl}></img>)}
                  <div className="post-actions">
                          <button id={post.post_id} className={post.hasLiked? "liked-button":"unliked-button"} onClick={post.hasLiked ? ()=>handleUnlike(visitorUserId,post.post_id) : ()=>handleLike(visitorUserId,post.post_id)}><FontAwesomeIcon className="j" icon={faHeart}/></button>
                          <p>  {post.actions.length}</p>
                      {/*    <button id={post.post_id} type="button" className={`comment-btn`} onClick={()=>{handleComment();setCurrentlyEditingPostId(post.post_id),setComment('');if(prevPostId===post.post_id){setEnhance(false),setPrevPostId(null)}}}><FontAwesomeIcon icon={faComment}/></button> */}
                        </div>
                         <form className='comment enhance' onSubmit={(e)=>{handleCommentSubmit(e,visitorUserId,post.post_id);setCommentStatus(true)}} >
                            <input placeholder="Write Something" value={comment} onClick={()=>setCommentStatus(false)}  onChange={(e)=>{setComment(e.target.value)}} ></input>
                            <button type="submit" ><FontAwesomeIcon icon={faArrowRight}/></button>
                        </form>

                        <div className="post-description">
                          <p><b>{post.userinfo.username} </b>{post.description}</p>
                        </div>

                        <div className='view-comments enhance'>
                            {post.comments.map(comment=>(
                                <div>
                                {visitorUserId==parseInt(comment.usr_id,10) ? <a onClick={()=>{setEditComment(parseInt(comment.comment_id,10)),setEditCommentToSend(comment.comment)}}>edit </a> : console.log(`user id visitor ${visitorUserId} comment user id ${comment.usr_id}`)}  
                                {editComment===parseInt(comment.comment_id,10) ? (
                                  <form className='comment enhance' onSubmit={(e)=>handleEditCommentSubmit(e,comment.comment_id)}>
                                  <input value={editCommentToSend} onChange={(e)=>{setEditCommentToSend(e.target.value)}}></input>
                                  <button type="submit" ><FontAwesomeIcon icon={faArrowRight}/></button>
                                </form>
                                ) : <p key={comment.comment_id}><b>{comment.userinfo.username}</b> {comment.comment}</p>}
                                
                                </div>
                            ))}
                            </div>
                                               
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