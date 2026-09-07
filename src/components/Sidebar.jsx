import { NavLink } from 'react-router-dom'
import logo from '../assets/img/logo.png'

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <img
          src={logo}
          alt="Yogur Natural Fruits"
        />

        <div>
          <h2>Yogur Natural Fruits</h2>
          <span>Sistema de Gestión</span>
        </div>

      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? 'menu-item activo' : 'menu-item'
          }
        >
          <span>🏠</span>Dashboard</NavLink>

        <NavLink
          to="/inventario"
          className={({ isActive }) =>
            isActive ? 'menu-item activo' : 'menu-item'
          }
        >
          <span>📦</span>Inventario</NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) =>
            isActive ? 'menu-item activo' : 'menu-item'
          }
        >
          <span>🥛</span>Productos</NavLink>

        <NavLink
          to="/insumos"
          className={({ isActive }) =>
            isActive ? 'menu-item activo' : 'menu-item'
          }
        >
          <span>🧺</span>Insumos</NavLink>

        <NavLink
          to="/ventas"
          className={({ isActive }) =>
            isActive ? 'menu-item activo' : 'menu-item'
          }
        >
          <span>💰</span>Ventas</NavLink>

        <NavLink
          to="/usuarios"
          className={({ isActive }) =>
            isActive ? 'menu-item activo' : 'menu-item'
          }
        >
          <span>👥</span>Usuarios</NavLink>

        <NavLink
          to="/reportes"
          className={({ isActive }) =>
            isActive ? 'menu-item activo' : 'menu-item'
          }
        >
          <span>📊</span>Reportes</NavLink>

      </nav>

    </aside>
  )
}

export default Sidebar