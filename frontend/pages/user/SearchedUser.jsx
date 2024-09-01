import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function SearchedUser() {
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state.user);

    const [post, setPosts] = useState(location.state.post);



    useEffect(() => {
        if (location.state.user && location.state.posts) {
            setUser(location.state.user);
            setPosts(location.state.posts);
        }
    }, [location.state.user, location.state.posts]);

    if (!user) {
        return <div>User not found</div>;
    }

    // console.log(user);
    // const posts = post[0];
    // console.log(post[0]);

    return (
        <>
            <div>
                <h1>Search Results</h1>
                <p>username : {user.username}</p>
                <p>firstname: {user.firstname}</p>
                <p>lastname: {user.lastname}</p>
                <p>mobileNo : {user.mobileNo}</p>
                <p>email : {user.email}</p>
                {/* <p>followers: {user.followers.length}</p>
                <p>following: {user.following.length}</p> */}
                <p>createdAt: {user.createdAt}</p>
            </div>
            {/* <div>
                {Array.isArray(post) &&post.map((p) => (

                    <div key={p._id}>
                        <h1>Posts:</h1>
                        <p>username:{user.username}</p>
                        <img src={p.image.url} alt={p.postedBy.name} />
                        <div dangerouslySetInnerHTML={{ __html: p.caption }} />

                        <p>likes: {p.like.length}</p>
                        <p>comments: {post.comment? post.comment.length : 'no comment yet'}</p>
                        <p>----------------------------------------------------</p>
                    </div>


                ))}

            </div> */}

            <div>
                <center >
                {Array.isArray(post) &&post.map((post) => (

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
                                <p>Posted by: {user.username}</p>
                                    <img
                                        className="card-img-top"
                                        src={post.image.url}
                                        alt={post.postedBy.name}
                                        style={{ width: '100%', height: 'auto' }}
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
                                                <i className="fa fa-heart" aria-hidden="true"></i>
                                                <span style={{ marginLeft: '10px' }}>{post.like.length} likes</span>
                                            </div>
                                            <div>
                                                <i className="fa fa-comment" aria-hidden="true"></i>
                                                <span style={{ marginLeft: '10px' }}>{post.comment.length} comments</span>
                                            </div>
                                            <br>
                                            </br>

                                            <br />
                                        </div>
                                    </div>
                                    {/* {user.userID === post.postedBy._id && (
                                        <div>
                                            <button className="btn btn-outline-primary" onClick={() => handleEditPost(post)}>Edit</button>

                                            <button className="btn btn-outline-danger" onClick={() => handleDeletePost(post._id)}>Delete</button>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>


                    ))}
                </center>

            </div>
        </>
    )
}

export default SearchedUser;