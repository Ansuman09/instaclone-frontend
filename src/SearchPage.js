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

        const [postLoading,setPostLoading]=useState(true);
        const [postData,setPostData]=useState([]);
        const token = localStorage.getItem('token');

        const apiUrl = process.env.REACT_APP_API_URL;

                        

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
                        const response = await fetch(`${apiUrl}/userinfo/all/${search_string}`, {
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
        const handleRunQueryOnPosts = async () => {
            
            const fetchPostsData = async () => {
                try {
                    const response = await fetch(`${apiUrl}/posts/home/search/${q}`, {
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
                    setPostData(data);
                    console.log(data);
                    setSearchType("posts");

                    //fetchPostImageafter posts data
                    await fetchPostWithImage(data); 

                } catch (error) {
                    console.log(error);
                    setPostLoading(false); 
                    setPostLoading(true);
                }
            };

            const fetchPostWithImage = async (posts) => {
                setPostLoading(true); 
                const postDataWithImageUrl = await Promise.all(
                    posts.map(async (post) => {
                        const imageUrl = await fetchImageUrl(post.image.imageName);
                        return { ...post, imageUrl }; 
                    })
                );

                setPostData(postDataWithImageUrl);

                setPostLoading(false);
                
            };

            fetchPostsData();
        };

        // useEffect(()=>{
        //         const updatePosts=async()=>{
        //             const userDataWithImageUrl=await Promise.all(
        //                 posts.map(async (post)=>{
        //                     const imageUrl=await fetchImageUrl(post.image.);
        //                     return {...user,imageUrl};
        //                 })
        //             )
                    
        //             setUsers(userDataWithImageUrl);
        //             console.log(users);
        //         }

        //         updateUsers();
        //         setLoading(false);
                
        //     },[userLoading]);

            if (loading) {
                return <h2>Loading...</h2>;
            } else {
                return (
                    <div>
                        <NavBar/>
                    
                    <div className="search-result-container">
                    <div className="searchtype-container">
                        <button className={searchType==="users" ? "selected-button":"unselected-button"} onClick={()=>{setSearchType("users"),setPostLoading(true)}}>Users</button>
                        <button className={searchType==="posts" ? "selected-button":"unselected-button"} onClick={()=>{setSearchType("posts"),handleRunQueryOnPosts(),setUserLoading(true)}}>Posts</button>
                        </div>
                
                        {searchType=="users" && users.map((user) => (
                            <div className="user-detail-container" onClick={()=>handleNameClick(user.username)}>
                                <img src={user.imageUrl} />
                                <h3>{user.username}</h3>
                            </div>    
                        ))}
                        {searchType=="posts" && !postLoading&& 
                        <div className="search-view-posts-container">
                        {postData.map(post=>(
                        <div className="search-view-post-container ">
                            <img src={post.imageUrl}/>
                        </div>))}
                        </div>
                    }
                    </div>
                    </div>
                );
            }
        };

export default SearchPage;

