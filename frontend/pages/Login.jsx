import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

function Login() {

    const { authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn } = useAuth();

    const navigate = useNavigate();




    const [LoginInputs, setLoginInputs] = useState({
        username: "",
        password: ""
    });


    useEffect(() => {
        const token = localStorage.getItem('JWT_Token');
        if (token) {
            axios.get('http://localhost:2000/user/auth', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    setAuthUser(response.data);
                    setIsLoggedIn(true);
                })
                .catch((error) => {
                    console.error(error);
                    localStorage.removeItem('JWT_Token');
                });
        }
    }, []);

    const HandleLoginchange = (e) => {
        setLoginInputs({ ...LoginInputs, [e.target.name]: e.target.value });
    };




    const HandleLoginSubmit = async (e) => {
        e.preventDefault();
        if (LoginInputs.username.length < 3) {
            alert('username must be 3 character');
            return;
        }

        if (LoginInputs.password.length < 8) {
            alert('Please ensure password is at least 8 characters ');
            return;
        }



        const data = JSON.stringify(LoginInputs);


        try {
            const response = await axios.post('http://localhost:2000/user/login', LoginInputs, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log('Response from server:', response.data);
            localStorage.setItem('JWT_Token', response.data.token);

            // localStorage.setItem('userId', response.data.userId);

            // const server_response= response.json();
            // console.log("response from server ",server_response);
            setAuthUser(LoginInputs.username);
            setIsLoggedIn(true);


            //userid received from the server
            // const userId=response.data.userId;
            // console.log(userId);
            if(response.data.ok)
            {

            
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Signed in successfully"
              });
            }
            


            navigate('/');


        } catch (err) {
            toast.error(err.response?.data?.message);
            console.error("something wrong")
        }

    };

    return (
        <>
            <div>
                <h1> Login page</h1>



                <div>
                    <center>
                        <br></br>
                        <form onSubmit={HandleLoginSubmit}>
                            <table border="0" >
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="mb-3">
                                                <label className="form-label"> username :   </label>
                                            </div>
                                        </td>
                                        <td>

                                            <div className='mb-3'>
                                                @<input type="text" className=" width-50" name="username" value={LoginInputs.username} onChange={HandleLoginchange} placeholder="enter your username " />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="mb-3">
                                                <label className="form-label">Password  : </label>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="mb-3">
                                                <input type="password" className=" width-50" name="password" value={LoginInputs.password} onChange={HandleLoginchange} placeholder="enter your password" />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <button type='submit' className="btn btn-primary" disabled={!LoginInputs.username || !LoginInputs.password} >Login</button>
                            </div>
                            <>
                                Don't have any account? <Link to='/register'>Register Hear</Link>
                            </>
                        </form>


                    </center>
                </div>
            </div>

        </>
    );
}

export default Login;