import express from 'express'

import {
  obtenerInsumos,
  obtenerInsumo,
  registrarInsumo,
  editarInsumo,
  borrarInsumo
} from '../controllers/insumoController.js'


const router = express.Router()


router.get(
  '/',
  obtenerInsumos
)

router.get(
  '/:id',
  obtenerInsumo
)

router.post(
  '/',
  registrarInsumo
)

router.put(
  '/:id',
  editarInsumo
)

router.delete(
  '/:id',
  borrarInsumo
)


export default router