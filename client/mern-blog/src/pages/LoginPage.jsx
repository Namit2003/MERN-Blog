import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserInfo } = useContext(UserContext)

    const login = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                response.json().then(userInfo => {
                    setUserInfo(userInfo)
                    setRedirect(true);
                })
            } else {
                const responseData = await response.json();
                setErrorMessage(responseData.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Invalid credentials');
        }
    };

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" placeholder="username" value={username} onChange={event => setUsername(event.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} />
            <button>Login</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    );
}

export default LoginPage;
