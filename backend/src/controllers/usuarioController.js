import bcrypt from 'bcryptjs'

import {
  listarUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorCorreo,
  crearUsuario,
  actualizarUsuario,
  actualizarUsuarioConContrasena,
  eliminarUsuario
} from '../services/usuarioService.js'


// =========================
// OBTENER TODOS
// =========================

const obtenerUsuarios = async (req, res) => {

  try {

    const usuarios =
      await listarUsuarios()

    res.status(200).json(usuarios)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar los usuarios.'
    })
  }
}


// =========================
// OBTENER POR ID
// =========================

const obtenerUsuario = async (req, res) => {

  try {

    const usuario =
      await buscarUsuarioPorId(
        req.params.id
      )


    if (!usuario) {

      return res.status(404).json({
        mensaje:
          'Usuario no encontrado.'
      })
    }


    res.status(200).json(usuario)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al consultar el usuario.'
    })
  }
}


// =========================
// REGISTRAR
// =========================

const registrarUsuario = async (req, res) => {

  try {

    const {
      nombreUsuario,
      correo,
      contrasena
    } = req.body


    if (
      !nombreUsuario ||
      !correo ||
      !contrasena
    ) {

      return res.status(400).json({
        mensaje:
          'Nombre, correo y contraseña son obligatorios.'
      })
    }


    const usuarioExistente =
      await buscarUsuarioPorCorreo(correo)


    if (usuarioExistente) {

      return res.status(409).json({
        mensaje:
          'Ya existe un usuario con este correo.'
      })
    }


    const contrasenaHash =
      await bcrypt.hash(
        contrasena,
        10
      )


    const nuevoUsuario =
      await crearUsuario({

        nombreUsuario,
        correo,

        contrasena:
          contrasenaHash
      })


    res.status(201).json({

      mensaje:
        'Usuario registrado correctamente.',

      usuario:
        nuevoUsuario

    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al registrar el usuario.'
    })
  }
}


// =========================
// EDITAR
// =========================

const editarUsuario = async (req, res) => {

  try {

    const {
      nombreUsuario,
      correo,
      contrasena
    } = req.body


    if (
      !nombreUsuario ||
      !correo
    ) {

      return res.status(400).json({
        mensaje:
          'Nombre y correo son obligatorios.'
      })
    }


    let filas


    if (
      contrasena &&
      contrasena.trim() !== ''
    ) {

      const contrasenaHash =
        await bcrypt.hash(
          contrasena,
          10
        )


      filas =
        await actualizarUsuarioConContrasena(
          req.params.id,
          {
            nombreUsuario,
            correo,
            contrasena:
              contrasenaHash
          }
        )

    } else {

      filas =
        await actualizarUsuario(
          req.params.id,
          {
            nombreUsuario,
            correo
          }
        )
    }


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Usuario no encontrado.'
      })
    }


    res.status(200).json({
      mensaje:
        'Usuario actualizado correctamente.'
    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al actualizar el usuario.'
    })
  }
}


// =========================
// ELIMINAR
// =========================

const borrarUsuario = async (req, res) => {

  try {

    const filas =
      await eliminarUsuario(
        req.params.id
      )


    if (filas === 0) {

      return res.status(404).json({
        mensaje:
          'Usuario no encontrado.'
      })
    }


    res.status(200).json({
      mensaje:
        'Usuario eliminado correctamente.'
    })


  } catch (error) {

    console.error(error)


    if (error.errno === 1451) {

      return res.status(409).json({
        mensaje:
          'No se puede eliminar este usuario porque tiene registros relacionados.'
      })
    }


    res.status(500).json({
      mensaje:
        'Error al eliminar el usuario.'
    })
  }
}

// =========================
// INICIAR SESIÓN
// =========================

const iniciarSesion = async (req, res) => {

  try {

    const {
      correo,
      contrasena
    } = req.body


    // Validar campos
    if (!correo || !contrasena) {

      return res.status(400).json({
        mensaje:
          'Correo y contraseña son obligatorios.'
      })
    }


    // Buscar usuario por correo
    const usuario =
      await buscarUsuarioPorCorreo(correo)


    if (!usuario) {

      return res.status(401).json({
        mensaje:
          'Correo o contraseña incorrectos.'
      })
    }


    // Comparar contraseña ingresada
    // con el hash almacenado en MySQL
    const contrasenaCorrecta =
      await bcrypt.compare(
        contrasena,
        usuario.contraseña
      )


    if (!contrasenaCorrecta) {

      return res.status(401).json({
        mensaje:
          'Correo o contraseña incorrectos.'
      })
    }


    // Nunca devolver la contraseña
    res.status(200).json({

      mensaje:
        'Inicio de sesión correcto.',

      usuario: {

        idUsuario:
          usuario.idUsuario,

        nombreUsuario:
          usuario.nombreUsuario,

        correo:
          usuario.correo

      }

    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      mensaje:
        'Error al iniciar sesión.'
    })
  }
}

export {
  obtenerUsuarios,
  obtenerUsuario,
  registrarUsuario,
  editarUsuario,
  borrarUsuario, 
  iniciarSesion
}