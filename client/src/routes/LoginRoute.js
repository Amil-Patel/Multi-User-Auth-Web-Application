import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from '../pages/Login';
import AdminPageGuard from '../shared/guards/AdminPageGuard';

const LoginRoute = () => {
    return (
        <>
            <Routes>
                <Route path='/admin' element={<AdminPageGuard><Login /></AdminPageGuard>} />
            </Routes>
        </>
    )
}

export default LoginRoute
