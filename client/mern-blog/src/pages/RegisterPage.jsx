import { useState } from "react";

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const backend_url = 'http://localhost:4000'

    const register = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${backend_url}/register`, {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const responseBody = await response.json();
                if (responseBody.error) {
                    setMessage(`Registration error: ${responseBody.error}`);
                } else {
                    setMessage('Unknown registration error');
                }
            } else {
                setMessage('Registration successful');
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" placeholder="username" value={username} onChange={event => setUsername(event.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            <button>Register</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default RegisterPage;
