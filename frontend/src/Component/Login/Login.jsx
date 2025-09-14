import React, { useEffect, useState } from 'react'
import './Login.css'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../Action/User';
import toast from 'react-hot-toast';

const Login = () => {
    const dispatch = useDispatch();
    
    const { error } = useSelector((state) => state.user);
    const { message } = useSelector((state) => state.like);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    }

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "ClearErrors" });
        }
        
        if (message) {
            toast.success(message);
            dispatch({ type: "ClearMessage" });
        }
    }, [dispatch, error, message]);

    return (
        <div className='login'>
            <form className='loginForm' onSubmit={loginHandler}>
                <Typography variant='h3' style={{ padding: '2vmax' }}>Login</Typography>

                <input type='email' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />

                <Link to='/forgot/password'>
                    <Typography>Forgot Password?</Typography>
                </Link>

                <Button type='submit'>Login</Button>

                <Link to='/register'>
                    <Typography>New User?</Typography>
                </Link>
            </form>
        </div>
    )
}

export default Login;