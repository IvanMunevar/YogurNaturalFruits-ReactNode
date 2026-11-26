import {
  listarInsumos,
  buscarInsumoPorId,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
} from '../services/insumoService.js'


// =========================
// OBTENER TODOS
// =========================

const obtenerInsumos = async (req, res) => {

  try {

    const insumos =
      await listarInsumos()

    res.status(200).json(insumos)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar los insumos.'
    })
  }
}


// =========================
// OBTENER POR ID
// =========================

const obtenerInsumo = async (req, res) => {

  try {

    const insumo =
      await buscarInsumoPorId(
        req.params.id
      )


    if (!insumo) {

      return res.status(404).json({
        mensaje:
          'Insumo no encontrado.'
      })
    }


    res.status(200).json(insumo)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar el insumo.'
    })
  }
}


// =========================
// REGISTRAR
// =========================

const registrarInsumo = async (req, res) => {

  try {

    const {
      nombreInsumo,
      cantidad,
      cantidadMinima,
      unidadMedida,
      fechaVencimiento,
      idProveedor
    } = req.body


    if (
      !nombreInsumo ||
      cantidad === undefined ||
      cantidadMinima === undefined ||
      !unidadMedida ||
      !idProveedor
    ) {

      return res.status(400).json({
        mensaje:
          'Nombre, cantidad, cantidad mínima, unidad de medida y proveedor son obligatorios.'
      })
    }


    if (Number(cantidad) < 0) {

      return res.status(400).json({
        mensaje:
          'La cantidad no puede ser negativa.'
      })
    }

    if (
    Number(cantidadMinima) < 0
    ) {

    return res.status(400).json({
    mensaje:
      'La cantidad mínima no puede ser negativa.'
    })
    }

    const nuevoInsumo =
      await crearInsumo({
        nombreInsumo,
        cantidad,
        cantidadMinima,
        unidadMedida,
        fechaVencimiento:
          fechaVencimiento || null,
        idProveedor
      })


    res.status(201).json({
      mensaje:
        'Insumo registrado correctamente.',

      insumo: nuevoInsumo
    })


  } catch (error) {

    console.error(error)


    if (error.errno === 1452) {

      return res.status(400).json({
        mensaje:
          'El proveedor seleccionado no existe.'
      })
    }


    res.status(500).json({
      mensaje:
        'Error al registrar el insumo.'
    })
  }
}


// =========================
// EDITAR
// =========================

const editarInsumo = async (req, res) => {

  try {

    const {
      nombreInsumo,
      cantidad,
      cantidadMinima,
      unidadMedida,
      idProveedor
    } = req.body


    if (
  !nombreInsumo ||
  cantidad === undefined ||
  cantidadMinima === undefined ||
  !unidadMedida ||
  !idProveedor
) {
  return res.status(400).json({
    mensaje:
      'Nombre, cantidad, cantidad mínima, unidad de medida y proveedor son obligatorios.'
  })
}

if (
  Number(cantidad) < 0 ||
  Number(cantidadMinima) < 0
) {
  return res.status(400).json({
    mensaje:
      'Las cantidades no pueden ser negativas.'
  })
}

    const filas =
      await actualizarInsumo(
        req.params.id,
        req.body
      )


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Insumo no encontrado.'
      })
    }


    res.status(200).json({
      mensaje:
        'Insumo actualizado correctamente.'
    })


  } catch (error) {

    console.error(error)


    if (error.errno === 1452) {

      return res.status(400).json({
        mensaje:
          'El proveedor seleccionado no existe.'
      })
    }


    res.status(500).json({
      mensaje:
        'Error al actualizar el insumo.'
    })
  }
}


// =========================
// ELIMINAR
// =========================

const borrarInsumo = async (req, res) => {

  try {

    const filas =
      await eliminarInsumo(
        req.params.id
      )


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Insumo no encontrado.'
      })
    }


    res.status(200).json({
      mensaje:
        'Insumo eliminado correctamente.'
    })


  } catch (error) {

    console.error(error)


    if (error.errno === 1451) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar el insumo porque tiene registros relacionados.'
      })
    }


    res.status(500).json({
      mensaje:
        'Error al eliminar el insumo.'
    })
  }
}


export {
  obtenerInsumos,
  obtenerInsumo,
  registrarInsumo,
  editarInsumo,
  borrarInsumo
}