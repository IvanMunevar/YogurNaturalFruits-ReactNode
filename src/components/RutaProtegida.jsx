import {
  Navigate,
  Outlet
} from 'react-router-dom'

const obtenerUsuario = () => {

  try {

    const usuarioGuardado =
      sessionStorage.getItem('usuario')

    return usuarioGuardado
      ? JSON.parse(usuarioGuardado)
      : null

  } catch {

    return null
  }
}

function RutaProtegida({
  rolesPermitidos = []
}) {

  const token =
    sessionStorage.getItem('token')

  const usuario =
    obtenerUsuario()

  const rol =
    String(usuario?.rol || '')
      .trim()
      .toUpperCase()

  // No existe una sesión válida
  if (!token || !usuario) {

    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  // El usuario está autenticado,
  // pero no posee el rol requerido
  if (
    rolesPermitidos.length > 0 &&
    !rolesPermitidos.includes(rol)
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return <Outlet />
}

export default RutaProtegida