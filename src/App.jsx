import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventario from './pages/Inventario'
import Productos from './pages/Productos'
import Insumos from './pages/Insumos'
import Ventas from './pages/Ventas'
import Usuarios from './pages/Usuarios'
import Reportes from './pages/Reportes'

import Layout from './components/Layout'

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* SISTEMA */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/inventario"
            element={<Inventario />}
          />

          <Route
            path="/productos"
            element={<Productos />}
          />

          <Route
            path="/insumos"
            element={<Insumos />}
          />

          <Route
            path="/ventas"
            element={<Ventas />}
          />

          <Route
            path="/usuarios"
            element={<Usuarios />}
          />

          <Route
            path="/reportes"
            element={<Reportes />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App