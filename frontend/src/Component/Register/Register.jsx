import React, { useEffect, useState } from 'react'
import './Register.css'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../Action/User';

const Register = () => {
    const dispatch = useDispatch();

    const {loading, error} = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handelImageChange = (e) => {
        const file = e.target.files[0];

        if(!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be under 10MB.");
            return;
        }

        const Reader = new FileReader();

        Reader.onload = () => {
            if(Reader.readyState === 2){
                setAvatar(Reader.result);
            }
        }
        Reader.readAsDataURL(file);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(registerUser(name, avatar, email, password));
    }

    useEffect(() => {
        if(error){
            toast.error(error);
            dispatch({ type: 'ClearErrors'});
        }
    },[error, dispatch]);

    return (
        <div className='register'>
            <form className="registerForm" onSubmit={submitHandler}>
                <Typography variant='h3' style={{ padding: '1vmax', marginTop: '-1vmax' }}>Register</Typography>

                <Avatar src={avatar} alt="user" sx={{ height: "10vmax", width: "10vmax"}} />
                <input type='file' accept='image/*' onChange={handelImageChange} />
                <input type='text' className='registerInputs' placeholder='Name' required value={name} onChange={(e) => setName(e.target.value)} />
                <input type='email' className='registerInputs' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' className='registerInputs' placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />

                <Link to="/"><Typography style={{ marginTop: '-2vmax'}}>Already have an Account? Login.</Typography></Link>

                <Button disabled={loading} type='submit'>Sign UP</Button>

            </form>
        </div>
    )
}

export default Register;