import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./LoginPage.css";
import { jwtDecode } from "jwt-decode";
import PrivacyPolicyModal from "./Modals/PrivacyPolicyModal";

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const [passwordVisible, setPasswordVisible] = useState(false); 
    const [showPrivacyPopUp, setShowPrivacyPopUp] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem('token');
    // const userRoles = jwtDecode(token).roles;

    const nav = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return; // Stop submission if passwords don't match
        }

        // Show Privacy Policy Modal
        setShowPrivacyPopUp(true);
    };

    const closePrivacyPagePopUp = (agree) => {
        setShowPrivacyPopUp(false);

        // If the user agrees to the privacy policy, proceed with the sign-up
        if (agree) {
            sendSignUpData();
            console.log("agreed")
        }else{
            console.log("disagree")
        }
    };

    const sendSignUpData = async () => {
        const userinfo = {
            username: username,
            password: password,
            email: email
        };

        try {
            const response = await fetch(`${apiUrl}/user/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userinfo)
            });

            if (response.status === 201) {
                setErrorMessage("Successfully registered!");
                setUsername("");
                setPassword("");
                setEmail("");
                nav('/'); 
            } else if (response.status === 409) {
                setErrorMessage("The username already exists.");
            } else if (response.status === 500) {
                setErrorMessage(" Facing server error.");
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            setErrorMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="login-component">
            {/* {userRoles.includes("ROLE_ROLES_MANAGER") && ( */}
                <div className="login-container">
                    <h3 className="app-name">VibeSphere</h3>
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
            
            <PrivacyPolicyModal showModal={showPrivacyPopUp} closeModal={closePrivacyPagePopUp} />
        </div>
    );
};

export default SignupPage;
