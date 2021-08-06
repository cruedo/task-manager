import React from 'react'
import { Redirect } from 'react-router'


export default function Logout(props) {

    const csrftoken = props.getCookie('csrftoken')
    
    const justLogout = () => {
        fetch("/logout/", {
            headers: {
                'X-CSRFToken': csrftoken,
            },
            credentials: "include",
        })
        .then(res => {
            console.log("In this area ready to set auth to false")
            props.setAuthed(false)
        })
    }

    const handleLogout = () => {
        if(props.authed)
        justLogout()
    }


    if(props.authed) {
        return (
            <div>
                <button type="button" onClick={handleLogout}>LOGOUT</button>
            </div>
        )
    }


    return (
        <Redirect to='/login' />
    )
}