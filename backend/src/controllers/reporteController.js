import {
  generarReporte,
  listarReportes
} from '../services/reporteService.js'


// ========================================
// GENERAR
// ========================================

const crearReporte = async (
  req,
  res
) => {

  try {

    const {
      tipoReporte,
      fechaInicio,
      fechaFin,
      idUsuario
    } = req.body


    if (
      !tipoReporte ||
      !idUsuario
    ) {

      return res.status(400).json({
        mensaje:
          'El tipo de reporte y el usuario son obligatorios.'
      })
    }


    if (
      fechaInicio &&
      fechaFin &&
      fechaInicio > fechaFin
    ) {

      return res.status(400).json({
        mensaje:
          'La fecha inicial no puede ser posterior a la fecha final.'
      })
    }


    const resultado =
      await generarReporte({

        tipoReporte,
        fechaInicio,
        fechaFin,
        idUsuario

      })


    res.status(201).json(
      resultado
    )


  } catch (error) {

    console.error(
      'Error al generar reporte:',
      error
    )


    res.status(
      error.status || 500
    ).json({

      mensaje:
        error.message ||
        'Error al generar el reporte.'

    })
  }
}


// ========================================
// HISTORIAL
// ========================================

const obtenerReportes = async (
  req,
  res
) => {

  try {

    const reportes =
      await listarReportes()


    res.status(200).json(
      reportes
    )


  } catch (error) {

    console.error(error)


    res.status(500).json({
      mensaje:
        'Error al consultar el historial de reportes.'
    })
  }
}


export {
  crearReporte,
  obtenerReportes
}