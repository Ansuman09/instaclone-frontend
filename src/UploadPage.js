import React, { useState } from "react";

const UploadPage = () => {
    const [owner_id, setOwner_id] = useState('');
    const [image_url, setImage_url] = useState('');
    const [description, setDescription] = useState('');
    const token = localStorage.getItem('token')
    
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            owner_id: owner_id,
            image_url: image_url,
            description: description
        };

        try {
            const response = await fetch(`${apiUrl}/posts/addpost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to upload');
            }


            // Reset form fields
            setOwner_id('');
            setImage_url('');
            setDescription('');
        } catch (error) {
            // Handle error: show error message to user, log, etc.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Owner ID:
                <input
                    type="text"
                    value={owner_id}
                    onChange={(e) => setOwner_id(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Image URL:
                <input
                    type="text"
                    value={image_url}
                    onChange={(e) => setImage_url(e.target.value)}
                    required
                />
            </label>
            <br />
            <label>
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </label>
            <br />
            <button type="submit">Upload</button>
        </form>
    );
};

export default UploadPage;
