import { useState } from 'react'
import '../styles/Productos.css'

function Productos() {

  const [productos, setProductos] = useState([])

  const [formulario, setFormulario] = useState({
    nombreProducto: '',
    descripcion: '',
    precio: '',
    stock: ''
  })

  const [editandoId, setEditandoId] = useState(null)

  const manejarCambio = (evento) => {

    const { name, value } = evento.target

    setFormulario({
      ...formulario,
      [name]: value
    })
  }

  const limpiarFormulario = () => {

    setFormulario({
      nombreProducto: '',
      descripcion: '',
      precio: '',
      stock: ''
    })

    setEditandoId(null)
  }

  const guardarProducto = (evento) => {

    evento.preventDefault()

    if (
      formulario.nombreProducto.trim() === '' ||
      formulario.precio === '' ||
      formulario.stock === ''
    ) {
      alert('Debe completar los campos obligatorios.')
      return
    }

    if (Number(formulario.precio) <= 0) {
      alert('El precio debe ser mayor a cero.')
      return
    }

    if (Number(formulario.stock) < 0) {
      alert('El stock no puede ser negativo.')
      return
    }

    if (editandoId !== null) {

      const productosActualizados = productos.map((producto) => {

        if (producto.idProducto === editandoId) {

          return {
            ...producto,
            nombreProducto: formulario.nombreProducto,
            descripcion: formulario.descripcion,
            precio: Number(formulario.precio),
            stock: Number(formulario.stock)
          }
        }

        return producto
      })

      setProductos(productosActualizados)

    } else {

      const nuevoProducto = {

        idProducto:
          productos.length > 0
            ? Math.max(...productos.map((producto) => producto.idProducto)) + 1
            : 1,

        nombreProducto: formulario.nombreProducto,
        descripcion: formulario.descripcion,
        precio: Number(formulario.precio),
        stock: Number(formulario.stock)
      }

      setProductos([
        ...productos,
        nuevoProducto
      ])
    }

    limpiarFormulario()
  }

  const editarProducto = (producto) => {

    setFormulario({
      nombreProducto: producto.nombreProducto,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    })

    setEditandoId(producto.idProducto)
  }

  const eliminarProducto = (idProducto) => {

    const confirmar = window.confirm(
      '¿Está seguro de eliminar este producto?'
    )

    if (!confirmar) {
      return
    }

    const nuevaLista = productos.filter(
      (producto) => producto.idProducto !== idProducto
    )

    setProductos(nuevaLista)

    if (editandoId === idProducto) {
      limpiarFormulario()
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

            <label htmlFor="stock">
              Stock *
            </label>

            <input
              type="number"
              id="stock"
              name="stock"
              placeholder="Ej. 20"
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
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {productos.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
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
                          producto.stock <= 5
                            ? 'stock stock-bajo'
                            : 'stock stock-normal'
                        }
                      >
                        {producto.stock}
                      </span>
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