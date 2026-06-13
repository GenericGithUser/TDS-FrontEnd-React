import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Transmissions from './pages/Transmissions'
import Records from './pages/Records'
import CreateEditRecord from './pages/CreateEditRecords'
import CreateEditTrans from './pages/CreateEditTrans'
import ProtectedRoute from './components/ProtectedRoute'
import Users from './pages/Users'
import CreateEditUser from './pages/CreateEditUser'
import ProbTickets from './pages/ProbTickets'
import Branches from './pages/Branches'
import CreateEditBranches from './pages/CreateEditBranches'
import ChangePassword from './pages/ChangePassword'
import ResetPassword from './pages/ResetPassword'
import ForgotPassword from './pages/ForgotPassword'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
  const { user } = useAuth();
  const isMobile =
    navigator.userAgentData?.mobile ??
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );



  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: { background: "#a6eaa3", color: "#fff", fontWeight: "bold" },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ddeaa3",
              color: "#ff5757",
              fontWeight: "bold",
            },
          },
        }}
      />
      {isMobile ? (
        <>
          <h1 style={{ margin: "auto" }}>
            Mobile Is Not Allowed to Use this tool
          </h1>
        </>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.must_change_password ? (
                  <Navigate to="/change-password" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                user.must_change_password ? (
                  <Navigate to="/change-password" replace />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="transmissions" element={<Transmissions />} />
            <Route path="records" element={<Records />} />
            <Route path="records/create" element={<CreateEditRecord />} />
            <Route path="records/edit" element={<CreateEditRecord />} />
            <Route path="home/edit" element={<CreateEditTrans />} />
            <Route path="home/edit/record" element={<CreateEditRecord />} />
            <Route path="transmissions/edit" element={<CreateEditTrans />} />
            <Route
              path="transmissions/edit/record"
              element={<CreateEditRecord />}
            />
            <Route path="transmissions/create" element={<CreateEditTrans />} />
            <Route path="users" element={<Users />} />
            <Route path="users/create" element={<CreateEditUser />} />
            <Route path="users/edit" element={<CreateEditUser />} />
            <Route path="branches" element={<Branches />} />
            <Route path="branches/create" element={<CreateEditBranches />} />
            <Route path="branches/edit" element={<CreateEditBranches />} />
            <Route path="passwordchange" element={<ChangePassword />} />
            <Route path="tickets" element={<ProbTickets />} />
          </Route>
          <Route path="/change-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      )}
    </>
  );
}

export default App
