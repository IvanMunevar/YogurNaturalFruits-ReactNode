const API_URL =
  'http://localhost:3000/api/ventas'


// =========================
// OBTENER VENTAS
// =========================

const obtenerVentas = async () => {

  const respuesta =
    await fetch(API_URL)

  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar las ventas.'
    )
  }


  return datos
}


// =========================
// OBTENER VENTA POR ID
// =========================

const obtenerVentaPorId = async (
  idVenta
) => {

  const respuesta =
    await fetch(
      `${API_URL}/${idVenta}`
    )

  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar la venta.'
    )
  }


  return datos
}


// =========================
// REGISTRAR VENTA
// =========================

const crearVenta = async (
  venta
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
          JSON.stringify(venta)
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible registrar la venta.'
    )
  }


  return datos
}


export {
  obtenerVentas,
  obtenerVentaPorId,
  crearVenta
}