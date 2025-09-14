import React, { useEffect, useState } from 'react'
import './UpdatePassword.css'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updatePassword } from '../../Action/User';

const UpdatePassword = () => {
    const { error, message, loading } = useSelector((state) => state.like);
    const dispatch = useDispatch();

    const [oldPassword, setOldPassword] =useState("");
    const [newPassword, setNewPassword] =useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updatePassword(oldPassword, newPassword));
    }

    useEffect(() => {
            if (error) {
                toast.error(error);
                dispatch({ type: "ClearErrors" });
            }
            if(message){
                toast.success(message);
                dispatch({ type: "ClearMessage"})
            }
        }, [dispatch, error, message]);

  return (
    <div className='updatePassword'>
        <form className='updatePasswordForm' onSubmit={submitHandler}>
            <Typography variant='h3' style={{padding: '2vmax'}}>PASSWORD</Typography>

           <input className='updatePasswordInputs' type='password' placeholder='Old Password' required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
           <input className='updatePasswordInputs' type='password' placeholder='New Password' required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            <Button disabled={loading} type='submit'>Change Password</Button>
        </form>
    </div>
  )
}

export default UpdatePassword;