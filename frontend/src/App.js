import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LoginPage from "./components/LoginPage/Login_page";
import HomePage from "./components/HomePage/HomePage";
import ProtectedRoute from "./components/ProtectedRoute"
import ToDoList from "./components/ToDoList/ToDoList";
import CreateAccount from "./components/CreateAccount/CreateAccount"

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route
					path="/home"
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/todo"
					element={
						<ProtectedRoute>
							<ToDoList />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/register"
					element={
						<ProtectedRoute>
							<CreateAccount />
						</ProtectedRoute>
					}
				/>
				{/*Redirigir a login si no coincide con ninguna ruta*/}
				<Route path="/" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
}

