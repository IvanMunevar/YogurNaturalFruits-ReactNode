import express from 'express'

import {
  obtenerDashboard
} from '../controllers/dashboardController.js'


const router =
  express.Router()


router.get(
  '/resumen',
  obtenerDashboard
)


export default router