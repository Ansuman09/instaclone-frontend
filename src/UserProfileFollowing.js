import { useDispatch, useSelector } from "react-redux";
import { setFollowing } from "./features/Subscriptions";
import FollowFollowingModal from "./Modals/FollowFollowingModal";
import { useEffect, useState } from "react";

const UserProfileFollowing = ({ username }) => {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;
    const subsDispatch = useDispatch();
    const subs = useSelector((state) => state.subs);
    const [loading, setLoading] = useState(true);
    const [showFollowingModal, setFollowingShowModal] = useState(false);
  
    const showFollowing = () => {
      setFollowingShowModal(true);
    };
  
    const closeFollowing = () => {
      setFollowingShowModal(null);
      console.log(`modal state ${showFollowingModal}`)  
     };
    
    useEffect(() => {
        console.log(`modal state: ${showFollowingModal}`);
      }, [showFollowingModal]);

    useEffect(() => {
      const funcToFetchFollowing = async () => {
        const responseToGetFollowing = await fetch(`${apiUrl}/followers/following/${username}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!responseToGetFollowing.ok) {
          throw new Error("Failed to load following");
        }
  
        const followingData = await responseToGetFollowing.json();
        subsDispatch(setFollowing(followingData));
        setLoading(false);
      };
  
      funcToFetchFollowing();
    }, [username]);
  
    return loading === true ? (
      <div>Loading...</div>
    ) : (
      <div className="userinfo-followers">
        <h1 onClick={showFollowing}>{subs.followingCount}</h1>
        <h2 onClick={showFollowing}>following</h2>
        <FollowFollowingModal
          userInfoData={subs.following}
          showModal={showFollowingModal}
          closeModal={closeFollowing}  
        />
      </div>
    );
  };
  
  export default UserProfileFollowing;
  