import express from 'express'

import {
  crearReporte,
  obtenerReportes
} from '../controllers/reporteController.js'


const router =
  express.Router()


router.get(
  '/',
  obtenerReportes
)


router.post(
  '/generar',
  crearReporte
)


export default router