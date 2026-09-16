const API_URL =
  'http://localhost:3000/api/usuarios'

// =========================
// INICIAR SESIÓN
// =========================

const iniciarSesion = async (
  correo,
  contrasena
) => {

  const respuesta = await fetch(
    `${API_URL}/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json'
      },

      body: JSON.stringify({
        correo,
        contrasena
      })
    }
  )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible iniciar sesión.'
    )
  }


  return datos
}

// =========================
// OBTENER USUARIOS
// =========================

const obtenerUsuarios = async () => {

  const respuesta = await fetch(API_URL)

  const datos = await respuesta.json()

  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar los usuarios.'
    )
  }

  return datos
}


// =========================
// CREAR USUARIO
// =========================

const crearUsuario = async (usuario) => {

  const respuesta = await fetch(
    API_URL,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(usuario)
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible registrar el usuario.'
    )
  }

  return datos
}


// =========================
// ACTUALIZAR USUARIO
// =========================

const actualizarUsuario = async (
  idUsuario,
  usuario
) => {

  const respuesta = await fetch(
    `${API_URL}/${idUsuario}`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(usuario)
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible actualizar el usuario.'
    )
  }

  return datos
}


// =========================
// ELIMINAR USUARIO
// =========================

const eliminarUsuario = async (
  idUsuario
) => {

  const respuesta = await fetch(
    `${API_URL}/${idUsuario}`,
    {
      method: 'DELETE'
    }
  )

  const datos = await respuesta.json()

  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible eliminar el usuario.'
    )
  }

  return datos
}


export {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario, 
  iniciarSesion
}