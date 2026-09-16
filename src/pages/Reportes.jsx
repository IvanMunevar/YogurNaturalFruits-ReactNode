import {
  useEffect,
  useState
} from 'react'

import {
  generarReporte,
  obtenerReportes
} from '../services/reporteService'

import '../styles/Reportes.css'


function Reportes() {

  // =========================
  // USUARIO AUTENTICADO
  // =========================

  const [usuario] =
    useState(() => {

      const datos =
        sessionStorage.getItem(
          'usuario'
        )

      return datos
        ? JSON.parse(datos)
        : null
    })


  // =========================
  // ESTADOS
  // =========================

  const [formulario, setFormulario] =
    useState({

      tipoReporte: 'Ventas',
      fechaInicio: '',
      fechaFin: ''

    })


  const [reporte, setReporte] =
    useState(null)


  const [historial, setHistorial] =
    useState([])


  const [cargando, setCargando] =
    useState(false)


  const [error, setError] =
    useState('')


  // =========================
  // CARGAR HISTORIAL
  // =========================

  const cargarHistorial = async () => {

    try {

      const datos =
        await obtenerReportes()

      setHistorial(datos)

    } catch (error) {

      console.error(error)
    }
  }


  useEffect(() => {

    cargarHistorial()

  }, [])


  // =========================
  // MANEJAR CAMBIOS
  // =========================

  const manejarCambio = (
    evento
  ) => {

    const {
      name,
      value
    } = evento.target


    setFormulario(
      (anterior) => ({

        ...anterior,

        [name]: value

      })
    )
  }


  // =========================
  // GENERAR REPORTE
  // =========================

  const manejarGenerarReporte =
    async (
      evento
    ) => {

      evento.preventDefault()


      if (!usuario) {

        alert(
          'No se encontró un usuario autenticado.'
        )

        return
      }


      if (
        formulario.fechaInicio &&
        formulario.fechaFin &&
        formulario.fechaInicio >
        formulario.fechaFin
      ) {

        alert(
          'La fecha inicial no puede ser posterior a la fecha final.'
        )

        return
      }


      try {

        setCargando(true)
        setError('')


        const datos = {

          tipoReporte:
            formulario.tipoReporte,

          idUsuario:
            usuario.idUsuario

        }


        // Inventario representa el estado
        // actual y no requiere fechas.

        if (
          formulario.tipoReporte !==
          'Inventario'
        ) {

          if (
            formulario.fechaInicio
          ) {

            datos.fechaInicio =
              formulario.fechaInicio
          }


          if (
            formulario.fechaFin
          ) {

            datos.fechaFin =
              formulario.fechaFin
          }
        }


        const resultado =
          await generarReporte(
            datos
          )


        setReporte(resultado)


        await cargarHistorial()


      } catch (error) {

        console.error(error)

        setError(
          error.message
        )

      } finally {

        setCargando(false)
      }
    }


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
      Number(valor || 0)
    )
  }


  // =========================
  // FORMATO FECHA
  // =========================

  const formatearFecha = (
    fecha
  ) => {

    if (!fecha) {
      return 'Sin fecha'
    }


    const fechaTexto =
      String(fecha).substring(
        0,
        10
      )


    const [
      anio,
      mes,
      dia
    ] =
      fechaTexto.split('-')


    if (
      !anio ||
      !mes ||
      !dia
    ) {

      return fecha
    }


    return `${dia}/${mes}/${anio}`
  }


  // =========================
  // IMPRIMIR
  // =========================

  const imprimirReporte = () => {

    window.print()
  }


  return (

    <div className="reportes-page">

      {/* =====================
          CABECERA
      ===================== */}

      <div className="reportes-cabecera no-imprimir">

        <div>

          <h1>
            Gestión de Reportes
          </h1>

          <p>
            Consulte información consolidada
            del sistema Yogur Natural Fruits.
          </p>

        </div>

      </div>


      {/* =====================
          FORMULARIO
      ===================== */}

      <section className="reporte-formulario-contenedor no-imprimir">

        <h2>
          Generar reporte
        </h2>


        <form
          onSubmit={
            manejarGenerarReporte
          }
        >

          <div className="reporte-formulario">

            <div className="campo-reporte">

              <label>
                Tipo de reporte
              </label>

              <select
                name="tipoReporte"
                value={
                  formulario.tipoReporte
                }
                onChange={
                  manejarCambio
                }
              >

                <option value="Ventas">
                  Ventas
                </option>

                <option value="Inventario">
                  Inventario
                </option>

                <option value="Pedidos">
                  Pedidos
                </option>

                <option value="Alertas">
                  Alertas
                </option>

              </select>

            </div>


            <div className="campo-reporte">

              <label>
                Fecha inicial
              </label>

              <input
                type="date"
                name="fechaInicio"
                value={
                  formulario.fechaInicio
                }
                onChange={
                  manejarCambio
                }
                disabled={
                  formulario.tipoReporte ===
                  'Inventario'
                }
              />

            </div>


            <div className="campo-reporte">

              <label>
                Fecha final
              </label>

              <input
                type="date"
                name="fechaFin"
                value={
                  formulario.fechaFin
                }
                onChange={
                  manejarCambio
                }
                disabled={
                  formulario.tipoReporte ===
                  'Inventario'
                }
              />

            </div>


            <div className="campo-reporte campo-boton">

              <button
                type="submit"
                className="btn-generar-reporte"
                disabled={cargando}
              >

                {
                  cargando
                    ? 'Generando...'
                    : '📊 Generar reporte'
                }

              </button>

            </div>

          </div>

        </form>


        {
          formulario.tipoReporte ===
          'Inventario' && (

            <p className="mensaje-inventario">
              El reporte de inventario
              muestra las existencias actuales,
              por lo cual no requiere rango
              de fechas.
            </p>

          )
        }


        {error && (

          <div className="reportes-error">
            ⚠️ {error}
          </div>

        )}

      </section>


      {/* =====================
          REPORTE GENERADO
      ===================== */}

      {reporte && (

        <section
          className="reporte-generado"
          id="reporte-imprimible"
        >

          <div className="reporte-encabezado">

            <div>

              <h2>
                Yogur Natural Fruits
              </h2>

              <h3>
                Reporte de {
                  reporte.tipoReporte
                }
              </h3>


              <p>
                Reporte N.º {
                  reporte.idReporte
                }
              </p>

            </div>


            <button
              type="button"
              className="btn-imprimir no-imprimir"
              onClick={
                imprimirReporte
              }
            >
              🖨 Imprimir
            </button>

          </div>


          <div className="datos-generacion">

            <span>
              <strong>
                Generado por:
              </strong>
              {' '}
              {
                usuario
                  ?.nombreUsuario
              }
            </span>


            {
              reporte.fechaInicio && (

                <span>

                  <strong>
                    Desde:
                  </strong>
                  {' '}
                  {
                    formatearFecha(
                      reporte.fechaInicio
                    )
                  }

                </span>

              )
            }


            {
              reporte.fechaFin && (

                <span>

                  <strong>
                    Hasta:
                  </strong>
                  {' '}
                  {
                    formatearFecha(
                      reporte.fechaFin
                    )
                  }

                </span>

              )
            }

          </div>


          {/* =====================
              VENTAS
          ===================== */}

          {
            reporte.tipoReporte ===
            'Ventas' && (

              <ReporteVentas
                reporte={reporte}
                formatearPrecio={
                  formatearPrecio
                }
              />

            )
          }


          {/* =====================
              PEDIDOS
          ===================== */}

          {
            reporte.tipoReporte ===
            'Pedidos' && (

              <ReportePedidos
                reporte={reporte}
                formatearPrecio={
                  formatearPrecio
                }
              />

            )
          }


          {/* =====================
              INVENTARIO
          ===================== */}

          {
            reporte.tipoReporte ===
            'Inventario' && (

              <ReporteInventario
                reporte={reporte}
                formatearFecha={
                  formatearFecha
                }
              />

            )
          }


          {/* =====================
              ALERTAS
          ===================== */}

          {
            reporte.tipoReporte ===
            'Alertas' && (

              <ReporteAlertas
                reporte={reporte}
              />

            )
          }

        </section>

      )}


      {/* =====================
          HISTORIAL
      ===================== */}

      <section className="historial-reportes no-imprimir">

        <div className="historial-titulo">

          <h2>
            Historial de reportes
          </h2>

          <span>
            {historial.length}
            {' '}
            registros
          </span>

        </div>


        <div className="tabla-contenedor">

          <table className="tabla-reportes">

            <thead>

              <tr>

                <th>ID</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Usuario</th>

              </tr>

            </thead>


            <tbody>

              {
                historial.length === 0
                  ? (

                    <tr>

                      <td
                        colSpan="5"
                        className="sin-reportes"
                      >
                        No existen reportes
                        registrados.
                      </td>

                    </tr>

                  )
                  : (

                    historial.map(
                      (item) => (

                        <tr
                          key={
                            item.idReporte
                          }
                        >

                          <td>
                            #{item.idReporte}
                          </td>

                          <td>
                            {
                              item.tipoReporte
                            }
                          </td>

                          <td>
                            {
                              item.descripcion
                            }
                          </td>

                          <td>
                            {
                              item.fechaGeneracion
                            }
                          </td>

                          <td>
                            {
                              item.nombreUsuario
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


// ==================================================
// REPORTE VENTAS
// ==================================================

function ReporteVentas({
  reporte,
  formatearPrecio
}) {

  return (

    <>

      <div className="reporte-resumen">

        <div>

          <span>
            Ventas realizadas
          </span>

          <strong>
            {
              reporte.resumen
                .cantidadVentas
            }
          </strong>

        </div>


        <div>

          <span>
            Total vendido
          </span>

          <strong>
            {
              formatearPrecio(
                reporte.resumen
                  .totalVentas
              )
            }
          </strong>

        </div>

      </div>


      <div className="tabla-contenedor">

        <table className="tabla-reporte">

          <thead>

            <tr>

              <th>Venta</th>
              <th>Fecha</th>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Responsable</th>
              <th>Método</th>
              <th>Total</th>

            </tr>

          </thead>


          <tbody>

            {
              reporte.datos.map(
                (venta) => (

                  <tr
                    key={
                      venta.idVenta
                    }
                  >

                    <td>
                      #{venta.idVenta}
                    </td>

                    <td>
                      {venta.fechaVenta}
                    </td>

                    <td>
                      #{venta.idPedido}
                    </td>

                    <td>
                      {
                        venta.nombreCliente
                      }
                    </td>

                    <td>
                      {
                        venta.nombreUsuario
                      }
                    </td>

                    <td>
                      {
                        venta.metodoPago
                      }
                    </td>

                    <td>
                      {
                        formatearPrecio(
                          venta.total
                        )
                      }
                    </td>

                  </tr>

                )
              )
            }

          </tbody>

        </table>

      </div>

    </>
  )
}


// ==================================================
// REPORTE PEDIDOS
// ==================================================

function ReportePedidos({
  reporte,
  formatearPrecio
}) {

  return (

    <>

      <div className="reporte-resumen reporte-resumen-cinco">

        <div>
          <span>Total</span>
          <strong>
            {reporte.resumen.total}
          </strong>
        </div>

        <div>
          <span>Pendientes</span>
          <strong>
            {reporte.resumen.pendientes}
          </strong>
        </div>

        <div>
          <span>Confirmados</span>
          <strong>
            {reporte.resumen.confirmados}
          </strong>
        </div>

        <div>
          <span>Entregados</span>
          <strong>
            {reporte.resumen.entregados}
          </strong>
        </div>

        <div>
          <span>Cancelados</span>
          <strong>
            {reporte.resumen.cancelados}
          </strong>
        </div>

      </div>


      <div className="tabla-contenedor">

        <table className="tabla-reporte">

          <thead>

            <tr>

              <th>Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Total</th>

            </tr>

          </thead>


          <tbody>

            {
              reporte.datos.map(
                (pedido) => (

                  <tr
                    key={
                      pedido.idPedido
                    }
                  >

                    <td>
                      #{pedido.idPedido}
                    </td>

                    <td>
                      {
                        pedido.fechaPedido
                      }
                    </td>

                    <td>
                      {
                        pedido.nombreCliente
                      }
                    </td>

                    <td>
                      {
                        pedido.nombreUsuario
                      }
                    </td>

                    <td>
                      {
                        pedido.estadoPedido
                      }
                    </td>

                    <td>
                      {
                        formatearPrecio(
                          pedido.total
                        )
                      }
                    </td>

                  </tr>

                )
              )
            }

          </tbody>

        </table>

      </div>

    </>
  )
}


// ==================================================
// REPORTE INVENTARIO
// ==================================================

function ReporteInventario({
  reporte,
  formatearFecha
}) {

  return (

    <>

      <div className="reporte-resumen">

        <div>

          <span>
            Productos
          </span>

          <strong>
            {
              reporte.resumen
                .totalProductos
            }
          </strong>

        </div>


        <div>

          <span>
            Insumos
          </span>

          <strong>
            {
              reporte.resumen
                .totalInsumos
            }
          </strong>

        </div>


        <div>

          <span>
            Productos bajo mínimo
          </span>

          <strong>
            {
              reporte.resumen
                .productosStockBajo
            }
          </strong>

        </div>


        <div>

          <span>
            Insumos bajo mínimo
          </span>

          <strong>
            {
              reporte.resumen
                .insumosStockBajo
            }
          </strong>

        </div>

      </div>


      <h3 className="subtitulo-reporte">
        Productos
      </h3>


      <div className="tabla-contenedor">

        <table className="tabla-reporte">

          <thead>

            <tr>

              <th>Producto</th>
              <th>Stock</th>
              <th>Mínimo</th>
              <th>Vencimiento</th>
              <th>Estado</th>

            </tr>

          </thead>


          <tbody>

            {
              reporte.productos.map(
                (producto) => (

                  <tr
                    key={
                      producto.idProducto
                    }
                  >

                    <td>
                      {producto.nombre}
                    </td>

                    <td>
                      {producto.cantidad}
                    </td>

                    <td>
                      {producto.minimo}
                    </td>

                    <td>
                      {
                        formatearFecha(
                          producto
                            .fechaVencimiento
                        )
                      }
                    </td>

                    <td>
                      {producto.estado}
                    </td>

                  </tr>

                )
              )
            }

          </tbody>

        </table>

      </div>


      <h3 className="subtitulo-reporte">
        Insumos
      </h3>


      <div className="tabla-contenedor">

        <table className="tabla-reporte">

          <thead>

            <tr>

              <th>Insumo</th>
              <th>Cantidad</th>
              <th>Mínimo</th>
              <th>Unidad</th>
              <th>Proveedor</th>
              <th>Vencimiento</th>
              <th>Estado</th>

            </tr>

          </thead>


          <tbody>

            {
              reporte.insumos.map(
                (insumo) => (

                  <tr
                    key={
                      insumo.idInsumo
                    }
                  >

                    <td>
                      {insumo.nombre}
                    </td>

                    <td>
                      {insumo.cantidad}
                    </td>

                    <td>
                      {insumo.minimo}
                    </td>

                    <td>
                      {
                        insumo.unidadMedida
                      }
                    </td>

                    <td>
                      {
                        insumo
                          .nombreProveedor
                      }
                    </td>

                    <td>
                      {
                        formatearFecha(
                          insumo
                            .fechaVencimiento
                        )
                      }
                    </td>

                    <td>
                      {insumo.estado}
                    </td>

                  </tr>

                )
              )
            }

          </tbody>

        </table>

      </div>

    </>
  )
}


// ==================================================
// REPORTE ALERTAS
// ==================================================

function ReporteAlertas({
  reporte
}) {

  return (

    <>

      <div className="reporte-resumen reporte-resumen-alertas">

        <div>
          <span>Total</span>
          <strong>
            {reporte.resumen.total}
          </strong>
        </div>

        <div>
          <span>Activas</span>
          <strong>
            {reporte.resumen.activas}
          </strong>
        </div>

        <div>
          <span>Atendidas</span>
          <strong>
            {reporte.resumen.atendidas}
          </strong>
        </div>

        <div>
          <span>Resueltas</span>
          <strong>
            {reporte.resumen.resueltas}
          </strong>
        </div>

        <div>
          <span>Stock mínimo</span>
          <strong>
            {reporte.resumen.stockMinimo}
          </strong>
        </div>

        <div>
          <span>Por vencer</span>
          <strong>
            {reporte.resumen.proximosVencer}
          </strong>
        </div>

        <div>
          <span>Vencidos</span>
          <strong>
            {reporte.resumen.vencidos}
          </strong>
        </div>

      </div>


      <div className="tabla-contenedor">

        <table className="tabla-reporte">

          <thead>

            <tr>

              <th>ID</th>
              <th>Tipo</th>
              <th>Elemento</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Estado</th>

            </tr>

          </thead>


          <tbody>

            {
              reporte.datos.map(
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
                      {
                        alerta.tipoAlerta
                      }
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

                    <td>
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
                      {alerta.estado}
                    </td>

                  </tr>

                )
              )
            }

          </tbody>

        </table>

      </div>

    </>
  )
}


export default Reportes