import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';

const App = () => {
  const [token, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Use 'element' prop to pass the component */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* For the home page, conditional rendering */}
        <Route path="/" element={<h1>{token ? 'Logged In' : 'Please Log In'}</h1>} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
