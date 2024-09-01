import { useState,useEffect } from 'react';
import axios from 'axios';

function Messages()
{
    useEffect(() => {
        const token = localStorage.getItem('JWT_Token');
        if (token) {
            axios.get('http://localhost:2000/user/messages', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.error("gadbad hai kuch:", error);

                });

        }
    }, []);
    return(
        <>
        <h1> Messages </h1>
        </>
    );
}

export default Messages;