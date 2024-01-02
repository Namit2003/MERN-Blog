import { useEffect, useState } from "react";
import Post from "../Post"

const IndexPages = () => {
    const [posts, setPosts] = useState([])
    const backend_url = process.env.BACKEND || 'http://localhost:4000'

    useEffect(() => {
        fetch(`${backend_url}/post`).then(response => {
            response.json().then(posts => {
                setPosts(posts)
            })
        })
    }, [])
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post key={post._id} {...post} />
            ))}
        </>

    )
}

export default IndexPages;