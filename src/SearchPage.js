import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import "./SearchPage.css";
import NavBar from "./NavBar";

const SearchPage=()=>{
        const [users,setUsers]=useState([]);
        const [loading,setLoading]=useState(true);
        const {q} = useParams();
        const nav = useNavigate();
        const [userLoading,setUserLoading]=useState(true);
        const [searchType,setSearchType]=useState("users");
        const token = localStorage.getItem('token');
        const [selectedSearch,setSelectedSearch]=useState("users");
                        

        const fetchImageUrl = async (imageName) => {
            console.log("Called image data");
            try {
              const response = await fetch(`http://localhost:8080/get-images/images/${imageName}`, {
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
              // Use imageUrl to display the image, e.g., set it in an <img> element.
            } catch (error) {
              console.log("Unable to get image:", error);
            }
          };

        useEffect(() => {
                const usersearchresult = async () => {
                    try {
                        const search_string = encodeURIComponent(q);
                        console.log(q)
                        const response = await fetch(`http://localhost:8080/userinfo/all/${search_string}`, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/json',
                                Authorization: `Bearer ${token}`
                            }
                        });
        
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
        
                        const data = await response.json();
                        setUsers(data);
                        setUserLoading(false);
                        console.log(data);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        setUserLoading(true); // Ensure loading is set to false in case of error
                    }
                };
        
                usersearchresult();
            }, []); // Empty dependency array ensures useEffect runs only once on component mount
            

            useEffect(()=>{
                const updateUsers=async()=>{
                    const userDataWithImageUrl=await Promise.all(
                        users.map(async (user)=>{
                            const imageUrl=await fetchImageUrl(user.profile_image);
                            return {...user,imageUrl};
                        })
                    )
                    
                    setUsers(userDataWithImageUrl);
                    console.log(users);
                }

                updateUsers();
                setLoading(false);
                
            },[userLoading]);

            const handleNameClick=(username)=>{
                nav(`/userprofile/${username}`);
            }

            if (loading) {
                return <h2>Loading...</h2>;
            } else {
                return (
                    <div>
                        <NavBar/>
                    
                    <div className="search-result-container">
                    <div className="searchtype-container">
                        <button className={selectedSearch==="users" ? "selected-button":"unselected-button"}>Users</button>
                        <button className={selectedSearch==="posts" ? "selected-button":"unselected-button"}>Posts</button>
                        </div>
                
                        {searchType=="users" && users.map((user) => (
                            <div className="user-detail-container" onClick={()=>handleNameClick(user.username)}>
                                <img src={user.imageUrl} />
                                <h3>{user.username}</h3>
                            </div>    
                        ))}
                    </div>
                    </div>
                );
            }
        };

export default SearchPage;

