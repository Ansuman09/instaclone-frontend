import React, { useEffect, useState } from "react";
import "./CreatePost.css"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from "./NavBar";


const CreatePost=()=>{
    const [image,setImage] = useState(null);
    const [imageFileToSend,setImageFileToSend]=useState(null);
    const [description,setDescription]=useState("");
    const token = localStorage.getItem('token')

    const apiUrl = process.env.REACT_APP_API_URL;

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
        formData.append("description", description);  // Append description
        formData.append("image", imageFileToSend);  // Append the file
    
        try {
            await fetch(`${apiUrl}/posts/addpost`, {
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
        setDescription("");
    };
    
    return (
        <div>
            <div style={{'padding-bottom':'120px'}}>
              <NavBar />
              
            </div>
        
        <div className="new-post">
            
            <div className="new-post-container"> 
            <form onSubmit={(e)=>handleAddpost(e)}>
                <label>Upload an Image     </label>
                <input type="file" className="browse-button" onChange={(e)=>handleImageSelection(e.target.files[0])}></input>
                <br/>
                <img src={image} className="new-post-image"></img>
                <br/>
                <input className="description-input" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Write Something"></input>
                <button className="submit-new-post" type="submit"><FontAwesomeIcon icon={faArrowRight}/></button>
            </form>
            </div>
        </div>
        </div>
    )
}


export default CreatePost;