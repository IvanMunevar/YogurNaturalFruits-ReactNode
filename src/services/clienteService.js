const API_URL =
  'http://localhost:3000/api/clientes'


// =========================
// OBTENER CLIENTES
// =========================

const obtenerClientes = async () => {

  const respuesta =
    await fetch(API_URL)

  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar los clientes.'
    )
  }


  return datos
}


// =========================
// CREAR CLIENTE
// =========================

const crearCliente = async (
  cliente
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
          JSON.stringify(cliente)
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible registrar el cliente.'
    )
  }


  return datos
}


// =========================
// ACTUALIZAR CLIENTE
// =========================

const actualizarCliente = async (
  idCliente,
  cliente
) => {

  const respuesta =
    await fetch(
      `${API_URL}/${idCliente}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(cliente)
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible actualizar el cliente.'
    )
  }


  return datos
}


// =========================
// ELIMINAR CLIENTE
// =========================

const eliminarCliente = async (
  idCliente
) => {

  const respuesta =
    await fetch(
      `${API_URL}/${idCliente}`,
      {
        method: 'DELETE'
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible eliminar el cliente.'
    )
  }


  return datos
}


export {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
}