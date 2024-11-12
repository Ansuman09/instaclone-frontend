import React, { useState } from "react";
const AdminController =()=>{

    const [table,setTable]=useState();
    const [posts,setPosts]=useState();
    const [actions,setActions]=useState();
    const [loading,setLoading]=useState(true);

    const token=localStorage.getItem('token');

    const apiUrl = process.env.REACT_APP_API_URL;

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

                }
                
            }

            getPostsData().then(setLoading(false));
        }
        console.log(table)
    }

    return(
        <div>
            <h3>This is where sm manager works</h3>

            <form>
                <label>
                    Select Database
                    <select onChange={(e)=>setTable(e.target.value)}>
                        <option value="posts">Posts</option>
                        <option value="actions">Actions</option>
                    </select>
                    <button type="submit" onClick={(e)=>handleFetchTableData(e)}>Go</button>
                </label>
            </form>
            {!loading && <table>
                <th>post_id</th>
                <th>owner_id</th>
                <th>description</th>
                {posts.map(post=>(
                            <tr>
                            <td>{post.post_id}</td>
                            <td>{post.owner_id}</td>
                            <td>{post.description}</td>
                            </tr>))}
            </table>}
        </div>
    )
}

export default AdminController;