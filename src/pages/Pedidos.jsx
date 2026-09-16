import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido
} from '../services/pedidoService'

import {
  obtenerClientes
} from '../services/clienteService'

import {
  obtenerProductos
} from '../services/productoService'

import '../styles/Pedidos.css'


function Pedidos() {

  const navigate = useNavigate()


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


  const [pedidos, setPedidos] =
    useState([])

  const [clientes, setClientes] =
    useState([])

  const [productos, setProductos] =
    useState([])

  const [productosPedido, setProductosPedido] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const [pedidoDetalle, setPedidoDetalle] =
    useState(null)


  // =========================
  // FORMULARIO PRINCIPAL
  // =========================

  const [formulario, setFormulario] =
    useState({

      idCliente: '',
      estadoPedido: 'Pendiente'

    })


  // =========================
  // PRODUCTO A AGREGAR
  // =========================

  const [productoActual, setProductoActual] =
    useState({

      idProducto: '',
      cantidad: 1

    })


  // =========================
  // CARGAR INFORMACIÓN
  // =========================

  const cargarDatos = async () => {

    try {

      setCargando(true)
      setError('')


      const [
        datosPedidos,
        datosClientes,
        datosProductos
      ] = await Promise.all([

        obtenerPedidos(),

        obtenerClientes(),

        obtenerProductos()

      ])


      setPedidos(
        datosPedidos
      )

      setClientes(
        datosClientes
      )

      setProductos(
        datosProductos
      )


    } catch (error) {

      console.error(error)

      setError(
        'No fue posible cargar la información.'
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
  // CAMBIOS FORMULARIO
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
  // CAMBIO PRODUCTO
  // =========================

  const manejarProductoActual = (
    evento
  ) => {

    const {
      name,
      value
    } = evento.target


    setProductoActual(
      (anterior) => ({

        ...anterior,

        [name]: value

      })
    )
  }


  // =========================
  // AGREGAR PRODUCTO
  // =========================

  const agregarProducto = () => {

    if (
      productoActual.idProducto === ''
    ) {

      alert(
        'Seleccione un producto.'
      )

      return
    }


    if (
      Number(
        productoActual.cantidad
      ) <= 0
    ) {

      alert(
        'La cantidad debe ser mayor a cero.'
      )

      return
    }


    const producto =
      productos.find(
        (item) =>
          item.idProducto ===
          Number(
            productoActual.idProducto
          )
      )


    if (!producto) {

      alert(
        'Producto no encontrado.'
      )

      return
    }


    const yaExiste =
      productosPedido.find(
        (item) =>
          item.idProducto ===
          producto.idProducto
      )


    // Si ya existe, aumenta cantidad
    if (yaExiste) {

      setProductosPedido(
        (anterior) =>
          anterior.map(
            (item) =>

              item.idProducto ===
              producto.idProducto

                ? {
                    ...item,

                    cantidad:
                      item.cantidad +
                      Number(
                        productoActual.cantidad
                      )
                  }

                : item
          )
      )

    } else {

      setProductosPedido(
        (anterior) => [

          ...anterior,

          {
            idProducto:
              producto.idProducto,

            nombreProducto:
              producto.nombreProducto,

            precio:
              Number(producto.precio),

            cantidad:
              Number(
                productoActual.cantidad
              )
          }

        ]
      )
    }


    setProductoActual({

      idProducto: '',
      cantidad: 1

    })
  }


  // =========================
  // CAMBIAR CANTIDAD
  // =========================

  const cambiarCantidad = (
    idProducto,
    nuevaCantidad
  ) => {

    const cantidad =
      Number(nuevaCantidad)


    if (cantidad <= 0) {
      return
    }


    setProductosPedido(
      (anterior) =>
        anterior.map(
          (item) =>

            item.idProducto ===
            idProducto

              ? {
                  ...item,
                  cantidad
                }

              : item
        )
    )
  }


  // =========================
  // QUITAR PRODUCTO
  // =========================

  const quitarProducto = (
    idProducto
  ) => {

    setProductosPedido(
      (anterior) =>
        anterior.filter(
          (item) =>
            item.idProducto !==
            idProducto
        )
    )
  }


  // =========================
  // TOTAL PRELIMINAR
  // =========================

  const totalPedido =
    productosPedido.reduce(
      (total, item) =>

        total +
        (
          Number(item.precio) *
          Number(item.cantidad)
        ),

      0
    )


  // =========================
  // GUARDAR PEDIDO
  // =========================

  const guardarPedido = async (
    evento
  ) => {

    evento.preventDefault()


    if (
      formulario.idCliente === ''
    ) {

      alert(
        'Debe seleccionar un cliente.'
      )

      return
    }


    if (
      productosPedido.length === 0
    ) {

      alert(
        'Debe agregar al menos un producto.'
      )

      return
    }


    const pedido = {

      idCliente:
        Number(
          formulario.idCliente
        ),

      idUsuario:
        usuario.idUsuario,

      estadoPedido:
        formulario.estadoPedido,

      productos:
        productosPedido.map(
          (item) => ({

            idProducto:
              item.idProducto,

            cantidad:
              item.cantidad

          })
        )
    }


    try {

      const respuesta =
        await crearPedido(
          pedido
        )


      alert(
        `Pedido #${respuesta.pedido.idPedido} registrado correctamente.`
      )


      // Limpiar
      setFormulario({

        idCliente: '',
        estadoPedido: 'Pendiente'

      })


      setProductosPedido([])


      await cargarDatos()


    } catch (error) {

      console.error(error)

      alert(
        error.message
      )
    }
  }


  // =========================
  // VER DETALLE
  // =========================

  const verDetalle = async (
    idPedido
  ) => {

    try {

      const datos =
        await obtenerPedidoPorId(
          idPedido
        )


      setPedidoDetalle(
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
  // CAMBIAR ESTADO
  // =========================

  const cambiarEstado = async (
    idPedido,
    nuevoEstado
  ) => {

    try {

      await actualizarEstadoPedido(
        idPedido,
        nuevoEstado
      )


      await cargarDatos()


      if (
        pedidoDetalle &&
        pedidoDetalle.idPedido ===
        idPedido
      ) {

        const actualizado =
          await obtenerPedidoPorId(
            idPedido
          )

        setPedidoDetalle(
          actualizado
        )
      }


    } catch (error) {

      console.error(error)

      alert(
        error.message
      )
    }
  }


  // =========================
  // FORMATO DE DINERO
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

    <div className="pedidos-page">

      {/* =========================
          CABECERA
      ========================= */}

      <div className="pedidos-cabecera">

        <h1>
          Gestión de Pedidos
        </h1>

        <p>
          Registre pedidos de clientes
          y consulte su estado.
        </p>

      </div>


      {cargando && (

        <div className="pedidos-cargando">
          Cargando pedidos...
        </div>

      )}


      {error && (

        <div className="pedidos-error">
          ⚠️ {error}
        </div>

      )}


      {/* =========================
          NUEVO PEDIDO
      ========================= */}

      <section className="pedido-contenedor">

        <div className="pedido-titulo">

          <div>

            <h2>
              Nuevo pedido
            </h2>

            <p>
              Usuario responsable:
              {' '}
              <strong>
                {usuario?.nombreUsuario}
              </strong>
            </p>

          </div>

        </div>


        <form
          onSubmit={guardarPedido}
        >

          <div className="pedido-datos">

            <div className="campo-pedido">

              <label>
                Cliente *
              </label>

              <select
                name="idCliente"
                value={
                  formulario.idCliente
                }
                onChange={manejarCambio}
              >

                <option value="">
                  Seleccione un cliente
                </option>


                {clientes.map(
                  (cliente) => (

                    <option
                      key={
                        cliente.idCliente
                      }
                      value={
                        cliente.idCliente
                      }
                    >

                      {
                        cliente.nombreCliente
                      }

                    </option>

                  )
                )}

              </select>

            </div>


            <div className="campo-pedido">

              <label>
                Estado
              </label>

              <select
                name="estadoPedido"
                value={
                  formulario.estadoPedido
                }
                onChange={manejarCambio}
              >

                <option value="Pendiente">
                  Pendiente
                </option>

                <option value="Confirmado">
                  Confirmado
                </option>

              </select>

            </div>

          </div>


          {/* =========================
              AGREGAR PRODUCTO
          ========================= */}

          <div className="agregar-producto">

            <div className="campo-pedido producto-selector">

              <label>
                Producto
              </label>

              <select
                name="idProducto"
                value={
                  productoActual.idProducto
                }
                onChange={
                  manejarProductoActual
                }
              >

                <option value="">
                  Seleccione un producto
                </option>


                {productos.map(
                  (producto) => (

                    <option
                      key={
                        producto.idProducto
                      }
                      value={
                        producto.idProducto
                      }
                    >

                      {
                        producto.nombreProducto
                      }

                      {' - '}

                      {
                        formatearPrecio(
                          producto.precio
                        )
                      }

                    </option>

                  )
                )}

              </select>

            </div>


            <div className="campo-pedido">

              <label>
                Cantidad
              </label>

              <input
                type="number"
                name="cantidad"
                min="1"
                step="1"
                value={
                  productoActual.cantidad
                }
                onChange={
                  manejarProductoActual
                }
              />

            </div>


            <div className="contenedor-agregar">

              <button
                type="button"
                className="btn-agregar-producto"
                onClick={
                  agregarProducto
                }
              >
                ＋ Agregar producto
              </button>

            </div>

          </div>


          {/* =========================
              PRODUCTOS DEL PEDIDO
          ========================= */}

          <div className="productos-pedido">

            <h3>
              Productos del pedido
            </h3>


            <div className="tabla-contenedor">

              <table className="tabla-detalle-pedido">

                <thead>

                  <tr>

                    <th>
                      Producto
                    </th>

                    <th>
                      Precio
                    </th>

                    <th>
                      Cantidad
                    </th>

                    <th>
                      Subtotal
                    </th>

                    <th>
                      Acción
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {
                    productosPedido.length === 0
                      ? (

                        <tr>

                          <td
                            colSpan="5"
                            className="sin-productos-pedido"
                          >
                            Agregue productos al pedido.
                          </td>

                        </tr>

                      )
                      : (

                        productosPedido.map(
                          (item) => (

                            <tr
                              key={
                                item.idProducto
                              }
                            >

                              <td>
                                {
                                  item.nombreProducto
                                }
                              </td>


                              <td>
                                {
                                  formatearPrecio(
                                    item.precio
                                  )
                                }
                              </td>


                              <td>

                                <input
                                  className="cantidad-detalle"
                                  type="number"
                                  min="1"
                                  value={
                                    item.cantidad
                                  }
                                  onChange={
                                    (evento) =>
                                      cambiarCantidad(
                                        item.idProducto,
                                        evento.target.value
                                      )
                                  }
                                />

                              </td>


                              <td>

                                {
                                  formatearPrecio(
                                    item.precio *
                                    item.cantidad
                                  )
                                }

                              </td>


                              <td>

                                <button
                                  type="button"
                                  className="btn-quitar-producto"
                                  onClick={() =>
                                    quitarProducto(
                                      item.idProducto
                                    )
                                  }
                                >
                                  🗑️ Quitar
                                </button>

                              </td>

                            </tr>

                          )
                        )

                      )
                  }

                </tbody>

              </table>

            </div>


            <div className="pedido-total">

              <span>
                Total estimado
              </span>

              <strong>
                {
                  formatearPrecio(
                    totalPedido
                  )
                }
              </strong>

            </div>

          </div>


          <button
            type="submit"
            className="btn-guardar-pedido"
          >
            🛒 Registrar pedido
          </button>

        </form>

      </section>


      {/* =========================
          HISTORIAL
      ========================= */}

      <section className="pedidos-historial">

        <div className="pedido-titulo">

          <div>

            <h2>
              Pedidos registrados
            </h2>

            <p>
              Total: {pedidos.length}
            </p>

          </div>

        </div>


        <div className="tabla-contenedor">

          <table className="tabla-pedidos">

            <thead>

              <tr>

                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Detalle</th>

              </tr>

            </thead>


            <tbody>

              {pedidos.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="sin-pedidos"
                  >
                    No hay pedidos registrados.
                  </td>

                </tr>

              ) : (

                pedidos.map(
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
                        {pedido.fechaPedido}
                      </td>


                      <td>
                        {pedido.nombreCliente}
                      </td>


                      <td>
                        {pedido.nombreUsuario}
                      </td>


                      <td>
                        {
                          formatearPrecio(
                            pedido.total
                          )
                        }
                      </td>


                      <td>

                        <select
                          className={
                            `estado-pedido ${pedido.estadoPedido.toLowerCase()}`
                          }
                          value={
                            pedido.estadoPedido
                          }
                          onChange={
                            (evento) =>
                              cambiarEstado(
                                pedido.idPedido,
                                evento.target.value
                              )
                          }
                        >

                          <option value="Pendiente">
                            Pendiente
                          </option>

                          <option value="Confirmado">
                            Confirmado
                          </option>

                      
                          <option value="Cancelado">
                            Cancelado
                          </option>

                        </select>

                      </td>


                      <td>

                        <button
                          type="button"
                          className="btn-ver-pedido"
                          onClick={() =>
                            verDetalle(
                              pedido.idPedido
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


      {/* =========================
          DETALLE DEL PEDIDO
      ========================= */}

      {pedidoDetalle && (

        <section className="detalle-pedido-card">

          <div className="detalle-cabecera">

            <div>

              <h2>
                Pedido #{pedidoDetalle.idPedido}
              </h2>

              <p>
                Cliente:
                {' '}
                <strong>
                  {
                    pedidoDetalle.nombreCliente
                  }
                </strong>
              </p>

            </div>


            <button
              type="button"
              className="btn-cerrar-detalle"
              onClick={() =>
                setPedidoDetalle(null)
              }
            >
              ✕
            </button>

          </div>


          <div className="detalle-info">

            <span>
              Fecha:
              {' '}
              {
                pedidoDetalle.fechaPedido
              }
            </span>

            <span>
              Usuario:
              {' '}
              {
                pedidoDetalle.nombreUsuario
              }
            </span>

            <span>
              Estado:
              {' '}
              <strong>
                {
                  pedidoDetalle.estadoPedido
                }
              </strong>
            </span>

          </div>


          <div className="tabla-contenedor">

            <table className="tabla-detalle-pedido">

              <thead>

                <tr>

                  <th>
                    Producto
                  </th>

                  <th>
                    Cantidad
                  </th>

                  <th>
                    Precio unitario
                  </th>

                  <th>
                    Subtotal
                  </th>

                </tr>

              </thead>


              <tbody>

                {
                  pedidoDetalle.productos.map(
                    (producto) => (

                      <tr
                        key={
                          producto.idDetallePedido
                        }
                      >

                        <td>
                          {
                            producto.nombreProducto
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
                              producto.precioUnitario
                            )
                          }
                        </td>

                        <td>
                          {
                            formatearPrecio(
                              producto.subtotal
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


          <div className="pedido-total">

            <span>
              Total
            </span>

            <strong>
              {
                formatearPrecio(
                  pedidoDetalle.total
                )
              }
            </strong>

          </div>

        </section>

      )}

    </div>
  )
}


export default Pedidos