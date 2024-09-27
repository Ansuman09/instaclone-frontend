import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

const SearchPage=()=>{
        const [users,setUsers]=useState([]);
        const [loading,setLoading]=useState(false);
        const {q} = useParams();
        const nav = useNavigate();
        
            useEffect(() => {
                const usersearchresult = async () => {
                    try {
                        const search_string = encodeURIComponent(q);
                        console.log(q)
                        const userid = localStorage.getItem('id')
                        const token = localStorage.getItem('token');
                        const response = await fetch(`http://localhost:8080/userinfo/all/${search_string}/${userid}`, {
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
                        setLoading(false); // Set loading to false after data is fetched
                        console.log(data);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        setLoading(false); // Ensure loading is set to false in case of error
                    }
                };
        
                usersearchresult();
            }, []); // Empty dependency array ensures useEffect runs only once on component mount
            
            const handleNameClick=(username)=>{
                nav(`/userprofile/${username}`);
            }
            if (loading) {
                return <h2>Loading...</h2>;
            } else {
                return (
                    <div>
                        {users.map((user) => (
                            <button type="button" onClick={()=>handleNameClick(user.username)}>{user.username}</button>

                        ))}
                    </div>
                );
            }
        };////////

export default SearchPage;

