const API_URL =
  'http://localhost:3000/api/dashboard'


// =========================
// OBTENER RESUMEN
// =========================

const obtenerResumenDashboard = async () => {

  const respuesta =
    await fetch(
      `${API_URL}/resumen`
    )

  const datos =
    await respuesta.json()


  if (!respuesta.ok) {

    throw new Error(
      datos.mensaje ||
      'No fue posible consultar el Dashboard.'
    )
  }


  return datos
}


export {
  obtenerResumenDashboard
}