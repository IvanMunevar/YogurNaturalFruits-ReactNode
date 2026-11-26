import express from 'express'
import cors from 'cors'

import productoRoutes from './routes/productoRoutes.js'
import proveedorRoutes from './routes/proveedorRoutes.js'
import insumoRoutes from './routes/insumoRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import inventarioRoutes from './routes/inventarioRoutes.js'
import clienteRoutes from './routes/clienteRoutes.js'
import pedidoRoutes from './routes/pedidoRoutes.js'
import ventaRoutes from './routes/ventaRoutes.js'
import alertaRoutes from './routes/alertaRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import reporteRoutes from './routes/reporteRoutes.js'

const app = express()


app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173'
  ]
}))

app.use(express.json())


app.get('/', (req, res) => {

  res.json({
    mensaje: 'API Yogur Natural Fruits funcionando.'
  })

})


app.use(
  '/api/productos',
  productoRoutes
)

app.use(
  '/api/proveedores',
  proveedorRoutes
)

app.use(
  '/api/insumos',
  insumoRoutes
)

app.use(
  '/api/usuarios',
  usuarioRoutes
)

app.use(
  '/api/inventario',
  inventarioRoutes
)

app.use(
  '/api/clientes',
  clienteRoutes
)

app.use(
  '/api/pedidos',
  pedidoRoutes
)

app.use(
  '/api/ventas',
  ventaRoutes
)

app.use(
  '/api/alertas',
  alertaRoutes
)

app.use(
  '/api/dashboard',
  dashboardRoutes
)

app.use(
  '/api/reportes',
  reporteRoutes
)

/**
 * Manejo global de errores.
 *
 * Evita exponer trazas, rutas internas o información técnica
 * en las respuestas enviadas al cliente.
 */
app.use((error, req, res, next) => {

  if (res.headersSent) {
    return next(error)
  }

  /**
   * Controlar JSON mal formado enviado por el cliente.
   */
  if (
    error instanceof SyntaxError &&
    error.status === 400
  ) {
    return res.status(400).json({
      mensaje:
        'El cuerpo de la solicitud contiene un JSON inválido.'
    })
  }

  /**
   * Registrar el detalle solamente en el servidor.
   */
  console.error(
    `Error en ${req.method} ${req.originalUrl}:`,
    error.message
  )

  /**
   * Entregar una respuesta genérica al cliente.
   */
  return res.status(500).json({
    mensaje:
      'Ocurrió un error interno en el servidor.'
  })
})

export default app