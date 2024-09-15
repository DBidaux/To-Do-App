import React from 'react';
import { useNavigate } from 'react-router-dom'; // Si usas React Router

export default function Header() {
    const navigate = useNavigate(); // Hook para redirigir

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userID');  // Si también tienes el userID almacenado

        // Redireccionar al usuario a la página de inicio de sesión o a home
        navigate('/login'); // O la ruta a la que quieras redirigir después del logout
    };

    return (
        <header className='py-3'>
            <h3 className="float-md-start mb-0">To-Do App</h3>
            <nav className="nav nav-masthead justify-content-center float-md-end">
                <a className="nav-link active" aria-current="page" href="/home">Home</a>
                <a className="nav-link" href="/todo">To-Do List</a>
                {/* Llamamos a handleLogout cuando se hace click en Log out */}
                <a className="nav-link" href="/" onClick={handleLogout}>Log out</a>
            </nav>
        </header>
    );
}
