import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { followAndUnfollowUser, getUserPosts, getUserProfile } from '../../Action/User';
import Loader from '../Loader/Loader';
import toast from 'react-hot-toast';
import Post from '../Post/Post';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import User from '../User/User';

const UserProfile = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { user, loading: userLoading, error: userError } = useSelector((state) => state.userProfile);
  const { user: me } = useSelector((state) => state.user);
  const { error, loading, posts } = useSelector((state) => state.userPosts)
  const { error: followError, message, loading: followLoading } = useSelector((state) => state.like)

  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);

  const followHandler = async () => {
    setFollowing(!following);
    await dispatch(followAndUnfollowUser(user._id));
    dispatch(getUserProfile(params.id));
  }

  useEffect(() => {
    dispatch(getUserProfile(params.id));
    dispatch(getUserPosts(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (me._id === params.id) {
      setMyProfile(true);
    }
    if (user) {
      user.followers.forEach((item) => {
        if (item._id === me._id) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
  }, [dispatch, me._id, params.id, user])

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "ClearErrors" });
    }
    if (userError) {
      toast.error(userError);
      dispatch({ type: "ClearErrors" });
    }
    if (followError) {
      toast.error(followError);
      dispatch({ type: "ClearErrors" })
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "ClearMessage" });
    }
  }, [error, followError, dispatch, message, userError]);
  return (
    loading === true || userLoading === true ? <Loader /> : (
      <div className='account'>
        <div className="accountleft">
          {
            posts && posts.length > 0 ? posts.map((post) => (
              <Post key={post._id}
                postId={post._id}
                caption={post.caption}
                postImage={post.image.url}
                likes={post.likes}
                comments={post.comments}
                ownerImage={post.owner.avatar.url}
                ownerName={post.owner.name}
                ownerId={post.owner._id}
                page={"userProfile"}
              />
            ))
              : <Typography variant='h6'>No post</Typography>
          }
        </div>
        <div className="accountright">
          {
            user && (
              <>
                <Avatar src={user.avatar.url} sx={{ height: '8vmax', width: '8vmax' }} />

                <Typography variant='h5'>{user.name}</Typography>

                <div>
                  <button onClick={() => setFollowersToggle(!followersToggle)}>
                    <Typography>Followers</Typography>
                  </button>
                  <Typography>{user.followers.length}</Typography>
                </div>
                <div>
                  <button onClick={() => setFollowingToggle(!followingToggle)}>
                    <Typography>Following</Typography>
                  </button>
                  <Typography>{user.following.length}</Typography>
                </div>
                <div>
                  <Typography>Posts</Typography>
                  <Typography>{user.posts.length}</Typography>
                </div>

                {myProfile ? null : <Button variant='contained' disabled={followLoading} onClick={followHandler} style={{ background: following ? "red" : "" }}>{following ? "UnFollow" : "Follow"}</Button>}
              </>
            )
          }

          <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
            <div className="DialogBox">
              <Typography variant='h4'>Followers</Typography>
              {
                user && user.followers.length > 0 ? (user.followers.map((follower) => (
                  <User key={follower._id} userId={follower._id} name={follower.name} avatar={follower.avatar.url} />
                ))) : <Typography style={{ margin: "2vmax" }}>You have no followers</Typography>
              }
            </div>
          </Dialog>
          <Dialog open={followingToggle} onClose={() => setFollowingToggle(!followingToggle)}>
            <div className="DialogBox">
              <Typography variant='h4'>Following</Typography>
              {
                user && user.following.length > 0 ? (user.following.map((follow) => (
                  <User key={follow._id} userId={follow._id} name={follow.name} avatar={follow.avatar.url} />
                ))) : <Typography style={{ margin: "2vmax" }}>You have no following</Typography>
              }
            </div>
          </Dialog>
        </div>
      </div>
    )
  )
}

export default UserProfile;