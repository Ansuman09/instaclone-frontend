import React, { useEffect, useState } from "react";
import "./CreatePost.css"
const CreatePost=()=>{
    const [image,setImage] = useState(null);
    const [imageFileToSend,setImageFileToSend]=useState(null);
    const [description,setDescription]=useState("");
    const owner_id = parseInt(localStorage.getItem('id'));
    const token = localStorage.getItem('token')

    const handleImageSelection=(imageFile)=>{
        setImage(URL.createObjectURL(imageFile))
        console.log(imageFile.name)
        setImageFileToSend(imageFile)
    }

    const handleAddpost = async (e) => {
        e.preventDefault();
        
        if (!imageFileToSend) {
            console.log("No image selected");
            return;
        }
    
        const formData = new FormData();
        formData.append("owner_id", owner_id);  // Append owner_id
        formData.append("description", description);  // Append description
        formData.append("image", imageFileToSend);  // Append the file
    
        try {
            await fetch("http://localhost:8080/posts/addpost", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`  // Do not set Content-type header manually here!
                },
                body: formData  // Send FormData, not JSON
            });
            console.log("Post successfully created!");
    
        } catch (e) {
            console.log(e);
            throw new Error("Unable to send data");
        }
        
        setImage(null);
        setDescription(null);
    };
    
    return (
        <div>
            <form>
                <label>image_url</label>
                <input type="file" onChange={(e)=>handleImageSelection(e.target.files[0])}></input>
                <br/>
                {image &&<img src={image} className="new-post-image"></img>}
                <br/>
                <label>description</label>
                <input value={description} onChange={(e)=>setDescription(e.target.value)}></input>
                <br/>
                <button type="button" onClick={handleAddpost}>Submit</button>
            </form>
        </div>
    )
}


export default CreatePost;