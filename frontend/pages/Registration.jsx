import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Navigate, useNavigate, Link } from 'react-router-dom';


function Registration() {
    const [Ok, setOk] = useState(false);
    const navigate = useNavigate();

    const [RegisterInputs, setRegisterInputs] = useState({
        firstname: '',
        lastname: '',
        mobileNo: '',
        email: '',
        gender: '',
        username: '',
        password: '',
        confirmPassword: '',
        // user_quetion: '',
        // user_quetion_answer: '',
    });

    const handleRegisterChange = (e) => {
        if (e.target.type === 'radio') {
            setRegisterInputs({ ...RegisterInputs, [e.target.name]: e.target.value });
        } else {

            setRegisterInputs({ ...RegisterInputs, [e.target.name]: e.target.value });
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (
            !RegisterInputs.firstname ||
            !RegisterInputs.lastname ||
            !RegisterInputs.mobileNo ||
            !RegisterInputs.gender ||
            !RegisterInputs.email ||
            !RegisterInputs.password ||
            RegisterInputs.password.length < 8 ||
            RegisterInputs.password !== RegisterInputs.confirmPassword
        ) {
            alert('Please fill in all fields and ensure password is at least 8 characters and matches confirm password');
            return;
        }
        if (RegisterInputs.username.length < 3) {
            alert('username must be 3 character');
            return;
        }


        const data = JSON.stringify(RegisterInputs);
        // console.log(data);

        try {
            const response = await axios.post('http://localhost:2000/user/register', RegisterInputs);
            setOk(response.data.ok);
            console.log('Response from server:', response.data);
            console.log("data sended to server;", RegisterInputs);

            if (response.data.ok) {

                toast.success("Registration successful!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                // Navigate to login page on successful registration
                navigate('/login', { replace: true });
            }
            else {

                if (response.data.message) {

                    toast.error(response.data.message);

                } else {

                    toast.error("An error occurred during registration.");

                }

            }
        } catch (err) {
            toast.error(err.response?.data?.message);
            console.error("something wrong")
        }
    };


    return (
        <>

            <div >

                <center>

                    <br></br>
                    <form onSubmit={handleRegisterSubmit}>

                        <table border="0">
                            <tbody>
                                <tr>
                                    <td><label>First Name:</label></td>
                                    <td><input type="text" name="firstname" value={RegisterInputs.firstname} onChange={handleRegisterChange} /></td>
                                </tr>

                                <tr>
                                    <td> <label>Last Name:</label></td>
                                    <td><input type="text" name="lastname" value={RegisterInputs.lastname} onChange={handleRegisterChange} /></td>
                                </tr>

                                <tr>
                                    <td><label>Mobile NO:</label></td>
                                    <td><input type="text" name="mobileNo" value={RegisterInputs.mobileNo} onChange={handleRegisterChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td> <label>Email:</label></td>
                                    <td> <input type="email" name="email" value={RegisterInputs.email} onChange={handleRegisterChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td> <label>Gender:</label></td>
                                    <td>
                                        <input
                                            type="radio"
                                            value="male"
                                            id="male"
                                            name="gender"
                                            checked={RegisterInputs.gender === 'male'}
                                            onChange={handleRegisterChange}
                                        />
                                        male
                                        <br></br>
                                        <input
                                            type="radio"
                                            value="female"
                                            id="female"
                                            name="gender"
                                            checked={RegisterInputs.gender === 'female'}
                                            onChange={handleRegisterChange}
                                        />
                                        female
                                        <br></br>
                                        <input
                                            type="radio"
                                            value="other"
                                            id="other"
                                            name="gender"
                                            checked={RegisterInputs.gender === 'other'}
                                            onChange={handleRegisterChange}
                                        />
                                        other</td>
                                </tr>
                                <tr>
                                    <td> username: </td>
                                    <td> @<input type="text" name="username" value={RegisterInputs.username} onChange={handleRegisterChange} />
                                    </td>
                                </tr>

                                <tr>
                                    <td><label>Password:</label></td>
                                    <td> <input type="password" name="password" value={RegisterInputs.password} onChange={handleRegisterChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>  <label>Confirm Password:</label></td>
                                    <td> <input type="password" name="confirmPassword" value={RegisterInputs.confirmPassword} onChange={handleRegisterChange} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <label>pick a quetion:</label> */}
                        {/* <select value={Registerinputs.user_quetion} name="city" onChange={handleRegisterChange} >
                    <option value="">select your quetion</option>
                    <option value="What is your Favorite Color?">What is your Favorite Color?</option>
                    <option value="What is you best Friend Name?">What is you best Friend Name?</option>
                    <option value="Which City in you born?">Which City in you born?</option>
                </select>
                <input type='text' name="user_quetion_answer" placeholder='Enter your answer' value={Registerinputs.user_quetion_answer_secret} onChange={handleRegisterChange} /> */}

                        <div>
                            <button
                                type="submit" className="btn btn-primary"
                                disabled={
                                    !RegisterInputs.firstname ||
                                    !RegisterInputs.lastname ||
                                    !RegisterInputs.mobileNo ||
                                    !RegisterInputs.gender ||
                                    !RegisterInputs.email ||
                                    !RegisterInputs.username ||
                                    !RegisterInputs.password ||
                                    RegisterInputs.password !== RegisterInputs.confirmPassword
                                }>
                                Register
                            </button>
                        </div>
                        <div>
                            <span> Already have an account? <Link to='/login'>Login</Link></span>
                        </div>

                    </form>
                </center>
            </div>







        </>
    );
}
export default Registration;
