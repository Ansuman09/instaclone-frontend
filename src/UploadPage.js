import React, { useState } from "react";

const UploadPage = () => {
    const [owner_id, setOwner_id] = useState('');
    const [image_url, setImage_url] = useState('');
    const [description, setDescription] = useState('');
    const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJLeWxpYW5NIiwiZXhwIjoxNzE5MDgxNzQyfQ.UujvYMf1uC8YxyZAvpVmLlJ8z4VwKkTuGa2r1dQcHYTeldLIhuAEJSayZEQEtGqK9sk2k6VnZnNeLyDWshoOXQ"; // Replace with your actual token

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            owner_id: owner_id,
            image_url: image_url,
            description: description
        };

        try {
            const response = await fetch('http://localhost:8080/posts/addpost', {
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

            console.log('Uploaded Successfully');

            // Reset form fields
            setOwner_id('');
            setImage_url('');
            setDescription('');
        } catch (error) {
            console.error('Error during upload:', error.message);
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
