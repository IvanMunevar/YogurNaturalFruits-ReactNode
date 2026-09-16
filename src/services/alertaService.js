const API_URL =
  'http://localhost:3000/api/alertas'


// =========================
// OBTENER ALERTAS
// =========================

const obtenerAlertas = async () => {

  const respuesta =
    await fetch(API_URL)

  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar las alertas.'
    )
  }


  return datos
}


// =========================
// GENERAR / SINCRONIZAR
// ALERTAS
// =========================

const generarAlertas = async () => {

  const respuesta =
    await fetch(
      `${API_URL}/generar`,
      {
        method: 'POST'
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible generar las alertas.'
    )
  }


  return datos
}


// =========================
// ACTUALIZAR ESTADO
// =========================

const actualizarEstadoAlerta =
  async (
    idAlerta,
    estado
  ) => {

    const respuesta =
      await fetch(
        `${API_URL}/${idAlerta}/estado`,
        {
          method: 'PATCH',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({
              estado
            })
        }
      )


    const datos =
      await respuesta.json()


    if (!respuesta.ok) {

      throw new Error(
        datos.mensaje ||
        'No fue posible actualizar la alerta.'
      )
    }


    return datos
  }


export {
  obtenerAlertas,
  generarAlertas,
  actualizarEstadoAlerta
}