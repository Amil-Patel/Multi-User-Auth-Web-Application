import React, { useState, useContext } from 'react';
import '../assets/css/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userRolesContext } from './admin/layout/RoleContext';
import Cookies from 'js-cookie';
const Login = () => {
    const [data, setData] = useState({
        username: "",
        password: ""
    })
    const handleChange = ((e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    })
    const { setUserRole } = useContext(userRolesContext);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const handleSubmit = ((e) => {
        e.preventDefault();
        axios.post('http://localhost:1007/login', data)
            .then((res) => {
                if (res.status === 200) {
                    setUserRole(res.data.role);
                    console.log(res.data)
                    Cookies.set('token', res.data.token, { expires: 1 });
                    navigate("/dashboard")
                } else {
                    alert("invalide username and password")
                }
            })
            .catch((err) => {
                console.log(err + "erro in login")
            })
    })
    return (
        <>
            <form class="login" onSubmit={handleSubmit}>
                <h2>Welcome, User!</h2>
                <p>Please log in</p>
                <input type="text" placeholder="User Name" name='username' value={data.username} onChange={handleChange} />
                <input type="password" placeholder="Password" name='password' value={data.password} onChange={handleChange} />
                <input type="submit" value="Log In" />
                <div class="links">
                    <a href="#">Forgot password</a>
                    <a href="#">Register</a>
                </div>
            </form>
        </>
    )
}


export default Login
