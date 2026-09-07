import { useState } from 'react'
import '../styles/Login.css'
import logo from '../assets/img/logo.png'
import { useNavigate } from 'react-router-dom'

function Login() {

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensajeError, setMensajeError] = useState('')
  const navigate = useNavigate()


const manejarSubmit = (evento) => {
  evento.preventDefault()

  setMensajeError('')

  if (correo.trim() === '' || contrasena.trim() === '') {
    setMensajeError('Debe completar todos los campos.')
    return
  }

  // Temporal mientras construimos el backend con Node.js
  navigate('/dashboard')
}

  return (
    <main className="login-page">

      <div className="login-card">

        <div className="login-logo">
          <img
              src={logo}
              alt="Logo Yogur Natural Fruits"
              className="logo-imagen"
             />

          <h1>Yogur Natural Fruits</h1>

          <p>Sistema de Gestión de Inventario</p>
        </div>

        {mensajeError && (
          <div className="mensaje-error">
            ⚠️ {mensajeError}
          </div>
        )}

        <form onSubmit={manejarSubmit}>

          <div className="campo-grupo">
            <label htmlFor="correo">
              Correo electrónico
            </label>

            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="usuario@naturalfruits.com"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              autoFocus
            />
          </div>

          <div className="campo-grupo">
            <label htmlFor="contrasena">
              Contraseña
            </label>

            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="••••••••"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-ingresar"
          >
            🔐 Ingresar al Sistema
          </button>

        </form>

        <div className="login-footer">
          <p>
            © 2026 Yogur Natural Fruits · Todos los derechos reservados
          </p>
        </div>

      </div>

    </main>
  )
}

export default Login