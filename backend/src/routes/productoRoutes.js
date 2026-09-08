import express from 'express'

import {
  obtenerProductos,
  obtenerProducto,
  registrarProducto,
  editarProducto,
  borrarProducto
} from '../controllers/productoController.js'


const router = express.Router()


router.get(
  '/',
  obtenerProductos
)

router.get(
  '/:id',
  obtenerProducto
)

router.post(
  '/',
  registrarProducto
)

router.put(
  '/:id',
  editarProducto
)

router.delete(
  '/:id',
  borrarProducto
)


export default router