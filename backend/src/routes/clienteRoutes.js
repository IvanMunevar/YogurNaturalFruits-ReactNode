import express from 'express'

import {
  obtenerClientes,
  obtenerCliente,
  registrarCliente,
  editarCliente,
  borrarCliente
} from '../controllers/clienteController.js'


const router = express.Router()


router.get(
  '/',
  obtenerClientes
)


router.get(
  '/:id',
  obtenerCliente
)


router.post(
  '/',
  registrarCliente
)


router.put(
  '/:id',
  editarCliente
)


router.delete(
  '/:id',
  borrarCliente
)


export default router