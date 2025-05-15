import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
const FollowFollowingModal = ({ userInfoData, showModal, closeModal }) => {
    const [userInfo, setUserInfo] = useState([]);
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;
    const [loading, setLoading] = useState(true);

    const nav = useNavigate();

    const navigateToUserPage=(username)=>{
        nav(`/userprofile/${username}`);
        window.location.reload();
    }
  
    const fetchImageUrl = async (imageName) => {
      try {
        const response = await fetch(`${apiUrl}/get-images/images/${imageName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch image for ${imageName}`);
        }
  
        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);
      } catch (error) {
        console.error("Unable to get image:", error);
        return null;
      }
    };
  
    useEffect(() => {
      const fetchUserData = async () => {
        const userDataWithImageUrl = await Promise.all(
          userInfoData.map(async (user) => {
            const imageUrl = await fetchImageUrl(user.profile_image);
            return {
              ...user,
              imageUrl,
            };
          })
        );
  
        setUserInfo(userDataWithImageUrl);
        setLoading(false);
      };
  
      if (showModal) {
        fetchUserData();
      }
    }, [userInfoData,showModal]);
  
    if (showModal) {
      return (
        <div className="modal-overlay">
          {!loading && (
            <div className="modal-content">
              <button onClick={closeModal} className="close-btn">Close</button>
              <div className="users-container">
                {userInfo.map((user) => (
                  <div key={user.id} className="modal-userinfo" onClick={()=>navigateToUserPage(user.username)}>
                    <img src={user.imageUrl} alt={user.name} className="user-image" />
                    <p>{user.username}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  
    return null;
  };
  
  export default FollowFollowingModal;
  