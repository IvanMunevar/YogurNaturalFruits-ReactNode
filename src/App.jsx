import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Insumos from './pages/Insumos'
import Inventario from './pages/Inventario'
import Proveedores from './pages/Proveedores'
import Usuarios from './pages/Usuarios'
import Clientes from './pages/Clientes'
import Pedidos from './pages/Pedidos'
import Ventas from './pages/Ventas'
import Reportes from './pages/Reportes' 
import Alertas from './pages/Alertas'

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
            path="/proveedores"
            element={<Proveedores />}
          />

          <Route
            path="/clientes"
            element={<Clientes />}
          />

          <Route
            path="/ventas"
            element={<Ventas />}
          />
          
          <Route
            path="/alertas"
            element={<Alertas />}
          />

          <Route
            path="/usuarios"
            element={<Usuarios />}
          />

          <Route
            path="/pedidos"
            element={<Pedidos />}
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