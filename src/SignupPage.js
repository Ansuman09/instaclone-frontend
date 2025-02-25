import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./LoginPage.css";

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Track confirm password separately
    const [errorMessage, setErrorMessage] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
    const apiUrl = process.env.REACT_APP_API_URL;
    
    const nav = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check password match before submitting
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return; // Stop submission if passwords don't match
        }

        const data = {
            username,
            email,
            password
        };

        try {
            const response = await fetch(`${apiUrl}/user/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            if (response.status === 201) {
                setErrorMessage("Successfully registered!");
                nav('/'); 
            } else if (response.status === 409) {
                setErrorMessage("The username already exists.");
                setUsername("");
                setPassword("");
                setEmail("");
                setConfirmPassword(""); 
            } else if (response.status === 500) {
                setErrorMessage(" Facing server error.");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Cannot connect to the server.");
        }
    };

    return (
        <div>
            <div className="login-container">
                <h3 className="app-name">InstaClone</h3>
                <form onSubmit={handleSubmit} className="login-form">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <br />
                    
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    
                    <label>Password:</label>
                    <input
                        type={passwordVisible ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    
                    <label>Retype Password:</label>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <br />
                    
                    <button type="submit">Sign Up</button>
                    
                    
                    {errorMessage && <p>{errorMessage}</p>}
                </form>
            </div>   
        </div>
    );
};

export default SignupPage;
