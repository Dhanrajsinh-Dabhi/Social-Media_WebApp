import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';
import { CameraOutlined } from '@ant-design/icons';



function UpdatePost() {
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(location.state.post);
  const [image, setImage] = useState(location.state.post.image);
  const [user, setUser] = useState({}); // Initialize user state

  useEffect(() => {
    if (location.state.post) {
      setPost(location.state.post);
    }
  }, [location.state.post]);

  const handleInputChange = (event) => {
    // console.log('handleInputChange called');
      setImage(event.target.files[0]);
  };
  const handleQuillChange = (content, delta, source, editor) => {
    // console.log('handleQuillChange called');
    setPost((prevPost) => ({ ...prevPost, caption: content }));
  };
  // console.log(post);

  const updatePost = (e) => {

    console.log("handle update submit");
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    if (post.caption) {
      formData.append('content', post.caption);
    }

    const postId = post._id;
    console.log(postId);

    axios
      .patch(`http://localhost:2000/user/post/update-post/${postId}`, formData)
      .then((response) => {
        if (response.data.ok) {
          console.log('User updated successfully!');
          const post_data = response.data.updatedPost;

          Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Your Post has been updated",
            showConfirmButton: false,
            timer: 1500
          });
          console.log('updated data=>', post_data);
          // console.log(response.data)
          navigate('/');
        }
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updatePost(post);
  };


  return (
    <>
      <h3>edit posts</h3>

      <div>
        <center>
          <form onSubmit={handleSubmit}>

            <img src={post.image.url} alt={post.name} />
            <br />
            <CameraOutlined/>
            <input type="file" accept='images/*' onChange={handleInputChange} />
            <div className='w-200 h-200'>
              <ReactQuill
               className='w-50 h-200'
                theme="snow"
                value={post.caption}
                onChange={handleQuillChange}
                placeholder="Write a caption..."
              />
            </div>

            <br /><br />

            {/* <label>caption:</label><input type="text" value={post.caption} onChange={handleInputChange} /> */}
            <br />
            <button  className="btn btn-outline-success" type="submit">update post</button>
          </form>
        </center>
      </div>
    </>
  );
}

export default UpdatePost;