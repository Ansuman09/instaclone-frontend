import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers } from "./features/Subscriptions";
import FollowFollowingModal from "./Modals/FollowFollowingModal";

const UserProfileFollowers = ({ username }) => {
  const token = localStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_API_URL;

  const subsDispatch = useDispatch();
  const subs = useSelector((state) => state.subs);
  const [loading, setLoading] = useState(true);

  const [showFollowersModal,setShowFollowers]=useState(false);

  const showFollowers=()=>{
      setShowFollowers(true);
  }

  const closeFollowing=()=>{
      console.log("Executed close")
      setShowFollowers(false);
  }

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const responseToGetFollowers = await fetch(
          `${apiUrl}/followers/userfollowers/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!responseToGetFollowers.ok) {
          throw new Error("Failed to load followers");
        }

        const followersData = await responseToGetFollowers.json();
        subsDispatch(setFollowers(followersData));
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [username, token, apiUrl, subsDispatch]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="userinfo-followers">
      <h1  onClick={showFollowers}>{subs.followersCount}</h1>
      <h2  onClick={showFollowers}>followers</h2>
      <FollowFollowingModal userInfoData={subs.followers} showModal={showFollowersModal} closeModal={()=>setShowFollowers(false)} />
            
    </div>
  );
};

export default UserProfileFollowers;
