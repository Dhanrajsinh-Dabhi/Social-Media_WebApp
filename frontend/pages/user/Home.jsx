import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import UploadProgress, { UploadStatus } from 'react-upload-progress';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CameraOutlined } from '@ant-design/icons';


function Home() {
    const [likes, setLikes] = useState(0);
    const [isLiked, setisLiked] = useState(false);
    const [postLikes, setPostLikes] = useState({});

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showInput, setShowInput] = useState(false);

    const [cms, setCms] = useState([]);
    const [showComments, setShowComments] = useState(false);

    const [postedBy, setPostedBy] = useState([]);

    const [progress, setProgress] = useState(0);

    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
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

    const [data, setData] = useState({
        caption: '',
        uId: ''
    });
    const [image, setImage] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('JWT_Token');
        if (token) {
            axios.get('http://localhost:2000/user/auth', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    if (response.data.ok) {
                        const user_data = response.data.isVerified;
                        setUser({
                            username: user_data.username,
                            email: user_data.email,
                            mobileNo: user_data.mobileNo,
                            userID: user_data._id
                        });

                        // setData({ userID: user.userID});
                        // console.log(data.userID);
                    }
                })
                .catch((error) => {
                    console.error("gadbad hai kuch:", error);
                });
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('JWT_Token');
        if (token) {
            axios.get('http://localhost:2000/user/get-all-posts', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((response) => {
                    if (response.data.ok) {
                        setPosts(response.data.posts);
                        setLoading(false);
                        // console.log(response.data.posts)

                    }
                })
                .catch((error) => {
                    console.error("gadbad hai kuch:", error);
                });
        }

    }, [])
    // useEffect(() => {
    //     const token = localStorage.getItem('JWT_Token');
    //     if (token) {

    //         axios.get(`http://localhost:2000/user/get-all-comments/${postId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         })
    //             .then((response) => {
    //                 if (response.data.ok) {
    //                     setCms(response.data.comment);
    //                     // setLoading(false);
    //                     console.log('cms:', response.data.comment)

    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error( error);
    //             });
    //     }
    // }, [])


    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }

    const handleCaptionChange = (value) => {
        setData({ ...data, caption: value.trim() });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // const handleProgress = (progressEvent) => {
    //     setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
    // };





    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.caption) {

            Swal.fire({
                // title: "alert!!",
                text: "Please fill both caption and image fields",
                icon: "info"
            });
            return;
        }
        const uID = user.uId;
        const formData = new FormData();
        formData.append('image', image);
        formData.append('caption', data.caption);
        formData.append('uId', uID);
        // console.log(formData.image)
        // JSON.stringify(data)
        try {
            const response = await axios.post('http://localhost:2000/user/create-post', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('JWT_Token')}`,
                    // 'Content-Type': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.ok) {
                console.log(response.data);
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                    // transition: Flip,
                });
            }
            else {
                toast.error(response.data.error, {
                    position: "top-right",
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
        } catch (error) {
            console.error("Error:", error);

        }
    };



    const handleEditPost = async (post) => {
        console.log(post);
        navigate('/post/update', { state: { post } });

    };





    const handleDeletePost = async (postId) => {
        try {
            // Swal.fire({
            //     title: "Are you sure?",
            //     text: "You won't be able to revert this!",
            //     icon: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#3085d6",
            //     cancelButtonColor: "#d33",
            //     confirmButtonText: "Yes, delete it!"

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire({
                        title: "Deleted!",
                        text: "Your Post has been deleted.",
                        icon: "success"
                    });

                    const response = axios.delete(`http://localhost:2000/user/post/delete-post/${postId}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('JWT_Token')}` },
                    });
                    // console.log(response.data);
                    console.log("Post deleted!");
                    setPosts(posts.filter((post) => post._id !== postId)); // Update posts state    

                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your Post is safe :)",
                        icon: "error"
                    });
                    console.log("Post not deleted.");
                }
            });

        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    // useEffect(() => {
    //     // axios.get(`http://localhost:2000/user/posts/${postId}/comments`)
    //     //   .then(response => setComments(response.data));
    //     axios.get(`http://localhost:2000/user/posts/${postId}/likes`)
    //       .then(response => setLikes(response.data));
    //   }, [posts]);

    const handleLikeClick = async (postId) => {
        const currentLikes = postLikes[postId] || 0;
        const isCurrentlyLiked = currentLikes > 0;
        if (!isCurrentlyLiked) {
            setPostLikes((prevPostLikes) => ({ ...prevPostLikes, [postId]: currentLikes + 1 }));
        } else {
            setPostLikes((prevPostLikes) => ({ ...prevPostLikes, [postId]: currentLikes - 1 }));
        }

        if (!isLiked) {
            setLikes(likes + 1);
            setisLiked(true);
            try {
                const uID = user.userID;
                const response = await axios.patch(`http://localhost:2000/user/post/${uID}/like/${postId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('JWT_Token')}` },
                    'Content-Type': 'application/json',

                });
                console.log(response);
                if (response.data.ok) {
                    console.log(response.data);
                    // toast.success(response.data.message, {
                    //     position: "top-right",
                    //     autoClose: 5000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    //     progress: undefined,
                    //     theme: "light"
                    // transition: Flip,
                    // });
                }
                else {
                    // toast.error(response.data.error, {
                    //     position: "top-right",
                    //     autoClose: 5000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: true,
                    //     draggable: true,
                    //     progress: undefined,
                    //     theme: "light"
                    //     // transition: Bounce,
                    // });
                    console.log(response.data.error)
                }
            }
            catch (error) {
                console.error("Error liking post:", error);
            }
        } else {
            setLikes(likes - 1);
            setisLiked(false);
            try {
                const uID = user.userID;
                const response = await axios.delete(`http://localhost:2000/user/post/${uID}/like/${postId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('JWT_Token')}` },
                    'Content-Type': 'application/json',

                });
                console.log(response);
                if (response.data.ok) {
                    console.log(response.data);
                }
                else {
                    console.log(response.data.error)
                }
            }
            catch (error) {
                console.error("Error delete like :", error);
            }
        }


    };



    // const handleCommentSubmit = async (event) => {
    //     event.preventDefault();
    //     try {
    //         const response = await axios.post(`/api/posts/${postId}/comments`, { content: newComment, createdBy: user._id });
    //         setComments([...comments, response.data]);
    //         setNewComment('');
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };


    // useEffect(() => {
    //     const token = localStorage.getItem('JWT_Token');
    //     if (token) {

    //         axios.get(`http://localhost:2000/user/get-all-comments/${postId}`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         })
    //             .then((response) => {
    //                 if (response.data.ok) {
    //                     setCms(response.data.comment);
    //                     // setLoading(false);
    //                     // console.log('cms:', response.data.comment)

    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //             });
    //     }
    // }, [postId])

    const handleCommentClick = () => {
        setShowInput(true);
    };

    const handleCommentSubmit = async (postId) => {
        // e.preventDefault();
        const newCommentObject = {
            text: newComment
            // postedBy: postId
            // timestamp: new Date().getTime(),
        };
        // setComments([...comments, newCommentObject]);
        // setNewComment('');
        // setShowInput(false);
        // console.log('postID:', postId)




        try {
            const uID = user.userID;
            const response = await axios.post(`http://localhost:2000/user/post/${uID}/comment/${postId}`, { text: newComment }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('JWT_Token')}` },
                'Content-Type': 'application/json',

            });

            if (response.data.ok) {
                setCms([...cms, newCommentObject]); // Update cms with the new comment
                setNewComment('');
                setShowInput(false);
            } else {
                console.log(response.data.error);
            }

        }
        catch (err) {
            console.error("error happend during post comment");
        }

    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const viewComments = async (postId) => {
        try {
            const token = localStorage.getItem('JWT_Token');
            if (token) {

                axios.get(`http://localhost:2000/user/get-all-comments/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })

                    .then((response) => {
                        if (response.data.ok) {
                            setComments(response.data.comment);
                            setPostedBy(response.data.users);
                            setShowComments(true);
                            // console.log(response.data.comment);
                            console.log(response.data.users);



                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });


            }
        }
        catch (err) {
            console.error("error happend during view comments");
        }
    }



    return (
        <div>
            <h3>Create a Post</h3>
            <center>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className='w-100 h-200'>
                            <ReactQuill
                                className='w-50 h-200'
                                theme="snow"
                                value={data.caption}
                                onChange={(value) => handleCaptionChange(value)}
                                placeholder="Write a caption..."
                                
                            />
                        </div>

                        <div>
                            <CameraOutlined />
                            <input type="file" accept='images/*' name='image' onChange={handleImageChange} multiple />
                        </div>
                        {/* {image && (
                            <UploadProgress
                            url={`http://localhost:2000/user/create-post`}
                                progress={progress}
                                onProgress={handleProgress}
                                onComplete={() => console.log('Upload complete!')}
                            />
                        )} */}

                        <div>

                            <button type="submit" className="btn btn-outline-primary">Post</button>

                        </div>

                    </form>
                </div>
                <div>
                    <h3>users posts</h3>
                    <div>
                        <center >
                            {posts.map((post) => (

                                <div key={post._id}>

                                    {/* <p>{post._id}</p>
    <p>Posted by: {post.postedBy.username}</p>
    <img src={post.image.url} alt={post.postedBy.name} />
    <div dangerouslySetInnerHTML={{ __html: post.caption }} />

    <p>likes: {post.like.length}</p>
    <p>comment: {post.comment.length}</p>

    {user.userID === post.postedBy._id && (
        <div>
            <button className="btn btn-outline-primary" onClick={() => handleEditPost(post)}>Edit</button>
            <button className="btn btn-outline-danger" onClick={() => handleDeletePost(post._id)}>Delete</button>
        </div>
    )} */}




                                    {/* <p>created at: {post.createdAt}</p> */}

                                    {/* <p>----------------------------------------------------</p> */}
                                    <div>
                                        <div className="card mx-auto p-2" style={{ width: '400px' }}>
                                            <p>Posted by: {post.postedBy.username}</p>
                                            <img
                                                className="card-img-top"
                                                src={post.image.url}
                                                alt={post.postedBy.name}
                                                style={{ width: '100%', height: 'auto' }}
                                                loading="fast"
                                            />
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <img
                                                            src={post.postedBy.profilePicture}
                                                            alt={post.postedBy.name}
                                                            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                                        />
                                                        <span style={{ marginLeft: '10px' }}>{post.postedBy.name}</span>
                                                    </div>
                                                    <div>
                                                        <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
                                                    </div>
                                                </div>
                                                <div dangerouslySetInnerHTML={{ __html: post.caption }} />
                                                <div className="d-flex justify-content-between">
                                                    <div>

                                                        {/* <span style={{ marginLeft: '10px' }}><button onClick={() => handleLikeClick(post._id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                                        </svg></button>{post.like.length} likes</span> */}

                                                        {/* {isLiked ? (
                                                            <span style={{ marginLeft: '10px' }}><button onClick={() => handleLikeClick(post._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill " viewBox="0 0 16 16">
                                                                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                                                            </svg></button>{post.like.length} likes </span>
                                                        )


                                                            :
                                                            (
                                                                <span style={{ marginLeft: '10px' }}><button onClick={() => handleLikeClick(post._id)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                                                </svg></button>{post.like.length} likes</span>
                                                            )

                                                        } */}


                                                        
                                                         {
                                                             postLikes[post._id] > 0 


                                                                ? (
                                                                    <span style={{ marginLeft: '10px' }}>
                                                                        <button onClick={() => handleLikeClick(post._id)}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                                                                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
                                                                            </svg></button>

                                                                    </span>
                                                                )
                                                                :
                                                                (
                                                                    <span style={{ marginLeft: '10px' }}>
                                                                        <button onClick={() => handleLikeClick(post._id)}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                                                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                                                            </svg>
                                                                        </button>

                                                                    </span>
                                                                )}
                                                        <span style={{ marginLeft: '10px' }}>{post.like.length} likes</span>


                                                            
                                                            


                                                    </div>
                                                    <div>

                                                        <span style={{ marginLeft: '10px' }}>{post.comment.length} comments</span>
                                                        {/* <ul>
                                                             {cms.filter(comment => comment.postId === post._id).map((comment, index) => (
                                                                <li key={index}>{comment.text}</li>
                                                            ))} 

                                                        </ul> */}
                                                        {showComments ? (
                                                            <ul>
                                                                {post.comment.map((comment, index) => (
                                                                    <li key={index}>{comment.text}   -<b>{postedBy[index]}</b></li>
                                                                    ))}
                                                                    
                                                                {/* {comments.map((comment, index) => (
                                                                    <li key={index}>{comment.text}   -<b>{postedBy[index]}</b></li>
                                                                ))} */}
                                                            </ul>
                                                        ) :
                                                            (
                                                                <button onClick={() => { viewComments(post._id) }}>view Comments</button>
                                                            )}

                                                        {showInput ? (
                                                            <div>
                                                                <ul>
                                                                    {cms.filter(comment => comment.postId === post._id).map((comment, index) => (
                                                                        <li key={index}>{comment.text} </li>
                                                                    ))}


                                                                </ul>

                                                                <form onSubmit={() => { handleCommentSubmit(post._id) }}>
                                                                    <input
                                                                        type="text"
                                                                        value={newComment}
                                                                        onChange={handleCommentChange}
                                                                        placeholder="Add a comment..."
                                                                    />
                                                                    <button type="submit" >Comment</button>
                                                                </form>
                                                            </div>
                                                        ) : (

                                                            <button onClick={handleCommentClick}>Add a comment</button>
                                                        )}
                                                    </div>
                                                    {/* <div>
                                                        <br />  <button onClick={() => handleLikeClick(post._id)}>{likes}like</button>
                                                    </div> */}

                                                    <br>
                                                    </br>

                                                    <br />
                                                </div>
                                            </div>
                                            {
                                                user.userID === post.postedBy._id && (
                                                    <div>
                                                        <button className="btn btn-outline-primary" onClick={() => handleEditPost(post)}>Edit</button>

                                                        <button className="btn btn-outline-danger" onClick={() => handleDeletePost(post._id)}>Delete</button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>


                            ))
                            }
                        </center >

                    </div >
                </div >
            </center >
        </div >
    );
}

export default Home;