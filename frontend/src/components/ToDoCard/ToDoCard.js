import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import EditModal from '../EditModal/EditModal';

export default function ToDoCard({ todo, index, onEdit, onDeactivate }) {
    const [showEditModal, setShowEditModal] = useState(false);

    const openEditModal = () => {
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
    };

    return (
        <Draggable draggableId={String(todo.id)} index={index}>
            {(provided) => (
                <div
                    className="todo-item"
                    onClick={openEditModal}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="todo-title">{todo.title}</div>
                    <div className="todo-description">{todo.description}</div>
                    <button className="erase-btn" onClick={(e) => { e.stopPropagation(); onDeactivate(todo.id); }}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>

                    {showEditModal && (
                        <EditModal
                            todo={todo}
                            onClose={closeEditModal}
                            onSubmit={onEdit}
                        />
                    )}
                </div>
            )}
        </Draggable>
    );
}
