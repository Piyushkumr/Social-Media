import React, { useEffect, useState } from 'react'
import './ResetPassword.css'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { resetPassword } from '../../Action/User';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const params = useParams();

    const { error, message, loading } = useSelector((state) => state.like);

    const [newPassword, setNewPassword] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(resetPassword(params.token, newPassword));
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
    }, [error, message, dispatch]);

    return (
        <div className='resetPassword'>
            <form className='resetPasswordForm' onSubmit={submitHandler}>
                <Typography variant='h3' style={{ padding: '2vmax' }}>PASSWORD</Typography>

                <input className='resetPasswordInputs' type='password' placeholder='New Password' required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                <Link to='/'>
                    <Typography>Login!</Typography>
                </Link>
                <Typography>Or</Typography>
                <Link to='/forgot/password'>
                    <Typography>Request Again!</Typography>
                </Link>

                <Button disabled={loading} type='submit'>Reset Password</Button>
            </form>
        </div>
    )
}

export default ResetPassword;