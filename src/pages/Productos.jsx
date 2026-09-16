import {
  useEffect,
  useState
} from 'react'

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto as eliminarProductoAPI
} from '../services/productoService'

import '../styles/Productos.css'


function Productos() {

  const [cargando, setCargando] = useState(true)

  const [error, setError] = useState('')

  const [productos, setProductos] = useState([])

  const [formulario, setFormulario] = useState({
  nombreProducto: '',
  descripcion: '',
  precio: '',
  stock: '',
  stockMinimo: '5',
  fechaVencimiento: ''
})

  const [editandoId, setEditandoId] = useState(null)

  // =========================
  // MANEJO DEL FORMULARIO
  // =========================

  const manejarCambio = (evento) => {

    const { name, value } = evento.target

    setFormulario((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value
    }))
  }

  // =========================
  // CARGAR PRODUCTOS
  // =========================

  const cargarProductos = async () => {

    try {

      setCargando(true)
      setError('')

      const datos = await obtenerProductos()

      console.log(
        'Productos recibidos:',
        datos
      )

      if (!Array.isArray(datos)) {
        throw new Error(
          'La API no devolvió una lista de productos.'
        )
      }

      setProductos(datos)

    } catch (error) {

      console.error(error)

      setProductos([])

      setError(
        'No fue posible cargar los productos.'
      )

    } finally {

      setCargando(false)
    }
  }


  useEffect(() => {
    cargarProductos()
  }, [])

  const limpiarFormulario = () => {

    setFormulario({
       nombreProducto: '',
        descripcion: '',
        precio: '',
        stock: '',
        stockMinimo: '5',
        fechaVencimiento: ''
      })

    setEditandoId(null)
  }

  const guardarProducto = async (evento) => {

  evento.preventDefault()

  if (
  formulario.nombreProducto.trim() === '' ||
  formulario.precio === '' ||
  formulario.stock === '' ||
  formulario.stockMinimo === ''
    ) {

    alert(
      'Debe completar los campos obligatorios.'
    )

    return
  }


  if (Number(formulario.precio) <= 0) {

    alert(
      'El precio debe ser mayor a cero.'
    )

    return
  }


  if (Number(formulario.stockMinimo) < 0) {

    alert(
      'El stock no puede ser negativo.'
    )

    return
  }


  const producto = {

  nombreProducto:
    formulario.nombreProducto,

  descripcion:
    formulario.descripcion,

  precio:
    Number(formulario.precio),

  stock:
    Number(formulario.stock),

  stockMinimo:
    Number(formulario.stockMinimo),

  fechaVencimiento:
    formulario.fechaVencimiento ||
    null
    }


  try {

    if (editandoId !== null) {

      await actualizarProducto(
        editandoId,
        producto
      )

      alert(
        'Producto actualizado correctamente.'
      )

    } else {

      await crearProducto(producto)

      alert(
        'Producto registrado correctamente.'
      )
    }

    limpiarFormulario()

    await cargarProductos()

  } catch (error) {

    console.error(error)

    alert(error.message)
  }
}

 const editarProducto = (
  producto
) => {

  setFormulario({

    nombreProducto:
      producto.nombreProducto,

    descripcion:
      producto.descripcion || '',

    precio:
      producto.precio,

    stock:
      producto.stock,

    stockMinimo:
      producto.stockMinimo,

    fechaVencimiento:
      producto.fechaVencimiento || ''
  })

  setEditandoId(
    producto.idProducto
  )

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    }

  const eliminarProducto = async (idProducto) => {

  const confirmar = window.confirm(
    '¿Está seguro de eliminar este producto?'
  )

  if (!confirmar) {
    return
  }

  try {

    await eliminarProductoAPI(idProducto)

    alert(
      'Producto eliminado correctamente.'
    )

    if (editandoId === idProducto) {
      limpiarFormulario()
    }

    await cargarProductos()

  } catch (error) {

    console.error(error)

    alert(error.message)
  }
}

  const formatearPrecio = (precio) => {

    return new Intl.NumberFormat(
      'es-CO',
      {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }
    ).format(precio)
  }


  
  return (

    <div className="productos-page">

    {/* =========================
        ESTADO DE CARGA
    ========================= */}

    {cargando && (
      <div className="mensaje-cargando">
        Cargando productos...
      </div>
    )}

    {/* =========================
        MENSAJE DE ERROR
    ========================= */}

    {error && (
      <div className="mensaje-error-productos">
        ⚠️ {error}
      </div>
    )}

      {/* =========================
          ENCABEZADO
      ========================= */}

      <div className="productos-cabecera">

        <div>
          <h1>Gestión de Productos</h1>

          <p> Registre, consulte, actualice y elimine
            los productos de Yogur Natural Fruits.
          </p>
        </div>

      </div>

      {/* =========================
          FORMULARIO
      ========================= */}

      <section className="productos-formulario-contenedor">

        <div className="titulo-seccion">

          <h2>
            {editandoId !== null
              ? 'Editar producto'
              : 'Registrar producto'}
          </h2>

          <p>
            Complete la información correspondiente.
          </p>

        </div>

        <form
          className="productos-formulario"
          onSubmit={guardarProducto}
        >

          <div className="campo-producto">

            <label htmlFor="nombreProducto">
              Nombre del producto *
            </label>

            <input
              type="text"
              id="nombreProducto"
              name="nombreProducto"
              placeholder="Ej. Yogur de fresa"
              value={formulario.nombreProducto}
              onChange={manejarCambio}
            />

          </div>

          <div className="campo-producto">

            <label htmlFor="precio">
              Precio *
            </label>

            <input
              type="number"
              id="precio"
              name="precio"
              placeholder="Ej. 8000"
              min="0"
              value={formulario.precio}
              onChange={manejarCambio}
            />

            </div>
            <div className="campo-producto">

            <label htmlFor="stockMinimo">
            Stock mínimo *
            </label>

            <input
            type="number"
            id="stockMinimo"
            name="stockMinimo"
            placeholder="Ej. 5"
            min="0"
            value={
            formulario.stockMinimo
            }
            onChange={manejarCambio}
            />

            </div>


            <div className="campo-producto">

            <label htmlFor="fechaVencimiento">
            Fecha de vencimiento
            </label>

            <input
            type="date"
            id="fechaVencimiento"
            name="fechaVencimiento"
            value={
            formulario.fechaVencimiento
            }
            onChange={manejarCambio}
            />
            </div>


          <div className="campo-producto">

            <label htmlFor="stock">
              Stock *
            </label>

            <input
              type="number"
              id="stock"
              name="stock"
              placeholder="Ej. 10"
              min="0"
              value={formulario.stock}
              onChange={manejarCambio}
            />

          </div>

          <div className="campo-producto descripcion">

            <label htmlFor="descripcion">
              Descripción
            </label>

            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Descripción del producto"
              rows="3"
              value={formulario.descripcion}
              onChange={manejarCambio}
            />

          </div>

          <div className="acciones-formulario">

            <button
              type="submit"
              className="btn-guardar-producto"
            >

              {editandoId !== null
                ? '💾 Actualizar producto'
                : '➕ Registrar producto'}

            </button>

            {editandoId !== null && (

              <button
                type="button"
                className="btn-cancelar-producto"
                onClick={limpiarFormulario}
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

      <section className="productos-listado">

        <div className="titulo-listado">

          <div>

            <h2>Productos registrados</h2>

            <p>
              Total de productos: {productos.length}
            </p>

          </div>

        </div>

        <div className="tabla-contenedor">

          <table className="tabla-productos">

            <thead>

              <tr>

                <th>ID</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Stock mínimo</th>
                <th>Vencimiento</th>
                <th>Acciones</th> 
              </tr>

            </thead>

            <tbody>

              {productos.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="sin-productos"
                  >
                    No hay productos registrados.
                  </td>

                </tr>

              ) : (

                productos.map((producto) => (

                  <tr key={producto.idProducto}>

                    <td>
                      {producto.idProducto}
                    </td>

                    <td className="nombre-producto-tabla">
                      {producto.nombreProducto}
                    </td>

                    <td>
                      {producto.descripcion || 'Sin descripción'}
                    </td>

                    <td>
                      {formatearPrecio(producto.precio)}
                    </td>

                    <td>

                      <span
                        className={
                         Number(producto.stock) <=
                          Number(producto.stockMinimo)
                           ? 'stock stock-bajo'
                           : 'stock stock-normal'
                        }
                      >
                         {producto.stock}
                    </span>
                    </td>

                    <td>
                      {producto.stockMinimo}
                    </td>

                    <td>
                      {producto.fechaVencimiento ||
                        'Sin fecha'
                      }
                    </td>


                    <td>

                      <div className="acciones-tabla">

                        <button
                          className="btn-editar"
                          onClick={() => editarProducto(producto)}
                        >
                          ✏️ Editar
                        </button>

                        <button
                          className="btn-eliminar"
                          onClick={() =>
                            eliminarProducto(
                              producto.idProducto
                            )
                          }
                        >
                          🗑️ Eliminar
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  )
}

export default Productos