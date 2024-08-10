import React, { useState, useEffect, useContext } from 'react'
import Sidebar from './layout/Sidebar'
import Navbar from './layout/Navbar'
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { userRolesContext } from "./layout/RoleContext";
import '../../assets/css/main.css'

const User = () => {
    const { userRole } = useContext(userRolesContext);

    // Permissions
    const [permData, setPermData] = useState([]);
    const getPermData = () => {
        axios.get("http://localhost:1007/getPermRole", {
            params: { userRole }
        })
            .then((res) => {
                setPermData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching permissions:", err);
            });
    }

    useEffect(() => {
        getPermData();
    }, [userRole]);

    const userPermissions = permData.find(perm => perm.perm_cat_id === 6); // Assuming perm_cat_id 2 is for users

    const canView = userPermissions?.can_view === 1;
    const canAdd = userPermissions?.can_add === 1;
    const canEdit = userPermissions?.can_edit === 1;
    const canDelete = userPermissions?.can_delete === 1;

    // Add user data code
    const [addData, setAddData] = useState({
        username: "",
        password: "",
        role: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const saveData = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:1007/adduser", addData)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data added successfully");
                    setAddData({
                        username: "",
                        password: "",
                        role: "",
                    });
                }
            })
            .catch((err) => {
                console.log("Error adding data in user:", err);
            });
    };

    // Get role data for selecting role for user
    const [roleData, setRoleData] = useState([]);
    const getRoleData = () => {
        axios.get("http://localhost:1007/getrole")
            .then((res) => {
                setRoleData(res.data);
            })
            .catch((err) => {
                console.log("Error getting role data in user:", err);
            });
    };

    // Get user data
    const [data, setData] = useState([]);
    const getData = () => {
        axios.get("http://localhost:1007/getuser")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log("Error getting data in user:", err);
            });
    };

    // Delete user data
    const deleteData = (id) => {
        axios.delete(`http://localhost:1007/deleteuser/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data deleted successfully");
                    getData();
                }
            })
            .catch((err) => {
                console.log("Error deleting data in user:", err);
            });
    };

    // Edit user data
    const [editData, setEditData] = useState({
        username: "",
        password: "",
        role: "",
    });
    const getUserWithId = (id) => {
        axios.get(`http://localhost:1007/getuserwithid/${id}`)
            .then((res) => {
                setEditData(res.data[0]);
            })
            .catch((err) => {
                console.log("Error editing data in user:", err);
            });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateData = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:1007/updateuser/${editData.id}`, editData)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data updated successfully");
                }
            })
            .catch((err) => {
                console.log("Error updating data in user:", err);
            });
    };

    useEffect(() => {
        getData();
        getRoleData();
    }, [addData]);

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
                            <h1>Users</h1>
                            <ul className="breadcrumb">
                                <li><a href="#">Dashboard</a></li>
                                <li><i className="bx bx-chevron-right"></i></li>
                                <li><NavLink to={"/dashboard"} className="active">Dashboard</NavLink></li>
                            </ul>
                        </div>
                        {canAdd && (
                            <NavLink href="#" className="btn-download" data-bs-toggle="modal" data-bs-target="#addUserModal">
                                <span className="text">Add User</span>
                            </NavLink>
                        )}
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>User Info</h3>
                                <i className="bx bx-search"></i>
                                <i className="bx bx-filter"></i>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Username</th>
                                        <th>Password</th>
                                        <th>Role</th>
                                        <th>Operation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length > 0 ? (
                                        data.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.username}</td>
                                                <td>{item.password}</td>
                                                <td>{item.role}</td>
                                                <td>
                                                    <div style={{ display: "flex" }}>
                                                        {canEdit && (
                                                            <div
                                                                style={{ backgroundColor: "blue", padding: "5px 8px", marginRight: "5px", borderRadius: "3px", cursor: "pointer" }}
                                                                onClick={() => getUserWithId(item.id)}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#editUserModal"
                                                            >
                                                                <i style={{ color: "white" }} className="fa-solid fa-pen fa-sm"></i>
                                                            </div>
                                                        )}
                                                        {canDelete && (
                                                            <div
                                                                style={{ backgroundColor: "red", padding: "5px 8px", borderRadius: "3px", cursor: "pointer" }}
                                                                onClick={() => deleteData(item.id)}
                                                            >
                                                                <i style={{ color: "white" }} className="fa-solid fa-trash fa-sm"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5}>No Data Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add User Modal */}
                    <div className="modal fade" id="addUserModal" tabIndex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={saveData}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="addUserModalLabel">Add User</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input type="text" className="form-control" id="username" name='username' value={addData.username} onChange={handleChange} placeholder="Enter Username" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input type="text" className="form-control" id="password" name='password' value={addData.password} onChange={handleChange} placeholder="Enter Password" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            id="role"
                                            name="role"
                                            value={addData.role}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select a role</option>
                                            {roleData.length > 0 ? (
                                                roleData.map((role, index) => (
                                                    <option key={index} value={role.name}>{role.name}</option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No roles available</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={!canAdd}>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Edit User Modal */}
                    <div className="modal fade" id="editUserModal" tabIndex="-1" aria-labelledby="editUserModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={updateData}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="editUserModalLabel">Edit User</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="editUsername" className="form-label">Username</label>
                                        <input type="text" className="form-control" id="editUsername" name='username' value={editData.username} onChange={handleEditChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editPassword" className="form-label">Password</label>
                                        <input type="text" className="form-control" id="editPassword" name='password' value={editData.password} onChange={handleEditChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editRole" className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            id="editRole"
                                            name="role"
                                            value={editData.role}
                                            onChange={handleEditChange}
                                        >
                                            <option value="" disabled>Select a role</option>
                                            {roleData.length > 0 ? (
                                                roleData.map((role) => (
                                                    <option key={role.id} value={role.name}>{role.name}</option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No roles available</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={!canEdit}>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </section>
        </>
    );
}

export default User;
