import { useNavigate } from 'react-router-dom'

function Header() {

  const navigate = useNavigate()

  const cerrarSesion = () => {
    navigate('/')
  }

  return (
    <header className="header">

      <div>
        <h3>Sistema de Gestión</h3>
        <p>Administración Yogur Natural Fruits</p>
      </div>

      <div className="header-usuario">

        <div className="usuario-info">
          <strong>Administrador</strong>
          <span>Usuario del sistema</span>
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