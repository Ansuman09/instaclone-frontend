import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "./features/Userinfo";
import { useNavigate } from "react-router";

const FollowTrending = ({ apiUrl, token }) => {
    const users = useSelector(state => state.users.value);
    const useUserInfoDispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);

    const nav= useNavigate();

    // Function to fetch trending users
    useEffect(() => {
        const usersearchresult = async () => {
            try {
                const response = await fetch(`${apiUrl}/userinfo/trending/all`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                useUserInfoDispatch(setUsers(data));  // Dispatch users data to Redux store
                setUserLoading(false);
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        setUserLoading(true);
        usersearchresult();
    }, []);

    // Function to fetch image URL for a user's profile image
    const fetchImageUrl = async (imageName) => {
        console.log("Called image data");
        try {
            const response = await fetch(`${apiUrl}/get-images/images/${imageName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            console.log(`Got image data: ${imageUrl}`);
            return imageUrl;
        } catch (error) {
            console.log("Unable to get image:", error);
        }
    };

    // Update users with their profile image URLs
    useEffect(() => {
        const updateUsers = async () => {
            const userDataWithImageUrl = await Promise.all(
                users.map(async (user) => {
                    const imageUrl = await fetchImageUrl(user.profile_image);
                    return { ...user, imageUrl };
                })
            );

            useUserInfoDispatch(setUsers(userDataWithImageUrl));  // Dispatch updated users data
            console.log(userDataWithImageUrl);
        };

        if (!userLoading) {  
            updateUsers();
            setLoading(false);
        }
    }, [ userLoading]);  


    //function to navigate to user profile on click
    const handleNameClick=(username)=>{
        nav(`/userprofile/${username}`);
        window.location.reload();
    }


    return (
        <ul className="followers-slide">
            {loading ? (
                <p>Loading...</p>
            ) : (
                users.map((user) => (
                    <li>
                    <div className="user-detail-container" key={user.usr_id} onClick={()=>{handleNameClick(user.username)}}>
                        {user.imageUrl && <img src={user.imageUrl} alt={user.username} />}
                        <h3>{user.username}</h3>
                        
                    </div>
                    </li>
                ))
            )}
        </ul>
    );
};

export default FollowTrending;
