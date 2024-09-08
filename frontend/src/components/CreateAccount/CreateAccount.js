import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css"

export default function Form() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [serverResponse, setServerResponse] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch(`http://localhost:5000/newuser`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const data = await response.json();
                if (response.ok) {
                    setServerResponse("Usuario creado exitosamente");
                    setTimeout(() => navigate("/"), 2000);
                } else {
                    setServerResponse(`Error: ${data.error || 'Error inesperado'}`);
                }
            } catch (error) {
                setServerResponse(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="backimage min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="card p-4 shadow-sm">
                <h1 className="card-title mb-4 text-center color-override">Registro de Nuevo Usuario</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            className="form-control transp"
                            placeholder="Nombre de Usuario"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && (
                            <div className="text-danger mt-1">
                                {errors.username}
                            </div>
                        )}
                    </div>

                    <div className=" mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control transp"
                            placeholder="Correo Electrónico"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <div className="text-danger mt-1">
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control transp"
                            placeholder="***************"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <div className="text-danger mt-1">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="form-control transp"
                            placeholder="***************"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                            <div className="text-danger mt-1">
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-override w-100"
                    >
                        Registrarse
                    </button>
                </form>

                <hr className="my-4" />

                <p className="text-center mt-3">
                    <a href="../ResetPassword" className="link color-override">
                        ¿Olvidaste tu contraseña?
                    </a>
                </p>
                <p className="text-center mt-1">
                    <a href="../" className="link color-override">
                        ¿Ya tienes una cuenta? Inicia sesión
                    </a>
                </p>
                {serverResponse && (
                    <p className="text-center text-success mt-3">
                        {serverResponse}
                    </p>
                )}
            </div>
        </div>
    );
}
