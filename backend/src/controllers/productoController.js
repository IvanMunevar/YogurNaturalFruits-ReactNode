import {
  listarProductos,
  buscarProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../services/productoService.js'


// =========================
// OBTENER TODOS
// =========================

const obtenerProductos = async (
  req,
  res
) => {

  try {

    const productos =
      await listarProductos()

    res.status(200).json(
      productos
    )

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar los productos.'
    })
  }
}


// =========================
// OBTENER POR ID
// =========================

const obtenerProducto = async (
  req,
  res
) => {

  try {

    const producto =
      await buscarProductoPorId(
        req.params.id
      )


    if (!producto) {

      return res.status(404).json({
        mensaje:
          'Producto no encontrado.'
      })
    }


    res.status(200).json(
      producto
    )


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar el producto.'
    })
  }
}


// =========================
// REGISTRAR
// =========================

const registrarProducto = async (
  req,
  res
) => {

  try {

    const {
      nombreProducto,
      descripcion,
      precio,
      stock,
      stockMinimo,
      fechaVencimiento
    } = req.body


    if (
      !nombreProducto ||
      precio === undefined ||
      stock === undefined ||
      stockMinimo === undefined
    ) {

      return res.status(400).json({
        mensaje:
          'Nombre, precio, stock y stock mínimo son obligatorios.'
      })
    }


    if (Number(precio) <= 0) {

      return res.status(400).json({
        mensaje:
          'El precio debe ser mayor a cero.'
      })
    }


    if (Number(stock) < 0) {

      return res.status(400).json({
        mensaje:
          'El stock no puede ser negativo.'
      })
    }


    if (Number(stockMinimo) < 0) {

      return res.status(400).json({
        mensaje:
          'El stock mínimo no puede ser negativo.'
      })
    }


    const nuevoProducto =
      await crearProducto({

        nombreProducto:
          nombreProducto.trim(),

        descripcion:
          descripcion?.trim() || null,

        precio:
          Number(precio),

        stock:
          Number(stock),

        stockMinimo:
          Number(stockMinimo),

        fechaVencimiento:
          fechaVencimiento || null
      })


    res.status(201).json({

      mensaje:
        'Producto registrado correctamente.',

      producto:
        nuevoProducto
    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al registrar el producto.'
    })
  }
}


// =========================
// EDITAR
// =========================

const editarProducto = async (
  req,
  res
) => {

  try {

    const {
      nombreProducto,
      descripcion,
      precio,
      stock,
      stockMinimo,
      fechaVencimiento
    } = req.body


    if (
      !nombreProducto ||
      precio === undefined ||
      stock === undefined ||
      stockMinimo === undefined
    ) {

      return res.status(400).json({
        mensaje:
          'Debe completar los campos obligatorios.'
      })
    }


    if (
      Number(precio) <= 0 ||
      Number(stock) < 0 ||
      Number(stockMinimo) < 0
    ) {

      return res.status(400).json({
        mensaje:
          'Revise los valores de precio y existencias.'
      })
    }


    const productoExiste =
      await buscarProductoPorId(
        req.params.id
      )


    if (!productoExiste) {

      return res.status(404).json({
        mensaje:
          'Producto no encontrado.'
      })
    }


    await actualizarProducto(
      req.params.id,
      {

        nombreProducto:
          nombreProducto.trim(),

        descripcion:
          descripcion?.trim() || null,

        precio:
          Number(precio),

        stock:
          Number(stock),

        stockMinimo:
          Number(stockMinimo),

        fechaVencimiento:
          fechaVencimiento || null
      }
    )


    res.status(200).json({
      mensaje:
        'Producto actualizado correctamente.'
    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al actualizar el producto.'
    })
  }
}


// =========================
// ELIMINAR
// =========================

const borrarProducto = async (
  req,
  res
) => {

  try {

    const filas =
      await eliminarProducto(
        req.params.id
      )


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Producto no encontrado.'
      })
    }


    res.status(200).json({
      mensaje:
        'Producto eliminado correctamente.'
    })


  } catch (error) {

    console.error(error)


    if (error.errno === 1451) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar el producto porque tiene registros relacionados.'
      })
    }


    res.status(500).json({
      mensaje:
        'Error al eliminar el producto.'
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