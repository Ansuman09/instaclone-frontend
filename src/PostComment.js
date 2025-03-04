import react, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUserComment,addUserComment } from "./features/Posts";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addComment, setComments, updateUserComment } from "./features/Comments";
import { jwtDecode } from "jwt-decode";

const PostComment=({post_id})=>{

    
    const postDispatch = useDispatch();
    const commentsDispatch=useDispatch();
    const comments=useSelector(state=>state.comments.value);
    const [commentStatement,setCommentStatement]=useState();
    const token = localStorage.getItem('token')
    const userRoles = jwtDecode(token).roles;
    
    const [commentLimit, setCommentLimit] = useState("5");
    const visitorName=localStorage.getItem('visitor');
    const [editComment,setEditComment]=useState(10000);
    const [editCommentToSend,setEditCommentToSend]=useState("");
    const [commentStatus,setCommentStatus]=useState(false);
    const [loading,setLoading]=useState(true);

    const apiUrl = process.env.REACT_APP_API_URL;
    
    useEffect(() => {
    
        const commentsGetter = async()=>{
            const response=await fetch(`${apiUrl}/comment/by/post/${post_id}`,{
                method:'GET',
                headers: {
                    'Content-type':'application/json',
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok){
                throw "Unable to load comments";
            }

            const commentsData= await response.json();
            commentsDispatch(setComments(commentsData));
            console.log('got comments')
            
            
        }

        commentsGetter();
        setLoading(false);
        console.log("comment limit");
        console.log(commentLimit);
        setCommentLimit("5")
    }, [post_id]); 
    
    const handleCommentSubmit=(e,post_id)=>{
                e.preventDefault();
                
                const datatosend={
                    post_id:post_id,
                    usr_id:0,
                    comment:commentStatement
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
                commentsDispatch(addComment(dataToUpdateCommentState))
                submitComment();
                setCommentStatement('');
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
    
          postDispatch(updateUserComment({...datatosend,post_id:post_id}))
          submitComment();
          setEditCommentToSend('');
          setEditComment(1000);
          
          }
    
    if (loading){
        return <div>loading</div>
    }else{

    return (
        <div>
        {userRoles.includes("ROLE_RW_USER") && <form className='comment enhance' onSubmit={(e)=>{handleCommentSubmit(e,post_id)}} >
            <input placeholder="Write Something" value={commentStatement}  onChange={(e)=>{setCommentStatement(e.target.value)}} ></input>
            <button type="submit" ><FontAwesomeIcon icon={faArrowRight}/></button>
        </form>}


        <div className='view-comments enhance'>
            {comments.slice(0,commentLimit ? parseInt(commentLimit):comments.length).map(comment=>(
                <div key={comment.comment_id}>
                {visitorName===comment.userinfo.username ? <a onClick={()=>{setEditComment(parseInt(comment.comment_id,10)),setEditCommentToSend(comment.comment),console.log("name matched")}}>edit </a> : console.log(`user id visitor`)}  
                { editComment==comment.comment_id ? (
                    <form className='comment enhance' onSubmit={(e)=>handleEditCommentSubmit(e,comment.comment_id,post_id)}>
                    <input value={editCommentToSend} onChange={(e)=>{setEditCommentToSend(e.target.value)}}></input>
                    <button type="submit" ><FontAwesomeIcon icon={faArrowRight}/></button>
                </form>
                ) : <p key={comment.comment_id}><b>{comment.userinfo.username}</b> {comment.comment}</p>}
                
                </div>
                
            ))}
            {commentLimit && <p  onClick={()=>{setCommentLimit(null)}}>seeMore</p>}
        </div>
        </div>

    )}
}

export default PostComment;