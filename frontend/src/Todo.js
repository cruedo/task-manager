import React, { useState } from "react";
import TodoAtom from './TodoAtom';
import Editor from './Editor'
// import Login from './Login'
// import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {useEffect} from 'react'
import './zz.css'

function App(props) {

  const [todos, setTodos] = useState([]);
  const [adder, setAdder] = useState("");
  let csrftoken = props.getCookie('csrftoken')

  function onChange(e) {
    setAdder(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if(adder.length === 0) return;

    let data = {
      desc: adder,
    }


    fetch("/api/insert/", {
      method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
          },
          body: JSON.stringify(data),
          credentials: "include",
    })
    .then(res => {
      if(!res.ok)
        return Promise.reject("Error while adding new todo");
      return res.json();
    })
    .then(res =>{
      data.id = res.id;
      data.edit = false;
      data.done = false;
      setTodos([...todos, data]);
      setAdder("");
    })
    .catch(err => {
      console.log(err)
    })

  }

  function deleteTodo(id) {
    setTodos(todos.filter((i) => i.id !== id));
    let url = `/api/delete/${id}/`
    console.log(url);
    fetch(url, {
      method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
          },
          credentials: "include",
    })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  function editTodo(New) {
    setTodos(todos.map((x) => {
      (x.id === New.id) ? x = New : x.edit = false
      return x;
    }))
  }


  useEffect(()=>{
    let pro = fetch('/api/list/', {
      credentials: "include",
    })
    pro.then((res)=>{
      // console.log(res)
      if(res.ok)
        return res.json()
      else
        return Promise.reject("OHH NO There was an error")
    })
    .then((res)=>{
        setTodos(res.todos.map( i => { return {...i, edit: false, id: i.id} }))
    }).catch((err)=>{console.log(err)})
  }, [])



  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="adder" onChange={onChange} placeholder="Add your note here" value={adder} autoComplete="off"/>      
        <button>ADD</button>
      </form>
      {
        todos.map((i, index) => {
            if(i.edit === false)
              return <TodoAtom key={index} data={i} onDelete={deleteTodo} onEdit={editTodo}/>
            else
              return <Editor key={index} data={i} onEdit={editTodo} getCookie={props.getCookie} />
          }
        )
      }
    </div>
  );
}

export default App;
