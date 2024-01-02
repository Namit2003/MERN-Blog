import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { backend_url } from '../config';

const Header = () => {

    const { setUserInfo, userInfo } = useContext(UserContext)

    useEffect(() => {
        fetch(`${backend_url}/profile`, {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo)
            })
        })
    }, [])

    const logout = () => {
        fetch(`${backend_url}/logout`, {
            credentials: 'include',
            method: 'POST',
        }).then(response => {
            if (response.ok) {
                localStorage.clear();
            } else {
                alert('Could not logout')
            }
        })
        setUserInfo(null)
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to={'/'} className="logo">MyBlog</Link>
            <nav>
                {username && (
                    <>
                        <Link to={'/create'}>Create new post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to={"/login"}>Login</Link>
                        <Link to={"/register"}>Register</Link>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header;