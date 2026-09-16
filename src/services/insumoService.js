const API_URL =
  'http://localhost:3000/api/insumos'


// =========================
// OBTENER INSUMOS
// =========================

const obtenerInsumos = async () => {

  const respuesta =
    await fetch(API_URL)

  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar los insumos.'
    )
  }


  return datos
}


// =========================
// CREAR INSUMO
// =========================

const crearInsumo = async (insumo) => {

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
          JSON.stringify(insumo)
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible registrar el insumo.'
    )
  }


  return datos
}


// =========================
// ACTUALIZAR
// =========================

const actualizarInsumo = async (
  idInsumo,
  insumo
) => {

  const respuesta =
    await fetch(
      `${API_URL}/${idInsumo}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(insumo)
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible actualizar el insumo.'
    )
  }


  return datos
}


// =========================
// ELIMINAR
// =========================

const eliminarInsumo = async (
  idInsumo
) => {

  const respuesta =
    await fetch(
      `${API_URL}/${idInsumo}`,
      {
        method: 'DELETE'
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible eliminar el insumo.'
    )
  }


  return datos
}


export {
  obtenerInsumos,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
}