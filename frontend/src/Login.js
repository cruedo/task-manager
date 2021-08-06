import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import './zz.css'

export default function Login(props) {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const csrftoken = props.getCookie('csrftoken')
        let url = "/login/"
        let data = {
            username: username,
            password: password,
            // csrfmiddlewaretoken: csrftoken,
        }
        console.log("IN FETCH...")
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(data),
            credentials: "include",
        })
        .then(res => {
            if(res.ok) {
                props.GS[1](true);
                console.log("LETSSS GO")
            }
            return res.text()
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
    

    if(props.GS[0]) {
        return (
            <Redirect to='/todo' />
        )
    }

    return (
        <div className="abc" >
            <form onSubmit={handleSubmit}>
                <label for="user">USERNAME</label><br/>
                <input type="text" onChange={e => setUsername(e.target.value)} required /><br/>
                <label for="pass">PASSWORD</label><br/>
                <input type="password" onChange={e => setPassword(e.target.value)} required /><br/>
                <input type="submit" value="LOGIN" />
            </form>
            <div>
                <p>New User ? <Link to="/signup/">Sign Up</Link></p>
            </div>
        </div>
    )
}