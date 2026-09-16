import {
  useEffect,
  useState
} from 'react'

import {
  generarAlertas,
  obtenerAlertas,
  actualizarEstadoAlerta
} from '../services/alertaService'

import '../styles/Alertas.css'


function Alertas() {

  const [alertas, setAlertas] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const [filtroEstado, setFiltroEstado] =
    useState('Todas')

  const [filtroTipo, setFiltroTipo] =
    useState('Todos')


  // =========================
  // CARGAR ALERTAS
  // =========================

  const cargarAlertas = async () => {

    try {

      setCargando(true)
      setError('')


      // Primero verificamos las condiciones
      // actuales de productos e insumos.
      await generarAlertas()


      // Después consultamos el historial.
      const datos =
        await obtenerAlertas()


      setAlertas(datos)


    } catch (error) {

      console.error(error)

      setError(
        'No fue posible cargar las alertas.'
      )

    } finally {

      setCargando(false)
    }
  }


  useEffect(() => {

    cargarAlertas()

  }, [])


  // =========================
  // CAMBIAR ESTADO
  // =========================

  const cambiarEstado = async (
    idAlerta,
    estado
  ) => {

    try {

      await actualizarEstadoAlerta(
        idAlerta,
        estado
      )


      await cargarAlertas()


    } catch (error) {

      console.error(error)

      alert(
        error.message
      )
    }
  }


  // =========================
  // INDICADORES
  // =========================

  const alertasActivas =
    alertas.filter(
      (alerta) =>
        alerta.estado === 'Activa'
    )


  const stockMinimo =
    alertasActivas.filter(
      (alerta) =>
        alerta.tipoAlerta ===
        'Stock mínimo'
    ).length


  const proximosVencer =
    alertasActivas.filter(
      (alerta) =>
        alerta.tipoAlerta ===
        'Próximo a vencer'
    ).length


  const vencidos =
    alertasActivas.filter(
      (alerta) =>
        alerta.tipoAlerta ===
        'Vencido'
    ).length


  // =========================
  // FILTROS
  // =========================

  const alertasFiltradas =
    alertas.filter(
      (alerta) => {

        const coincideEstado =
          filtroEstado === 'Todas' ||
          alerta.estado ===
          filtroEstado


        const coincideTipo =
          filtroTipo === 'Todos' ||
          alerta.tipoAlerta ===
          filtroTipo


        return (
          coincideEstado &&
          coincideTipo
        )
      }
    )


  // =========================
  // CLASE VISUAL
  // =========================

  const claseTipoAlerta = (
    tipo
  ) => {

    if (
      tipo === 'Stock mínimo'
    ) {
      return 'stock-minimo'
    }


    if (
      tipo === 'Próximo a vencer'
    ) {
      return 'proximo-vencer'
    }


    if (
      tipo === 'Vencido'
    ) {
      return 'vencido'
    }


    return ''
  }


  return (

    <div className="alertas-page">

      {/* CABECERA */}

      <div className="alertas-cabecera">

        <div>

          <h1>
            Gestión de Alertas
          </h1>

          <p>
            Control de existencias mínimas
            y fechas de vencimiento.
          </p>

        </div>


        <button
          className="btn-actualizar-alertas"
          onClick={cargarAlertas}
        >
          🔄 Actualizar alertas
        </button>

      </div>


      {cargando && (

        <div className="alertas-cargando">
          Analizando productos e insumos...
        </div>

      )}


      {error && (

        <div className="alertas-error">
          ⚠️ {error}
        </div>

      )}


      {/* =========================
          RESUMEN
      ========================= */}

      <section className="alertas-resumen">

        <div className="alerta-card">

          <span>
            Alertas activas
          </span>

          <strong>
            {alertasActivas.length}
          </strong>

        </div>


        <div className="alerta-card">

          <span>
            Stock mínimo
          </span>

          <strong>
            {stockMinimo}
          </strong>

        </div>


        <div className="alerta-card">

          <span>
            Próximos a vencer
          </span>

          <strong>
            {proximosVencer}
          </strong>

        </div>


        <div className="alerta-card">

          <span>
            Vencidos
          </span>

          <strong>
            {vencidos}
          </strong>

        </div>

      </section>


      {/* =========================
          FILTROS
      ========================= */}

      <section className="alertas-contenedor">

        <div className="alertas-titulo">

          <div>

            <h2>
              Alertas registradas
            </h2>

            <p>
              Consulte y gestione las alertas
              generadas por el sistema.
            </p>

          </div>

        </div>


        <div className="alertas-filtros">

          <div className="campo-filtro">

            <label>
              Estado
            </label>

            <select
              value={filtroEstado}
              onChange={
                (evento) =>
                  setFiltroEstado(
                    evento.target.value
                  )
              }
            >

              <option value="Todas">
                Todas
              </option>

              <option value="Activa">
                Activas
              </option>

              <option value="Atendida">
                Atendidas
              </option>

              <option value="Resuelta">
                Resueltas
              </option>

            </select>

          </div>


          <div className="campo-filtro">

            <label>
              Tipo de alerta
            </label>

            <select
              value={filtroTipo}
              onChange={
                (evento) =>
                  setFiltroTipo(
                    evento.target.value
                  )
              }
            >

              <option value="Todos">
                Todos
              </option>

              <option value="Stock mínimo">
                Stock mínimo
              </option>

              <option value="Próximo a vencer">
                Próximo a vencer
              </option>

              <option value="Vencido">
                Vencido
              </option>

            </select>

          </div>

        </div>


        {/* =========================
            TABLA
        ========================= */}

        <div className="tabla-contenedor">

          <table className="tabla-alertas">

            <thead>

              <tr>

                <th>ID</th>
                <th>Tipo</th>
                <th>Elemento</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Generación</th>
                <th>Estado</th>
                <th>Acción</th>

              </tr>

            </thead>


            <tbody>

              {
                alertasFiltradas.length === 0
                  ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="sin-alertas"
                      >
                        No existen alertas
                        para los filtros seleccionados.
                      </td>

                    </tr>

                  )
                  : (

                    alertasFiltradas.map(
                      (alerta) => (

                        <tr
                          key={
                            alerta.idAlerta
                          }
                        >

                          <td>
                            #{alerta.idAlerta}
                          </td>


                          <td>

                            <span
                              className={
                                `tipo-alerta ${claseTipoAlerta(
                                  alerta.tipoAlerta
                                )}`
                              }
                            >

                              {
                                alerta.tipoAlerta
                              }

                            </span>

                          </td>


                          <td>
                            {
                              alerta.nombreElemento
                            }
                          </td>


                          <td>
                            {
                              alerta.tipoElemento
                            }
                          </td>


                          <td className="descripcion-alerta">
                            {
                              alerta.descripcion
                            }
                          </td>


                          <td>
                            {
                              alerta.fechaGeneracion
                            }
                          </td>


                          <td>

                            <span
                              className={
                                `estado-alerta ${alerta.estado.toLowerCase()}`
                              }
                            >

                              {
                                alerta.estado
                              }

                            </span>

                          </td>


                          <td>

                            {
                              alerta.estado ===
                              'Activa'
                                ? (

                                  <button
                                    type="button"
                                    className="btn-atender-alerta"
                                    onClick={() =>
                                      cambiarEstado(
                                        alerta.idAlerta,
                                        'Atendida'
                                      )
                                    }
                                  >
                                    ✅ Atender
                                  </button>

                                )
                                : (

                                  <span className="alerta-sin-accion">
                                    —
                                  </span>

                                )
                            }

                          </td>

                        </tr>

                      )
                    )

                  )
              }

            </tbody>

          </table>

        </div>

      </section>

    </div>
  )
}


export default Alertas