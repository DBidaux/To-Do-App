import React, { useState } from 'react';
import './Modal.css';

export default function Modal({ show, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Evitar que el modal se cierre si haces clic dentro del contenido
    const handleContentClick = (e) => e.stopPropagation();

    // Función para manejar el envío de la tarea
    const handleSubmit = () => {
        if (title && description) {
            onSubmit(title, description);  // Enviar los datos ingresados al callback
            setTitle('');  // Reiniciar el campo
            setDescription('');  // Reiniciar el campo
        }
    };

    return show ? (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleContentClick}>
                <h2>New Task</h2>
                <input
                    className='modal-style'
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className='modal-style'
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="modal-actions">
                    <button onClick={handleSubmit}>Add Task</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    ) : null;
}
