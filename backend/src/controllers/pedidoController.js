import {
  listarPedidos,
  buscarPedidoPorId,
  crearPedido,
  actualizarEstadoPedido
} from '../services/pedidoService.js'


// =========================
// LISTAR PEDIDOS
// =========================

const obtenerPedidos = async (
  req,
  res
) => {

  try {

    const pedidos =
      await listarPedidos()

    res.status(200).json(
      pedidos
    )

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar los pedidos.'
    })
  }
}


// =========================
// OBTENER PEDIDO
// =========================

const obtenerPedido = async (
  req,
  res
) => {

  try {

    const pedido =
      await buscarPedidoPorId(
        req.params.id
      )


    if (!pedido) {

      return res.status(404).json({
        mensaje:
          'Pedido no encontrado.'
      })
    }


    res.status(200).json(
      pedido
    )


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar el pedido.'
    })
  }
}


// =========================
// REGISTRAR PEDIDO
// =========================

const registrarPedido = async (
  req,
  res
) => {

  try {

    const {
      idCliente,
      idUsuario,
      estadoPedido,
      productos
    } = req.body


    // =========================
    // VALIDACIONES
    // =========================

    if (!idCliente) {

      return res.status(400).json({
        mensaje:
          'Debe seleccionar un cliente.'
      })
    }


    if (!idUsuario) {

      return res.status(400).json({
        mensaje:
          'El usuario responsable es obligatorio.'
      })
    }


    if (
      !Array.isArray(productos) ||
      productos.length === 0
    ) {

      return res.status(400).json({
        mensaje:
          'El pedido debe contener al menos un producto.'
      })
    }


    const estadosPermitidos = [
      'Pendiente',
      'Confirmado',
      'Entregado',
      'Cancelado'
    ]


    const estado =
      estadoPedido || 'Pendiente'


    if (
      !estadosPermitidos.includes(
        estado
      )
    ) {

      return res.status(400).json({
        mensaje:
          'El estado del pedido no es válido.'
      })
    }


    for (const item of productos) {

      if (
        !item.idProducto ||
        !item.cantidad ||
        Number(item.cantidad) <= 0
      ) {

        return res.status(400).json({
          mensaje:
            'Todos los productos deben tener una cantidad válida.'
        })
      }
    }


    const resultado =
      await crearPedido({

        idCliente:
          Number(idCliente),

        idUsuario:
          Number(idUsuario),

        estadoPedido:
          estado,

        productos
      })


    res.status(201).json({

      mensaje:
        'Pedido registrado correctamente.',

      pedido:
        resultado

    })


  } catch (error) {

    console.error(error)


    res.status(
      error.statusCode || 500
    ).json({

      mensaje:
        error.message ||
        'Error al registrar el pedido.'

    })
  }
}


// =========================
// ACTUALIZAR ESTADO
// =========================

const cambiarEstadoPedido = async (
  req,
  res
) => {

  try {

    const {
      estadoPedido
    } = req.body


    const estadosPermitidos = [
      'Pendiente',
      'Confirmado',
      'Cancelado'
    ]


    if (
      !estadosPermitidos.includes(
        estadoPedido
      )
    ) {

      return res.status(400).json({
        mensaje:
          'El estado Entregado solo puede asignarse al registrar una venta.'
      })
    }


    const filas =
      await actualizarEstadoPedido(
        req.params.id,
        estadoPedido
      )


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Pedido no encontrado.'
      })
    }


    res.status(200).json({
      mensaje:
        'Estado actualizado correctamente.'
    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al actualizar el estado.'
    })
  }
}


export {
  obtenerPedidos,
  obtenerPedido,
  registrarPedido,
  cambiarEstadoPedido
}