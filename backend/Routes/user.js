const express = require('express');
const router = express.Router();
const { allUsers, userRegistration, userLogin, auth_me } = require('../Controller/authController');
const authenticate = require('../Middleware/authMiddleware');
const { Home, Messages, Profile, ProfileUpdate, CreatePost, PostByUser, getAllPosts ,UpdatePost, DeletePost,SearchUser, addLike, removeLike, addComment, allComment} = require('../Controller/User/protectedUser');


const multer = require('multer');
// const { default: UpdatePost } = require('../../social_media/pages/user/UpdateUserPost');
// const upload = multer({ dest: 'uploads/' });

// router.get('/allUsers',allUsers);
router.get('/allusers', (req, res) => {
    res.send("all users");
    console.log("app running smoothlyy");
});



// const upload = multer({
//     dest: './uploads/',
//     limits: { fileSize: 9000000 }, // 9MB
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//             return cb(new Error('Please upload an image'));
//         }
//         cb(undefined, true);
//     },
// });

const upload = multer({
    dest: './uploads/',
    limits: { fileSize: 9000000 }, // 9MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    },
    filename(req, file, cb) {
        const userId = req.params.id;
        const filename = `user_${userId}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    },
});


router.post('/register', userRegistration);
router.post('/login', userLogin);
router.get('/auth', auth_me);
router.get('/', Home);
router.get('/messages', Messages);
router.get('/profile', authenticate,Profile);
router.patch('/profile/update/:uID', ProfileUpdate);
router.post('/create-post', upload.single('image'),authenticate, CreatePost);
router.get('/users-post',authenticate,PostByUser);
router.get('/get-all-posts',authenticate,getAllPosts);
router.patch('/post/update-post/:postId',upload.single('image'),UpdatePost);
router.delete('/post/delete-post/:postId',DeletePost);
router.post('/search',SearchUser);
router.patch('/post/:uID/like/:postId',addLike);
router.delete('/post/:uID/like/:postId',removeLike);
router.post('/post/:uID/comment/:postId',addComment);
router.get('/get-all-comments/:postId',authenticate,allComment);

// router.get('/posts/:postId/likes',)

module.exports = router;