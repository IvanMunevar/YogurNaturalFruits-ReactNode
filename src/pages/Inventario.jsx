import {
  useEffect,
  useState
} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  obtenerMovimientos,
  registrarMovimiento
} from '../services/inventarioService'

import {
  obtenerProductos
} from '../services/productoService'

import {
  obtenerInsumos
} from '../services/insumoService'

import '../styles/Inventario.css'


function Inventario() {

  const navigate =
    useNavigate()


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


  const [movimientos, setMovimientos] =
    useState([])

  const [productos, setProductos] =
    useState([])

  const [insumos, setInsumos] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')


  const [formulario, setFormulario] =
    useState({

      tipoMovimiento: 'Entrada',

      tipoElemento: 'Producto',

      idElemento: '',

      cantidad: ''

    })


  // =========================
  // CARGAR DATOS
  // =========================

  const cargarDatos = async () => {

    try {

      setCargando(true)

      setError('')


      const [
        datosMovimientos,
        datosProductos,
        datosInsumos
      ] = await Promise.all([

        obtenerMovimientos(),

        obtenerProductos(),

        obtenerInsumos()

      ])


      setMovimientos(
        datosMovimientos
      )

      setProductos(
        datosProductos
      )

      setInsumos(
        datosInsumos
      )


    } catch (error) {

      console.error(error)

      setError(
        'No fue posible cargar el inventario.'
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
  // CAMBIO DEL FORMULARIO
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

        [name]: value,

        ...(name === 'tipoElemento'
          ? { idElemento: '' }
          : {})

      })
    )
  }


  // =========================
  // REGISTRAR MOVIMIENTO
  // =========================

  const guardarMovimiento = async (
    evento
  ) => {

    evento.preventDefault()


    if (
      formulario.idElemento === '' ||
      formulario.cantidad === ''
    ) {

      alert(
        'Seleccione un elemento e indique la cantidad.'
      )

      return
    }


    if (
      Number(formulario.cantidad) <= 0
    ) {

      alert(
        'La cantidad debe ser mayor a cero.'
      )

      return
    }


    const movimiento = {

      tipoMovimiento:
        formulario.tipoMovimiento,

      cantidad:
        Number(formulario.cantidad),

      idProducto:
        formulario.tipoElemento ===
        'Producto'
          ? Number(
              formulario.idElemento
            )
          : null,

      idInsumo:
        formulario.tipoElemento ===
        'Insumo'
          ? Number(
              formulario.idElemento
            )
          : null,

      idUsuario:
        usuario.idUsuario
    }


    try {

      await registrarMovimiento(
        movimiento
      )


      alert(
        'Movimiento registrado correctamente.'
      )


      setFormulario(
        (anterior) => ({

          ...anterior,

          idElemento: '',

          cantidad: ''

        })
      )


      await cargarDatos()


    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  const entradas =
    movimientos.filter(
      (movimiento) =>
        movimiento.tipoMovimiento ===
        'Entrada'
    ).length


  const salidas =
    movimientos.filter(
      (movimiento) =>
        movimiento.tipoMovimiento ===
        'Salida'
    ).length


  return (

    <div className="inventario-page">

      {/* CABECERA */}

      <div className="inventario-cabecera">

        <div>

          <h1>
            Gestión de Inventario
          </h1>

          <p>
            Registre y consulte los movimientos
            de productos e insumos.
          </p>

        </div>

      </div>


      {cargando && (

        <div className="inventario-cargando">
          Cargando inventario...
        </div>

      )}


      {error && (

        <div className="inventario-error">
          ⚠️ {error}
        </div>

      )}


      {/* TARJETAS */}

      <section className="inventario-resumen">

        <div className="inventario-card">

          <span>
            Movimientos
          </span>

          <strong>
            {movimientos.length}
          </strong>

        </div>


        <div className="inventario-card">

          <span>
            Entradas
          </span>

          <strong>
            {entradas}
          </strong>

        </div>


        <div className="inventario-card">

          <span>
            Salidas
          </span>

          <strong>
            {salidas}
          </strong>

        </div>

      </section>


      {/* FORMULARIO */}

      <section className="inventario-formulario-contenedor">

        <div className="inventario-titulo-seccion">

          <h2>
            Registrar movimiento
          </h2>

          <p>
            Usuario responsable:
            {' '}
            <strong>
              {usuario?.nombreUsuario}
            </strong>
          </p>

        </div>


        <form
          className="inventario-formulario"
          onSubmit={
            guardarMovimiento
          }
        >


          <div className="campo-inventario">

            <label>
              Tipo de movimiento
            </label>

            <select
              name="tipoMovimiento"
              value={
                formulario.tipoMovimiento
              }
              onChange={manejarCambio}
            >

              <option value="Entrada">
                Entrada
              </option>

              <option value="Salida">
                Salida
              </option>

            </select>

          </div>


          <div className="campo-inventario">

            <label>
              Tipo de elemento
            </label>

            <select
              name="tipoElemento"
              value={
                formulario.tipoElemento
              }
              onChange={manejarCambio}
            >

              <option value="Producto">
                Producto
              </option>

              <option value="Insumo">
                Insumo
              </option>

            </select>

          </div>


          <div className="campo-inventario">

            <label>
              Elemento *
            </label>

            <select
              name="idElemento"
              value={
                formulario.idElemento
              }
              onChange={manejarCambio}
            >

              <option value="">
                Seleccione
              </option>


              {formulario.tipoElemento ===
              'Producto'

                ? productos.map(
                    (producto) => (

                      <option
                        key={
                          producto.idProducto
                        }
                        value={
                          producto.idProducto
                        }
                      >

                        {producto.nombreProducto}
                        {' '}
                        (Stock:
                        {' '}
                        {producto.stock})

                      </option>

                    )
                  )

                : insumos.map(
                    (insumo) => (

                      <option
                        key={
                          insumo.idInsumo
                        }
                        value={
                          insumo.idInsumo
                        }
                      >

                        {insumo.nombreInsumo}
                        {' '}
                        (
                        {insumo.cantidad}
                        {' '}
                        {insumo.unidadMedida}
                        )

                      </option>

                    )
                  )
              }

            </select>

          </div>


          <div className="campo-inventario">

            <label>
              Cantidad *
            </label>

            <input
              type="number"
              name="cantidad"
              step="0.01"
              min="0.01"
              value={
                formulario.cantidad
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="inventario-acciones">

            <button
              type="submit"
              className="btn-movimiento"
            >
              ➕ Registrar movimiento
            </button>

          </div>

        </form>

      </section>


      {/* HISTORIAL */}

      <section className="inventario-historial">

        <div className="inventario-titulo-seccion">

          <h2>
            Historial de movimientos
          </h2>

          <p>
            Registro de entradas y salidas.
          </p>

        </div>


        <div className="tabla-contenedor">

          <table className="tabla-inventario">

            <thead>

              <tr>

                <th>ID</th>
                <th>Fecha</th>
                <th>Movimiento</th>
                <th>Tipo</th>
                <th>Elemento</th>
                <th>Cantidad</th>
                <th>Usuario</th>

              </tr>

            </thead>


            <tbody>

              {movimientos.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="sin-movimientos"
                  >
                    No existen movimientos registrados.
                  </td>

                </tr>

              ) : (

                movimientos.map(
                  (movimiento) => (

                    <tr
                      key={
                        movimiento.idInventario
                      }
                    >

                      <td>
                        {
                          movimiento.idInventario
                        }
                      </td>


                      <td>
                        {
                          movimiento.fechaMovimiento
                        }
                      </td>


                      <td>

                        <span
                          className={
                            movimiento.tipoMovimiento ===
                            'Entrada'
                              ? 'movimiento entrada'
                              : 'movimiento salida'
                          }
                        >

                          {
                            movimiento.tipoMovimiento
                          }

                        </span>

                      </td>


                      <td>
                        {
                          movimiento.tipoElemento
                        }
                      </td>


                      <td>
                        {
                          movimiento.nombreElemento
                        }
                      </td>


                      <td>
                        {
                          movimiento.cantidad
                        }
                      </td>


                      <td>
                        {
                          movimiento.nombreUsuario
                        }
                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  )
}


export default Inventario