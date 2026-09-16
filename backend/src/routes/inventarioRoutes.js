import express from 'express'

import {
  obtenerMovimientos,
  obtenerMovimiento,
  crearMovimiento
} from '../controllers/inventarioController.js'


const router = express.Router()


router.get(
  '/',
  obtenerMovimientos
)


router.get(
  '/:id',
  obtenerMovimiento
)


router.post(
  '/',
  crearMovimiento
)


export default router