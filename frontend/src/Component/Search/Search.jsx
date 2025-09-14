import React, { useState } from 'react'
import './Search.css'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../Action/User';
import User from '../User/User';

const Search = () => {
    const dispatch = useDispatch();

    const { users, loading } = useSelector((state) => state.allUsers)

    const [name, setName] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getAllUsers(name));
    }

    return (
        <div className="search">
            <form className='searchForm' onSubmit={submitHandler}>
                <Typography variant='h3' style={{ padding: "2vmax" }}>Search</Typography>

                <input type='text' value={name} placeholder='Name' required onChange={(e) => setName(e.target.value)} />

                <Button type='submit' disabled={loading}>Search</Button>

                <div className="searchResults">
                    {users && users.map((user) => (
                        <User key={user._id}
                            userId={user._id}
                            name={user.name}
                            avatar={user.avatar.url} />
                    ))}
                </div>
            </form>
        </div>
    )
}

export default Search;