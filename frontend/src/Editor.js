import React, {useState} from 'react'

export default function Editor(props) {

    const [editValue, setEditValue] = useState(props.data.desc);

    function handleChange(e) {
        setEditValue(e.target.value)
    }
    
    function Edit(e) {
        e.preventDefault();
        props.onEdit({
            ...props.data,
            edit: false,
            desc: editValue,
        })
        let csrftoken = props.getCookie('csrftoken')
        let data = {
            id: props.data.id,
            desc: editValue,
          }
          const url = "/api/edit/"
          fetch(url, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken,
            },
            credentials: "include",
            body: JSON.stringify(data),
          })
          .then(res => res.json())
          .then(res => console.log(res))
          .catch(err => console.log(err))
    }

    return (
        <form onSubmit={Edit}>
            <label>
                <input type="checkbox" onChange={() => props.onEdit({...props.data, done: !props.data.done})} defaultChecked={props.data.done}/>
                <input style={{width: "100px",display: "inline-block" , margin: "0px 10px"}} onChange={handleChange} value={editValue}/>
            </label>
            <button>DONE</button>
        </form>
    )
}