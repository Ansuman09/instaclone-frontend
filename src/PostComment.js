import react, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editUserComment,addUserComment } from "./features/Posts";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PostComment=(comments)=>{

    
    const postDispatch = useDispatch();
    
    const token = localStorage.getItem('token')
    
    const visitorName=localStorage.getItem('visitor');
    const [comment,setComment]=useState('');
    const [editComment,setEditComment]=useState(10000);
    const [editCommentToSend,setEditCommentToSend]=useState("");
    const [commentStatus,setCommentStatus]=useState(false);
    const [loading,setLoading]=useState(true);

    const apiUrl = process.env.REACT_APP_API_URL;
    
    useEffect(() => {
        setLoading(false);
        console.log("This is inside comments");
        console.log(comments);
    }, [comments]); 
    
    const handleCommentSubmit=(e,post_id)=>{
                e.preventDefault();
                
                console.log(e);
                console.log(comment,post_id);
                
                const datatosend={
                    post_id:post_id,
                    usr_id:0,
                    comment:comment
                }
        
                const submitComment=async()=>{
                    await fetch(`${apiUrl}/comment/queue/addComment`,{
                        method:'POST',
                        headers:{
                            'Content-type':'application/json',
                            Authorization:`Bearer ${token}`
                        },
                        body:JSON.stringify(datatosend)
                    }).then(console.log('comment submitted'))
                }
        
                const dataToUpdateCommentState={...datatosend,username:visitorName}
                postDispatch(addUserComment(dataToUpdateCommentState))
                submitComment();
                setComment('');
            }
    
    const handleEditCommentSubmit=(e,comment_id,post_id)=>{
          e.preventDefault();
          
          console.log(e);
          console.log(`updated user comment at comment id :: ${comment_id}`);
          
          const datatosend={
              comment_id:comment_id,
              comment:editCommentToSend
          }
          const submitComment=async()=>{
              //prev ${apiUrl}/comment/edit_this_comment
              await fetch(`${apiUrl}/comment/queue/editComment`,{
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
    
          postDispatch(editUserComment({...datatosend,post_id:post_id}))
          submitComment();
          setEditCommentToSend('');
          setEditComment(1000);
          
          }
    
    if (loading){
        return <div>loading</div>
    }else{

    return (
        <div>
        <form className='comment enhance' onSubmit={(e)=>{handleCommentSubmit(e,comments.post_id)}} >
            <input placeholder="Write Something" value={comment}  onChange={(e)=>{setComment(e.target.value)}} ></input>
            <button type="submit" ><FontAwesomeIcon icon={faArrowRight}/></button>
        </form>


        <div className='view-comments enhance'>
            {comments.comments.map(comment=>(
                <div>
                {visitorName===comment.userinfo.username ? <a onClick={()=>{setEditComment(parseInt(comment.comment_id,10)),setEditCommentToSend(comment.comment),console.log("name matched")}}>edit </a> : console.log(`user id visitor`)}  
                { editComment==comment.comment_id ? (
                    <form className='comment enhance' onSubmit={(e)=>handleEditCommentSubmit(e,comment.comment_id,comments.post_id)}>
                    <input value={editCommentToSend} onChange={(e)=>{setEditCommentToSend(e.target.value)}}></input>
                    <button type="submit" ><FontAwesomeIcon icon={faArrowRight}/></button>
                </form>
                ) : <p key={comment.comment_id}><b>{comment.userinfo.username}</b> {comment.comment}</p>}
                
                </div>
            ))}
        </div>
        </div>

    )}
}

export default PostComment;