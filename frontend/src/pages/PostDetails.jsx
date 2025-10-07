import '../styles/PostDetails.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

const PostDetails = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { id } = useParams(); // extragem id-ul din URL
    const [post, setPost] = useState(null);
    const [isOwner, setIsOwner] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);

    const getPost = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3000/post/${id}`,
                { withCredentials: true }
            );

            setPost(res.data.post);
            setIsOwner(res.data.isOwner);
        } catch (err) {
            console.error(err);
        }
    };

    const getUserId = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3000/me`,
                { withCredentials: true }
            );

            setCurrentUserId(res.data.userId);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getPost();
        getUserId();
    }, []);

    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % post.images.length);
    };

    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    };

    const handleAddCommentClick = () => {
        setShowInput(!showInput);
    };

    const handleDelete = async (commentToDelete) => {
        try {
            const res = await axios.delete(
                `http://localhost:3000/post/${id}/comment/${commentToDelete}`,
                { withCredentials: true }
            );

            setPost(prevPost => ({
                ...prevPost,
                comments: res.data.updatedComments
            }));
            toast.success("Comentariu șters!");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong.");
        }
    }

    const handleDeleteComment = async (commentId) => {
        const ok = window.confirm("Sigur vrei să ștergi acest comentariu?");
        if (!ok) return;

        handleDelete(commentId)
    };


    const handleSubmitButton = async () => {
        try {
            const text = newComment.trim();
            const response = await axios.post(`http://localhost:3000/post/${id}/comment`,
                { text: newComment.trim() },
                { withCredentials: true }
            );

            setPost(prevPost => ({
                ...prevPost,
                comments: response.data.comments
            }))
            setNewComment("");
            toast.success("Comentariu adăugat!");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong.");
        }
    }

    return (
        <div className="container-info">
            {/* Carousel imagine */}
            {post && post.images.length > 0 && (<div className="images-container">
                <button className="nav-btn" onClick={goPrev}>◀</button>
                <div className='image-wrapper'>
                    {post && <img src={post.images[currentIndex]} className="image" alt={post.title} />}
                </div>
                <button className="nav-btn" onClick={goNext}>▶</button>
            </div>)}

            {post && (
                <div className='details-container'>
                    <div className={`post-type ${post.type === 'lost' ? 'lost' : 'found'}`}>
                        {post.type === 'lost' ? 'Pierdut' : 'Găsit'}
                    </div>


                    <div className='details' style={{ gap: '2rem' }}>
                        <h4 className='title'>{post.title}</h4>
                        <h4>📍 {post.location?.address}</h4>
                        {post.dateTime && <h4><FaRegCalendarAlt color="blue" size={14} /> {new Date(post.dateTime).toLocaleString()}</h4>}
                        {post.description && <div>Descriere: {post.description}</div>}
                        <div>Contact: {post.contact}</div>
                    </div>

                    <div className='details'>
                        <div className='comments-header'>
                            <h4>Comentarii</h4>
                            <button className='btn-add-comment' onClick={handleAddCommentClick}>
                                Scrie un comentariu
                            </button>
                        </div>

                        {showInput && (
                            <div className='new-comment'>
                                <textarea
                                    className='input-comment'
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Scrie un comentariu..."
                                />
                                <button className='btn-post-comment' onClick={handleSubmitButton}>
                                    Postează
                                </button>
                            </div>
                        )}
                        {post.comments && post.comments.length > 0 && (
                            post.comments.map((comment) => (
                                <div className='comment' key={comment._id}>
                                    <div className='comment-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{comment.userId.firstName} {comment.userId.lastName}</strong>
                                            <span className='email'>({comment.userId.email})</span>
                                        </div>
                                        {comment.userId._id === currentUserId && (
                                            <button className='btn-delete-comment' onClick={() => handleDeleteComment(comment._id)}>
                                                Șterge
                                            </button>
                                        )}
                                    </div>
                                    <div className='comment-text'>
                                        {comment.text}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

        </div>

    )
}

export default PostDetails