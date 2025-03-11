import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const postSlice = createSlice({
    name:'posts',
    initialState:{
        value:[],
    },
    reducers:{
        setPosts:(state,action)=>{
            state.value=action.payload;
        },
        activePostUpdateWithPostId: (state, action) => {
            state.value = state.value.map(post => {
                if (post.post_id !== action.payload) {
                    return { ...post, activePost: false };
                } else {
                    return { ...post, activePost: true };
                }
                
            });
        },
        updatePostLikeCount:(state,action)=>{
                state.value=state.value.map(post=>{
                    return ({
                        ...post,
                        likeCount:post.actions.length,
                        activePost:false
                    })
                });
        },
        
        updateHasLikedPost: (state,action)=>{
            return {...state,
            value:state.value.map(post=>{
                if (action.payload.post_id==post.post_id){
                    return {...post,hasLiked:true,likeCount:post.likeCount+1};
                }else{
                    return {...post}
                }
            })}
        },

        updateHasUnlikedPost: (state,action)=>{
            return {...state,
            value:state.value.map(post=>{
                if (action.payload.post_id==post.post_id){
                    return {...post,hasLiked:false,likeCount:post.likeCount-1};
                }else{
                    return {...post}
                }
            })}
        },

        addUserComment: (state,action)=>{
            return{
                ...state,
                value: state.value.map(post=>{
                    if (action.payload.post_id==post.post_id){
                        return {...post,comments:[...post.comments,{
                            post_id:action.payload.post_id,
                            comment:action.payload.comment,
                            userinfo:{username:action.payload.username}
                        }]}
                    }
                    else{
                        return {...post}
                    }
                })
            }
        },

        editUserComment: (state,action)=>{
            return {...state,
                value: state.value.map(post=>{
                    if (action.payload.post_id===post.post_id){
                        return{...post,
                            comments:post.comments.map(comment=>{
                                if (comment.comment_id===action.payload.comment_id){
                                    return {...comment,comment:action.payload.comment}
                                }else{
                                    return {...comment};
                                }
                            })
                        }
                    }else{
                        return {...post}
                    }
                })
            }
        }
    }
})

export const {setPosts,updatePostLikeCount,updateHasLikedPost,updateHasUnlikedPost,addUserComment,editUserComment,activePostUpdateWithPostId} = postSlice.actions;

export default postSlice.reducer;
