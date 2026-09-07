import '../styles/Dashboard.css'

function Dashboard() {

  return (
    <div className="dashboard">

      <div className="dashboard-cabecera">

        <div>
          <h1>Dashboard</h1>

          <p>
            Bienvenido al Sistema de Gestión de
            Yogur Natural Fruits
          </p>
        </div>

      </div>

      <section className="tarjetas-dashboard">

        <div className="tarjeta-dashboard">

          <div className="tarjeta-icono">
            🥛
          </div>

          <div>
            <span>Productos</span>
            <h2>0</h2>
            <p>Productos registrados</p>
          </div>

        </div>

        <div className="tarjeta-dashboard">

          <div className="tarjeta-icono">
            📦
          </div>

          <div>
            <span>Insumos</span>
            <h2>0</h2>
            <p>Insumos registrados</p>
          </div>

        </div>

        <div className="tarjeta-dashboard">

          <div className="tarjeta-icono">
            💰
          </div>

          <div>
            <span>Ventas</span>
            <h2>$0</h2>
            <p>Ventas registradas</p>
          </div>

        </div>

        <div className="tarjeta-dashboard">

          <div className="tarjeta-icono">
            👥
          </div>

          <div>
            <span>Usuarios</span>
            <h2>0</h2>
            <p>Usuarios del sistema</p>
          </div>

        </div>

      </section>

      <section className="dashboard-paneles">

        <div className="panel">

          <h3>Resumen de inventario</h3>

          <p>
            Aquí se mostrará información de productos
            e insumos cuando conectemos el sistema
            con MySQL.
          </p>

        </div>

        <div className="panel">

          <h3>Alertas</h3>

          <p>
            En esta sección aparecerán las alertas
            de stock mínimo y productos próximos
            a vencer.
          </p>

        </div>

      </section>

    </div>
  )
}

export default Dashboard