import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../../pages/admin/Dashboard";
import AdminAuthGuard from "../../shared/guards/AdminAuthGuard";

const MainAr = () => {
  return (
    <>
      <Routes>
        <Route
          exact
          path="/dashboard"
          element={<AdminAuthGuard><Dashboard /></AdminAuthGuard>}
        ></Route>
      </Routes>
    </>
  );
};

export default MainAr;
