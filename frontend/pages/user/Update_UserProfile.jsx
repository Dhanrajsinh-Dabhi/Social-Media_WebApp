import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Update() {
    const location = useLocation();
    const navigate = useNavigate();

    const [user, setUser] = useState(location.state || {
        username: '',
        firstname: '',
        lastname: '',
        mobileNo: '',
        email: '',
        followers: '',
        following: '',
        createdAt: '',
        updatedAt: '',
        userID: ''
    });

    useEffect(() => {
        if (location.state.user) {
            setUser(location.state.user);
        }
    }, [location.state.user]);


    const updateUser = (updatedUser) => {
        const uID = user.userID;
        axios
            .patch(`http://localhost:2000/user/profile/update/${uID}`, updatedUser)
            .then((response) => {
                if (response.data.ok) {
                  
                    const user_data = response.data.updatedUser;
                    // console.log('updated data=>',user_data);
                    setUser({
                        ...user,
                        username: user_data.username,
                        firstname: user_data.firstname,
                        lastname: user_data.lastname,
                        mobileNo: user_data.mobileNo,
                        email: user_data.email,
                        followers: user_data.followers,
                        following: user_data.following,
                        createdAt: user_data.createdAt,
                        updatedAt: user_data.updatedAt,
                        userID: user_data._id,
                    });
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your Profile has been updated",
                        showConfirmButton: false,
                        timer: 1500
                      });
                    console.log('User updated successfully!');

                    navigate('/profile');
                }
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
    };

    const handleInputChange = (event) => {
        console.log('handleInputChange called');
        const { name, value } = event.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateUser(user);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Update</h1>
                <label>username:</label>
                @<input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleInputChange}
                />
                <br />
                <label>First name:</label>
                <input
                    type="text"
                    name="firstname"
                    value={user.firstname}
                    onChange={handleInputChange}
                />
                <br />
                <label>Last name:</label>
                <input
                    type="text"
                    name="lastname"
                    value={user.lastname}
                    onChange={handleInputChange}
                />
                <br />
                <label>Mobile No:</label>
                <input
                    type="text"
                    name="mobileNo"
                    value={user.mobileNo}
                    onChange={handleInputChange}
                />
                <br />
                <label>Email:</label>
                <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                />
                <br />
                <button type="submit" className="btn btn-outline-success">Update</button>
            </form>
        </div>
    );
}

export default Update;