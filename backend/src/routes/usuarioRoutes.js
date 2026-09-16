import express from 'express'

import {
  obtenerUsuarios,
  obtenerUsuario,
  registrarUsuario,
  editarUsuario,
  borrarUsuario,
  iniciarSesion

} from '../controllers/usuarioController.js'


const router = express.Router()


router.get(
  '/',
  obtenerUsuarios
)

router.post(
  '/login',
  iniciarSesion
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