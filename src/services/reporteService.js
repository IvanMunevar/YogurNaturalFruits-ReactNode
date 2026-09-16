const API_URL =
  'http://localhost:3000/api/reportes'


// =========================
// GENERAR REPORTE
// =========================

const generarReporte = async (
  datosReporte
) => {

  const respuesta =
    await fetch(
      `${API_URL}/generar`,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(
            datosReporte
          )
      }
    )


  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible generar el reporte.'
    )
  }


  return datos
}


// =========================
// HISTORIAL
// =========================

const obtenerReportes = async () => {

  const respuesta =
    await fetch(API_URL)

  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar el historial.'
    )
  }


  return datos
}


export {
  generarReporte,
  obtenerReportes
}