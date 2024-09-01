const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const user = require('../Middleware/authMiddleware');


const allUsers = (req, res) => {
    res.send("all users");
};

const userRegistration = async (req, res) => {
    const reg_data = req.body;
    console.log(reg_data);
    const username = req.body.username;
    const email = req.body.email;
    const mobileNo = req.body.mobileNo;

    // check if user already exist
    const exist_username = await User.findOne({ username });
    const exist_email = await User.findOne({ email });
    const exist_mobile = await User.findOne({ mobileNo });

    if (exist_username) {
        return res.json({ ok: false, message: 'username is  already exist' });
    }
    else if (exist_email) {
        return res.json({ ok: false, message: 'email is  already exist' });

    }
    else if (exist_mobile) {
        return res.json({ ok: false, message: 'mobile is  already exist' });
    }
    else {


        try {
            const new_user_data = new User(reg_data);
            const save_data = await new_user_data.save();
            console.log("received client data is: ", reg_data)
            return res.json({ ok: true, message: 'registration complate' });


        } catch (error) {
            console.log("REGISTERED FAILED =>", error);
            return res.status(500).json({ ok: false, message: 'error in registration /n registration failed' });

        }

    }

};

const userLogin = async (req, res) => {
    const { username, password } = req.body;

    try {


        const exist_user = await User.findOne({ 'username': username });
        if (!exist_user) {
            console.log('user not founded');
            return res.status(404).json({ ok: false, message: 'User not found' });
        }


        // Check password
        const isValidPassword = await bcrypt.compare(password, exist_user.password);
        if (!isValidPassword) {
            return res.status(401).json({ ok: false, message: 'Incorrect password' });
        }

        console.log("user found /n login successful");


        const token = await exist_user.generateToken();
        const userId = exist_user._id.toString();
        console.log("token: ", token, "\n userId: ", userId);
        res.status(200).json({ ok: true, message: 'Login successful', token, userId, username, password });



    } catch (error) {
        res.status(500).json({ ok: false, message: 'An error occurred during login' });
        console.error(error);
    }
};


const auth_me = async (req, res) => {


    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }
    //hear removing pre-fix  bearer from token
    const jwtToken = token.replace("Bearer", "").trim();
    console.log("token from auth middleware: ", jwtToken);

    try {

        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        if (isVerified) {
            console.log("!!");
            console.log("token verify ho gay this is data: ", isVerified);
         

        }
        

        const u_name = isVerified.username;
        console.log("!!", u_name, "!!");

        const userData = await User.findOne({ username: u_name });
        // console.log(userData);
        if (userData) {
            console.log("user found");
            res.json({ message: 'token valid haii' ,ok:true,isVerified});
        }
        else {
            console.log("user not found");
            res.status(401).json({ message: "User not found" });
        }

    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized. Invalid token" });
    }
};



module.exports = { allUsers, userRegistration, userLogin,auth_me};