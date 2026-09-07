import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar'
import Header from './Header'

import '../styles/Layout.css'

function Layout() {

  return (
    <div className="app-layout">

      <Sidebar />

      <div className="app-contenido">

        <Header />

        <main className="contenido-principal">

          <Outlet />

        </main>

      </div>

    </div>
  )
}

export default Layout