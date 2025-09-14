import React, { useEffect, useState } from 'react'
import './NewPost.css'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { createNewPost } from '../../Action/Post';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadUser } from '../../Action/User';

const NewPost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, message } = useSelector((state) => state.like);

    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            toast.error("No file selected.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10MB.");
            return;
        }

        const Reader = new FileReader();

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setImage(Reader.result);
            }
        }
        Reader.readAsDataURL(file);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(createNewPost(image, caption));
        dispatch(loadUser());
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "ClearErrors" });
        }
        if (message) {
            toast.success(message);
            dispatch({ type: "ClearMessage" });

            navigate("/");
        }
    }, [dispatch, message, error, navigate]);

    return (
        <div className='newPost'>
            <form className="newPostForm" onSubmit={submitHandler}>
                <Typography variant='h3'>New Post</Typography>
                {image && <img src={image} alt='post' />}
                <input type='file' accept='image/*' onChange={handleImageChange} />
                <input type='text' placeholder='Caption...' value={caption} onChange={(e) => setCaption(e.target.value)} />
                <Button disabled={loading} type='submit'>Post</Button>
            </form>
        </div>
    )
}

export default NewPost;