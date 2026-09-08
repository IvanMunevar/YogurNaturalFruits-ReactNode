const API_URL = 'http://localhost:3000/api/productos'


const obtenerProductos = async () => {

  const respuesta = await fetch(API_URL)

  if (!respuesta.ok) {
    throw new Error(
      'No fue posible consultar los productos.'
    )
  }

  const datos = await respuesta.json()

  console.log(
    'Datos recibidos desde Node:',
    datos
  )

  return datos
}


const crearProducto = async (producto) => {

  const respuesta = await fetch(
    API_URL,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(producto)
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
      'No fue posible registrar el producto.'
    )
  }

  return datos
}


const actualizarProducto = async (
  idProducto,
  producto
) => {

  const respuesta = await fetch(
    `${API_URL}/${idProducto}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(producto)
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
      'No fue posible actualizar el producto.'
    )
  }

  return datos
}


const eliminarProducto = async (idProducto) => {

  const respuesta = await fetch(
    `${API_URL}/${idProducto}`,
    {
      method: 'DELETE'
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(
      datos.mensaje ||
      'No fue posible eliminar el producto.'
    )
  }

  return datos
}


export {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
}