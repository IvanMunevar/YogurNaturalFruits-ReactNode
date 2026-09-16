import {
  listarVentas,
  buscarVentaPorId,
  crearVenta
} from '../services/ventaService.js'


// =========================
// OBTENER VENTAS
// =========================

const obtenerVentas = async (
  req,
  res
) => {

  try {

    const ventas =
      await listarVentas()

    res.status(200).json(
      ventas
    )

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar las ventas.'
    })
  }
}


// =========================
// OBTENER VENTA POR ID
// =========================

const obtenerVenta = async (
  req,
  res
) => {

  try {

    const venta =
      await buscarVentaPorId(
        req.params.id
      )


    if (!venta) {

      return res.status(404).json({
        mensaje:
          'Venta no encontrada.'
      })
    }


    res.status(200).json(
      venta
    )


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar la venta.'
    })
  }
}


// =========================
// REGISTRAR VENTA
// =========================

const registrarVenta = async (
  req,
  res
) => {

  try {

    const {
      idPedido,
      metodoPago
    } = req.body


    if (!idPedido) {

      return res.status(400).json({
        mensaje:
          'Debe seleccionar un pedido.'
      })
    }


    if (
      !metodoPago ||
      metodoPago.trim() === ''
    ) {

      return res.status(400).json({
        mensaje:
          'Debe seleccionar un método de pago.'
      })
    }


    const metodosPermitidos = [
      'Efectivo',
      'Transferencia',
      'Tarjeta',
      'Nequi',
      'Daviplata'
    ]


    if (
      !metodosPermitidos.includes(
        metodoPago
      )
    ) {

      return res.status(400).json({
        mensaje:
          'Método de pago no válido.'
      })
    }


    const venta =
      await crearVenta(
        Number(idPedido),
        metodoPago
      )


    res.status(201).json({

      mensaje:
        'Venta registrada correctamente.',

      venta
    })


  } catch (error) {

    console.error(error)


    res.status(
      error.statusCode || 500
    ).json({

      mensaje:
        error.message ||
        'Error al registrar la venta.'

    })
  }
}


export {
  obtenerVentas,
  obtenerVenta,
  registrarVenta
}