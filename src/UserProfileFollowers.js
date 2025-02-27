import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers } from "./features/Subscriptions";

const UserProfileFollowers = ({ username }) => {
  const token = localStorage.getItem("token");
  const apiUrl = process.env.REACT_APP_API_URL;

  const subsDispatch = useDispatch();
  const subs = useSelector((state) => state.subs);
  const [loading, setLoading] = useState(true);

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
      <h1>{subs.followersCount}</h1>
      <h2>followers</h2>
    </div>
  );
};

export default UserProfileFollowers;
