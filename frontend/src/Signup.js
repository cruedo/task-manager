import React, { useState } from 'react'
import { Link} from 'react-router-dom'
import './zz.css'

export default function Signup(props) {

    const [username, setU] = useState('')
    const [email, setE] = useState('')
    const [password1, setP1] = useState('')
    const [password2, setP2] = useState('')
    const [message, setM] = useState('')

    let csrftoken = props.getCookie('csrftoken')

    function handleSubmit(e) {
        e.preventDefault();
        const url = "/signup/"

        fetch(url, {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({username, email, password1, password2}),
        })
        .then(res => {
            if(res.ok) {
                props.setAuthed(true)
            }

            return res.json()
        })
        .then(res => {
            if(res.message !== "Success") setM(res.message)
        })
        .catch(err => console.log(err))
        
    }

    if(props.authed) {
        window.location = "/todo"
    }

    return (
        <div className="abc">
            <form action="/signup/" onSubmit={handleSubmit}>
                <label for="username">USERNAME</label><br/>
                <input type="text" value={username} onChange={(e)=>setU(e.target.value)} required/><br/>
                <label for="email">EMAIL</label><br/>
                <input type="email" value={email} onChange={(e)=>setE(e.target.value)} required/><br/>
                <label for="password1">PASSWORD</label><br/>
                <input type="password" onChange={(e)=>setP1(e.target.value)} value={password1} required/><br/>
                <label for="password2">Re-Enter PASSWORD</label><br/>
                <input type="password" onChange={(e)=>setP2(e.target.value)} value={password2} required/><br/>
                <input type="submit" value="SIGN-UP"/>
            </form>
            {message}
            <div>
                <p>Already have an account ? <Link to="/login">Login</Link></p>
            </div>
    </div>
    )
}