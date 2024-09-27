import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./LoginPage.css"
const SignupPage= () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email,setEmail]=useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    
    const nav = useNavigate();


    const handleSubmit = async (event) => {

        event.preventDefault();

        const data = {
            username:username,
            email:email,
            password:password
        }

        if (errorMessage===null){
        try{
        response = await fetch("http://localhost:8080/user/register",{
            method:'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify(data)
        })
        
        if(response){
            console.log(response);
            console.log(data);
        }}catch (error){
            console.log(error)
            throw new Error("Can not connect to the server")
        }}

    };

    return (
        <div>
            <div className="login-container">
            <h3 className="app-name">InstaClone</h3>
            <form onSubmit={handleSubmit} className="login-form">
                <label>
                    Username:
                </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label>
                    email:
                </label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label>
                    Password:
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <label>
                    Retype Password:
                </label>
                <input type="password" onChange={(e) => (e.target.value===password ? setErrorMessage(null) : setErrorMessage("Password does not match"))} />
                <br />
                <button type="submit">Login</button>
                {errorMessage && <p>{errorMessage}</p>}
            </form>
            </div>   
        </div>
    );
};

export default SignupPage;