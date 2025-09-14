import React, { useEffect, useState } from 'react'
import './Post.css'
import Avatar from '@mui/material/Avatar';
import { Link, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ChatBubbleOutline, DeleteOutline, Favorite, FavoriteBorder, MoreVert, Send } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentOnPost, deletePost, likePost, updatePost } from '../../Action/Post';
import { getFollowingPosts, getMyPosts, getUserPosts, loadUser } from '../../Action/User';
import Dialog from '@mui/material/Dialog';
import User from '../User/User';
import CommentCard from '../CommentCard/CommentCard';

const Post = ({ postId, caption, postImage, likes = [], comments = [], ownerImage, ownerName, ownerId, isDelete = false, isAccount = false, page = "user"}) => {
    const dispatch = useDispatch();
    const params = useParams();

    const { user } = useSelector((state) => state.user);

    const [liked, setLiked] = useState(false);
    const [likesUser, setLikesUser] = useState(false);
    const [commentValue, setCommentValue] = useState("");
    const [commentToggle, setCommentToggle] = useState(false);
    const [captionValue, setcaptionValue] = useState(caption);
    const [captionToggle, setcaptionToggle] = useState(false);

    const handleLike = async () => {
        setLiked(!liked);
        await dispatch(likePost(postId));

        if (isAccount) {
            dispatch(getMyPosts());
        }else if(page === "userProfile"){
            dispatch(getUserPosts(params.id));
        }
         else {
            dispatch(getFollowingPosts());
        }
    }

    const addCommentHandler = async (e) => {
        e.preventDefault();
        await dispatch(addCommentOnPost(postId, commentValue));

        if (isAccount) {
            dispatch(getMyPosts());
        } else {
            dispatch(getFollowingPosts());
        }
    }

    const updateCaptionHandler = (e) => {
        e.preventDefault();
        dispatch(updatePost(postId, captionValue));
        dispatch(getMyPosts());
    }

    const deletePostHandler = async() => {
        await dispatch(deletePost(postId));
        dispatch(getMyPosts());
        dispatch(loadUser());
    }

    useEffect(() => {
        if(!user) return;

        likes.forEach((item) => {
            if (item._id === user._id) {
                setLiked(true);
            }
        })
    }, [likes, user._id, user]);

    return (
        <div className='post'>
            <div className="postHeader">
                {isAccount ? (
                    <Button onClick={() => setcaptionToggle(!captionToggle)}>
                        <MoreVert />
                    </Button>
                ) : null
                }
            </div>
            <img src={postImage} alt="Post" />
            <div className="postDetails">
                <Avatar src={ownerImage} alt='User' sx={{ height: '3vmax', width: '3vmax' }} />

                <Link to={`/user/${ownerId}`}>
                    <Typography fontWeight={700}>{ownerName}</Typography>
                </Link>
                <Typography fontWeight={100} color="rgba(0, 0, 0, 0.582)" style={{ alignSelf: "center" }}>{caption}</Typography>

            </div>
            <button style={{ border: 'none', backgroundColor: 'white', margin: '1vmax 2vmax', cursor: 'pointer' }} onClick={() => setLikesUser(!likesUser)} disabled={likes.length === 0 ? true : false} >
                <Typography>{likes.length} likes</Typography>
            </button>
            <div className="postFooter">
                <Button onClick={handleLike}>
                    {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
                </Button>
                <Button onClick={() => setCommentToggle(!commentToggle)}>
                    <ChatBubbleOutline />
                </Button>
                {isDelete ? (
                    <Button onClick={deletePostHandler}>
                        <DeleteOutline />
                    </Button>) : null}
            </div>
            <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)} >
                <div className="DialogBox">
                    <Typography variant='h4'>Liked By</Typography>
                    {
                        likes.map((like, index) => (
                            
                            <User key={like._id}
                                userId={like._id}
                                name={like.name}
                                avatar={like.avatar.url} />
                        ))
                    }
                </div>
            </Dialog>
            <Dialog open={commentToggle} onClose={() => setCommentToggle(!commentToggle)} >
                <div className="DialogBox">
                    <Typography variant='h4'>Comments</Typography>
                    <form className="commentForm" onSubmit={addCommentHandler}>
                        <input type='text' value={commentValue} onChange={(e) => setCommentValue(e.target.value)} placeholder='Comment here..' required />
                        <Button type='submit' variant='contained' style={{ borderRadius: "0 50px 50px 0" }}><Send /></Button>
                    </form>
                    {
                        comments.length > 0 ? (comments.map((item) => (<CommentCard
                            key={item._id}
                            userId={item.user._id}
                            name={item.user.name}
                            avatar={item.user.avatar.url}
                            comment={item.comment}
                            commentId={item._id}
                            postId={postId}
                            isAccount={isAccount}
                        />))
                        ) : (<Typography>No Comment Yet</Typography>)
                    }
                </div>
            </Dialog>
            <Dialog open={captionToggle} onClose={() => setcaptionToggle(!captionToggle)} >
                <div className="DialogBox">
                    <Typography variant='h4'>Update Caption</Typography>
                    <form className="commentForm" onSubmit={updateCaptionHandler}>
                        <input type='text' value={captionValue} onChange={(e) => setcaptionValue(e.target.value)} placeholder='Caption here..' required />
                        <Button type='submit' variant='contained' style={{ borderRadius: "0 50px 50px 0" }}>Update</Button>
                    </form>
                </div>
            </Dialog>
        </div>
    )
}

export default Post;