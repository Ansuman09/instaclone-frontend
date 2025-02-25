import React, { useEffect, useState } from "react";
import "./CreatePost.css"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from "./NavBar";

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [imageFileToSend, setImageFileToSend] = useState(null);
  const [imageLoading,setImageLoading] = useState(true);
  const [description, setDescription] = useState("");
  const token = localStorage.getItem('token')

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleImageSelection = (imageFile) => {
    setImage(URL.createObjectURL(imageFile));
    console.log(imageFile.name);
    resizeImage(imageFile); // Call the resize function
  }

  const resizeImage = (imageFile) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onloadend = () => {
      img.src = reader.result;
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set the desired size (350x280)
        const width = 600;
        const height = 350;

        canvas.width = width;
        canvas.height = height;

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a Blob
        canvas.toBlob((blob) => {
          setImageFileToSend(blob); // Set the Blob to be sent
        }, imageFile.type);
      }
    };
    setImageLoading(false);
    reader.readAsDataURL(imageFile); // Read the file
  }

  const handleAddPost = async (e) => {
    e.preventDefault();

    if (!imageFileToSend) {
      console.log("No image selected");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);  // Append description
    formData.append("image", imageFileToSend);  // Append the resized image

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
      <div style={{ 'padding-bottom': '120px' }}>
        <NavBar />
      </div>

      <div className="new-post">
        <div className="new-post-container">
          <form onSubmit={(e) => handleAddPost(e)}>
            <label>Upload an Image</label>
            <input type="file" className="browse-button" onChange={(e) => handleImageSelection(e.target.files[0])}></input>
            <br />
            {!imageLoading && <img src={image} className="new-post-image" alt="Preview"></img>}
            <br />
            <input className="description-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write Something"></input>
            <button className="submit-new-post" type="submit"><FontAwesomeIcon icon={faArrowRight} /></button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
