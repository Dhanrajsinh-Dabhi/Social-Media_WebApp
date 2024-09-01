const { auth_me } = require('../authController')
const User = require('../../Models/userModel');
const mongoose = require('mongoose');
const Post = require('../../Models/Post');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const authenticate = require('../../Middleware/authMiddleware');
const { response } = require('express');

const cloudinary = require('../../config/cloudinary_confif');


const Home = (req, res) => {

    // const token = req.header('Authorization');
    // if (!token) {
    //     return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    // }
    // //hear removing pre-fix  bearer from token
    // const jwtToken = token.replace("Bearer", "").trim();
    // // console.log("token from auth middleware: ", jwtToken);

    // try {

    //     const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    //     if (isVerified) {

    //         return res.json({ messsage: "home route from backedend", isVerified, ok: true });

    //     }

    try {
        const uID = req.user;
        console.log(uID);
        if (!uID) {
            return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });


        }



    }
    catch (error) {
        return res.status(401).json({ message: "Unauthorized. Invalid token" });
    }
};


const Messages = (req, res) => {


    return res.json({ messsage: "message route from backedend" });

};
const Profile = async (req, res) => {
    try {

        // const find_id = req.params.uID;
        const find_id = req.uId;
        console.log(find_id);
        const IsUser = User.findById(find_id).then((userFound) => {
            console.log('profile route user found:', userFound);
            res.json({ userFound, ok: true }); // Send JSON response
        }).catch((err) => {

            console.log(err)
        });
    } catch (error) {
        console.error('Error in Profile function:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

};

const ProfileUpdate = async (req, res) => {
    try {
        const id = req.params.uID;
        const body = req.body;
        console.log(id, " !! ", body);
        const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
        if (!updatedUser) {
            console.log('profile update nahi hui ')
            return res.status(404).json({ ok: false, message: 'User not found' });
        }
        console.log("profile update ho gai ");
        res.json({ ok: true, message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};





const PostByUser = async (req, res) => {

    try {
        const uId = req.uId;

        console.log('uid:', uId)
        const user = await User.findById(uId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // const userModelData=await User.findById(uId);
        // console.log('name:!!',userModelData);

        const posts = await Post.find({ postedBy: uId }).populate('postedBy',
            '_id name caption  url like comment createdAt  updatedAt username firstname').sort({ createdAt: -1 }).limit(10);;
        console.log(posts)
        res.json({ posts, ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error fetching posts' });
    }


}
const CreatePost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const uId = req.uId;

        console.log(image);
        console.log(caption, "!!", uId);


        if (!image) {
            return res.status(400).send({ error: 'Image is required' });
        }
        // console.log(image)
        const user = await User.findById(uId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        // console.log(image)
        const result = await cloudinary.uploader.upload(image.path, {
            upload_preset: "Posts",
            width: 300//default was 300
            // crop:'scal'
        });
        console.log(result);
        const newPost = new Post({
            caption,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },
            postedBy: user._id,
        });

        await newPost.save();
        return res.json({ message: 'Post created successfully', ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Error creating post' });
    }
};


const getAllPosts = async (req, res) => {
    const uId = req.uId;
    try {
        // const posts = await Post.find().populate('postedBy', '_id name').populate('like', '_id name').populate('comment.postedBy', '_id name');
        const posts = await Post.find().populate('postedBy',
            '_id name caption  url like comment createdAt  updatedAt username firstname').sort({ createdAt: -1 }).limit(10);
        return res.json({ posts, ok: true });
    } catch (error) {
        return res.status(400).json({ error: 'Error fetching posts', error });
    }
};

const UpdatePost = async (req, res) => {
    const id = req.params.postId;
    try {

        let updateObj = {};
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                upload_preset: 'Posts',
                width: 300
            });
            updateObj.image = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        if (req.body) {
            updateObj.caption = req.body.content;
        }
        console.log('update obj=>', updateObj);
        const updatedPost = await Post.findByIdAndUpdate(id, updateObj, { new: true });

        if (!updatedPost) {
            console.log('Post update nahi hui ')
            return res.status(404).json({ ok: false, error: 'User not found' });
        }
        console.log("post update ho gai ");
        res.json({ ok: true, message: 'post updated successfully', updatedPost });
    }
    catch (error) {
        console.error('Error updating post:', error);
        return res.status(400).json({ error: 'Error updating post', error });

    }

};

const DeletePost = async (req, res) => {
    const id = req.params.postId;
    try {
        console.log("DeletePost api:", id);
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            console.log('Post not found');
            return res.status(404).json({ ok: false, message: 'Post not found' });
        }
        console.log("post deleted successfully");
        res.json({ ok: true, message: 'post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(400).json({ message: 'Error deleting post' });
    }
};


const SearchUser = async (req, res) => {
    const uname = req.body.username;
    console.log('uname:', uname);
    try {
        const user = await User.findOne({ username: uname })
        // console.log(user);
        if (!user) {
            console.log('searched user not found')
            return res.send({ message: 'searched user not found', ok: false })
        }

        const uID = user._id;
        console.log(uID)


        const posts = await Post.find({ postedBy: uID })
            .lean()
            .exec();

        posts.forEach(async (post) => {
            post.postedBy = await User.findById(post.postedBy).select(' username caption image like ');
        });




        console.log("searched user found=>", user, "!!", posts);
        res.json({ message: "searched user found", user, posts, ok: true });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error searching users' });
    }
};

// const LikeUpdate=async(req,res)=>{
//     // const postid=req.params.id;
//     const id = req.params.postId;
//     try {
//         console.log("Post update id:", id);
//         const update_like = await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true } );
//         // if (!update_like) {
//         //     console.log('Post not found');
//         //     return res.status(404).json({ ok: false, message: 'Post not found' });
//         // }
//         console.log("like updated successfully");
//         res.json({ ok: true, message: 'like updated successfully' });
//     } catch (error) {
//         console.error('Error deleting post:', error);
//         res.status(400).json({ message: 'Error updating  post' });
//     }
// };

const addLike = async (req, res) => {
    const pID = req.params.postId;
    const uID = req.params.uID;
    try {
        // console.log("like update id:", pID);
        const post = await Post.findById(pID);

        if (post.like.includes(uID)) {
            return res.status(400).json({ error: 'User has already liked this post' });
        }
        else {


            const update_like = await Post.findByIdAndUpdate(pID, { $addToSet: { like: uID } }, { new: true });
            console.log("like increas successfully");
            res.json({ ok: true, message: 'like add successfully' });
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(400).json({ oj: false, message: 'Error increasing like' });
    }
};


const removeLike = async (req, res) => {
    const pID = req.params.postId;
    const uID = req.params.uID;
    try {
        // console.log("like update id:", pID);
        // Check if user has not liked the post
        const post = await Post.findById(pID);

        if (!post.like.includes(uID)) {
            return res.status(400).json({ error: 'User has not liked this post' });
        }
        else {


            const update_like = await Post.findByIdAndUpdate(pID, { $pull: { like: uID } }, { new: true });
            console.log("like decrease successfully");
            res.json({ ok: true, message: 'like remove successfully' });
        }
    } catch (error) {
        console.error('Error updating like:', error);
        res.status(400).json({ ok: false, message: 'Error updating like' });
    }
};

const addComment = async (req, res) => {
    const pID = req.params.postId;
    const uID = req.params.uID;
    const text = req.body.text;

    if (!uID) {
        return res.status(400).send({ ok: false, message: 'User ID is required' });
    }

    if (!text || typeof text !== 'string') {
        return res.status(400).send({ ok: false, message: 'Comment text is required' });
    }


    try {


        const post = await Post.findById(pID);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }


        const newComment = {
            text,
            postedBy: uID
        };

        post.comment.push(newComment);
        await post.save();

        res.send({ ok: true, message: 'Comment created successfully' });

    }
    catch (err) {
        console.error("error");
        res.status(500).send({ ok: false, message: 'Error creating comment' });
    }
}

const allComment = async (req, res) => {
    const pID = req.params.postId;

    try {


        const post_comment = await Post.findById(pID).populate('comment');
        if (!post_comment) {
            return res.status(404).send({ ok: false, message: 'Post not found' });
        }



        const comment= post_comment.comment;
        // console.log(comment);   

        const users = await Promise.all(comment.map(async (commentt) => {
            const postedBy_ID = commentt.postedBy;
            const user = await User.findById(postedBy_ID);
            return user.username;
        }));

        console.log("posted by:", users);
        console.log("done")
        return res.json({ comment,users, ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, message: 'Error fetching comments' });
    }
}

module.exports = { Home, Messages, Profile, ProfileUpdate, CreatePost, PostByUser, getAllPosts, UpdatePost, DeletePost, SearchUser, addLike, removeLike, addComment, allComment };