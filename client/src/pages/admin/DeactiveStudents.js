import React, { useState, useEffect } from 'react'
import Sidebar from './layout/Sidebar'
import Navbar from './layout/Navbar'
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/main.css'

const DeactiveStudents = () => {
    //get deactive students data  code start
    const [data, setData] = useState([]);

    const getData = () => {
        axios.get("http://localhost:1007/getdeactivestudents")
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log(err + "error in getting data in instructure");
            })
    }
    useEffect(() => {
        getData();
    }, [])
    const [sidebarHidden, setSidebarHidden] = useState(window.innerWidth < 768);
    const [isDarkMode, setDarkMode] = useState(false);

    const toggleSidebar = () => {
        setSidebarHidden(!sidebarHidden);
    };

    const toggleDarkMode = () => {
        setDarkMode(!isDarkMode);
        document.body.classList.toggle("dark");
    };

    useEffect(() => {
        const handleResize = () => {
            setSidebarHidden(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <>
            <Sidebar isOpen={!sidebarHidden} />
            <Navbar toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} />
            <section id="content">
                <main>
                    <div className="head-title">
                        <div className="left">
                            <h1>Deactive Student</h1>
                            <ul className="breadcrumb">
                                <li>
                                    <a href="#">Dashboard</a>
                                </li>
                                <li>
                                    <i className="bx bx-chevron-right"></i>
                                </li>
                                <li>
                                    <NavLink to={"/dashboard"} className="active">
                                        Dashboard
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Deactive Student Info</h3>
                                <i className="bx bx-search"></i>
                                <i className="bx bx-filter"></i>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Address</th>
                                        <th>Mobile Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 ? (
                                            data.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.first_name}</td>
                                                        <td>{item.last_name}</td>
                                                        <td>{item.address}</td>
                                                        <td>{item.mobile_number}</td>
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6}>No Data Found</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </section>
        </>
    )
}

export default DeactiveStudents
