import {
  listarClientes,
  buscarClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../services/clienteService.js'


// =========================
// OBTENER CLIENTES
// =========================

const obtenerClientes = async (
  req,
  res
) => {

  try {

    const clientes =
      await listarClientes()

    res.status(200).json(clientes)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar los clientes.'
    })
  }
}


// =========================
// OBTENER CLIENTE POR ID
// =========================

const obtenerCliente = async (
  req,
  res
) => {

  try {

    const cliente =
      await buscarClientePorId(
        req.params.id
      )


    if (!cliente) {

      return res.status(404).json({
        mensaje:
          'Cliente no encontrado.'
      })
    }


    res.status(200).json(cliente)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar el cliente.'
    })
  }
}


// =========================
// REGISTRAR CLIENTE
// =========================

const registrarCliente = async (
  req,
  res
) => {

  try {

    const {
      nombreCliente,
      direccion,
      telefono,
      correo
    } = req.body


    // Según la estructura real de MySQL,
    // nombre y teléfono son obligatorios.
    if (
      !nombreCliente ||
      !telefono
    ) {

      return res.status(400).json({
        mensaje:
          'Nombre y teléfono son obligatorios.'
      })
    }


    const nuevoCliente =
      await crearCliente({

        nombreCliente:
          nombreCliente.trim(),

        direccion:
          direccion?.trim() || null,

        telefono:
          telefono.trim(),

        correo:
          correo?.trim() || null

      })


    res.status(201).json({

      mensaje:
        'Cliente registrado correctamente.',

      cliente:
        nuevoCliente

    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al registrar el cliente.'
    })
  }
}


// =========================
// ACTUALIZAR CLIENTE
// =========================

const editarCliente = async (
  req,
  res
) => {

  try {

    const {
      nombreCliente,
      direccion,
      telefono,
      correo
    } = req.body


    if (
      !nombreCliente ||
      !telefono
    ) {

      return res.status(400).json({
        mensaje:
          'Nombre y teléfono son obligatorios.'
      })
    }


    const filas =
      await actualizarCliente(
        req.params.id,
        {
          nombreCliente:
            nombreCliente.trim(),

          direccion:
            direccion?.trim() || null,

          telefono:
            telefono.trim(),

          correo:
            correo?.trim() || null
        }
      )


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Cliente no encontrado.'
      })
    }


    res.status(200).json({
      mensaje:
        'Cliente actualizado correctamente.'
    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al actualizar el cliente.'
    })
  }
}


// =========================
// ELIMINAR CLIENTE
// =========================

const borrarCliente = async (
  req,
  res
) => {

  try {

    const filas =
      await eliminarCliente(
        req.params.id
      )


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Cliente no encontrado.'
      })
    }


    res.status(200).json({
      mensaje:
        'Cliente eliminado correctamente.'
    })


  } catch (error) {

    console.error(error)


    // Si posteriormente tiene pedidos asociados,
    // MySQL protegerá la integridad referencial.
    if (error.errno === 1451) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar el cliente porque tiene pedidos relacionados.'
      })
    }


    res.status(500).json({
      mensaje:
        'Error al eliminar el cliente.'
    })
  }
}


export {
  obtenerClientes,
  obtenerCliente,
  registrarCliente,
  editarCliente,
  borrarCliente
}