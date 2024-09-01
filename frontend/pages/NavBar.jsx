import { useState } from 'react';

import { BrowserRouter as Router, Link, Navigate } from "react-router-dom";
import Home from './user/Home';
import Messages from './user/Messages';
import User_Profile from './user/UserProfile';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function NavBar() {
  const [count, setCount] = useState(0);
  const { authUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const [search, setSearch] = useState({
    username: ''
  });
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('JWT_Token');
    setIsLoggedIn(false);
    navigate('/login');
  };


  const handleInputChange = (e) => {
    setSearch({username:e.target.value});

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('JWT_Token');
    if (token) {
      const uname=search.username;
      axios.post(`http://localhost:2000/user/search`, search, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.data.ok) {
            // const user=response.data.user;
            // const userData = user;
            // const username=user.username;
            // console.log(user);


            const { user, posts } = response.data;
    
            const userData = response.data.user;
            const username=userData.username;
            // console.log(userData,"!!",posts);
            navigate(`/user/${username}`,{ state: { user ,posts} });
            // console.log(response.data);
          }
          else{
            console.log (response.data);
            Swal.fire({
              position: "top-center",
              icon: "error",
              title: "user not found",
              showConfirmButton: false,
              timer: 1500
            });
          }
        })
        .catch(err => console.log(err))
      }

    }
    return (
      <>
        <div className="full-width">

          {/* <nav>
            <ul>
              <li>
                <Link to="/register">Registration </Link>
              </li>
              <li>
                <Link to="/login">Login </Link>
              </li>
              <li>
                <Link to="/">home </Link>
              </li>
              <li>
                <Link to="/messages">messages </Link>
              </li>
              <li>
                <Link to="/profile">profile </Link>
              </li>



            </ul>

          </nav> */}

          <div>
            <div >
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />

              <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark" >
                <div className="container-fluid">
                  <a className="navbar-brand" href="#">Navbar</a>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>



                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                      </li>
                      {/* <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/messages">Messages</Link>
                        
                      </li> */}
                      <li className="nav-item">
                        <Link className="nav-link " aria-current="page" to="/profile">User-Profile</Link>
                      </li>

                      {/* <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                          About profile
                        </a>



                        <ul className="dropdown-menu">
                          {/* <li><a className="dropdown-item" href="#">logout</a></li> *
                          <Link className="dropdown-item " aria-current="page" to="/user-profile">User-Profile</Link>
                        </ul>
                      </li> */}





                    </ul>
                    <form className="d-flex" role="search" onSubmit={handleSubmit}>
                      <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={search.username} onChange={handleInputChange} />
                      <button className="btn btn-outline-success" type="submit" >Search</button>
                    </form>
                  </div>


                  {isLoggedIn ? (
                    <><button className="btn btn-outline-danger" onClick={handleLogout}>
                      Logout
                    </button>
                    </>
                  ) : (
                    <>
                      <Link className="btn btn-outline-primary" to="/login">
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </nav>

            </div>
          </div>
        </div>
      </>

    );
  }

  export default NavBar;