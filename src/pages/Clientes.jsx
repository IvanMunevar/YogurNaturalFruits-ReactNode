import {
  useEffect,
  useState
} from 'react'

import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente as eliminarClienteAPI
} from '../services/clienteService'

import '../styles/Clientes.css'


function Clientes() {

  const [clientes, setClientes] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const [editandoId, setEditandoId] =
    useState(null)


  const [formulario, setFormulario] =
    useState({

      nombreCliente: '',
      direccion: '',
      telefono: '',
      correo: ''

    })


  // =========================
  // CARGAR CLIENTES
  // =========================

  const cargarClientes = async () => {

    try {

      setCargando(true)
      setError('')


      const datos =
        await obtenerClientes()


      setClientes(datos)


    } catch (error) {

      console.error(error)

      setError(
        'No fue posible cargar los clientes.'
      )

    } finally {

      setCargando(false)
    }
  }


  useEffect(() => {

    cargarClientes()

  }, [])


  // =========================
  // MANEJAR FORMULARIO
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
  // LIMPIAR FORMULARIO
  // =========================

  const limpiarFormulario = () => {

    setFormulario({

      nombreCliente: '',
      direccion: '',
      telefono: '',
      correo: ''

    })

    setEditandoId(null)
  }


  // =========================
  // GUARDAR CLIENTE
  // =========================

  const guardarCliente = async (
    evento
  ) => {

    evento.preventDefault()


    if (
      formulario.nombreCliente.trim() === '' ||
      formulario.telefono.trim() === ''
    ) {

      alert(
        'Nombre y teléfono son obligatorios.'
      )

      return
    }


    const cliente = {

      nombreCliente:
        formulario.nombreCliente,

      direccion:
        formulario.direccion,

      telefono:
        formulario.telefono,

      correo:
        formulario.correo

    }


    try {

      if (editandoId !== null) {

        await actualizarCliente(
          editandoId,
          cliente
        )

        alert(
          'Cliente actualizado correctamente.'
        )

      } else {

        await crearCliente(
          cliente
        )

        alert(
          'Cliente registrado correctamente.'
        )
      }


      limpiarFormulario()

      await cargarClientes()


    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  // =========================
  // EDITAR
  // =========================

  const editarCliente = (
    cliente
  ) => {

    setFormulario({

      nombreCliente:
        cliente.nombreCliente,

      direccion:
        cliente.direccion || '',

      telefono:
        cliente.telefono,

      correo:
        cliente.correo || ''

    })


    setEditandoId(
      cliente.idCliente
    )


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  // =========================
  // ELIMINAR
  // =========================

  const eliminarCliente = async (
    idCliente
  ) => {

    const confirmar =
      window.confirm(
        '¿Está seguro de eliminar este cliente?'
      )


    if (!confirmar) {
      return
    }


    try {

      await eliminarClienteAPI(
        idCliente
      )


      alert(
        'Cliente eliminado correctamente.'
      )


      if (editandoId === idCliente) {
        limpiarFormulario()
      }


      await cargarClientes()


    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  return (

    <div className="clientes-page">

      {/* CABECERA */}

      <div className="clientes-cabecera">

        <h1>
          Gestión de Clientes
        </h1>

        <p>
          Registre y administre los clientes
          de Yogur Natural Fruits.
        </p>

      </div>


      {cargando && (

        <div className="clientes-cargando">
          Cargando clientes...
        </div>

      )}


      {error && (

        <div className="clientes-error">
          ⚠️ {error}
        </div>

      )}


      {/* FORMULARIO */}

      <section className="clientes-formulario-contenedor">

        <h2>

          {editandoId !== null
            ? 'Editar cliente'
            : 'Registrar cliente'}

        </h2>


        <form
          className="clientes-formulario"
          onSubmit={guardarCliente}
        >


          <div className="campo-cliente">

            <label>
              Nombre del cliente *
            </label>

            <input
              type="text"
              name="nombreCliente"
              value={
                formulario.nombreCliente
              }
              onChange={manejarCambio}
              placeholder="Nombre completo"
            />

          </div>


          <div className="campo-cliente">

            <label>
              Teléfono *
            </label>

            <input
              type="text"
              name="telefono"
              value={
                formulario.telefono
              }
              onChange={manejarCambio}
              placeholder="3001234567"
            />

          </div>


          <div className="campo-cliente">

            <label>
              Correo electrónico
            </label>

            <input
              type="email"
              name="correo"
              value={
                formulario.correo
              }
              onChange={manejarCambio}
              placeholder="cliente@correo.com"
            />

          </div>


          <div className="campo-cliente">

            <label>
              Dirección
            </label>

            <input
              type="text"
              name="direccion"
              value={
                formulario.direccion
              }
              onChange={manejarCambio}
              placeholder="Dirección del cliente"
            />

          </div>


          <div className="clientes-acciones-formulario">

            <button
              type="submit"
              className="btn-guardar-cliente"
            >

              {editandoId !== null
                ? '💾 Actualizar cliente'
                : '➕ Registrar cliente'}

            </button>


            {editandoId !== null && (

              <button
                type="button"
                className="btn-cancelar-cliente"
                onClick={
                  limpiarFormulario
                }
              >
                Cancelar edición
              </button>

            )}

          </div>

        </form>

      </section>


      {/* LISTADO */}

      <section className="clientes-listado">

        <div className="clientes-listado-titulo">

          <div>

            <h2>
              Clientes registrados
            </h2>

            <p>
              Total: {clientes.length}
            </p>

          </div>

        </div>


        <div className="tabla-contenedor">

          <table className="tabla-clientes">

            <thead>

              <tr>

                <th>ID</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Dirección</th>
                <th>Registro</th>
                <th>Acciones</th>

              </tr>

            </thead>


            <tbody>

              {clientes.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="sin-clientes"
                  >
                    No hay clientes registrados.
                  </td>

                </tr>

              ) : (

                clientes.map(
                  (cliente) => (

                    <tr
                      key={
                        cliente.idCliente
                      }
                    >

                      <td>
                        {cliente.idCliente}
                      </td>


                      <td>
                        {cliente.nombreCliente}
                      </td>


                      <td>
                        {cliente.telefono}
                      </td>


                      <td>
                        {cliente.correo ||
                          'Sin correo'}
                      </td>


                      <td>
                        {cliente.direccion ||
                          'Sin dirección'}
                      </td>


                      <td>
                        {cliente.fechaRegistro}
                      </td>


                      <td>

                        <div className="clientes-acciones-tabla">

                          <button
                            className="btn-editar-cliente"
                            onClick={() =>
                              editarCliente(
                                cliente
                              )
                            }
                          >
                            ✏️ Editar
                          </button>


                          <button
                            className="btn-eliminar-cliente"
                            onClick={() =>
                              eliminarCliente(
                                cliente.idCliente
                              )
                            }
                          >
                            🗑️ Eliminar
                          </button>

                        </div>

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


export default Clientes