import { format } from 'date-fns'
import { Link } from 'react-router-dom';
import { backend_url } from '../config';

const Post = ({ _id, title, summary, cover, content, createdAt, author }) => {

    return (
        <div className="post">
            <div className="image">
                <Link to={`/post/${_id}`}>
                    <img src={`${backend_url}/` + cover} alt="" />
                </Link>
            </div>
            <div className="texts">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <a className="author">{author.username}</a>
                    <time>{format(new Date(createdAt), 'do MMM yyyy, HH:mm')}</time>
                </p>
                <p className='summary'>{summary}</p>
            </div>
        </div>
    )
}

export default Post;