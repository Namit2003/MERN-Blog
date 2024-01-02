import { useEffect, useState } from "react";
import Post from "../Post"
import { backend_url } from "../../config";

const IndexPages = () => {
    const [posts, setPosts] = useState([])

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