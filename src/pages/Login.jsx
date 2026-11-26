import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../styles/Login.css'

import logo from '../assets/img/logo.png'

import {
  iniciarSesion
} from '../services/usuarioService'


function Login() {

  const [correo, setCorreo] =
    useState('')

  const [contrasena, setContrasena] =
    useState('')

  const [mensajeError, setMensajeError] =
    useState('')

  const navigate = useNavigate()


  // =========================
  // INICIAR SESIÓN
  // =========================

  const manejarSubmit = async (evento) => {

    evento.preventDefault()

    setMensajeError('')


    // Validar campos
    if (
      correo.trim() === '' ||
      contrasena.trim() === ''
    ) {

      setMensajeError(
        'Debe completar todos los campos.'
      )

      return
    }


    try {

      // Consultar backend
      const respuesta =
        await iniciarSesion(
          correo,
          contrasena
        )


      // Verificar respuesta del backend
      if (
      !respuesta.token ||
  !respuesta.usuario
      ) {
  throw new Error(
    'La respuesta de autenticación no es válida.'
  )
}

// Guardar token y usuario autenticado
  sessionStorage.setItem(
  'token',
  respuesta.token
)

sessionStorage.setItem(
  'usuario',
  JSON.stringify(
    respuesta.usuario
  )
)   


      // Ir al Dashboard
      navigate('/dashboard')


    } catch (error) {

      console.error(
        'Error al iniciar sesión:',
        error
      )

      setMensajeError(
        error.message
      )
    }
  }


  return (

    <main className="login-page">

      <div className="login-card">

        {/* =========================
            LOGO
        ========================= */}

        <div className="login-logo">

          <img
            src={logo}
            alt="Logo Yogur Natural Fruits"
            className="logo-imagen"
          />

          <h1>
            Yogur Natural Fruits
          </h1>

          <p>
            Sistema de Gestión de Inventario
          </p>

        </div>


        {/* =========================
            MENSAJE DE ERROR
        ========================= */}

        {mensajeError && (

          <div className="mensaje-error">

            ⚠️ {mensajeError}

          </div>

        )}


        {/* =========================
            FORMULARIO
        ========================= */}

        <form
          onSubmit={manejarSubmit}
        >

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
              onChange={(evento) =>
                setCorreo(
                  evento.target.value
                )
              }
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
              onChange={(evento) =>
                setContrasena(
                  evento.target.value
                )
              }
            />

          </div>


          <button
            type="submit"
            className="btn-ingresar"
          >
            🔐 Ingresar al Sistema
          </button>

        </form>


        {/* =========================
            FOOTER
        ========================= */}

        <div className="login-footer">

          <p>
            © 2026 Yogur Natural Fruits ·
            Todos los derechos reservados
          </p>

        </div>

      </div>

    </main>
  )
}


export default Login