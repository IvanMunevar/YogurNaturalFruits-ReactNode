import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta
} from '../services/ventaService'

import {
  obtenerPedidos,
  obtenerPedidoPorId
} from '../services/pedidoService'

import '../styles/Ventas.css'


function Ventas() {

  const navigate =
    useNavigate()


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


  const [ventas, setVentas] =
    useState([])

  const [pedidos, setPedidos] =
    useState([])

  const [pedidoSeleccionado,
    setPedidoSeleccionado] =
    useState(null)

  const [ventaDetalle,
    setVentaDetalle] =
    useState(null)

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')


  const [formulario, setFormulario] =
    useState({

      idPedido: '',
      metodoPago: 'Efectivo'

    })


  // =========================
  // CARGAR INFORMACIÓN
  // =========================

  const cargarDatos = async () => {

    try {

      setCargando(true)

      setError('')


      const [
        datosVentas,
        datosPedidos
      ] = await Promise.all([

        obtenerVentas(),

        obtenerPedidos()

      ])


      setVentas(
        datosVentas
      )


      // Solo pedidos confirmados
      setPedidos(
        datosPedidos.filter(
          (pedido) =>
            pedido.estadoPedido ===
            'Confirmado'
        )
      )


    } catch (error) {

      console.error(error)

      setError(
        'No fue posible cargar la información de ventas.'
      )

    } finally {

      setCargando(false)
    }
  }


  useEffect(() => {

    if (!usuario) {

      navigate('/')

      return
    }


    cargarDatos()

  }, [navigate, usuario])


  // =========================
  // SELECCIONAR PEDIDO
  // =========================

  const seleccionarPedido = async (
    evento
  ) => {

    const idPedido =
      evento.target.value


    setFormulario(
      (anterior) => ({

        ...anterior,

        idPedido

      })
    )


    if (idPedido === '') {

      setPedidoSeleccionado(null)

      return
    }


    try {

      const pedido =
        await obtenerPedidoPorId(
          Number(idPedido)
        )


      setPedidoSeleccionado(
        pedido
      )


    } catch (error) {

      console.error(error)

      setPedidoSeleccionado(null)

      alert(
        error.message
      )
    }
  }


  // =========================
  // MÉTODO DE PAGO
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
  // REGISTRAR VENTA
  // =========================

  const guardarVenta = async (
    evento
  ) => {

    evento.preventDefault()


    if (
      formulario.idPedido === ''
    ) {

      alert(
        'Debe seleccionar un pedido confirmado.'
      )

      return
    }


    const confirmar =
      window.confirm(
        '¿Desea registrar esta venta? Al hacerlo se descontará el stock de los productos.'
      )


    if (!confirmar) {
      return
    }


    try {

      const respuesta =
        await crearVenta({

          idPedido:
            Number(
              formulario.idPedido
            ),

          metodoPago:
            formulario.metodoPago

        })


      alert(
        `Venta #${respuesta.venta.idVenta} registrada correctamente.`
      )


      // Limpiar
      setFormulario({

        idPedido: '',
        metodoPago: 'Efectivo'

      })


      setPedidoSeleccionado(
        null
      )


      // Recargar ventas y pedidos.
      // El pedido vendido ya no aparecerá
      // porque ahora quedó Entregado.
      await cargarDatos()


    } catch (error) {

      console.error(error)

      alert(
        error.message
      )
    }
  }


  // =========================
  // VER DETALLE DE VENTA
  // =========================

  const verDetalleVenta = async (
    idVenta
  ) => {

    try {

      const datos =
        await obtenerVentaPorId(
          idVenta
        )


      setVentaDetalle(
        datos
      )


    } catch (error) {

      console.error(error)

      alert(
        error.message
      )
    }
  }


  // =========================
  // FORMATEAR DINERO
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


  // =========================
  // INDICADORES
  // =========================

  const totalIngresos =
    ventas.reduce(
      (total, venta) =>
        total +
        Number(venta.total),
      0
    )


  return (

    <div className="ventas-page">

      {/* =====================
          CABECERA
      ===================== */}

      <div className="ventas-cabecera">

        <h1>
          Gestión de Ventas
        </h1>

        <p>
          Registre las ventas provenientes
          de pedidos confirmados.
        </p>

      </div>


      {cargando && (

        <div className="ventas-cargando">
          Cargando ventas...
        </div>

      )}


      {error && (

        <div className="ventas-error">
          ⚠️ {error}
        </div>

      )}


      {/* =====================
          INDICADORES
      ===================== */}

      <section className="ventas-resumen">

        <div className="venta-card">

          <span>
            Ventas registradas
          </span>

          <strong>
            {ventas.length}
          </strong>

        </div>


        <div className="venta-card">

          <span>
            Ingresos registrados
          </span>

          <strong>
            {
              formatearPrecio(
                totalIngresos
              )
            }
          </strong>

        </div>


        <div className="venta-card">

          <span>
            Pedidos por vender
          </span>

          <strong>
            {pedidos.length}
          </strong>

        </div>

      </section>


      {/* =====================
          NUEVA VENTA
      ===================== */}

      <section className="venta-contenedor">

        <div className="venta-titulo">

          <h2>
            Registrar venta
          </h2>

          <p>
            Seleccione un pedido previamente
            confirmado.
          </p>

        </div>


        <form
          onSubmit={guardarVenta}
        >

          <div className="venta-formulario">

            <div className="campo-venta">

              <label>
                Pedido confirmado *
              </label>

              <select
                name="idPedido"
                value={
                  formulario.idPedido
                }
                onChange={
                  seleccionarPedido
                }
              >

                <option value="">
                  Seleccione un pedido
                </option>


                {pedidos.map(
                  (pedido) => (

                    <option
                      key={
                        pedido.idPedido
                      }
                      value={
                        pedido.idPedido
                      }
                    >

                      Pedido #{pedido.idPedido}
                      {' - '}
                      {pedido.nombreCliente}
                      {' - '}
                      {
                        formatearPrecio(
                          pedido.total
                        )
                      }

                    </option>

                  )
                )}

              </select>

            </div>


            <div className="campo-venta">

              <label>
                Método de pago *
              </label>

              <select
                name="metodoPago"
                value={
                  formulario.metodoPago
                }
                onChange={manejarCambio}
              >

                <option value="Efectivo">
                  Efectivo
                </option>

                <option value="Transferencia">
                  Transferencia
                </option>

                <option value="Tarjeta">
                  Tarjeta
                </option>

                <option value="Nequi">
                  Nequi
                </option>

                <option value="Daviplata">
                  Daviplata
                </option>

              </select>

            </div>

          </div>


          {/* =====================
              PEDIDO SELECCIONADO
          ===================== */}

          {pedidoSeleccionado && (

            <div className="pedido-venta-detalle">

              <div className="pedido-venta-info">

                <div>

                  <span>
                    Cliente
                  </span>

                  <strong>
                    {
                      pedidoSeleccionado
                        .nombreCliente
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Pedido
                  </span>

                  <strong>
                    #
                    {
                      pedidoSeleccionado
                        .idPedido
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Estado
                  </span>

                  <strong>
                    {
                      pedidoSeleccionado
                        .estadoPedido
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Total
                  </span>

                  <strong>
                    {
                      formatearPrecio(
                        pedidoSeleccionado
                          .total
                      )
                    }
                  </strong>

                </div>

              </div>


              <div className="tabla-contenedor">

                <table className="tabla-venta-productos">

                  <thead>

                    <tr>

                      <th>
                        Producto
                      </th>

                      <th>
                        Cantidad
                      </th>

                      <th>
                        Precio
                      </th>

                      <th>
                        Subtotal
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {
                      pedidoSeleccionado
                        .productos
                        .map(
                          (producto) => (

                            <tr
                              key={
                                producto
                                  .idDetallePedido
                              }
                            >

                              <td>
                                {
                                  producto
                                    .nombreProducto
                                }
                              </td>

                              <td>
                                {
                                  producto
                                    .cantidad
                                }
                              </td>

                              <td>
                                {
                                  formatearPrecio(
                                    producto
                                      .precioUnitario
                                  )
                                }
                              </td>

                              <td>
                                {
                                  formatearPrecio(
                                    producto
                                      .subtotal
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

            </div>

          )}


          <div className="venta-acciones">

            <button
              type="submit"
              className="btn-registrar-venta"
              disabled={
                !pedidoSeleccionado
              }
            >
              💰 Registrar venta
            </button>

          </div>

        </form>

      </section>


      {/* =====================
          HISTORIAL
      ===================== */}

      <section className="ventas-historial">

        <div className="venta-titulo">

          <h2>
            Historial de ventas
          </h2>

          <p>
            Total de ventas:
            {' '}
            {ventas.length}
          </p>

        </div>


        <div className="tabla-contenedor">

          <table className="tabla-ventas">

            <thead>

              <tr>

                <th>ID</th>
                <th>Fecha</th>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Responsable</th>
                <th>Método</th>
                <th>Total</th>
                <th>Detalle</th>

              </tr>

            </thead>


            <tbody>

              {ventas.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="sin-ventas"
                  >
                    No existen ventas registradas.
                  </td>

                </tr>

              ) : (

                ventas.map(
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

                      <td>

                        <button
                          type="button"
                          className="btn-ver-venta"
                          onClick={() =>
                            verDetalleVenta(
                              venta.idVenta
                            )
                          }
                        >
                          👁 Ver
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =====================
          DETALLE VENTA
      ===================== */}

      {ventaDetalle && (

        <section className="venta-detalle-card">

          <div className="venta-detalle-cabecera">

            <div>

              <h2>
                Venta #{ventaDetalle.idVenta}
              </h2>

              <p>
                Pedido #
                {ventaDetalle.idPedido}
              </p>

            </div>


            <button
              type="button"
              className="btn-cerrar-venta"
              onClick={() =>
                setVentaDetalle(null)
              }
            >
              ✕
            </button>

          </div>


          <div className="venta-detalle-info">

            <div>

              <span>
                Cliente
              </span>

              <strong>
                {
                  ventaDetalle
                    .nombreCliente
                }
              </strong>

            </div>


            <div>

              <span>
                Fecha
              </span>

              <strong>
                {
                  ventaDetalle
                    .fechaVenta
                }
              </strong>

            </div>


            <div>

              <span>
                Método de pago
              </span>

              <strong>
                {
                  ventaDetalle
                    .metodoPago
                }
              </strong>

            </div>


            <div>

              <span>
                Responsable
              </span>

              <strong>
                {
                  ventaDetalle
                    .nombreUsuario
                }
              </strong>

            </div>

          </div>


          <div className="tabla-contenedor">

            <table className="tabla-venta-productos">

              <thead>

                <tr>

                  <th>
                    Producto
                  </th>

                  <th>
                    Cantidad
                  </th>

                  <th>
                    Precio
                  </th>

                  <th>
                    Subtotal
                  </th>

                </tr>

              </thead>


              <tbody>

                {
                  ventaDetalle
                    .productos
                    .map(
                      (producto) => (

                        <tr
                          key={
                            producto.idDetalle
                          }
                        >

                          <td>
                            {
                              producto
                                .nombreProducto
                            }
                          </td>

                          <td>
                            {
                              producto.cantidad
                            }
                          </td>

                          <td>
                            {
                              formatearPrecio(
                                producto
                                  .precioUnitario
                              )
                            }
                          </td>

                          <td>
                            {
                              formatearPrecio(
                                producto
                                  .subtotal
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


          <div className="venta-total">

            <span>
              Total de la venta
            </span>

            <strong>
              {
                formatearPrecio(
                  ventaDetalle.total
                )
              }
            </strong>

          </div>

        </section>

      )}

    </div>
  )
}


export default Ventas