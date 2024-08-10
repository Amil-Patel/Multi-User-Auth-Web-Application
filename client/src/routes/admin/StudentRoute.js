import React from 'react';
import { Routes, Route } from "react-router-dom";
import Student from '../../pages/admin/Student';
import DeactiveStudents from '../../pages/admin/DeactiveStudents';
import AdminAuthGuard from '../../shared/guards/AdminAuthGuard';

const StudentRoute = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/student"
                    element={
                        <>
                         <AdminAuthGuard>
                            <Student />
                        </AdminAuthGuard>
                        </>
                    }
                ></Route>
                <Route
                    path="/deactivestudent"
                    element={
                        <>
                         <AdminAuthGuard>
                            <DeactiveStudents />
                        </AdminAuthGuard>
                        </>
                    }
                ></Route>
            </Routes>
        </>
    )
}

export default StudentRoute
