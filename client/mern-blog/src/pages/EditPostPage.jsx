import { useState } from "react";
import 'react-quill/dist/quill.snow.css'
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";
import { useEffect } from "react";
import { backend_url } from "../../config";

const EditPostPage = () => {

    const { id } = useParams()
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetch(`${backend_url}/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title)
                    setSummary(postInfo.summary)
                    setContent(postInfo.content)
                })
            })
    }, [])

    const updatePost = async (event) => {
        event.preventDefault();
        const data = new FormData()
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('id', id)
        if (files?.[0]) {
            data.set('file', files?.[0])
        }
        data.set('token', token)

        const response = await fetch(`${backend_url}/post`, {
            method: 'PUT',
            body: data,
            credentials: 'include'
        })

        if (response.ok)
            setRedirect(true)
    }

    if (redirect) return <Navigate to={'/post/' + id} />

    return (
        <form onSubmit={updatePost}>
            <input type="title" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} />
            <input type="summary" placeholder="Summary" value={summary} onChange={event => setSummary(event.target.value)} />
            <input type="file" onChange={event => setFiles(event.target.files)} />
            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '7px' }}>EDIT POST</button>
        </form>
    )

}

export default EditPostPage;