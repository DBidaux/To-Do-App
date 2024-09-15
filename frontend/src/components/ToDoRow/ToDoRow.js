import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import EditModal from '../EditModal/EditModal';  // Importamos el modal de edición
import "../ToDoRow/ToDoRowEdit.css"

// Mapeo del estado
const statusMapping = {
    TODO: 'To-Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done'
};

export default function ToDoRow({ todo, onEdit, onDeactivate }) {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleEditSubmit = (id, title, description, status) => {
        onEdit(id, title, description, status);  // Ejecuta la función de edición que viene por props
        closeModal();  // Cierra el modal una vez enviada la tarea
    };

    return (
        <>
            <tr>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.updated_at}</td>
                <td>{statusMapping[todo.status] || todo.status}</td> {/* Mapeamos el estado */}
                <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={openModal}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDeactivate(todo.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </td>
            </tr>

            {showModal && (
                <EditModal
                    todo={todo}
                    onClose={closeModal}
                    onSubmit={handleEditSubmit}  // Pasamos la función para manejar el envío
                />
            )}
        </>
    );
}