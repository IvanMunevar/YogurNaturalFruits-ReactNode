import {
  listarProveedores,
  buscarProveedorPorId,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
} from '../services/proveedorService.js'


// =========================
// OBTENER TODOS
// =========================

const obtenerProveedores = async (req, res) => {

  try {

    const proveedores = await listarProveedores()

    res.status(200).json(proveedores)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje: 'Error al consultar los proveedores.'
    })
  }
}


// =========================
// OBTENER POR ID
// =========================

const obtenerProveedor = async (req, res) => {

  try {

    const proveedor =
      await buscarProveedorPorId(req.params.id)

    if (!proveedor) {

      return res.status(404).json({
        mensaje: 'Proveedor no encontrado.'
      })
    }

    res.status(200).json(proveedor)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje: 'Error al consultar el proveedor.'
    })
  }
}


// =========================
// REGISTRAR
// =========================

const registrarProveedor = async (req, res) => {

  try {

    const {
      nombreProveedor,
      contacto,
      telefono,
      correo,
      direccion,
      estado
    } = req.body


    if (!nombreProveedor) {

      return res.status(400).json({
        mensaje:
          'Nombre, teléfono y estado son obligatorios.'
      })
    }


    const nuevoProveedor =
      await crearProveedor({
        nombreProveedor,
        contacto: contacto || '',
        telefono: telefono || '',
        correo: correo || '',
        direccion: direccion || '',
        estado: estado || 'Activo'
      })


    res.status(201).json({
      mensaje:
        'Proveedor registrado correctamente.',
      proveedor: nuevoProveedor
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al registrar el proveedor.'
    })
  }
}


// =========================
// EDITAR
// =========================

const editarProveedor = async (req, res) => {

  try {

    const filas = await actualizarProveedor(
      req.params.id,
      req.body
    )

    if (filas === 0) {

      return res.status(404).json({
        mensaje: 'Proveedor no encontrado.'
      })
    }

    res.status(200).json({
      mensaje:
        'Proveedor actualizado correctamente.'
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al actualizar el proveedor.'
    })
  }
}


// =========================
// ELIMINAR
// =========================

const borrarProveedor = async (req, res) => {

  try {

    const filas =
      await eliminarProveedor(req.params.id)

    if (filas === 0) {

      return res.status(404).json({
        mensaje: 'Proveedor no encontrado.'
      })
    }

    res.status(200).json({
      mensaje:
        'Proveedor eliminado correctamente.'
    })

  } catch (error) {

    console.error(error)

    // Si el proveedor ya está relacionado
    // con algún insumo, MySQL puede impedir
    // su eliminación por la clave foránea.
    if (error.errno === 1451) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar el proveedor porque tiene insumos relacionados.'
      })
    }

    res.status(500).json({
      mensaje:
        'Error al eliminar el proveedor.'
    })
  }
}


export {
  obtenerProveedores,
  obtenerProveedor,
  registrarProveedor,
  editarProveedor,
  borrarProveedor
}