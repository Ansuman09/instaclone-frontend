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
        updatePostLikeCount:(state,action)=>{
                state.value=state.value.map(post=>{
                    return ({
                        ...post,
                        likeCount:post.actions.length})
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
        }
    }
})

export const {setPosts,updatePostLikeCount,updateHasLikedPost,updateHasUnlikedPost,addUserComment} = postSlice.actions;

export default postSlice.reducer;
