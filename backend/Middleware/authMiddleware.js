const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');


const authenticate = async (req, res, next) => {
    
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
            console.log("!!");
        }

        const u_name = isVerified.username;
        console.log("!!", u_name, "!!");

        const userData = await User.findOne({ username: u_name });
        // console.log(userData);
        if (userData) {
            console.log("user found | token valid haii'");
            // res.json({ message: 'token valid haii' });
        }
        else {
            console.log("user not found | User not found");
            // res.status(401).json({ message: "User not found" });
        }
        req.user = userData;
        req.token = token;
        req.uId = userData._id;
        next();



    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized. Invalid token" });
    }
};



module.exports = authenticate;