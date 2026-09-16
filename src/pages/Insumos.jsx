import {
  useEffect,
  useState
} from 'react'

import {
  obtenerInsumos,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo as eliminarInsumoAPI
} from '../services/insumoService'

import {
  obtenerProveedores
} from '../services/proveedorService'

import '../styles/Insumos.css'


function Insumos() {

  const [insumos, setInsumos] =
    useState([])

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

      nombreInsumo: '',
      cantidad: '',
      cantidadMinima: '',
      unidadMedida: '',
      fechaVencimiento: '',
      idProveedor: ''

    })


  // =========================
  // CARGAR DATOS
  // =========================

  const cargarDatos = async () => {

    try {

      setCargando(true)
      setError('')


      const [
        datosInsumos,
        datosProveedores
      ] = await Promise.all([

        obtenerInsumos(),

        obtenerProveedores()

      ])


      setInsumos(
        datosInsumos
      )

      setProveedores(
        datosProveedores
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

    cargarDatos()

  }, [])


  // =========================
  // CAMBIO DE CAMPOS
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
  // LIMPIAR
  // =========================

  const limpiarFormulario = () => {

    setFormulario({

      nombreInsumo: '',
      cantidad: '',
      cantidadMinima: '5',
      unidadMedida: '',
      fechaVencimiento: '',
      idProveedor: ''

    })


    setEditandoId(null)
  }


  // =========================
  // GUARDAR
  // =========================

  const guardarInsumo = async (
    evento
  ) => {

    evento.preventDefault()


// =========================
// VALIDAR CAMPOS
// =========================

if (
  formulario.nombreInsumo.trim() === '' ||
  formulario.cantidad === '' ||
  formulario.cantidadMinima === '' ||
  formulario.unidadMedida === '' ||
  formulario.idProveedor === ''
) {

  alert(
    'Complete los campos obligatorios.'
  )

  return
}


// Validar cantidad

if (
  Number(formulario.cantidad) < 0
) {

  alert(
    'La cantidad no puede ser negativa.'
  )

  return
}


// Validar cantidad mínima

if (
  Number(formulario.cantidadMinima) < 0
) {

  alert(
    'La cantidad mínima no puede ser negativa.'
  )

  return
}


    if (
      Number(formulario.cantidad) < 0
    ) {

      alert(
        'La cantidad no puede ser negativa.'
      )

      return
    }

      if (
      Number(
      formulario.cantidadMinima
      ) < 0
      ) {

      alert(
      'La cantidad mínima no puede ser negativa.'
      )

      return
      }

      const insumo = {

      nombreInsumo:
        formulario.nombreInsumo,

      cantidad:
        Number(formulario.cantidad),

      cantidadMinima:
        Number(formulario.cantidadMinima
        ),

      unidadMedida:
        formulario.unidadMedida,

      fechaVencimiento:
        formulario.fechaVencimiento ||
        null,

      idProveedor:
        Number(formulario.idProveedor)
    }


    try {

      if (editandoId !== null) {

        await actualizarInsumo(
          editandoId,
          insumo
        )

        alert(
          'Insumo actualizado correctamente.'
        )

      } else {

        await crearInsumo(
          insumo
        )

        alert(
          'Insumo registrado correctamente.'
        )
      }


      limpiarFormulario()

      await cargarDatos()


    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  // =========================
  // EDITAR
  // =========================

  const editarInsumo = (
    insumo
  ) => {

    setFormulario({

      nombreInsumo:
        insumo.nombreInsumo,

      cantidad:
        insumo.cantidad,

      cantidadMinima:
        insumo.cantidadMinima,

      unidadMedida:
        insumo.unidadMedida,

      fechaVencimiento:
        insumo.fechaVencimiento || '',

      idProveedor:
        String(insumo.idProveedor)

    })


    setEditandoId(
      insumo.idInsumo
    )


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  // =========================
  // ELIMINAR
  // =========================

  const eliminarInsumo = async (
    idInsumo
  ) => {

    const confirmar =
      window.confirm(
        '¿Está seguro de eliminar este insumo?'
      )


    if (!confirmar) {
      return
    }


    try {

      await eliminarInsumoAPI(
        idInsumo
      )


      alert(
        'Insumo eliminado correctamente.'
      )


      await cargarDatos()


    } catch (error) {

      console.error(error)

      alert(error.message)
    }
  }


  return (

    <div className="insumos-page">

      <div className="insumos-cabecera">

        <h1>
          Gestión de Insumos
        </h1>

        <p>
          Administre los insumos utilizados
          en la elaboración de Yogur Natural Fruits.
        </p>

      </div>


      {cargando && (

        <div className="mensaje-cargando">
          Cargando insumos...
        </div>

      )}


      {error && (

        <div className="mensaje-error-insumos">
          ⚠️ {error}
        </div>

      )}


      <section className="insumos-formulario-contenedor">

        <h2>

          {editandoId !== null
            ? 'Editar insumo'
            : 'Registrar insumo'}

        </h2>


        <form
          className="insumos-formulario"
          onSubmit={guardarInsumo}
        >

          <div className="campo-insumo">

<div className="campo-insumo">

  <label htmlFor="cantidadMinima">
    Cantidad mínima *
  </label>

  <input
    type="number"
    id="cantidadMinima"
    name="cantidadMinima"
    min="0"
    step="0.01"
    placeholder="Ej. 5"
    value={
      formulario.cantidadMinima
    }
    onChange={manejarCambio}
  />

</div>

            <label>
              Nombre del insumo *
            </label>

            <input
              type="text"
              name="nombreInsumo"
              value={
                formulario.nombreInsumo
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-insumo">

            <label>
              Cantidad *
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="cantidad"
              value={
                formulario.cantidad
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-insumo">

            <label>
              Unidad de medida *
            </label>

            <select
              name="unidadMedida"
              value={
                formulario.unidadMedida
              }
              onChange={manejarCambio}
            >

              <option value="">
                Seleccione
              </option>

              <option value="Litros">
                Litros
              </option>

              <option value="Mililitros">
                Mililitros
              </option>

              <option value="Kilogramos">
                Kilogramos
              </option>

              <option value="Gramos">
                Gramos
              </option>

              <option value="Unidades">
                Unidades
              </option>

            </select>

          </div>


          <div className="campo-insumo">

            <label>
              Fecha de vencimiento
            </label>

            <input
              type="date"
              name="fechaVencimiento"
              value={
                formulario.fechaVencimiento
              }
              onChange={manejarCambio}
            />

          </div>


          <div className="campo-insumo">

            <label>
              Proveedor *
            </label>

            <select
              name="idProveedor"
              value={
                formulario.idProveedor
              }
              onChange={manejarCambio}
            >

              <option value="">
                Seleccione un proveedor
              </option>


              {proveedores.map(
                (proveedor) => (

                  <option
                    key={
                      proveedor.idProveedor
                    }
                    value={
                      proveedor.idProveedor
                    }
                  >

                    {proveedor.nombreProveedor}

                    {proveedor.estado === 'Inactivo'
                      ? ' - Inactivo'
                      : ''}

                  </option>

                )
              )}

            </select>

          </div>


          <div className="acciones-formulario">

            <button
              type="submit"
              className="btn-guardar-insumo"
            >

              {editandoId !== null
                ? '💾 Actualizar insumo'
                : '➕ Registrar insumo'}

            </button>


            {editandoId !== null && (

              <button
                type="button"
                className="btn-cancelar-insumo"
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


      <section className="insumos-listado">

        <h2>
          Insumos registrados
        </h2>

        <p>
          Total: {insumos.length}
        </p>


        <div className="tabla-contenedor">

          <table className="tabla-insumos">

            <thead>

              <tr>

                <th>ID</th>
                <th>Insumo</th>
                <th>Cantidad</th>
                <th>Cantidad mínima</th>
                <th>Unidad</th>
                <th>Vencimiento</th>
                <th>Proveedor</th>
                <th>Acciones</th>

              </tr>

            </thead>


            <tbody>

              {insumos.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="sin-insumos"
                  >
                    No hay insumos registrados.
                  </td>

                </tr>

              ) : (

                insumos.map(
                  (insumo) => (

                    <tr
                      key={
                        insumo.idInsumo
                      }
                    >

                      <td>
                        {insumo.idInsumo}
                      </td>

                      <td>
                        {insumo.nombreInsumo}
                      </td>

                      <td>
                        {insumo.cantidad}
                      </td>

                      <td>
                        {insumo.cantidadMinima}
                      </td>

                      <td>
                        {insumo.unidadMedida}
                      </td>

                      <td>
                        {insumo.fechaVencimiento ||
                          'Sin fecha'}
                      </td>

                      <td>
                        {insumo.nombreProveedor}
                      </td>

                      <td>

                        <div className="acciones-tabla">

                          <button
                            className="btn-editar"
                            onClick={() =>
                              editarInsumo(
                                insumo
                              )
                            }
                          >
                            ✏️ Editar
                          </button>


                          <button
                            className="btn-eliminar"
                            onClick={() =>
                              eliminarInsumo(
                                insumo.idInsumo
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


export default Insumos