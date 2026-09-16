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
  origin: 'http://localhost:5173'
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

export default app