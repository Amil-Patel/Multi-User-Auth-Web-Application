import React, { useState, useEffect, useContext } from 'react'
import Sidebar from './layout/Sidebar'
import Navbar from './layout/Navbar'
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { userRolesContext } from "./layout/RoleContext";
import '../../assets/css/main.css'

const Instructure = () => {
    const { userRole } = useContext(userRolesContext);

    const [permData, setPermData] = useState([]);

    const getPermData = () => {
        axios.get("http://localhost:1007/getPermRole", {
            params: {
                userRole: userRole
            }
        })
            .then((res) => {
                setPermData(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log("Error in getting permission role data in user:", err);
            });
    }

    useEffect(() => {
        getPermData();
    }, []);

    // Extract permissions for the specific category (e.g., instructure, perm_cat_id = 3)
    const instructurePermissions = permData.find(perm => perm.perm_cat_id === 3);

    const canView = instructurePermissions?.can_view === 1;
    const canAdd = instructurePermissions?.can_add === 1;
    const canEdit = instructurePermissions?.can_edit === 1;
    const canDelete = instructurePermissions?.can_delete === 1;

    // Add instructure data code start
    const [addData, setAddData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        address: "",
        graduation: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const saveData = async (e) => {
        e.preventDefault();
        axios.post("http://localhost:1007/addinstructure", addData)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data added successfully");
                    setAddData({
                        first_name: "",
                        last_name: "",
                        mobile_number: "",
                        address: "",
                        graduation: "",
                    });
                }
            })
            .catch((err) => {
                console.log("Error in adding data in instructure:", err);
            })
    }

    // Get student data code start
    const [data, setData] = useState([]);

    const getData = () => {
        axios.get("http://localhost:1007/getinstructure")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log("Error in getting data in instructure:", err);
            })
    }

    // Delete data code start
    const deleteData = (id) => {
        axios.delete(`http://localhost:1007/deleteinstructure/${id}`)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data deleted successfully");
                    getData();
                }
            })
            .catch((err) => {
                console.log("Error in deleting data in instructure:", err);
            })
    }

    // Edit data code start
    const [editData, setEditData] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        address: "",
        graduation: "",
        status: "",
    })

    const getStudentWithId = (id) => {
        axios.get(`http://localhost:1007/getinstructurewithid/${id}`)
            .then((res) => {
                setEditData(res.data[0]);
            })
            .catch((err) => {
                console.log("Error in editing data in instructure:", err);
            })
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const updateData = () => {
        axios.put(`http://localhost:1007/updateinstructure/${editData.id}`, editData)
            .then((res) => {
                if (res.status === 200) {
                    console.log("Data updated successfully");
                }
            })
            .catch((err) => {
                console.log("Error in updating data in instructure:", err);
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
                            <h1>Instructors</h1>
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
                        {canAdd && (
                            <NavLink href="#" className="btn-download" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <span className="text">Add Instructor</span>
                            </NavLink>
                        )}
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Instructors Info</h3>
                                <i className="bx bx-search"></i>
                                <i className="bx bx-filter"></i>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Graduation</th>
                                        <th>Address</th>
                                        <th>Mobile Number</th>
                                        <th>Operation</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.first_name}</td>
                                                    <td>{item.last_name}</td>
                                                    <td>{item.graduation}</td>
                                                    <td>{item.address}</td>
                                                    <td>{item.mobile_number}</td>
                                                    <td>
                                                        <div style={{ display: "flex" }}>
                                                            {canEdit && (
                                                                <div style={{ backgroundColor: "blue", padding: "5px 8px", marginRight: "5px", borderRadius: "3px", cursor: "pointer" }} onClick={() => getStudentWithId(item.id)} data-bs-toggle="modal" data-bs-target="#exampleModal1">
                                                                    <i style={{ color: "white" }} className="fa-solid fa-pen fa-sm"></i>
                                                                </div>
                                                            )}
                                                            {canDelete && (
                                                                <div style={{ backgroundColor: "red", padding: "5px 8px", borderRadius: "3px", cursor: "pointer" }} onClick={() => deleteData(item.id)}>
                                                                    <i style={{ color: "white" }} className="fa-solid fa-trash fa-sm"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>{item.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8}>No Data Found</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add Modal */}
                    <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={saveData}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Add Instructor</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="first_name" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="first_name" placeholder="Enter First Name" name='first_name' value={addData.first_name} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="last_name" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="last_name" placeholder="Enter Last Name" name='last_name' value={addData.last_name} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input type="text" className="form-control" id="address" placeholder="Enter Address" name='address' value={addData.address} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                                        <input type="number" className="form-control" id="mobile_number" placeholder="Enter Mobile Number" name='mobile_number' value={addData.mobile_number} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="graduation" className="form-label">Graduation</label>
                                        <input type="text" className="form-control" id="graduation" placeholder="Enter Graduation" name='graduation' value={addData.graduation} onChange={handleChange} />
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
                    <div className="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <form className="modal-content" onSubmit={updateData}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Edit Instructor</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="first_name" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="first_name" name='first_name' value={editData.first_name} onChange={handleEditChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="last_name" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="last_name" name='last_name' value={editData.last_name} onChange={handleEditChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input type="text" className="form-control" id="address" name='address' value={editData.address} onChange={handleEditChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                                        <input type="number" className="form-control" id="mobile_number" name='mobile_number' value={editData.mobile_number} onChange={handleEditChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="graduation" className="form-label">Graduation</label>
                                        <input type="text" className="form-control" id="graduation" name='graduation' value={editData.graduation} onChange={handleEditChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">Role</label>
                                        <select
                                            className="form-select"
                                            aria-label="Default select example"
                                            name="status"
                                            value={editData.status}
                                            onChange={handleEditChange}
                                        >
                                            <option value="" disabled>Select a role</option>
                                            <option value="active">Active</option>
                                            <option value="deactive">Deactive</option>
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
    )
}

export default Instructure
