import { createSlice } from "@reduxjs/toolkit";

const subscriptionSlice= createSlice({
    name:"subs",
    initialState:{followers:[],following:[]},
    reducers:{
        setFollowers: (state, action) => {
            state.followers = action.payload;
            state.followersCount = action.payload.length;
          },
        setFollowing: (state, action) => {
            state.following = action.payload;
            state.followingCount = action.payload.length;
          },
        doFollow: (state)=>{
            return {...state,followersCount:state.followersCount+1}
        },
        doUnFollow:(state)=>{
            return {...state,followersCount:state.followersCount-1}    
        }
}})

export const {setFollowers,setFollowing,doFollow,doUnFollow} =subscriptionSlice.actions;
export default subscriptionSlice.reducer;

