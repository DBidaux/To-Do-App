import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import imglogin from "../../images/imglogin.jpeg"
import './LoginPage.css'; // Mantén tus estilos personalizados aquí


export default function LoginPage() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json()

            if (response.ok) {
                setSuccessMessage(result.message);
                setErrorMessage('');
                localStorage.setItem('token', result.access_token)
                navigate("/home")
            } else {
                setErrorMessage(result.message);
                setSuccessMessage('')
            }
        } catch (error) {
            console.error("Error en la solicitud", error)
            setErrorMessage("Problema al hacer la solicitud.")
        }


    }



    return (
        <div className="backimage d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow-sm rounded-3">
                <div className="row g-0 flex-column flex-md-row">
                    {/* Imagen visible en todas las pantallas, pero cambia de orden en pantallas pequeñas */}
                    <div className="col-md-6">
                        <img
                            src={imglogin}
                            className="img-fluid rounded-start"
                            alt="Foto cuadrilla"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </div>
                    <div className="col-md-6 d-flex align-items-center justify-content-center p-4">
                        <div className="w-100">
                            <h1 className="mb-4 fs-4 fw-semibold text-secondary color-override ">Inicio de sesión</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        placeholder="***************"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn btn-override w-100"
                                    type="submit"
                                >
                                    Log in
                                </button>
                            </form>
                            {/* Mensajes de error*/}
                            {errorMessage && (
                                <div className='alert alert-danger mt-3' role='alert' >{errorMessage}</div>
                            )}
                            {successMessage && (
                                <div className='alert alert-success mt-3' role='alert' >{successMessage}</div>
                            )}

                            <hr className="my-4" />
                            <p className="mb-1">
                                <a href="../resetpassword" className="text-primary color-override">¿Olvidaste tu contraseña?</a>
                            </p>
                            <p>
                                <a href="../register" className="text-primary color-override">Crear cuenta</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}