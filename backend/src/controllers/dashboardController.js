import {
  obtenerResumenDashboard
} from '../services/dashboardService.js'


const obtenerDashboard = async (
  req,
  res
) => {

  try {

    const resumen =
      await obtenerResumenDashboard()


    res.status(200).json(
      resumen
    )


  } catch (error) {

    console.error(
      'Error Dashboard:',
      error
    )


    res.status(500).json({
      mensaje:
        'Error al consultar la información del Dashboard.'
    })
  }
}


export {
  obtenerDashboard
}