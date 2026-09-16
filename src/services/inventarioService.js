const API_URL =
  'http://localhost:3000/api/inventario'


// =========================
// OBTENER MOVIMIENTOS
// =========================

const obtenerMovimientos = async () => {

  const respuesta =
    await fetch(API_URL)


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar el inventario.'
    )
  }


  return datos
}


// =========================
// REGISTRAR MOVIMIENTO
// =========================

const registrarMovimiento = async (
  movimiento
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
          JSON.stringify(movimiento)
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible registrar el movimiento.'
    )
  }


  return datos
}


export {
  obtenerMovimientos,
  registrarMovimiento
}