import React, { createContext, useEffect, useState } from 'react';
const userRolesContext = createContext();
const RoleContext = ({ children }) => {
    const [userRole, setUserRole] = useState(() => {
        const storedUserRole = localStorage.getItem('userRole');
        return storedUserRole ? JSON.parse(storedUserRole) : null;
    });

    useEffect(() => {
        if (userRole) {
            localStorage.setItem('userRole', JSON.stringify(userRole));
        } else {
            localStorage.removeItem('userRole');
        }
    }, [userRole]);

    return (
        <>

            <userRolesContext.Provider value={{ userRole, setUserRole }}>
                {children}
            </userRolesContext.Provider>
        </>
    )
}

export { userRolesContext, RoleContext }

