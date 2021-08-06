import React from 'react'
import { Link, BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Login from './Login'
import Todo from './Todo'
import About from './About'
import Logout from './Logout'
import Home from './Home'
import Signup from './Signup'
import './zz.css'

import Cookies from 'universal-cookie';

export default function App(props) {

    const [authed, setAuthed] = React.useState(false);

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function PrivateRoute({redir, component: Component, ck, ...rest}) {
        return (
            <Route
                {...rest}
                render={(props) => { ck === true ? <Todo {...props} /> : <Redirect to='/login' />}}
            >
            </Route>
        )
    }

    React.useEffect(() => {
        let csrftoken = getCookie('csrftoken')
        fetch("/ping/", {
            headers: {
                'X-CSRFToken': csrftoken
            },
            credentials: "include",
        })
        .then(res => res.json())
        .then(res => {
            if(res.ok)
                setAuthed(true)
            else {
                const cookies = new Cookies();
                cookies.set('csrftoken', res.csrftoken, {
                    path: '/',
                    sameSite: 'lax',
                    maxAge: 31449600,
                })
            }
        })
    }, [])

    return (
        <Router>
            <nav>
                <ul>
                    <li><Link className="nav-link" to="/">Home</Link></li>
                    {authed === true ? <li><Link className="nav-link" to="/todo">Todo</Link></li>: ""}
                    <li><Link className="nav-link" to="/about">About</Link></li>
                    {authed === false ? <li><Link className="nav-link" to="/login">Login</Link></li>: ""}
                    {authed === true ? <li><Link className="nav-link" to="/logout">Logout</Link></li>: ""}
                    {authed === false ? <li> <Link className="nav-link" to="/signup">Sign Up</Link> </li>: ""}
                </ul>
            </nav>

            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/login">
                    <Login GS={[authed, setAuthed]} getCookie={getCookie} />
                </Route>
                <Route path="/todo">
                    <Todo authed={authed} setAuthed={setAuthed} getCookie={getCookie} />
                </Route>
                {/* <PrivateRoute path="/todo" component={Todo} redir={'/login'} ck={authed} authed={authed} setAuthed={setAuthed} getCookie={getCookie} /> */}
                <Route path='/logout'>
                    <Logout authed={authed} setAuthed={setAuthed} getCookie={getCookie} />
                </Route>
                <Route path="/signup">
                    <Signup authed={authed} setAuthed={setAuthed} getCookie={getCookie} />
                </Route>
            </Switch>
        </Router>
    )
}