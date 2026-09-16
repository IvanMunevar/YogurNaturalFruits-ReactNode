const API_URL =
  'http://localhost:3000/api/pedidos'


// =========================
// OBTENER PEDIDOS
// =========================

const obtenerPedidos = async () => {

  const respuesta =
    await fetch(API_URL)

  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar los pedidos.'
    )
  }


  return datos
}


// =========================
// OBTENER PEDIDO POR ID
// =========================

const obtenerPedidoPorId = async (
  idPedido
) => {

  const respuesta =
    await fetch(
      `${API_URL}/${idPedido}`
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar el pedido.'
    )
  }


  return datos
}


// =========================
// CREAR PEDIDO
// =========================

const crearPedido = async (
  pedido
) => {

  const respuesta =
    await fetch(
      API_URL,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(pedido)
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible registrar el pedido.'
    )
  }


  return datos
}


// =========================
// CAMBIAR ESTADO
// =========================

const actualizarEstadoPedido =
  async (
    idPedido,
    estadoPedido
  ) => {

    const respuesta =
      await fetch(
        `${API_URL}/${idPedido}/estado`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({
              estadoPedido
            })
        }
      )


    const datos =
      await respuesta.json()


    if (!respuesta.ok) {

      throw new Error(
        datos.mensaje ||
        'No fue posible actualizar el estado.'
      )
    }


    return datos
  }


export {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido
}