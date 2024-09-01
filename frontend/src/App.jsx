import { Profiler, useState } from 'react';
import './App.css';
import NavBar from '../pages/NavBar';
import { BrowserRouter, Routes, Route, Link, useNavigate, Outlet, Navigate } from "react-router-dom";
import User_Profile from '../pages/user/UserProfile';
import Home from '../pages/user/Home';
import Messages from '../pages/user/Messages';
import Registration from '../pages/Registration';
import Login from '../pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import ForgotPassword from '../pages/ForgotPassword';
import { useAuth } from '../context/AuthContext';
import Update from '../pages/user/Update_UserProfile';
import UpdatePost from '../pages/user/UpdateUserPost';
import SearchedUser from '../pages/user/SearchedUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
  
};

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}


function App() {
  const [count, setCount] = useState(0);
  const { isLoggedIn, setAuthUser, setIsLoggedIn } = useAuth();
  return (
    <>
      <div>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"></link>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossOrigin="anonymous"></script>


        <div>
          <NavBar />
        </div>

        <Routes>


          <Route exact path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route exact path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route exact path="/profile" element={<PrivateRoute><User_Profile /></PrivateRoute> } />
          <Route exact path='/profile/update' element={<PrivateRoute><Update  /></PrivateRoute>} />

          <Route exact path="/register" element={<PublicRoute><Registration /></PublicRoute>} />
          <Route exact path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route exact path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route exact path="/post/update" element={<PrivateRoute><UpdatePost /></PrivateRoute>} />
          <Route exact path="/user/:username" element={<PrivateRoute><SearchedUser  /></PrivateRoute>} />


        </Routes>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;