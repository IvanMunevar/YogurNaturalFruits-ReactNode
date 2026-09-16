import express from 'express'

import {
  obtenerAlertas,
  sincronizarAlertas,
  cambiarEstadoAlerta
} from '../controllers/alertaController.js'


const router =
  express.Router()


// Consultar
router.get(
  '/',
  obtenerAlertas
)


// Analizar productos e insumos
router.post(
  '/generar',
  sincronizarAlertas
)


// Cambiar estado
router.patch(
  '/:id/estado',
  cambiarEstadoAlerta
)


export default router