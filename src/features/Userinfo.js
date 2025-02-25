import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice=createSlice({
    name: "users",
    initialState:{value:[]},
    reducers: {
        setUsers:(state,action)=>{
            state.value=action.payload;
        }
    }
})
export const {setUsers} = userInfoSlice.actions;
export default userInfoSlice.reducer;