import React, { useEffect, useState } from 'react'
import './ForgotPassword.css'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../../Action/User';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    const {error, loading, message} = useSelector((state) => state.like);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    }

    useEffect(() => {
        if(error){
            toast.error(error);
            dispatch({type : "ClearErrors"});
        }
        if(message){
            toast.success(message);
            dispatch({type: "ClearMessage"});
        }
    },[dispatch, error, message]);

  return (
    <div className='forgotPassword'>
                <form className='forgotPasswordForm' onSubmit={submitHandler}>
                    <Typography variant='h3' style={{ padding: '2vmax' }}>Forgot Password</Typography>
    
                    <input type='email' className='forgotPasswordInputs' placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
    
                    <Button type='submit' disabled={loading}>Forgot</Button>
                </form>
            </div>
  )
}

export default ForgotPassword;