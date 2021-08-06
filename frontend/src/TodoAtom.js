import React from 'react';
import './zz.css'


function Todo(props) {

    
    function Edit() {
        props.onEdit({...(props.data), edit: true})
    }

    function onDone() {
        props.onEdit({...(props.data), done: !props.data.done})
    }

    return (
        <div>
            <label>
                <input type="checkbox" checked={props.data.done} onChange={onDone}/>
                <p style={{width: "100px",display: "inline-block" , margin: "0px 10px"}}>{props.data.desc}</p>
            </label>
            <button onClick={() => props.onDelete(props.data.id)}>DELETE</button>
            <button onClick={Edit}>EDIT</button>
        </div>
    );

}

export default Todo;