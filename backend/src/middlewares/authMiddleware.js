import jwt from 'jsonwebtoken'


const autenticarToken = (req, res, next) => {

  const encabezado =
    req.headers.authorization


  if (
    !encabezado ||
    !encabezado.startsWith('Bearer ')
  ) {

    return res.status(401).json({
      mensaje:
        'Token de autenticación requerido.'
    })
  }


  const token =
    encabezado.slice(7).trim()


  try {

    const usuarioAutenticado =
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        {
          algorithms: ['HS256']
        }
      )


    req.usuario =
      usuarioAutenticado

    next()

  } catch (error) {

    if (error.name === 'TokenExpiredError') {

      return res.status(401).json({
        mensaje:
          'El token de autenticación ha expirado.'
      })
    }


    return res.status(401).json({
      mensaje:
        'Token de autenticación inválido.'
    })
  }
}


const autorizarRoles =
  (...rolesPermitidos) =>
    (req, res, next) => {

      if (
        !req.usuario ||
        !rolesPermitidos.includes(
          req.usuario.rol
        )
      ) {

        return res.status(403).json({
          mensaje:
            'No tiene permisos para realizar esta acción.'
        })
      }


      next()
    }


export {
  autenticarToken,
  autorizarRoles
}