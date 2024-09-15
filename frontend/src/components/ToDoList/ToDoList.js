import React, { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TodoColumn from '../ToDoColumn/ToDoColumn';
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import ToDoTable from '../ToDoTable/ToDoTable';
import './ToDoList.css';

export default function TodoLists() {
	const [todos, setTodos] = useState({ todo: [], inProgress: [], done: [] });
	const [username, setUsername] = useState("");  // Estado para almacenar el nombre de usuario
	const [allTodos, setAllTodos] = useState([]);  // Almacena todas las tareas activas
	const [inactiveTodos, setInactiveTodos] = useState([]);  // Almacena todas las tareas inactivas
	const [filteredTodos, setFilteredTodos] = useState([]);  // Tareas filtradas para la tabla
	const [showActive, setShowActive] = useState(true);  // Controla si se muestran las tareas activas o inactivas en la tabla

	// Fetch para obtener las tareas activas
	const fetchTodos = async () => {
		const token = localStorage.getItem("token");
		try {
			const response = await fetch("http://localhost:5000/usertodo", {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});
			const data = await response.json();

			// Separar las tareas según su estado
			const todo = data.filter(todo => todo.status === "TODO");
			const inProgress = data.filter(todo => todo.status === "IN_PROGRESS");
			const done = data.filter(todo => todo.status === "DONE");

			setTodos({ todo, inProgress, done });

			// Guardamos todas las tareas activas para la tabla
			setAllTodos(data);

			// Por defecto, mostramos las tareas activas en la tabla
			setFilteredTodos(data);
		} catch (error) {
			console.error("Error fetching todos:", error);
		}
	};

	// Fetch para obtener las tareas inactivas (completadas)
	const fetchInactiveTodos = async () => {
		const token = localStorage.getItem("token");
		try {
			const response = await fetch("http://localhost:5000/usertodo/inactive", {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});
			const data = await response.json();

			// Guardar las tareas inactivas en el estado
			setInactiveTodos(data);

			// Actualizar la tabla para mostrar las tareas inactivas
			setFilteredTodos(data);
		} catch (error) {
			console.error("Error fetching inactive todos:", error);
		}
	};

	useEffect(() => {
		fetchUserDetails();
		fetchTodos();  // Obtener las tareas activas al cargar la página
	}, []);

	// Función para obtener los detalles del usuario
	const fetchUserDetails = async () => {
		const token = localStorage.getItem("token");

		try {
			const response = await fetch("http://localhost:5000/userdetails", {
				method: 'GET',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});
			const data = await response.json();
			setUsername(data.username);  // Almacenar el nombre de usuario en el estado
		} catch (error) {
			console.error("Error fetching user details:", error);
		}
	};

	// Función para alternar entre tareas activas e inactivas en la tabla
	const handleTableFilterChange = (filter) => {
		if (filter === "active") {
			setFilteredTodos(allTodos);  // Mostrar tareas activas
			setShowActive(true);
		} else if (filter === "inactive") {
			fetchInactiveTodos();  // Obtener y mostrar tareas inactivas
			setShowActive(false);
		}
	};

	// Funciones de CRUD para las tareas
	const addTask = async (status, title, description) => {
		const token = localStorage.getItem("token");
		const userId = localStorage.getItem("userID");

		const newTask = {
			title,
			description,
			status,
			user_id: userId,
		};

		try {
			const response = await fetch("http://localhost:5000/newtodo", {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(newTask)
			});

			fetchTodos();  // Recargar las tareas activas después de añadir una nueva
		} catch (error) {
			console.error("Error adding new task:", error);
		}
	};

	const editTask = async (taskId, newTitle, newDescription, status) => {
		const token = localStorage.getItem("token");

		const updatedTask = {
			title: newTitle,
			description: newDescription,
			status
		};

		try {
			await fetch(`http://localhost:5000/todos/${taskId}`, {
				method: 'PUT',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(updatedTask)
			});

			fetchTodos();  // Recargar las tareas activas después de editar
		} catch (error) {
			console.error("Error updating task", error);
		}
	};

	const deactivateTask = async (taskId) => {
		const token = localStorage.getItem("token");

		try {
			await fetch(`http://localhost:5000/todos/${taskId}/deactivate`, {
				method: 'PUT',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});

			fetchTodos();  // Recargar las tareas activas después de desactivar
		} catch (error) {
			console.error("Error deactivating task", error);
		}
	};
	// Fetch para obtener las tareas desde la API


	// Función que se dispara al iniciar el drag
	const onDragStart = (start) => {
		const { source } = start;
		console.log(`Iniciando arrastre desde ${source.droppableId}`);
	};

	// Función que se dispara cuando finaliza el drag
	const onDragEnd = (result) => {
		const { source, destination } = result;

		// Si no hay un destino válido
		if (!destination) return;

		// Mapear droppableId a los nombres de las columnas (estado)
		const droppableIdToStateKey = {
			"TODO": 'todo',
			"IN_PROGRESS": 'inProgress',
			"DONE": 'done'
		};

		// Obtener las listas de origen y destino
		const sourceKey = droppableIdToStateKey[source.droppableId];
		const destinationKey = droppableIdToStateKey[destination.droppableId];

		if (!sourceKey || !destinationKey) {
			console.error(`Droppable ID ${source.droppableId} or ${destination.droppableId} is invalid.`);
			return;
		}

		const sourceList = [...todos[sourceKey]];
		const destinationList = [...todos[destinationKey]];

		// Mover el todo de la lista de origen a la lista de destino
		const [movedTask] = sourceList.splice(source.index, 1);
		destinationList.splice(destination.index, 0, movedTask);

		// Actualizar el estado de las listas
		setTodos({
			...todos,
			[sourceKey]: sourceList,
			[destinationKey]: destinationList
		});

		// Actualizar el estado de la tarea en la base de datos
		updateTaskStatus(movedTask.id, destination.droppableId, movedTask.title, movedTask.description);
		fetchTodos()
	};

	// Función para actualizar el estado de la tarea en la DB
	const updateTaskStatus = async (taskId, newStatus, title, description) => {
		const token = localStorage.getItem("token");
		try {
			await fetch(`http://localhost:5000/todos/${taskId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					title: title,
					description: description,
					status: newStatus.toUpperCase()
				})
			});
			fetchTodos();
		} catch (error) {
			console.error("Error updating task:", error);
		}
	};


	return (
		<div className="todo-lists-container min-vh-100">
			<Header />
			<h1 className='py-3'>Todo List of {username}</h1>
			<p>As you may have noticed, there is no button to create a new task. To create a new task, you must click on the title of the column in which you want to add a task. </p>
			<p>This task list has a "Drag&Drop" functionality, which updates the status of the task as it changes column.</p>
			<p>The delete button is a "soft-delete", that is, it does not delete the task but archives it.</p>
			<DragDropContext onDragEnd={onDragEnd} >
				<div className='py-5'>
					<div className="todo-lists">
						<TodoColumn
							title="To-do"
							todos={todos.todo}
							status="TODO"
							onAddTask={addTask}
							onEditTask={editTask}
							onDeactivateTask={deactivateTask}
						/>
						<TodoColumn
							title="In progress"
							todos={todos.inProgress}
							status="IN_PROGRESS"
							onAddTask={addTask}
							onEditTask={editTask}
							onDeactivateTask={deactivateTask}
						/>
						<TodoColumn
							title="Done"
							todos={todos.done}
							status="DONE"
							onAddTask={addTask}
							onEditTask={editTask}
							onDeactivateTask={deactivateTask}
						/>
					</div>
				</div>
			</DragDropContext>
			<h1>Table of To-Dos</h1>
			<p>In this table you can see the actual tasks you have on the list above, if you want to see in other format. With the buttons below, you can switch between the active and the inactive task table.</p>
			<p><strong>REMINDER</strong>: The server has been configured to delete inactive tasks that have not been modified in a period of 30 days.</p>
			<p><strong>REMINDER</strong> 2: Inactive tasks cannot be reactivated, if you have archived it by mistake, you will have to create it again.</p>
			{/* Botones para filtrar entre tareas activas e inactivas */}
			<div className="filter-buttons py-3">
				<button
					className={`btn ${showActive ? 'btn-override' : 'btn-secondary'}`}
					onClick={() => handleTableFilterChange("active")}
				>
					Show Active Tasks
				</button>
				<button
					className={`btn ${!showActive ? 'btn-override' : 'btn-secondary'}`}
					onClick={() => handleTableFilterChange("inactive")}
				>
					Show Inactive Tasks
				</button>
			</div>

			{/* Tabla con tareas filtradas */}
			<ToDoTable allTodos={filteredTodos} onEditTask={editTask} onDeactivateTask={deactivateTask} />

			<Footer />
		</div>
	);
}