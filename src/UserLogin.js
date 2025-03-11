import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./LoginPage.css"
import TermsOfUse from "./TermsOfUse";
const UserLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isAuth, setIsAuth] = useState(false); 
    const apiUrl = process.env.REACT_APP_API_URL;

    const nav = useNavigate();

    useEffect(() => {
        const fetchUserid = async () => {
            if (isAuth) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${apiUrl}/userinfo/getuserid/forlogin/${username}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error("Unable to get userdata");
                    }

                    const data = await response.json();
                    const id = data.usr_id;
                    // console.log(data.usr_id); // Assuming your response returns userId
                    // setIsAuth(false);
                    localStorage.setItem('id',id)
                    nav("/feedpage")
                } catch (error) {
                    console.error("Error fetching user ID:", error);
                }
            }
        };

        fetchUserid();
    }, [isAuth, username]); // Include isAuth and username in dependency array to trigger fetchUserid on changes

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { username: username, password: password };

        try {
            const response = await fetch(`${apiUrl}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to authenticate: ${errorText}`);
            }

            const authHeader = response.headers.get('Authorization');
            if (!authHeader) {
                throw new Error("Authorization header not found in response");
            }

            const token = authHeader.split(' ')[1];
            
            setIsAuth(true);
            localStorage.setItem('token', token);
            localStorage.setItem('visitor',username);
            setErrorMessage(""); // Clear any previous error message on success

            // Optionally, redirect user to another page after successful login
            // nav('/dashboard'); // Uncomment if you want to redirect using useNavigate
        } catch (error) {
            console.error("Error:", error.message);
            setErrorMessage(error.message); // Display detailed error message
        }
    };

    return (
        <div className="login-component">
            <div className="login-container">
            <h3 className="app-name">VibeSphere</h3>
            <form onSubmit={handleSubmit} className="login-form">
                <label>
                    Username:
                </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label>
                    Password:
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit">Login</button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
            <p style={{color:"wheat"}}>
                First time on the website? <i onClick={()=>{nav("/signup")}}>sign up</i>
            </p>
            </div>   
            <br></br>            
            <TermsOfUse/>
        </div>
    );
};

export default UserLogin;

