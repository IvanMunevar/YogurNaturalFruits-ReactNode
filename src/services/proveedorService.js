const API_URL =
  'http://localhost:3000/api/proveedores'


// =========================
// OBTENER PROVEEDORES
// =========================

const obtenerProveedores = async () => {

  const respuesta = await fetch(API_URL)

  const datos = await respuesta.json()

  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar los proveedores.'
    )
  }

  return datos
}


// =========================
// CREAR PROVEEDOR
// =========================

const crearProveedor = async (proveedor) => {

  const respuesta = await fetch(
    API_URL,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(proveedor)
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible registrar el proveedor.'
    )
  }

  return datos
}


// =========================
// ACTUALIZAR
// =========================

const actualizarProveedor = async (
  idProveedor,
  proveedor
) => {

  const respuesta = await fetch(
    `${API_URL}/${idProveedor}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(proveedor)
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible actualizar el proveedor.'
    )
  }

  return datos
}


// =========================
// ELIMINAR
// =========================

const eliminarProveedor = async (
  idProveedor
) => {

  const respuesta = await fetch(
    `${API_URL}/${idProveedor}`,
    {
      method: 'DELETE'
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible eliminar el proveedor.'
    )
  }

  return datos
}


export {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
}