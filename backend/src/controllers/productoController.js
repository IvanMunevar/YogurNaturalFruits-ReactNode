import {
  listarProductos,
  buscarProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../services/productoService.js'


const obtenerProductos = async (req, res) => {

  try {

    const productos = await listarProductos()

    res.status(200).json(productos)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje: 'Error al consultar los productos.'
    })
  }
}


const obtenerProducto = async (req, res) => {

  try {

    const producto = await buscarProductoPorId(
      req.params.id
    )

    if (!producto) {

      return res.status(404).json({
        mensaje: 'Producto no encontrado.'
      })
    }

    res.status(200).json(producto)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje: 'Error al consultar el producto.'
    })
  }
}


const registrarProducto = async (req, res) => {

  try {

    const {
      nombreProducto,
      descripcion,
      precio,
      stock
    } = req.body

    if (
      !nombreProducto ||
      precio === undefined ||
      stock === undefined
    ) {

      return res.status(400).json({
        mensaje: 'Debe completar los campos obligatorios.'
      })
    }

    const nuevoProducto =
      await crearProducto(req.body)

    res.status(201).json({
      mensaje: 'Producto registrado correctamente.',
      producto: nuevoProducto
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje: 'Error al registrar el producto.'
    })
  }
}


const editarProducto = async (req, res) => {

  try {

    const filas =
      await actualizarProducto(
        req.params.id,
        req.body
      )

    if (filas === 0) {

      return res.status(404).json({
        mensaje: 'Producto no encontrado.'
      })
    }

    res.status(200).json({
      mensaje: 'Producto actualizado correctamente.'
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje: 'Error al actualizar el producto.'
    })
  }
}


const borrarProducto = async (req, res) => {

  try {

    const filas =
      await eliminarProducto(req.params.id)

    if (filas === 0) {

      return res.status(404).json({
        mensaje: 'Producto no encontrado.'
      })
    }

    res.status(200).json({
      mensaje: 'Producto eliminado correctamente.'
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje: 'Error al eliminar el producto.'
    })
  }
}


export {
  obtenerProductos,
  obtenerProducto,
  registrarProducto,
  editarProducto,
  borrarProducto
}