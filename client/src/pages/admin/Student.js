import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import '../../assets/css/main.css';
import { NavLink } from 'react-router-dom';
import { userRolesContext } from "./layout/RoleContext";
import axios from 'axios';

const Student = () => {
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

    // Extract permissions for the specific category (e.g., student info, perm_cat_id = 1)
    const studentPermissions = permData.find(perm => perm.perm_cat_id === 1);

    const canView = studentPermissions?.can_view === 1;
    const canAdd = studentPermissions?.can_add === 1;
    const canEdit = studentPermissions?.can_edit === 1;
    const canDelete = studentPermissions?.can_delete === 1;

    // The rest of your state and functions remain the same
    const [addData, setAddData] = useState({
        first_name: "",
        last_name: "",
        address: "",
        mobile_number: "",
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
        axios.post("http://localhost:1007/addstudents", addData)
            .then((res) => {
                if (res.status == 200) {
                    console.log("data is added successfully");
                    setAddData({
                        first_name: "",
                        last_name: "",
                        address: "",
                        mobile_number: "",
                    });
                    getData();
                }
            })
            .catch((err) => {
                console.log("error in adding data in students:", err);
            });
    };

    const [data, setData] = useState([]);

    const getData = () => {
        axios.get("http://localhost:1007/getstudents")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log("error in getting data in students:", err);
            });
    };

    const deleteData = (id) => {
        axios.delete(`http://localhost:1007/deletestudent/${id}`)
            .then((res) => {
                if (res.status == 200) {
                    console.log("data is deleted successfully");
                    getData();
                }
            })
            .catch((err) => {
                console.log("error in deleting data in students:", err);
            });
    };

    const [editData, setEditData] = useState({
        first_name: "",
        last_name: "",
        address: "",
        mobile_number: "",
        status: "",
    });

    const getStudentWithId = (id) => {
        axios.get(`http://localhost:1007/getstudentwithid/${id}`)
            .then((res) => {
                setEditData(res.data[0]);
            })
            .catch((err) => {
                console.log("error in editing data in students:", err);
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
        axios.put(`http://localhost:1007/updatestudent/${editData.id}`, editData)
            .then((res) => {
                if (res.status == 200) {
                    console.log("data is updated successfully");
                    getData();
                }
            })
            .catch((err) => {
                console.log("error in updating data in students:", err);
            });
    };

    useEffect(() => {
        getData();
    }, []);

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
                            <h1>Students</h1>
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
                            <NavLink className="btn-download" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <span className="text">Add Student</span>
                            </NavLink>
                        )}
                    </div>

                    <div className="table-data">
                        <div className="order">
                            <div className="head">
                                <h3>Students Info</h3>
                                <i className="bx bx-search"></i>
                                <i className="bx bx-filter"></i>
                            </div>
                            {canView ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Address</th>
                                            <th>Mobile Number</th>
                                            <th>Operation</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.first_name}</td>
                                                    <td>{item.last_name}</td>
                                                    <td>{item.address}</td>
                                                    <td>{item.mobile_number}</td>
                                                    <td>
                                                        <div style={{ display: "flex" }}>
                                                            {canEdit && (
                                                                <div
                                                                    style={{ backgroundColor: "blue", padding: "5px 8px", marginRight: "5px", borderRadius: "3px", cursor: "pointer" }}
                                                                    onClick={() => getStudentWithId(item.id)}
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
                                                    <td>{item.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6}>No Data Found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <p>You do not have permission to view student data.</p>
                            )}
                        </div>
                    </div>
                    {/* Add Modal */}
                    {canAdd && (
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <form className="modal-content" onSubmit={saveData}>
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Add Student</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">First Name</label>
                                            <input type="text" className="form-control" placeholder="Enter First Name" name="first_name" value={addData.first_name} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Last Name</label>
                                            <input type="text" className="form-control" placeholder="Enter Last Name" name="last_name" value={addData.last_name} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Address</label>
                                            <input type="text" className="form-control" placeholder="Enter Address" name="address" value={addData.address} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Mobile Number</label>
                                            <input type="number" className="form-control" placeholder="Enter Mobile Number" name="mobile_number" value={addData.mobile_number} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal */}
                    {canEdit && (
                        <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <form className="modal-content" onSubmit={updateData}>
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Edit Student</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">First Name</label>
                                            <input type="text" className="form-control" name="first_name" value={editData.first_name} onChange={handleEditChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Last Name</label>
                                            <input type="text" className="form-control" name="last_name" value={editData.last_name} onChange={handleEditChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Address</label>
                                            <input type="text" className="form-control" name="address" value={editData.address} onChange={handleEditChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Mobile Number</label>
                                            <input type="number" className="form-control" name="mobile_number" value={editData.mobile_number} onChange={handleEditChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Status</label>
                                            <select
                                                className="form-select"
                                                aria-label="Default select example"
                                                name="status"
                                                value={editData.status}
                                                onChange={handleEditChange}
                                            >
                                                <option value="" disabled>Select a status</option>
                                                <option value="active">Active</option>
                                                <option value="deactive">Deactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </main>
            </section>
        </>
    );
}

export default Student;
