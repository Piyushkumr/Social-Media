import React, { useEffect, useState } from 'react'
import './UpdateProfile.css'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, updateProfile } from '../../Action/User';
import Loader from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useSelector((state) => state.user);
    const { loading: updateLoading, error: updateError, message } = useSelector((state) => state.like);

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState("");
    const [avatarPrev, setAvatarPrev] = useState(user.avatar.url)

    const handelImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10MB.");
            return;
        }

        const Reader = new FileReader();

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatarPrev(Reader.result);

                setAvatar(Reader.result);
            }
        }
        Reader.readAsDataURL(file);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await dispatch(updateProfile(name, avatar, email));
        dispatch(loadUser());
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: 'ClearErrors' });
        }
        if (updateError) {
            toast.error(updateError);
            dispatch({ type: 'ClearErrors' });
        }
        if (message) {
            toast.success(message);
            dispatch({ type: 'ClearMessage' });
            navigate("/account");
        }
    }, [error, dispatch, message, updateError, navigate]);

    return (
        loading ? <Loader /> : (
            <div className='updateProfile'>
                <form className="updateProfileForm" onSubmit={submitHandler}>
                    <Typography variant='h3' style={{ padding: '1vmax', marginTop: '-1vmax' }}>Edit Profile</Typography>

                    <Avatar src={avatarPrev} alt="user" sx={{ height: "10vmax", width: "10vmax" }} />
                    <input type='file' accept='image/*' onChange={handelImageChange} />
                    <input type='text' className='updateProfileInputs' placeholder='Name' required value={name} onChange={(e) => setName(e.target.value)} />
                    <input type='email' className='updateProfileInputs' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />

                    <Button disabled={updateLoading} type='submit'>Update</Button>

                </form>
            </div>
        )
    )
}

export default UpdateProfile;