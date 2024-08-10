import React, { useState, useEffect } from 'react';
import Sidebar from './layout/Sidebar';
import Navbar from './layout/Navbar';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/main.css';

const Permission = () => {
    const { id } = useParams();
    const [permissionData, setPermissionData] = useState([]);
    const [updatedPermissions, setUpdatedPermissions] = useState({});
    const [rolePermissionCheckData, setRolePermissionCheckData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getRolesPermissionData();
        if (rolePermissionCheckData.length > 0) {
            getPermissionData();
            getRolesPermissionData();
        } else {
            getPermissionData();
        }
    }, []);

    // useEffect(() => {

    // }, []);

    const getPermissionData = () => {
        axios.get(`http://localhost:1007/permissiondata`)
            .then((res) => {
                setPermissionData(res.data);

                // Initialize the updatedPermissions state with current permissions
                const initialPermissions = res.data.reduce((acc, item) => {
                    acc[item.id] = {
                        pgname: item.pgname,
                        itemName: item.name,
                        enable_view: item.enable_view === 1,
                        enable_add: item.enable_add === 1,
                        enable_edit: item.enable_edit === 1,
                        enable_delete: item.enable_delete === 1
                    };
                    return acc;
                }, {});
                setUpdatedPermissions(initialPermissions);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getRolesPermissionData = () => {
        axios.get(`http://localhost:1007/rolepermissiondataforcheck/${id}`)
            .then((res) => {
                setRolePermissionCheckData(res.data);
            })
            .catch((err) => {
                console.log(err + " error in checking role permission data");
            });
    };

    const handleCheckboxChange = (itemId, field, value) => {
        setUpdatedPermissions(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value
            }
        }));
    };

    const handleEditCheckBox = (itemId, field, value) => {
        setRolePermissionCheckData(prev =>
            prev.map(permission =>
                permission.perm_cat_id === itemId ? { ...permission, [field]: value } : permission
            )
        );
    };
    // console.log(updatedPermissions)
    // console.log(rolePermissionCheckData)
    const handleSave = () => {
        const dataToUpdate = Object.entries(updatedPermissions).map(([id, fields]) => ({
            id: Number(id),
            pgname: fields.pgname,
            itemName: fields.itemName,
            enable_view: fields.enable_view ? 1 : 0,
            enable_add: fields.enable_add ? 1 : 0,
            enable_edit: fields.enable_edit ? 1 : 0,
            enable_delete: fields.enable_delete ? 1 : 0,
        }));

        console.log(dataToUpdate)
        axios.post(`http://localhost:1007/add-role-permissions/${id}`, dataToUpdate)
            .then(response => {
                console.log('Permissions updated:', response.data);
                navigate("/role");
            })
            .catch(error => {
                console.log('Error updating permissions:', error);
            });
    };

    const handleEdit = () => {
        const dataToUpdate = rolePermissionCheckData.map(permission => ({
            permid: permission.perm_cat_id,
            enable_view: permission.can_view ? 1 : 0,
            enable_add: permission.can_add ? 1 : 0,
            enable_edit: permission.can_edit ? 1 : 0,
            enable_delete: permission.can_delete ? 1 : 0,
        }));

        console.log(dataToUpdate)
        axios.put(`http://localhost:1007/update-role-permissions/${id}`, dataToUpdate)
            .then(response => {
                console.log('Permissions updated:', response.data);
                navigate("/role");
            })
            .catch(error => {
                console.log('Error updating permissions:', error);
            });
    };

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

    const groupedPermissions = permissionData.reduce((acc, permission) => {
        console.log(acc);
        console.log(permission)
        if (!acc[permission.perm_group_id]) {
            acc[permission.perm_group_id] = {
                pgname: permission.pgname.split(' ')[0], 
                items: []
            };
        }
        acc[permission.perm_group_id].items.push(permission);
        return acc;
    }, {});

    return (
        <>
            <Sidebar isOpen={!sidebarHidden} />
            <Navbar toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} />
            <section id="content">
                <main>
                    <div className="head-title">
                        <div className="left">
                            <h1>Permission</h1>
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
                            {
                                rolePermissionCheckData.length > 0 ? (
                                    Object.entries(groupedPermissions).map(([groupId, group]) => (
                                        <>
                                            <div key={groupId} style={{ marginBottom: "30px", display: 'flex', justifyContent: "space-between" }}>
                                                <div style={{ width: "30%" }}>
                                                    <h5>{group.pgname} Information</h5>
                                                </div>
                                                <div style={{ width: "70%" }}>
                                                    {group.items.map(item => {
                                                        const rolePermission = rolePermissionCheckData.find(permission => permission.perm_cat_id === item.id);
                                                        return (
                                                            <div key={item.id} style={{ marginLeft: '20px' }}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div style={{ width: '50%' }}>{item.name}</div>
                                                                    <div>
                                                                        {item.enable_view === 1 && (
                                                                            <label style={{ marginLeft: '20px' }}>
                                                                                <input
                                                                                    style={{ marginRight: '3px' }}
                                                                                    type="checkbox"
                                                                                    checked={rolePermission?.can_view === 1}
                                                                                    onChange={(e) => handleEditCheckBox(item.id, 'can_view', e.target.checked ? 1 : 0)}
                                                                                />
                                                                                View
                                                                            </label>
                                                                        )}
                                                                        {item.enable_add === 1 && (
                                                                            <label style={{ marginLeft: '20px' }}>
                                                                                <input
                                                                                    style={{ marginRight: '3px' }}
                                                                                    type="checkbox"
                                                                                    checked={rolePermission?.can_add === 1}
                                                                                    onChange={(e) => handleEditCheckBox(item.id, 'can_add', e.target.checked ? 1 : 0)}
                                                                                />
                                                                                Add
                                                                            </label>
                                                                        )}
                                                                        {item.enable_edit === 1 && (
                                                                            <label style={{ marginLeft: '20px' }}>
                                                                                <input
                                                                                    style={{ marginRight: '3px' }}
                                                                                    type="checkbox"
                                                                                    checked={rolePermission?.can_edit === 1}
                                                                                    onChange={(e) => handleEditCheckBox(item.id, 'can_edit', e.target.checked ? 1 : 0)}
                                                                                />
                                                                                Edit
                                                                            </label>
                                                                        )}
                                                                        {item.enable_delete === 1 && (
                                                                            <label style={{ marginLeft: '20px' }}>
                                                                                <input
                                                                                    style={{ marginRight: '3px' }}
                                                                                    type="checkbox"
                                                                                    checked={rolePermission?.can_delete === 1}
                                                                                    onChange={(e) => handleEditCheckBox(item.id, 'can_delete', e.target.checked ? 1 : 0)}
                                                                                />
                                                                                Delete
                                                                            </label>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    ))
                                ) : (
                                    Object.entries(groupedPermissions).map(([groupId, group]) => (
                                        <>
                                            <div key={groupId} style={{ marginBottom: "30px", display: 'flex', justifyContent: "space-between" }}>
                                                <div style={{ width: "30%" }}>
                                                    <h5>{group.pgname} Information</h5>
                                                </div>
                                                <div style={{ width: "70%" }}>
                                                    {group.items.map(item => (
                                                        <div key={item.id} style={{ marginLeft: '20px' }}>
                                                            <div style={{ display: 'flex' }}>
                                                                <div style={{ width: '50%' }}>{item.name}</div>
                                                                <div>
                                                                    {item.enable_view === 1 && (
                                                                        <label style={{ marginLeft: '20px' }}>
                                                                            <input
                                                                                style={{ marginRight: '3px' }}
                                                                                type="checkbox"
                                                                                checked={updatedPermissions[item.id]?.enable_view ?? false}
                                                                                onChange={(e) => handleCheckboxChange(item.id, 'enable_view', e.target.checked)}
                                                                            />
                                                                            View
                                                                        </label>
                                                                    )}
                                                                    {item.enable_add === 1 && (
                                                                        <label style={{ marginLeft: '20px' }}>
                                                                            <input
                                                                                style={{ marginRight: '3px' }}
                                                                                type="checkbox"
                                                                                checked={updatedPermissions[item.id]?.enable_add ?? false}
                                                                                onChange={(e) => handleCheckboxChange(item.id, 'enable_add', e.target.checked)}
                                                                            />
                                                                            Add
                                                                        </label>
                                                                    )}
                                                                    {item.enable_edit === 1 && (
                                                                        <label style={{ marginLeft: '20px' }}>
                                                                            <input
                                                                                style={{ marginRight: '3px' }}
                                                                                type="checkbox"
                                                                                checked={updatedPermissions[item.id]?.enable_edit ?? false}
                                                                                onChange={(e) => handleCheckboxChange(item.id, 'enable_edit', e.target.checked)}
                                                                            />
                                                                            Edit
                                                                        </label>
                                                                    )}
                                                                    {item.enable_delete === 1 && (
                                                                        <label style={{ marginLeft: '20px' }}>
                                                                            <input
                                                                                style={{ marginRight: '3px' }}
                                                                                type="checkbox"
                                                                                checked={updatedPermissions[item.id]?.enable_delete ?? false}
                                                                                onChange={(e) => handleCheckboxChange(item.id, 'enable_delete', e.target.checked)}
                                                                            />
                                                                            Delete
                                                                        </label>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ))
                                )
                            }

                            {
                                rolePermissionCheckData.length > 0 ? (
                                    <button onClick={handleEdit} style={{ marginTop: '20px', padding: "10px 20px", backgroundColor: "#3C91E6", color: "white", borderRadius: "3px" }}>Save Changes</button>
                                ) : (
                                    <button onClick={handleSave} style={{ marginTop: '20px', padding: "10px 20px", backgroundColor: "#3C91E6", color: "white", borderRadius: "3px" }}>Add</button>
                                )
                            }

                        </div>
                    </div>
                </main>
            </section>
        </>
    );
}

export default Permission;
