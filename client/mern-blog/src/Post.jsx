const Post = () => {
    return (
        <div className="post">
            <div className="image">
                <img src="https://techcrunch.com/wp-content/uploads/2023/12/CMC_7587.jpg?w=850&h=492&crop=1" alt="" />
            </div>
            <div className="texts">
                <h2>Amazon's new Echo Frames can't touch the Ray-Ban Meta</h2>
                <p className="info">
                    <a className="author">Namit Patel</a>
                    <time>25-12-2023 10:47</time>
                </p>
                <p className='summary'>This April marked the 10th anniversary since Google released the first generation of Glass.</p>
            </div>
        </div>
    )
}    

export default Post;