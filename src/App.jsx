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
import { useAuth } from './context/AuthContext'
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
      {isMobile ? (
        <>
          <h1>Mobile Is Not Allowed to Use this tool</h1>
        </>
      ) : (
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
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
            <Route path="home/edit" element={<CreateEditRecord />} />
            <Route path="transmissions/edit" element={<CreateEditTrans />} />
            <Route path="transmissions/create" element={<CreateEditTrans />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App
