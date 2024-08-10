import React, { useState, useEffect, useContext } from 'react'
import Sidebar from './layout/Sidebar'
import Navbar from './layout/Navbar'
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { userRolesContext } from "./layout/RoleContext";
import '../../assets/css/main.css'

const Role = () => {
    const { userRole } = useContext(userRolesContext);

    // Fetch permissions
    const [permData, setPermData] = useState([]);
    const getPermData = () => {
        axios.get("http://localhost:1007/getPermRole", {
            params: {
                userRole: userRole
            }
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

    // Extract permissions for the specific category (e.g., roles, perm_cat_id = 1)
    const rolePermissions = permData.find(perm => perm.perm_cat_id === 5);

    const canView = rolePermissions?.can_view === 1;
    const canAdd = rolePermissions?.can_add === 1;
    const canEdit = rolePermissions?.can_edit === 1;
    const canDelete = rolePermissions?.can_delete === 1;

    // Add role data
    const [addData, setAddData] = useState({ name: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddData(prev => ({ ...prev, [name]: value }));
    }

    const saveData = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:1007/addrole", addData)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data added successfully");
                    setAddData({ name: "" });
                }
            })
            .catch((err) => {
                console.log("Error adding data:", err);
            })
    }

    // Get role data
    const [data, setData] = useState([]);
    const getData = () => {
        axios.get("http://localhost:1007/getrole")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log("Error fetching data:", err);
            })
    }

    // Delete role data
    const deleteData = (id) => {
        axios.delete(`http://localhost:1007/deleterole/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data deleted successfully");
                    getData();
                }
            })
            .catch((err) => {
                console.log("Error deleting data:", err);
            })
    }

    // Edit role data
    const [editData, setEditData] = useState({ name: "" });
    const getRoleWithId = (id) => {
        axios.get(`http://localhost:1007/getrolewithid/${id}`)
            .then((res) => {
                setEditData(res.data[0]);
            })
            .catch((err) => {
                console.log("Error fetching data for edit:", err);
            })
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    }

    const updateData = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:1007/updaterole/${editData.id}`, editData)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data updated successfully");
                }
            })
            .catch((err) => {
                console.log("Error updating data:", err);
            })
    }

    useEffect(() => {
        getData();
    }, [addData])

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
                            <h1>Role</h1>
                            <ul className="breadcrumb">
                                <li><a href="#">Dashboard</a></li>
                                <li><i className="bx bx-chevron-right"></i></li>
                                <li><NavLink to={"/dashboard"} className="active">Dashboard</NavLink></li>
                            </ul>
                        </div>
                        {canAdd && (
                            <NavLink href="#" className="btn-download" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <span className="text">Add Role</span>
                            </NavLink>
                        )}
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Roles Info</h3>
                                <i className="bx bx-search"></i>
                                <i className="bx bx-filter"></i>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>Permission</th>
                                        <th>Operation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>
                                                        <NavLink to={`/permission/${item.id}`}>
                                                            Give Permission
                                                        </NavLink>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: "flex" }}>
                                                            {canEdit && (
                                                                <div
                                                                    style={{ backgroundColor: "blue", padding: "5px 8px", marginRight: "5px", borderRadius: "3px", cursor: "pointer" }}
                                                                    onClick={() => getRoleWithId(item.id)}
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal1"
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
                                                <td colSpan={4}>No Data Found</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add Modal */}
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={saveData}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Role</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="roleName" className="form-label">Name</label>
                                        <input type="text" className="form-control" id="roleName" placeholder="Enter Role Name" name='name' value={addData.name} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={!canAdd}>Save</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={updateData}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Edit Role</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="editRoleName" className="form-label">Name</label>
                                        <input type="text" className="form-control" id="editRoleName" name='name' value={editData.name} onChange={handleEditChange} />
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
    )
}

export default Role;
