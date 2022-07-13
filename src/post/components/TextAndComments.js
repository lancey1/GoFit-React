import React, { useContext, useEffect, useState } from 'react'
import CommentsList from '../../comment/components/CommentsList';
import { AuthContext } from '../../context/AuthContext';
import ErrorModal from '../../shared/components/ErrorModal';
import DislikeButton from './DislikeButton';
import FollowUserButton from './FollowUserButton';
import styles from './TextAndComments.module.css';

function TextAndComments(props) {

    const auth = useContext(AuthContext);

    const post = props.post;
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const [fetchComments, setFetchComments] = useState(false);

    const commentInputHandler = event => {
        setComment(event.target.value);
    }

    const commentSubmitHandler = async (event) => {
        event.preventDefault();
        if (comment.trim().length === 0) {
            setError('Comment can not be null.');
        };
        
        if (!auth || !auth.user) {
            return setError('Please Login first!');
        };

        try {
            setIsloading(true);
            let response = await fetch(`http://localhost:5000/api/comments/post/${post.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json',
                    Authorization: 'Bearer ' + auth.token
                },
                body: JSON.stringify({
                    text: comment.trim(),
                    creator: auth.userId
                })
            });
            let responseData = await response.json();
            setIsloading(false);
            if (!response.ok) {
                throw new Error(responseData.message);
            };
            console.log(responseData)
        } catch (error) {
            console.log(error)
            setError(error.message);
        }
        setIsloading(false);
        setFetchComments(prev => !prev);

    };

    useEffect(() => {
        (async () => {
            try {
                setIsloading(true);
                let response = await fetch(`http://localhost:5000/api/comments/post/${post.id}`);
                let responseData = await response.json();
                setIsloading(false);
                if (!response.ok) {
                    throw new Error(responseData.message);
                };
                console.log(responseData)
                setComments(responseData.comments);
                setComment('');
            } catch (error) {
                console.log(error)
                setError(error.message);
            }
            setIsloading(false);
        })();
    }, [fetchComments])

    return (
        <React.Fragment>
            {error && <ErrorModal error={error} onClear={() => setError(null)} />}
            <div className={`${styles.user_img_name_follow}`}>
                <img className={`${styles.avatar}`} src={post.creator.image} alt="" />
                <div className={`${styles.name_follow}`}>
                    <h3>{post.creator.name}</h3>
                    <FollowUserButton post={post}/>
                </div>
            </div>

            <article className={`${styles.article}`} >
                <h2 >{post.title}</h2>
                <p>{post.description}</p>
                <div className={`${styles.btn_div}`} >
                    <DislikeButton post={post} />
                </div>
                <hr />
            </article>

            <section>
                <i>{comments.length} comments</i>
                <form onSubmit={commentSubmitHandler}>
                    {auth.user && <input className={`${styles.comment_input}`} type="text" placeholder="Write a comment...💭" value={comment} onChange={commentInputHandler} />}
                    {auth.user && <button className={`${styles.submit_btn}`} disabled={!comment.trim().length}>Send</button>}
                    {!auth.user && <input className={`${styles.comment_input}`} type="text" placeholder="Log in to leave a comment" value={comment} onChange={commentInputHandler} />}
                    {!auth.user && <button className={`${styles.submit_btn}`} disabled={true}>Send</button>}
                </form>
                <CommentsList comments={comments} />
            </section>
        </React.Fragment>
    )
}

export default TextAndComments