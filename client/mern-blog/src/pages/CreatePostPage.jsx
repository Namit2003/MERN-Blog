import { useState } from "react";
import 'react-quill/dist/quill.snow.css'
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { backend_url } from "../../config";

const CreatePost = () => {
    
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const token = localStorage.getItem('token');

    const data = new FormData()
    data.set('title', title)
    data.set('summary', summary)
    data.set('content', content)
    data.set('file', files[0])
    data.set('token', token)

    const createNewPost = async (event) => {
        event.preventDefault();

        // Check if any of the fields is empty
        if (!title || !summary || !content || !files[0]) {
            setErrorMessage('Please fill in all the fields');
            return;
        }
        
        const response = await fetch(`${backend_url}/post`, {
            method: 'POST',
            body: data,
            credentials: 'include'
        });

        if (response.ok) {
            setRedirect(true);
        } else {
            setErrorMessage('Error creating the post. Please try again.');
        }
    }

    if (redirect) return <Navigate to={'/'} />

    return (
        <form onSubmit={createNewPost}>
            <input type="title" placeholder="Title" value={title} onChange={event => setTitle(event.target.value)} />
            <input type="summary" placeholder="Summary" value={summary} onChange={event => setSummary(event.target.value)} />
            <input type="file" onChange={event => setFiles(event.target.files)} />
            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '7px' }}>POST</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    )
}

export default CreatePost;
