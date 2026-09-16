import {
  useEffect,
  useState
} from 'react'

import {
  obtenerResumenDashboard
} from '../services/dashboardService'

import {
  obtenerAlertas
} from '../services/alertaService'

import '../styles/Dashboard.css'


function Dashboard() {

  const [resumen, setResumen] =
    useState({

      productos: 0,
      insumos: 0,
      usuarios: 0,
      clientes: 0,

      pedidosPendientes: 0,
      pedidosConfirmados: 0,

      ventasRegistradas: 0,
      totalVentas: 0,

      alertasActivas: 0,

      productosStockBajo: 0,
      insumosStockBajo: 0

    })


  const [alertas, setAlertas] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')


  // =========================
  // CARGAR DASHBOARD
  // =========================

  const cargarDashboard = async () => {

    try {

      setCargando(true)
      setError('')


      const [
        datosResumen,
        datosAlertas
      ] = await Promise.all([

        obtenerResumenDashboard(),

        obtenerAlertas()

      ])


      setResumen(
        datosResumen
      )


      setAlertas(
        datosAlertas.filter(
          (alerta) =>
            alerta.estado ===
            'Activa'
        )
      )


    } catch (error) {

      console.error(error)

      setError(
        'No fue posible cargar la información del Dashboard.'
      )

    } finally {

      setCargando(false)
    }
  }


  useEffect(() => {

    cargarDashboard()

  }, [])


  // =========================
  // FORMATO MONEDA
  // =========================

  const formatearPrecio = (
    valor
  ) => {

    return new Intl.NumberFormat(
      'es-CO',
      {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }
    ).format(
      Number(valor)
    )
  }


  return (

    <div className="dashboard-page">

      {/* CABECERA */}

      <div className="dashboard-presentacion">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Bienvenido al Sistema de Gestión
            de Yogur Natural Fruits
          </p>

        </div>


        <button
          type="button"
          className="btn-actualizar-dashboard"
          onClick={cargarDashboard}
        >
          🔄 Actualizar
        </button>

      </div>


      {cargando && (

        <div className="dashboard-cargando">
          Cargando información...
        </div>

      )}


      {error && (

        <div className="dashboard-error">
          ⚠️ {error}
        </div>

      )}


      {/* =========================
          CARDS PRINCIPALES
      ========================= */}

      <section className="dashboard-cards">

        <article className="dashboard-card">

          <div className="dashboard-icono">
            🥛
          </div>

          <div>

            <span>
              Productos
            </span>

            <strong>
              {resumen.productos}
            </strong>

            <p>
              Productos registrados
            </p>

          </div>

        </article>


        <article className="dashboard-card">

          <div className="dashboard-icono">
            📦
          </div>

          <div>

            <span>
              Insumos
            </span>

            <strong>
              {resumen.insumos}
            </strong>

            <p>
              Insumos registrados
            </p>

          </div>

        </article>


        <article className="dashboard-card">

          <div className="dashboard-icono">
            💰
          </div>

          <div>

            <span>
              Ventas
            </span>

            <strong>
              {
                formatearPrecio(
                  resumen.totalVentas
                )
              }
            </strong>

            <p>
              {resumen.ventasRegistradas}
              {' '}
              ventas registradas
            </p>

          </div>

        </article>


        <article className="dashboard-card">

          <div className="dashboard-icono">
            👥
          </div>

          <div>

            <span>
              Usuarios
            </span>

            <strong>
              {resumen.usuarios}
            </strong>

            <p>
              Usuarios del sistema
            </p>

          </div>

        </article>

      </section>


      {/* =========================
          INFORMACIÓN ADICIONAL
      ========================= */}

      <section className="dashboard-secundario">

        <article className="dashboard-panel">

          <h2>
            Resumen general
          </h2>


          <div className="resumen-grid">

            <div className="resumen-item">

              <span>
                👤 Clientes
              </span>

              <strong>
                {resumen.clientes}
              </strong>

            </div>


            <div className="resumen-item">

              <span>
                📋 Pedidos pendientes
              </span>

              <strong>
                {
                  resumen
                    .pedidosPendientes
                }
              </strong>

            </div>


            <div className="resumen-item">

              <span>
                ✅ Pedidos confirmados
              </span>

              <strong>
                {
                  resumen
                    .pedidosConfirmados
                }
              </strong>

            </div>


            <div className="resumen-item">

              <span>
                💵 Ventas realizadas
              </span>

              <strong>
                {
                  resumen
                    .ventasRegistradas
                }
              </strong>

            </div>

          </div>

        </article>


        {/* ALERTAS */}

        <article className="dashboard-panel alertas-panel">

          <div className="panel-titulo">

            <h2>
              Alertas
            </h2>

            <span className="contador-alertas">
              {resumen.alertasActivas}
            </span>

          </div>


          {alertas.length === 0 ? (

            <div className="dashboard-sin-alertas">

              ✅ No existen alertas
              activas actualmente.

            </div>

          ) : (

            <div className="dashboard-lista-alertas">

              {
                alertas
                  .slice(0, 5)
                  .map(
                    (alerta) => (

                      <div
                        className="dashboard-alerta"
                        key={
                          alerta.idAlerta
                        }
                      >

                        <div>

                          <strong>
                            ⚠️ {
                              alerta.tipoAlerta
                            }
                          </strong>

                          <span>
                            {
                              alerta.nombreElemento
                            }
                          </span>

                        </div>

                      </div>

                    )
                  )
              }

          </div>

          )}

        </article>

      </section>


      {/* =========================
          RESUMEN INVENTARIO
      ========================= */}

      <section className="dashboard-panel">

        <h2>
          Resumen de inventario
        </h2>


        <div className="inventario-dashboard">

          <div className="inventario-resumen-item">

            <span>
              Productos con stock mínimo
            </span>

            <strong>
              {
                resumen
                  .productosStockBajo
              }
            </strong>

          </div>


          <div className="inventario-resumen-item">

            <span>
              Insumos con cantidad mínima
            </span>

            <strong>
              {
                resumen
                  .insumosStockBajo
              }
            </strong>

          </div>


          <div className="inventario-resumen-item">

            <span>
              Total de alertas activas
            </span>

            <strong>
              {
                resumen
                  .alertasActivas
              }
            </strong>

          </div>

        </div>

      </section>

    </div>
  )
}


export default Dashboard