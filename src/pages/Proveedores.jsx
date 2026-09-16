import {
  useEffect,
  useState
} from 'react'

import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor as eliminarProveedorAPI
} from '../services/proveedorService'

import '../styles/Proveedores.css'


function Proveedores() {

  const [proveedores, setProveedores] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const [editandoId, setEditandoId] =
    useState(null)


  const [formulario, setFormulario] =
    useState({

      nombreProveedor: '',
      contacto: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: 'Activo'

    })


  // =========================
  // CARGAR PROVEEDORES
  // =========================

  const cargarProveedores = async () => {

    try {

      setCargando(true)
      setError('')

      const datos =
        await obtenerProveedores()

      setProveedores(datos)

    } catch (error) {

      console.error(error)

      setError(
        'No fue posible cargar los proveedores.'
      )

    } finally {

      setCargando(false)
    }
  }


  useEffect(() => {

    cargarProveedores()

  }, [])


  // =========================
  // CAMBIOS FORMULARIO
  // =========================

  const manejarCambio = (evento) => {

    const {
      name,
      value
    } = evento.target

    setFormulario(
      (formularioAnterior) => ({

        ...formularioAnterior,

        [name]: value

      })
    )
  }


  // =========================
  // LIMPIAR
  // =========================

  const limpiarFormulario = () => {

    setFormulario({

      nombreProveedor: '',
      contacto: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: 'Activo'

    })

    setEditandoId(null)
  }


  // =========================
  // GUARDAR
  // =========================

  const guardarProveedor = async (
    evento
  ) => {

    evento.preventDefault()


    if (
      formulario.nombreProveedor.trim()
      === ''
    ) {

      alert(
        'El nombre del proveedor es obligatorio.'
      )

      return
    }


    const proveedor = {

      nombreProveedor:
        formulario.nombreProveedor,

      contacto:
        formulario.contacto,

      telefono:
        formulario.telefono,

      correo:
        formulario.correo,

      direccion:
        formulario.direccion,

      estado:
        formulario.estado
    }


    try {

      if (editandoId !== null) {

        await actualizarProveedor(
          editandoId,
          proveedor
        )

        alert(
          'Proveedor actualizado correctamente.'
        )

      } else {

        await crearProveedor(
          proveedor
        )

        alert(
          'Proveedor registrado correctamente.'
        )
      }


      limpiarFormulario()

      await cargarProveedores()


    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  // =========================
  // EDITAR
  // =========================

  const editarProveedor = (
    proveedor
  ) => {

    setFormulario({

      nombreProveedor:
        proveedor.nombreProveedor,

      contacto:
        proveedor.contacto || '',

      telefono:
        proveedor.telefono || '',

      correo:
        proveedor.correo || '',

      direccion:
        proveedor.direccion || '',

      estado:
        proveedor.estado || 'Activo'

    })

    setEditandoId(
      proveedor.idProveedor
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  // =========================
  // ELIMINAR
  // =========================

  const eliminarProveedor = async (
    idProveedor
  ) => {

    const confirmar =
      window.confirm(
        '¿Está seguro de eliminar este proveedor?'
      )


    if (!confirmar) {
      return
    }


    try {

      await eliminarProveedorAPI(
        idProveedor
      )

      alert(
        'Proveedor eliminado correctamente.'
      )

      await cargarProveedores()

    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  return (

    <div className="proveedores-page">

      <div className="proveedores-cabecera">

        <h1>
          Gestión de Proveedores
        </h1>

        <p>
          Administre los proveedores de
          Yogur Natural Fruits.
        </p>

      </div>


      {cargando && (

        <div className="mensaje-cargando">
          Cargando proveedores...
        </div>

      )}


      {error && (

        <div className="mensaje-error-proveedores">
          ⚠️ {error}
        </div>

      )}


      {/* FORMULARIO */}

      <section className="proveedores-formulario-contenedor">

        <h2>

          {editandoId !== null
            ? 'Editar proveedor'
            : 'Registrar proveedor'}

        </h2>


        <form
          className="proveedores-formulario"
          onSubmit={guardarProveedor}
        >

          <div className="campo-proveedor">

            <label>
              Nombre del proveedor *
            </label>

            <input
              type="text"
              name="nombreProveedor"
              value={
                formulario.nombreProveedor
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-proveedor">

            <label>
              Contacto
            </label>

            <input
              type="text"
              name="contacto"
              value={
                formulario.contacto
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-proveedor">

            <label>
              Teléfono
            </label>

            <input
              type="text"
              name="telefono"
              value={
                formulario.telefono
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-proveedor">

            <label>
              Correo
            </label>

            <input
              type="email"
              name="correo"
              value={
                formulario.correo
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-proveedor">

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
            />

          </div>


          <div className="campo-proveedor">

            <label>
              Estado
            </label>

            <select
              name="estado"
              value={
                formulario.estado
              }
              onChange={manejarCambio}
            >

              <option value="Activo">
                Activo
              </option>

              <option value="Inactivo">
                Inactivo
              </option>

            </select>

          </div>


          <div className="acciones-formulario">

            <button
              type="submit"
              className="btn-guardar-proveedor"
            >

              {editandoId !== null
                ? '💾 Actualizar proveedor'
                : '➕ Registrar proveedor'}

            </button>


            {editandoId !== null && (

              <button
                type="button"
                className="btn-cancelar-proveedor"
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

      <section className="proveedores-listado">

        <h2>
          Proveedores registrados
        </h2>

        <p>
          Total: {proveedores.length}
        </p>


        <div className="tabla-contenedor">

          <table className="tabla-proveedores">

            <thead>

              <tr>

                <th>ID</th>
                <th>Proveedor</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th>Acciones</th>

              </tr>

            </thead>


            <tbody>

              {proveedores.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="sin-proveedores"
                  >
                    No hay proveedores registrados.
                  </td>

                </tr>

              ) : (

                proveedores.map(
                  (proveedor) => (

                    <tr
                      key={
                        proveedor.idProveedor
                      }
                    >

                      <td>
                        {proveedor.idProveedor}
                      </td>

                      <td>
                        {proveedor.nombreProveedor}
                      </td>

                      <td>
                        {proveedor.contacto}
                      </td>

                      <td>
                        {proveedor.telefono}
                      </td>

                      <td>
                        {proveedor.correo}
                      </td>

                      <td>

                        <span
                          className={
                            proveedor.estado === 'Activo'
                              ? 'estado activo'
                              : 'estado inactivo'
                          }
                        >
                          {proveedor.estado}
                        </span>

                      </td>


                      <td>

                        <div className="acciones-tabla">

                          <button
                            className="btn-editar"
                            onClick={() =>
                              editarProveedor(
                                proveedor
                              )
                            }
                          >
                            ✏️ Editar
                          </button>

                          <button
                            className="btn-eliminar"
                            onClick={() =>
                              eliminarProveedor(
                                proveedor.idProveedor
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


export default Proveedores