import express from 'express'

import {
  obtenerProveedores,
  obtenerProveedor,
  registrarProveedor,
  editarProveedor,
  borrarProveedor
} from '../controllers/proveedorController.js'


const router = express.Router()


router.get(
  '/',
  obtenerProveedores
)

router.get(
  '/:id',
  obtenerProveedor
)

router.post(
  '/',
  registrarProveedor
)

router.put(
  '/:id',
  editarProveedor
)

router.delete(
  '/:id',
  borrarProveedor
)


export default router