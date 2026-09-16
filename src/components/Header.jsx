import { useNavigate } from 'react-router-dom'

function Header() {

  const navigate = useNavigate()

  const cerrarSesion = () => {
  sessionStorage.removeItem('usuario')
    navigate('/')
    }

  const usuarioGuardado =
  sessionStorage.getItem('usuario')

  const usuario =
  usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : null

  return (
    <header className="header">

      <div>
        <h3>Sistema de Gestión</h3>
        <p>Administración Yogur Natural Fruits</p>
      </div>

      <div className="header-usuario">

        <div className="usuario-info">
          <strong> {usuario?.nombreUsuario ||'Usuario'}</strong>
          <span>  {usuario?.correo ||'Usuario del sistema'}</span>
        </div>

        <button
          className="btn-salir"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>

      </div>

    </header>
  )
}

export default Header