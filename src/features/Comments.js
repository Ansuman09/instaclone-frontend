import { createSlice } from "@reduxjs/toolkit";
import reducer, { editUserComment } from "./Posts";

const commentSlice = createSlice({
    name:"comments",
    initialState:{
        value:[]
    },
    reducers:{
        setComments:(state,action)=>{
            state.value=action.payload;
        },

        addComment: (state, action) => {
            state.value.push({
                post_id: action.payload.post_id,
                comment: action.payload.comment,
                userinfo: { username: action.payload.username },
            });
        },


        updateUserComment: (state,action)=>{
            return {...state,
                value:state.value.map(comment=>{
                    if (comment.comment_id===action.payload.comment_id){
                        return {...comment,comment:action.payload.comment,comment};
                    }else{
                        return{...comment}
                    }
                })
            }
        }
            
        
    }
})


export default commentSlice.reducer;

export const {setComments,addComment,updateUserComment}=commentSlice.actions;