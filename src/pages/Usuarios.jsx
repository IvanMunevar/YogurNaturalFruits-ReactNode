import {
  useEffect,
  useState
} from 'react'

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario as eliminarUsuarioAPI
} from '../services/usuarioService'

import '../styles/Usuarios.css'


function Usuarios() {

  const [usuarios, setUsuarios] =
    useState([])

  const [cargando, setCargando] =
    useState(true)

  const [error, setError] =
    useState('')

  const [editandoId, setEditandoId] =
    useState(null)


  const [formulario, setFormulario] =
    useState({

      nombreUsuario: '',
      correo: '',
      contrasena: ''

    })


  // =========================
  // CARGAR USUARIOS
  // =========================

  const cargarUsuarios = async () => {

    try {

      setCargando(true)
      setError('')

      const datos =
        await obtenerUsuarios()

      setUsuarios(datos)

    } catch (error) {

      console.error(error)

      setError(
        'No fue posible cargar los usuarios.'
      )

    } finally {

      setCargando(false)
    }
  }


  useEffect(() => {

    cargarUsuarios()

  }, [])


  // =========================
  // CAMBIOS DEL FORMULARIO
  // =========================

  const manejarCambio = (evento) => {

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

      nombreUsuario: '',
      correo: '',
      contrasena: ''

    })

    setEditandoId(null)
  }


  // =========================
  // GUARDAR USUARIO
  // =========================

  const guardarUsuario = async (
    evento
  ) => {

    evento.preventDefault()


    if (
      formulario.nombreUsuario.trim() === '' ||
      formulario.correo.trim() === ''
    ) {

      alert(
        'Nombre y correo son obligatorios.'
      )

      return
    }


    if (
      editandoId === null &&
      formulario.contrasena.trim() === ''
    ) {

      alert(
        'La contraseña es obligatoria para un usuario nuevo.'
      )

      return
    }


    const usuario = {

      nombreUsuario:
        formulario.nombreUsuario,

      correo:
        formulario.correo,

      contrasena:
        formulario.contrasena
    }


    try {

      if (editandoId !== null) {

        await actualizarUsuario(
          editandoId,
          usuario
        )

        alert(
          'Usuario actualizado correctamente.'
        )

      } else {

        await crearUsuario(
          usuario
        )

        alert(
          'Usuario registrado correctamente.'
        )
      }


      limpiarFormulario()

      await cargarUsuarios()


    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  // =========================
  // EDITAR USUARIO
  // =========================

  const editarUsuario = (
    usuario
  ) => {

    setFormulario({

      nombreUsuario:
        usuario.nombreUsuario,

      correo:
        usuario.correo || '',

      // Se deja vacía por seguridad.
      contrasena: ''

    })


    setEditandoId(
      usuario.idUsuario
    )


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  // =========================
  // ELIMINAR USUARIO
  // =========================

  const eliminarUsuario = async (
    idUsuario
  ) => {

    const confirmar =
      window.confirm(
        '¿Está seguro de eliminar este usuario?'
      )


    if (!confirmar) {
      return
    }


    try {

      await eliminarUsuarioAPI(
        idUsuario
      )

      alert(
        'Usuario eliminado correctamente.'
      )

      await cargarUsuarios()


    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  return (

    <div className="usuarios-page">

      <div className="usuarios-cabecera">

        <h1>
          Gestión de Usuarios
        </h1>

        <p>
          Administre los usuarios que tienen
          acceso al sistema Yogur Natural Fruits.
        </p>

      </div>


      {cargando && (

        <div className="usuarios-cargando">
          Cargando usuarios...
        </div>

      )}


      {error && (

        <div className="usuarios-error">
          ⚠️ {error}
        </div>

      )}


      {/* =========================
          FORMULARIO
      ========================= */}

      <section className="usuarios-formulario-contenedor">

        <h2>

          {editandoId !== null
            ? 'Editar usuario'
            : 'Registrar usuario'}

        </h2>


        <form
          className="usuarios-formulario"
          onSubmit={guardarUsuario}
        >

          <div className="campo-usuario">

            <label>
              Nombre del usuario *
            </label>

            <input
              type="text"
              name="nombreUsuario"
              placeholder="Ej. Juan Pérez"
              value={
                formulario.nombreUsuario
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-usuario">

            <label>
              Correo electrónico *
            </label>

            <input
              type="email"
              name="correo"
              placeholder="usuario@correo.com"
              value={
                formulario.correo
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-usuario">

            <label>
              Contraseña
              {editandoId === null
                ? ' *'
                : ''}
            </label>

            <input
              type="password"
              name="contrasena"
              placeholder={
                editandoId !== null
                  ? 'Dejar vacío para conservar'
                  : 'Ingrese una contraseña'
              }
              value={
                formulario.contrasena
              }
              onChange={manejarCambio}
            />

          </div>


          {editandoId !== null && (

            <p className="nota-contrasena">
              Si no desea cambiar la contraseña,
              deje este campo vacío.
            </p>

          )}


          <div className="usuarios-acciones-formulario">

            <button
              type="submit"
              className="btn-guardar-usuario"
            >

              {editandoId !== null
                ? '💾 Actualizar usuario'
                : '➕ Registrar usuario'}

            </button>


            {editandoId !== null && (

              <button
                type="button"
                className="btn-cancelar-usuario"
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


      {/* =========================
          LISTADO
      ========================= */}

      <section className="usuarios-listado">

        <div className="usuarios-listado-cabecera">

          <div>

            <h2>
              Usuarios registrados
            </h2>

            <p>
              Total: {usuarios.length}
            </p>

          </div>

        </div>


        <div className="tabla-contenedor">

          <table className="tabla-usuarios">

            <thead>

              <tr>

                <th>ID</th>

                <th>
                  Nombre
                </th>

                <th>
                  Correo
                </th>

                <th>
                  Contraseña
                </th>

                <th>
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              {usuarios.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="sin-usuarios"
                  >
                    No hay usuarios registrados.
                  </td>

                </tr>

              ) : (

                usuarios.map(
                  (usuario) => (

                    <tr
                      key={
                        usuario.idUsuario
                      }
                    >

                      <td>
                        {usuario.idUsuario}
                      </td>

                      <td>
                        {usuario.nombreUsuario}
                      </td>

                      <td>
                        {usuario.correo ||
                          'Sin correo'}
                      </td>

                      <td>
                        ••••••••
                      </td>

                      <td>

                        <div className="usuarios-acciones-tabla">

                          <button
                            className="btn-editar-usuario"
                            onClick={() =>
                              editarUsuario(
                                usuario
                              )
                            }
                          >
                            ✏️ Editar
                          </button>


                          <button
                            className="btn-eliminar-usuario"
                            onClick={() =>
                              eliminarUsuario(
                                usuario.idUsuario
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


export default Usuarios