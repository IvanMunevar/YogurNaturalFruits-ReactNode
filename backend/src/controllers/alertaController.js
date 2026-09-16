import {
  listarAlertas,
  generarAlertas,
  actualizarEstadoAlerta
} from '../services/alertaService.js'


// =========================
// OBTENER ALERTAS
// =========================

const obtenerAlertas = async (
  req,
  res
) => {

  try {

    const alertas =
      await listarAlertas()

    res.status(200).json(
      alertas
    )

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar las alertas.'
    })
  }
}


// =========================
// GENERAR ALERTAS
// =========================

const sincronizarAlertas = async (
  req,
  res
) => {

  try {

    const resultado =
      await generarAlertas()


    res.status(200).json({

      mensaje:
        'Alertas verificadas correctamente.',

      nuevasAlertas:
        resultado.nuevasAlertas

    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al generar las alertas.'
    })
  }
}


// =========================
// CAMBIAR ESTADO
// =========================

const cambiarEstadoAlerta = async (
  req,
  res
) => {

  try {

    const {
      estado
    } = req.body


    const estadosPermitidos = [
      'Activa',
      'Atendida',
      'Resuelta'
    ]


    if (
      !estadosPermitidos.includes(
        estado
      )
    ) {

      return res.status(400).json({
        mensaje:
          'Estado de alerta no válido.'
      })
    }


    const filas =
      await actualizarEstadoAlerta(
        req.params.id,
        estado
      )


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Alerta no encontrada.'
      })
    }


    res.status(200).json({
      mensaje:
        'Estado de alerta actualizado correctamente.'
    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al actualizar la alerta.'
    })
  }
}


export {
  obtenerAlertas,
  sincronizarAlertas,
  cambiarEstadoAlerta
}