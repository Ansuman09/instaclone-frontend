import react, { useState } from "react";
import PostComment from "./PostComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import {faArrowDown, faDeleteLeft, faListDots, faHeart as faSolidHeart} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { activePostUpdateWithPostId, updateHasLikedPost, updateHasUnlikedPost } from "./features/Posts";
import DeleteModal from "./Modals/DeleteModal";
import { useNavigate } from "react-router";


const PostComponent=({post})=>{
    const postDispatch=useDispatch();
    const nav=useNavigate();

    const [showDeletePopUp,setShowDeletePopUp]= useState(false);

    // delete this after test
    
    const openDeletePopUp = () => setShowDeletePopUp(true);
    const closeDeletePopUp = () => setShowDeletePopUp(false);
    //
    const token = localStorage.getItem('token');    
    const apiUrl = process.env.REACT_APP_API_URL;
    const visitor=localStorage.getItem('visitor');
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
    
    const togglePostId=(post_id)=>{
        postDispatch(activePostUpdateWithPostId(post_id))
        console.log(post_id)
        console.log(post)   
    }

    const handleNameClick=(username)=>{
        nav(`/userprofile/${username}`);
        window.location.reload();
    }
    
    return(
        <div className="post-container-with-cmt">
                
                    <div key={post.post_id} className="post-container">
                        <img  src={post.imageUrl}></img>
                        
                        <div className="post-actions" >
                          {!post.hasLiked && <span id={post.post_id} className={"unliked-button"} onClick={post.hasLiked ? ()=>handleUnlike(post.post_id) : ()=>handleLike(post.post_id)}><FontAwesomeIcon icon={faHeart} />  </span>}
                          {post.hasLiked && <span id={post.post_id} className={"unliked-button"} onClick={post.hasLiked ? ()=>handleUnlike(post.post_id) : ()=>handleLike(post.post_id)}><FontAwesomeIcon icon={faSolidHeart} />  </span>}
                          <p>    {post.likeCount}</p>
                          <span id={post.post_id} type="button" className={`comment-btn`} onClick={()=>{togglePostId(post.post_id)}}> <FontAwesomeIcon icon={faComment}/></span>
                          {visitor === post.userinfo.username  && <i id={post.post_id} className="delete-btn" onClick={openDeletePopUp}><FontAwesomeIcon icon={faTrashCan}/></i>}
                        
                        </div>
                        <div className="post-ownerinfo">
                        
                        <img  src={post.userinfo.profileImageUrl}></img>
                        <div className="post-userinfo-desc">
                            <h4 className="username" onClick={()=>handleNameClick(post.userinfo.username)}>{post.userinfo.username}</h4>
                            <p>{post.description}</p>
                        </div>

                        {/*This part of the code is for testing the pop up modal component */}
                        <div>
                            <DeleteModal showModal={showDeletePopUp} closeModal={closeDeletePopUp} post={post}>
                                <h2>This is a Pop-up!</h2>
                                <p>You can put any content here!</p>
                            </DeleteModal>
                        </div>
                        {/* <div className="post-advanced-actions">
                            <span>Delete</span>
                        </div> */}
                        
                        
                        </div>


                       
                        { <div className={`post-description ${post.activePost && 'active'}`} >
                            <span className="closing-cmnt-desc-btn" onClick={()=>{togglePostId(null)}}><FontAwesomeIcon icon={faArrowDown}/></span>
                            <br/>
                            <br/>
                            <p>{post.description}</p>
                            {post.activePost ?  <PostComment post_id={post.post_id}/>:<p></p>}
                        </div>}
                       
                        </div>
                        
                        
                    </div>
    )
}

export default PostComponent;