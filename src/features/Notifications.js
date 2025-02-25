import {createSlice} from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name:'notifications',
    initialState: {
        value:[]
    },
    reducers:{
        setNotifications:(state,action)=>{
            state.value=action.payload;
        },
        updateNotifications:(state,action)=>{
           return {
            ...state,
            value: state.value.map(notification=>{
                if(action.payload===notification.id){
                    return {...notification,status:"read"};
                }else {
                    return {...notification}
                }
            })
           } 
        }
    }
})

export const {setNotifications,updateNotifications}=notificationSlice.actions;
export default notificationSlice.reducer;