import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
// import /
import { useEffect,useState } from "react";
import { faArrowRight, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faComment} from "@fortawesome/free-solid-svg-icons"

import NavBar from "./NavBar";
const FeedPage=()=>{
    const [posts,setPosts] = useState([]);
    const [loading,setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const [postsLoading,setPostsLoading] = useState(true);

    const [postImages,setPostImages]=useState([]);
    const [likeStatus,setLikeStatus] = useState();
    const [commentStatus,setCommentStatus] = useState();
    const [enhance,setEnhance] = useState(false);
    const [comment,setComment] = useState('');
    const [currentlyEditingPostId,setCurrentlyEditingPostId]=useState();
    const [prevPostId,setPrevPostId]=useState();

    const apiUrl = process.env.REACT_APP_API_URL;

    //this function gets images from names
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

        // const token = sessionStorage.getItem('token')

        fetch(`${apiUrl}/posts/feed`,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                Authorization: `Bearer ${token}`
            }
        })
        .then(response=>{
            if(!response.ok){
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data=>{
            setPosts(data)
            console.log(data)
            setPostsLoading(false);
        })
    },[likeStatus,commentStatus])

    useEffect(() => {
        if (postsLoading) return; // Exit early if loading is not finished
  
        const update_posts = async () => {
          const postsDataWithImageUrl = await Promise.all(
            posts.map(async (post) => {
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
          setPostImages(postsDataWithImageUrl);
          console.log(postsDataWithImageUrl)
        };

        update_posts();
        
        setLoading(false); 
      }, [postsLoading]); // Trigger when postImages or postsLoading changes
  
  
    const handleLike=async(liked_post_id)=>{

        const json_body={
            post_id:liked_post_id,
            action:"like"
        }

        try {
            const request = await fetch(`${apiUrl}/action/add`,{
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

    const handleUnlike=async(liked_post_id)=>{
        try {
        const request = await fetch(`${apiUrl}/action/delete/${liked_post_id}`,{
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
    const handleComment=()=>{
        setEnhance(true);
    }

    const handleCommentSubmit=(e,post_id)=>{
        e.preventDefault();
        if (currentlyEditingPostId===post_id){
        console.log(e);
        console.log(comment,post_id);
        
        const datatosend={
            post_id:post_id,
            usr_id:0,
            comment:comment
        }
        const submitComment=async()=>{
            await fetch(`${apiUrl}/comment/add`,{
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
        setComment('');}
    }

    if (loading){
        return (<h3>Loading...</h3>);
    }
    else{
        console.log(window.location.href)
        return(
            <div>
                <div style={{'paddingBottom':'120px'}}>
                <NavBar/>
                </div>
                <div className="posts-container">
                {posts.map(post=>(
                    <div key={post.post_id} className="post-container">
                        <div id={post.post_id} className="post-ownerinfo">
                        
                        {postImages.filter(image=>post.post_id==image.post_id).map(image=><img  src={image.userinfo.profileImageUrl}></img>)}
                        <h4>{post.userinfo.username}</h4>
                        </div>
                        {postImages.filter(image=>post.post_id==image.post_id).map(image=><img  src={image.imageUrl}></img>)}
                        
                        <div className="post-actions">
                          <button id={post.post_id} className={post.hasLiked? "liked-button":"unliked-button"} onClick={post.hasLiked ? ()=>handleUnlike(post.post_id) : ()=>handleLike(post.post_id)}><FontAwesomeIcon className="j" icon={faHeart}/></button>
                          <p>  {post.actions.length}</p>
                          <button id={post.post_id} type="button" className={`comment-btn`} onClick={()=>{handleComment();setCurrentlyEditingPostId(post.post_id),setComment('');if(prevPostId===post.post_id){setEnhance(false),setPrevPostId(null)}}}> <FontAwesomeIcon icon={faComment}/></button>
                        </div>
                        <div className="post-description">
                        <p><b>{post.userinfo.username}</b>  {post.description}</p>
                        </div>
                        <form className={`comment ${enhance && post.post_id===currentlyEditingPostId ? 'enhance' : ''}`} onSubmit={(e)=>{handleCommentSubmit(e,post.post_id);setCommentStatus(true)}} >
                            <input placeholder="Write Something" onClick={(e)=>{setComment(e.target.value)}} onChange={(e)=>{setComment(e.target.value);setPrevPostId(post.post_id)}} value={post.post_id == currentlyEditingPostId ? comment:''}></input>
                            <button type="submit" ><FontAwesomeIcon icon={faArrowRight}/></button>
                        </form>
                        <div className={`view-comments ${enhance && post.post_id===currentlyEditingPostId ? 'enhance' : ''}`}>
                            {post.comments.map(comment=>(
                                <p><b>{comment.userinfo.username}</b> {comment.comment}</p>
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        );
    }
}


export default FeedPage;