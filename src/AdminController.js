import { faAngleRight, faDeleteLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import "./AdminController.css";

const AdminController =()=>{

    const [table,setTable]=useState("posts");
    const [posts,setPosts]=useState({});
    const [actions,setActions]=useState({});
    const [loading,setLoading]=useState(true);

    const token=localStorage.getItem('token');

    const apiUrl = process.env.REACT_APP_API_URL;

    // useEffect(()=>{
    //     if (table=="posts"){
    //         const getPostsData=async ()=>{
    //             const response = await fetch(`${apiUrl}/posts/all`,{
    //                 method:"GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Authorization: `Bearer ${token}`
    //                   }

    //             })

    //             if (response.ok){
    //                 const data = await response.json()
    //                 setPosts(data);
    //                 console.log(data)
    //                 setLoading(false)
    //             }
                
    //         }

    //         getPostsData()  ;
    //     }
    //     console.log(table)

    // },[])

    const handleFetchTableData=(e)=>{
        e.preventDefault();
        console.log(table)        
        if (table=="posts"){
            const getPostsData=async ()=>{
                const response = await fetch(`${apiUrl}/posts/all`,{
                    method:"GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      }

                })

                if (response.ok){
                    const data = await response.json()
                    setPosts(data);
                    console.log(data)
                    setLoading(false)
                }
                
            }

            getPostsData()  ;
        }
        console.log(table)

        if (table=="actions"){
            const getActionData=async ()=>{
                const response = await fetch(`${apiUrl}/action/all`,{
                    method:"GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      }

                })

                if (response.ok){
                    const data = await response.json()
                    setActions(data);
                    console.log(data)
                    setLoading(false)
                }
                
            }

            getActionData()  ;
        }
    }

    const handleDeletePost=async(e,post_id)=>{
        handleFetchTableData(e);

        const response=await fetch(`${apiUrl}/posts/delete/${post_id}`,{
            method:"POST",
            headers: {
                Authorization: `Bearer ${token}`
            }

            
        })
        if (response.status==202){
            handleFetchTableData(e);
        }
        

    }

    const handleDeleteAction=async(e,post_id,user_id)=>{
        const response= await fetch(`${apiUrl}/action/delete/${post_id}/${user_id}`,{
            method:"DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }

            
        })
        if (response.status==202){
            handleFetchTableData(e);
        }


    }

    return(
        <div>
            <NavBar />        
        <div style={{paddingLeft:300,paddingTop:150}}>
            
            <h3>This is where sm manager works</h3>

            <form>
                <label>
                    Select Database
                    <select onChange={(e)=>{setTable(e.target.value),setLoading(true)}}>
                        <option value="posts">Posts</option>
                        <option value="actions">Actions</option>
                    </select>
                    <button type="submit" onClick={(e)=>handleFetchTableData(e)} style={{marginLeft:3,cursor:"pointer",backgroundColor:"green",color:"white"}}>   <FontAwesomeIcon icon={faAngleRight}/></button>
                </label>
            </form>
            <div className="data-table-container">
            {!loading && table==="posts" &&<table className="data-table">
                <th>post_id</th>
                <th>owner_id</th>
                <th>description</th>
                <th>Delete </th>
                <th>Update </th>
                {posts.map(post=>(
                            <tr>
                            <td>{post.post_id}</td>
                            <td>{post.owner_id}</td>
                            <td>{post.description}</td>
                            <td><button type="button" className="delete-btn" onClick={(e)=>handleDeletePost(e,post.post_id)} ><FontAwesomeIcon icon={faDeleteLeft} /> </button></td>
                            <td><button type="button" className="update-btn"><FontAwesomeIcon icon={faEdit}/> </button></td>
                            </tr>))}
            </table>}
            {!loading && table==="actions" && 
                <table className="data-table">
                    <th>post_id</th>
                    <th>user_id</th>
                    <th>action</th>
                    <th>Delete </th>
                    <th>Update </th>
                    {actions.map(action=>(
                        <tr>
                            <td>{action.post_id}</td>
                            <td>{action.user_id}</td>
                            <td>{action.action}</td>
                            <td><button type="button" className="delete-btn" onClick={(e)=>handleDeleteAction(e,action.post_id,action.user_id)}><FontAwesomeIcon icon={faDeleteLeft}/> </button></td>
                            <td><button type="button" className="update-btn"><FontAwesomeIcon icon={faEdit}/> </button></td>
                            
                        </tr>
                    ))}
                </table>
            }
            </div>
        </div>
        </div>
    )
}

export default AdminController;