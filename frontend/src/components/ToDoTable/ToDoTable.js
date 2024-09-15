import React from 'react';
import ToDoRow from '../ToDoRow/ToDoRow';

export default function ToDoTable({ allTodos, onEditTask, onDeactivateTask }) {
    return (
        <div className="table-responsive px-4 min-vh-100">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Updated at</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allTodos.length > 0 ? (
                        allTodos.map((todo) => (
                            <ToDoRow 
                                key={todo.id} 
                                todo={todo} 
                                onEdit={onEditTask}  // Pasamos la función de edición
                                onDeactivate={onDeactivateTask}  // Pasamos la función de desactivación
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No tasks available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
