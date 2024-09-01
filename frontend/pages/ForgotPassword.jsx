import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ForgotPassword() {
    const [LoginInputs, setLoginInputs] = useState({
        email: "",
        password: ""
    });

    const HandleLoginchange = (e) => {
        setLoginInputs({ ...LoginInputs, [e.target.name]: e.target.value });
    };

    const HandleLoginSubmit = (e) => {
        e.preventDefault();

        if (LoginInputs.password.length < 8) {
            alert('Please fill in all fields and ensure password is at least 8 characters ');
            return;
        }
        else {
            console.log("login successfully");
            toast.success('🦄 Wow so easy!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
                // transition: Bounce,
            });
        }


    };

    return (
        <>
            <div>
                <h1> Login page</h1>
                {/* <div>
                    <form onSubmit={HandleLoginSubmit}>
                        <label>Email:</label>
                        <input type="email" name="email" value={LoginInputs.email} onChange={HandleLoginchange} />
                        <br></br>
                        <label>Password:</label>
                        <input type="password" name="password" value={LoginInputs.password} onChange={HandleLoginchange} />
                        <br></br>

                        <button type='submit' disabled={!LoginInputs.email || !LoginInputs.password} >Login</button>
                    </form>
                </div> */}

                <div>
                    <center>
                        <br></br>
                        <form onSubmit={HandleLoginSubmit}>
                            <table border="0" >
                                <tbody>
                                <tr>
                                    <td>
                                        <div className="mb-3">
                                            <label className="form-label"> Email address : </label>
                                        </div>
                                    </td>
                                    <td>

                                        <div className='mb-3'>
                                            <input type="email" className=" width-50" name="email" value={LoginInputs.email} onChange={HandleLoginchange} placeholder="enter your email " />
                                        </div>
                                    </td>
                                </tr>
                               
                                </tbody>
                            </table>
                            <div>
                                <button type='submit' className="btn btn-primary" disabled={!LoginInputs.email || !LoginInputs.password} >Login</button>
                            </div>
                        </form>
                    </center>
                </div>
            </div>

        </>
    );
}

export default ForgotPassword;