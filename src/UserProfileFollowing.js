import react, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing } from "./features/Subscriptions";


const UserProfileFollowing=({username})=>{
    const token = localStorage.getItem('token')
    const apiUrl = process.env.REACT_APP_API_URL;
    
    const subsDispatch = useDispatch();
    const subs=useSelector(state=>state.subs);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const funcToFetchFollowing=async()=>{
            const responseToGetFollowing = await fetch(`${apiUrl}/followers/following/${username}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
    
            if (!responseToGetFollowing.ok) {
                throw new Error("Failed to load following");
            }
    
            const followingData = await responseToGetFollowing.json();
            subsDispatch(setFollowing(followingData));
            setLoading(false);
        }
        
        funcToFetchFollowing();
    },[username])

    return (
        loading === true ? (
          <div>Loading...</div>
        ) : (
            <div className="userinfo-followers">
                <h1>{subs.followingCount}</h1>
                <h2>following</h2>
            </div>
        )
      );


}

export default UserProfileFollowing;