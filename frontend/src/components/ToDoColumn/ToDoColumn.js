import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TodoCard from '../ToDoCard/ToDoCard';
import Modal from '../Modal/Modal';

export default function TodoColumn({ title, todos, status, onAddTask, onEditTask, onDeactivateTask }) {
    const [showModal, setShowModal] = useState(false);

    const openModal = () => { setShowModal(true); };
    const closeModal = () => { setShowModal(false); };

    const handleAddTask = (title, description) => {
        onAddTask(status, title, description);
        closeModal();
    };

    return (
        <Droppable droppableId={status}>
            {(provided) => (
                <div className="todo-column" ref={provided.innerRef} {...provided.droppableProps}>
                    <h2 onClick={openModal}>{title}</h2>
                    <ul>
                        {todos.map((todo, index) => (
                            <TodoCard key={todo.id} todo={todo} index={index} onEdit={onEditTask} onDeactivate={onDeactivateTask} />
                        ))}
                    </ul>
                    {showModal && <Modal show={showModal} onClose={closeModal} onSubmit={handleAddTask} />}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
