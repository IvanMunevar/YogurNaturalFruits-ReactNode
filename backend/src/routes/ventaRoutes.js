import express from 'express'

import {
  obtenerVentas,
  obtenerVenta,
  registrarVenta
} from '../controllers/ventaController.js'


const router =
  express.Router()


router.get(
  '/',
  obtenerVentas
)


router.get(
  '/:id',
  obtenerVenta
)


router.post(
  '/',
  registrarVenta
)


export default router