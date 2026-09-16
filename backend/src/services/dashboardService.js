import pool from '../config/database.js'


// =========================
// OBTENER RESUMEN DASHBOARD
// =========================

const obtenerResumenDashboard = async () => {

  // Productos
  const [productos] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM productos
    `)


  // Insumos
  const [insumos] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM insumos
    `)


  // Usuarios
  const [usuarios] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM usuario
    `)


  // Clientes
  const [clientes] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM clientes
    `)


  // Pedidos pendientes
  const [pedidosPendientes] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM pedidos
      WHERE estado_pedido = 'Pendiente'
    `)


  // Pedidos confirmados
  const [pedidosConfirmados] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM pedidos
      WHERE estado_pedido = 'Confirmado'
    `)


  // Ventas
  const [ventas] =
    await pool.query(`
      SELECT
        COUNT(*) AS cantidadVentas,
        COALESCE(
          SUM(total),
          0
        ) AS totalVentas

      FROM ventas
    `)


  // Alertas activas
  const [alertas] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM alertas
      WHERE estado = 'Activa'
    `)


  // Stock mínimo productos
  const [productosStockBajo] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM productos
      WHERE stock <= stock_minimo
    `)


  // Stock mínimo insumos
  const [insumosStockBajo] =
    await pool.query(`
      SELECT COUNT(*) AS total
      FROM insumos
      WHERE cantidad <= cantidad_minima
    `)


  return {

    productos:
      Number(productos[0].total),

    insumos:
      Number(insumos[0].total),

    usuarios:
      Number(usuarios[0].total),

    clientes:
      Number(clientes[0].total),

    pedidosPendientes:
      Number(
        pedidosPendientes[0].total
      ),

    pedidosConfirmados:
      Number(
        pedidosConfirmados[0].total
      ),

    ventasRegistradas:
      Number(
        ventas[0].cantidadVentas
      ),

    totalVentas:
      Number(
        ventas[0].totalVentas
      ),

    alertasActivas:
      Number(alertas[0].total),

    productosStockBajo:
      Number(
        productosStockBajo[0].total
      ),

    insumosStockBajo:
      Number(
        insumosStockBajo[0].total
      )
  }
}


export {
  obtenerResumenDashboard
}