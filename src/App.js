import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Vendor from "./pages/Vendor";
import { ProtectedRoute } from "./pages/ProtectedRoute"

function App() {
    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/reset" element={<Reset />} />
                    <Route exact path="/dashboard" element={<Dashboard />} />
                    <Route exact path="/admin" element={<Admin />} />
                    <Route exact path="/Vendor" element={<Vendor />} />
                </Routes>
            </Router>
        </div>
    );
}
export default App;