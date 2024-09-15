import React, { useState } from 'react';
import "../Modal/Modal.css";

export default function EditModal({ todo, onClose, onSubmit }) {
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description);

    // Asegúrate de que el status sea solo la cadena y no un objeto Enum
    const [status, setStatus] = useState(todo.status);  // Esto debería ser una cadena

    const handleSubmit = () => {
        onSubmit(todo.id, title, description, status);  // Enviar solo la cadena del status
        onClose();  // Cierra el modal
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Edit To-Do</h2>
                <input
                    className='rounded'
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className='rounded'
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className='button-container'>
                    <button onClick={handleSubmit}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
