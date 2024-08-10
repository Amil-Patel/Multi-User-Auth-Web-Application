import React from 'react';
import { Routes, Route } from "react-router-dom";
import Role from '../pages/admin/Role'
import Permission from '../pages/admin/Permission';
import AdminAuthGuard from '../shared/guards/AdminAuthGuard';

const RoleRoute = () => {
    return (
        <>
            <Routes>
                <Route path='/role' element={<AdminAuthGuard><Role /></AdminAuthGuard>} />
                <Route path='/permission/:id' element={<AdminAuthGuard><Permission /></AdminAuthGuard>} />
            </Routes>
        </>
    )
}

export default RoleRoute
