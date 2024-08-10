import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/sidebar.css";
import { useLocation } from "react-router-dom";
import { userRolesContext } from "./RoleContext";

const Sidebar = ({ isOpen }) => {
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
      })
      .catch((err) => {
        console.log("Error in getting permission role data in user:", err);
      });
  }

  useEffect(() => {
    getPermData();
  }, [])
  const studentPermissions = permData.find(perm => perm.perm_cat_id === 1);
  const deactiveSstudentPermissions = permData.find(perm => perm.perm_cat_id === 2);
  const instructurePermissions = permData.find(perm => perm.perm_cat_id === 3);
  const deactiveInstructurePermissions = permData.find(perm => perm.perm_cat_id === 4);
  const rolePermissions = permData.find(perm => perm.perm_cat_id === 5);
  const userPermissions = permData.find(perm => perm.perm_cat_id === 6);

  const canStudentBasicView = studentPermissions?.can_view === 1;
  const deactiveSstudentView = deactiveSstudentPermissions?.can_view === 1;
  const instructureBasicView = instructurePermissions?.can_view === 1;
  const deactiveInstructureView = deactiveInstructurePermissions?.can_view === 1;
  const roleView = rolePermissions?.can_view === 1;
  const userView = userPermissions?.can_view === 1;


  const location = useLocation();
  return (
    <>
      <section id="sidebar" className={isOpen ? "" : "hide"}>
        <NavLink to="/dashboard" className="brand">
          <i className="bx bxs-smile"></i>
          <span className="text">AdminHub</span>
        </NavLink>
        <ul className="side-menu top">
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <NavLink to="/dashboard">
              <i className="bx bxs-dashboard"></i>
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          {
            canStudentBasicView && (
              <li className={location.pathname === "/student" ? "active" : ""}>
                <NavLink to="/student">
                  <i className="bx bxs-shopping-bag-alt"></i>
                  <span className="text">Student</span>
                </NavLink>
              </li>
            )
          }
          {
            deactiveSstudentView && (
              <li className={location.pathname === "/deactivestudent" ? "active" : ""}>
                <NavLink to="/deactivestudent">
                  <i className="bx bxs-shopping-bag-alt"></i>
                  <span className="text">Deactive Student</span>
                </NavLink>
              </li>
            )
          }
          {
            instructureBasicView && (
              <li className={location.pathname === "/instructure" ? "active" : ""}>
                <NavLink to="/instructure">
                  <i className="bx bxs-shopping-bag-alt"></i>
                  <span className="text">Instructure</span>
                </NavLink>
              </li>
            )
          }
          {
            deactiveInstructureView && (
              <li className={location.pathname === "/deactiveinstructure" ? "active" : ""}>
                <NavLink to="/deactiveinstructure">
                  <i className="bx bxs-shopping-bag-alt"></i>
                  <span className="text">Deactive Instructure</span>
                </NavLink>
              </li>
            )
          }
          {
            roleView && (
              <li className={location.pathname === "/role" ? "active" : ""}>
                <NavLink to="/role">
                  <i className="bx bxs-shopping-bag-alt"></i>
                  <span className="text">Role</span>
                </NavLink>
              </li>
            )
          }
          {
            userView && (
              <li className={location.pathname === "/user" ? "active" : ""}>
                <NavLink to="/user">
                  <i className="bx bxs-shopping-bag-alt"></i>
                  <span className="text">User</span>
                </NavLink>
              </li>
            )
          }

        </ul>

        <ul className="side-menu">
          <li className={location.pathname === "/dashboard4" ? "active" : ""}>
            <NavLink to="/dashboard">
              <i className="bx bxs-cog"></i>
              <span className="text">Settings</span>
            </NavLink>
          </li>
          <li className={location.pathname === "/dashboard5" ? "active" : ""}>
            <NavLink className="logout">
              <i className="bx bxs-log-out-circle"></i>
              <span className="text">Logout</span>
            </NavLink>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Sidebar;
