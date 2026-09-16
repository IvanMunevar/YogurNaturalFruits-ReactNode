import {
  listarMovimientos,
  buscarMovimientoPorId,
  registrarMovimiento
} from '../services/inventarioService.js'


// =========================
// OBTENER MOVIMIENTOS
// =========================

const obtenerMovimientos = async (
  req,
  res
) => {

  try {

    const movimientos =
      await listarMovimientos()

    res.status(200).json(
      movimientos
    )

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar el inventario.'
    })
  }
}


// =========================
// OBTENER POR ID
// =========================

const obtenerMovimiento = async (
  req,
  res
) => {

  try {

    const movimiento =
      await buscarMovimientoPorId(
        req.params.id
      )


    if (!movimiento) {

      return res.status(404).json({
        mensaje:
          'Movimiento no encontrado.'
      })
    }


    res.status(200).json(
      movimiento
    )

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar el movimiento.'
    })
  }
}


// =========================
// REGISTRAR MOVIMIENTO
// =========================

const crearMovimiento = async (
  req,
  res
) => {

  try {

    const {
      tipoMovimiento,
      cantidad,
      idProducto,
      idInsumo,
      idUsuario
    } = req.body


    // Validar tipo
    if (
      ![
        'Entrada',
        'Salida'
      ].includes(tipoMovimiento)
    ) {

      return res.status(400).json({
        mensaje:
          'El tipo de movimiento debe ser Entrada o Salida.'
      })
    }


    // Validar cantidad
    if (
      cantidad === undefined ||
      Number(cantidad) <= 0
    ) {

      return res.status(400).json({
        mensaje:
          'La cantidad debe ser mayor a cero.'
      })
    }


    // Validar usuario
    if (!idUsuario) {

      return res.status(400).json({
        mensaje:
          'El usuario responsable es obligatorio.'
      })
    }


    const tieneProducto =
      idProducto !== null &&
      idProducto !== undefined


    const tieneInsumo =
      idInsumo !== null &&
      idInsumo !== undefined


    // Debe existir exactamente uno
    if (
      (!tieneProducto && !tieneInsumo) ||
      (tieneProducto && tieneInsumo)
    ) {

      return res.status(400).json({
        mensaje:
          'Debe seleccionar un producto o un insumo, pero no ambos.'
      })
    }


    const resultado =
      await registrarMovimiento({

        tipoMovimiento,

        cantidad:
          Number(cantidad),

        idProducto:
          tieneProducto
            ? Number(idProducto)
            : null,

        idInsumo:
          tieneInsumo
            ? Number(idInsumo)
            : null,

        idUsuario:
          Number(idUsuario)
      })


    res.status(201).json({

      mensaje:
        'Movimiento registrado correctamente.',

      movimiento:
        resultado
    })


  } catch (error) {

    console.error(error)


    res.status(
      error.statusCode || 500
    ).json({

      mensaje:
        error.message ||
        'Error al registrar el movimiento.'

    })
  }
}


export {
  obtenerMovimientos,
  obtenerMovimiento,
  crearMovimiento
}