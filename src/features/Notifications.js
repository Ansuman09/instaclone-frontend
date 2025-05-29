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
        },

        updateFollowRequest:(state,action)=>{
            return{
                ...state,
                value: state.value.map(notification=>{
                    if(action.payload===notification.id){
                    return {...notification,message:"started following you",action:"follow"};
                }else {
                    return {...notification}
                }
                })
            }
        },

        deleteFollowState:(state,action)=>{
            return{
                 ...state,
                value: state.value.filter((notification) => {
                return action.payload !== notification.id;
                })
            }
        }
    }
})

export const {setNotifications,updateNotifications,updateFollowRequest,deleteFollowState}=notificationSlice.actions;
export default notificationSlice.reducer;