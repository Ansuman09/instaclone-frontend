import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";

const ManageRolesController = () => {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;
    const [username, setUsername] = useState("");
    const [roles, setRoles] = useState([]);
    const [reportUserRoleStatus, setReportUserRoleStatus] = useState("");

    const getUserData = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/user/roles/by/${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setRoles(data.map((role) => role.role));
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const addUserRole = async () => {
        const formData = { username: username, roles: roles };

        try {
            const response = await fetch(`${apiUrl}/user/change/role`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Sending JSON now
                },
                body: JSON.stringify(formData),
            });

            console.log("Post successfully created!");

            if (response.ok) {
                setReportUserRoleStatus("Roles updated successfully!");
            }
        } catch (e) {
            console.log(e);
            setReportUserRoleStatus("Unable to update roles.");
        }
    };

    const handleRoleChange = (e) => {
        const selectedRole = `${e.target.value}`;

        if (!roles.includes(selectedRole)) {
            setRoles((prevRoles) => [...prevRoles, selectedRole]);
        }
    };

    const removeRole = (roleToRemove) => {
        setRoles((prevRoles) => prevRoles.filter((role) => role !== roleToRemove));
    };

    return (
        <div>
            <form onSubmit={getUserData}>
                <label>Username:</label>
                <input
                    value={username}
                    onChange={(e) => {setUsername(e.target.value),setReportUserRoleStatus()}}
                />
                <button type="submit">GO</button>
            </form>

            <br />

            {roles.length > 0 && (
                <ul>
                    {roles.map((role, index) => (
                        <li key={index}>
                            {role + "    " }
                            <button type="button" className="delete-btn" style={{padding:"0px 4px 0px 4px"}} onClick={() => removeRole(role)}> <FontAwesomeIcon icon={faDeleteLeft} /> </button>
                        </li>
                    ))}
                </ul>
            )}

            <br />

            <form>
                <label>New Role  </label>
                <select id="newrole" onChange={handleRoleChange}>
                    <option value="RW_USER">RW_USER</option>
                    <option value="ROLES_MANAGER">ROLES_MANAGER</option>
                    <option value="RO_USER">RO_USER</option>
                </select>
                <p></p>
                <button
                    type="button"
                    onClick={addUserRole}
                >
                    Confirm
                </button>
            </form>

            <p>{reportUserRoleStatus}</p>
        </div>
    );
};

export default ManageRolesController;
