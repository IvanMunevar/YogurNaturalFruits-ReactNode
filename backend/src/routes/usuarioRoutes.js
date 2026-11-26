import express from 'express'

import {
  obtenerUsuarios,
  obtenerUsuario,
  registrarUsuario,
  editarUsuario,
  borrarUsuario,
  iniciarSesion

} from '../controllers/usuarioController.js'

import {
  autenticarToken,
  autorizarRoles
} from '../middlewares/authMiddleware.js'

const router = express.Router()


// Ruta pública
router.post(
  '/login',
  iniciarSesion
)


// Desde aquí se exige token
// y rol de administrador
router.use(
  autenticarToken,
  autorizarRoles('ADMINISTRADOR')
)


router.get(
  '/',
  obtenerUsuarios
)

router.get(
  '/:id',
  obtenerUsuario
)

router.post(
  '/',
  registrarUsuario
)

router.put(
  '/:id',
  editarUsuario
)

router.delete(
  '/:id',
  borrarUsuario
)

export default router