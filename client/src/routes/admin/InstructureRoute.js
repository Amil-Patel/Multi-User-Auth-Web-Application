import React from 'react';
import { Routes, Route } from "react-router-dom";
import Instructure from '../../pages/admin/Instructure'
import DeactiveInstructures from '../../pages/admin/DeactiveInstructures';
import AdminAuthGuard from '../../shared/guards/AdminAuthGuard';

const InstructureRoute = () => {
    return (
        <>
            <Routes>
                <Route
                    path="/instructure"
                    element={
                        <>
                            <AdminAuthGuard>
                                <Instructure />
                            </AdminAuthGuard>
                        </>
                    }
                ></Route>
                <Route
                    path="/deactiveinstructure"
                    element={
                        <> <AdminAuthGuard>
                            <DeactiveInstructures />
                        </AdminAuthGuard>
                        </>
                    }
                ></Route>
            </Routes>
        </>
    )
}

export default InstructureRoute
