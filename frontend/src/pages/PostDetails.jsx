const API_URL = import.meta.env.VITE_API_URL;
import '../styles/postDetails.css';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import ProfilePopUp from '../components/ProfilePopUp';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';

const PostDetails = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { id } = useParams(); // extragem id-ul din URL
    const [post, setPost] = useState(null);
    const [isOwner, setIsOwner] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    const getPost = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/post/${id}`,
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
                `${API_URL}/me`,
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
                `${API_URL}/post/${id}/comment/${commentToDelete}`,
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

    const handleDeleteComment = (commentId) => {
        const ok = window.confirm("Sigur vrei să ștergi acest comentariu?");
        if (!ok) return;

        handleDelete(commentId)
    };

    const handleSubmitButton = async () => {
        try {
            const response = await axios.post(`${API_URL}/post/${id}/comment`,
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

    const hanldleOnMarkResolved = (postId) => {
        const ok = window.confirm("Marchezi această postare ca rezolvată?");
        if (!ok) return;

        onMarkResolved(postId)
    };

    const onMarkResolved = async (postId) => {
        try {
            await axios.patch(`${API_URL}/post/${postId}`,
                {},
                { withCredentials: true }
            );
            setPost(prevPost => ({
                ...prevPost,
                type: 'resolved'
            }));
            toast.success("Status actualizat!");
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong.");
        }
    }

    const handleOnDelete = (postId) => {
        const ok = window.confirm("Sigur vrei să ștergi postarea?");
        if (!ok) return;

        onDelete(postId)
    }

    const onDelete = async (postId) => {
        try {
            await axios.delete(`${API_URL}/post/${postId}`,
                { withCredentials: true }
            );
            toast.success("Postare ștearsă cu succes!");
            navigate(-1);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong.");
        }
    }

    useEffect(() => {
        console.log(post)
    }, [post])

    return (
        <div className="container-info">
            {isOwner && (
                <div className="owner-actions">
                    <button onClick={() => handleOnDelete(post._id)}>Șterge postarea</button>
                    <button //daca a fost deja marcat ca rezolvat, nu mai apare butonul
                        style={{
                            opacity: post.type === 'resolved' ? 0 : 1,
                            pointerEvents: post.type === 'resolved' ? 'none' : 'auto'
                        }}
                        onClick={() => hanldleOnMarkResolved(post._id)}
                    >
                        Marchează ca rezolvat
                    </button>
                </div>
            )}
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
                    <div
                        className={`post-type ${post.type === 'lost' ? 'lost' : post.type === 'found' ? 'found' : 'resolved'}`}>
                        {post.type === 'lost' ? 'Pierdut' : post.type === 'found' ? 'Găsit' : 'Rezolvat'}
                    </div>

                    <div className='details' style={{ gap: '1rem' }}>
                        <h4 className='title'>{post.title}</h4>
                        <div className='author-name'>
                            <span>
                                <span className='detail-title' style={{ fontWeight: 'normal', marginRight: '5px' }}><FaUser /> </span>
                                {post.userId.firstName} {post.userId.lastName}
                            </span>
                            <button
                                className='author-button'
                                onClick={() => setShowProfilePopup(true)}>
                                Vezi detalii utilizator
                            </button>
                            {showProfilePopup &&
                                <ProfilePopUp
                                    onClose={() => setShowProfilePopup(false)}
                                    email={post.userId.email}
                                />
                            }
                        </div>
                        <h4><FaMapMarkerAlt color="red" /> {post.location?.address}</h4>
                        {post.dateTime && <h4><FaRegCalendarAlt color="blue" size={14} /> {new Date(post.dateTime).toLocaleString()}</h4>}
                        {post.description && <div><p className='detail-title'> Descriere: </p> {post.description}</div>}
                        <div> <p className='detail-title'> Detalii de contact </p>{post.contact}</div>
                    </div>

                    <div className='details' style={{ marginBottom: '2rem' }}>
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
                                    <div className="comment-date">
                                        {new Date(comment.createdAt).toLocaleString('ro-RO', {
                                            day: 'numeric',
                                            month: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
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