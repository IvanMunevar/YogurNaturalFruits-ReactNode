import express from 'express'

import {
  obtenerPedidos,
  obtenerPedido,
  registrarPedido,
  cambiarEstadoPedido
} from '../controllers/pedidoController.js'


const router =
  express.Router()


// Listar
router.get(
  '/',
  obtenerPedidos
)


// Consultar detalle
router.get(
  '/:id',
  obtenerPedido
)


// Registrar pedido
router.post(
  '/',
  registrarPedido
)


// Cambiar estado
router.patch(
  '/:id/estado',
  cambiarEstadoPedido
)


export default router