import React from 'react';
import './Modal.css'; 

const DeleteModal = ({ showModal, closeModal, post }) => {
  
  const token=localStorage.getItem('token');

  const apiUrl = process.env.REACT_APP_API_URL;

  const deletePost=async()=>{
    const response=await fetch(`${apiUrl}/posts/delete/post/${post.post_id}`,{
      method:"POST",
      headers: {
          Authorization: `Bearer ${token}`
      }

      
  })
  if (response.ok){
      window.location.reload();
  }

   
  }

  if (!showModal) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={closeModal} className="close-btn">Close</button>
        <p>Are you sure you want to delet this Post ? {post.description}</p>
        <div >
        <button className="delete-btn" onClick={deletePost}> Yes</button>
        <button className="update-btn" onClick={closeModal} > No</button>
        </div>
        
      </div>
    </div>
  );
};

export default DeleteModal;
