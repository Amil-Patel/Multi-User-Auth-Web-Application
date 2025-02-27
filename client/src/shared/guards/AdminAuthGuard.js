import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
// import { ROUTES } from '../../utils/constant';

const AdminAuthGuard = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
 
    useEffect(() => {
        // Check if the token exists in cookies using js-cookie
        const token = Cookies.get('token');

        if (token) {
            console.log("token", token);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    if (!isAuthenticated) {
        return <Navigate to={"/admin"} replace />;
    }

    return <div>{children}</div>;
};

export default AdminAuthGuard;
