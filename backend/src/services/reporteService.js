import pool from '../config/database.js'


// ========================================
// VALIDAR USUARIO
// ========================================

const validarUsuario = async (
  idUsuario
) => {

  const [usuarios] =
    await pool.execute(
      `
        SELECT id_usuario
        FROM usuario
        WHERE id_usuario = ?
      `,
      [idUsuario]
    )


  return usuarios.length > 0
}


// ========================================
// REGISTRAR REPORTE EN HISTORIAL
// ========================================

const registrarReporte = async (
  tipoReporte,
  descripcion,
  idUsuario
) => {

  const [resultado] =
    await pool.execute(
      `
        INSERT INTO reportes
        (
          tipo_reporte,
          descripcion,
          fecha_generacion,
          id_usuario
        )
        VALUES (?, ?, NOW(), ?)
      `,
      [
        tipoReporte,
        descripcion,
        idUsuario
      ]
    )


  return resultado.insertId
}


// ========================================
// FILTRO DE FECHAS
// ========================================

const construirFiltroFechas = (
  campoFecha,
  fechaInicio,
  fechaFin
) => {

  let condicion = ''
  const parametros = []


  if (fechaInicio) {

    condicion += `
      AND DATE(${campoFecha}) >= ?
    `

    parametros.push(
      fechaInicio
    )
  }


  if (fechaFin) {

    condicion += `
      AND DATE(${campoFecha}) <= ?
    `

    parametros.push(
      fechaFin
    )
  }


  return {
    condicion,
    parametros
  }
}


// ========================================
// REPORTE DE VENTAS
// ========================================

const generarReporteVentas = async (
  fechaInicio,
  fechaFin
) => {

  const filtro =
    construirFiltroFechas(
      'v.fecha_venta',
      fechaInicio,
      fechaFin
    )


  const [ventas] =
    await pool.execute(
      `
        SELECT
          v.id_venta AS idVenta,

          DATE_FORMAT(
            v.fecha_venta,
            '%Y-%m-%d %H:%i:%s'
          ) AS fechaVenta,

          v.id_pedido AS idPedido,
          c.nombre_cliente AS nombreCliente,
          u.nombre_usuario AS nombreUsuario,
          v.metodo_pago AS metodoPago,
          v.total

        FROM ventas v

        INNER JOIN pedidos p
          ON v.id_pedido = p.id_pedido

        INNER JOIN clientes c
          ON p.id_cliente = c.id_cliente

        INNER JOIN usuario u
          ON p.id_usuario = u.id_usuario

        WHERE 1 = 1

        ${filtro.condicion}

        ORDER BY
          v.fecha_venta DESC
      `,
      filtro.parametros
    )


  const totalVentas =
    ventas.reduce(
      (total, venta) =>
        total +
        Number(venta.total),
      0
    )


  return {

    resumen: {
      cantidadVentas:
        ventas.length,

      totalVentas
    },

    datos: ventas
  }
}


// ========================================
// REPORTE DE PEDIDOS
// ========================================

const generarReportePedidos = async (
  fechaInicio,
  fechaFin
) => {

  const filtro =
    construirFiltroFechas(
      'p.fecha_pedido',
      fechaInicio,
      fechaFin
    )


  const [pedidos] =
    await pool.execute(
      `
        SELECT
          p.id_pedido AS idPedido,

          DATE_FORMAT(
            p.fecha_pedido,
            '%Y-%m-%d %H:%i:%s'
          ) AS fechaPedido,

          c.nombre_cliente AS nombreCliente,
          u.nombre_usuario AS nombreUsuario,

          p.estado_pedido AS estadoPedido,
          p.total

        FROM pedidos p

        INNER JOIN clientes c
          ON p.id_cliente = c.id_cliente

        INNER JOIN usuario u
          ON p.id_usuario = u.id_usuario

        WHERE 1 = 1

        ${filtro.condicion}

        ORDER BY
          p.fecha_pedido DESC
      `,
      filtro.parametros
    )


  const resumen = {

    total:
      pedidos.length,

    pendientes:
      pedidos.filter(
        (pedido) =>
          pedido.estadoPedido ===
          'Pendiente'
      ).length,

    confirmados:
      pedidos.filter(
        (pedido) =>
          pedido.estadoPedido ===
          'Confirmado'
      ).length,

    entregados:
      pedidos.filter(
        (pedido) =>
          pedido.estadoPedido ===
          'Entregado'
      ).length,

    cancelados:
      pedidos.filter(
        (pedido) =>
          pedido.estadoPedido ===
          'Cancelado'
      ).length
  }


  return {
    resumen,
    datos: pedidos
  }
}


// ========================================
// REPORTE DE INVENTARIO
// ========================================

const generarReporteInventario =
  async () => {

    const [productos] =
      await pool.query(
        `
          SELECT
            id_producto AS idProducto,
            nombre_producto AS nombre,
            stock AS cantidad,
            stock_minimo AS minimo,
            fecha_vencimiento AS fechaVencimiento,

            CASE
              WHEN stock <= stock_minimo
                THEN 'Stock mínimo'
              ELSE 'Normal'
            END AS estado

          FROM productos

          ORDER BY
            nombre_producto
        `
      )


    const [insumos] =
      await pool.query(
        `
          SELECT
            i.id_insumo AS idInsumo,
            i.nombre_insumo AS nombre,
            i.cantidad,
            i.cantidad_minima AS minimo,
            i.unidad_medida AS unidadMedida,
            i.fecha_vencimiento AS fechaVencimiento,
            p.nombre_proveedor AS nombreProveedor,

            CASE
              WHEN
                i.cantidad <=
                i.cantidad_minima
              THEN 'Stock mínimo'
              ELSE 'Normal'
            END AS estado

          FROM insumos i

          INNER JOIN proveedor p
            ON i.id_proveedor =
               p.id_proveedor

          ORDER BY
            i.nombre_insumo
        `
      )


    const productosStockBajo =
      productos.filter(
        (producto) =>
          producto.estado ===
          'Stock mínimo'
      ).length


    const insumosStockBajo =
      insumos.filter(
        (insumo) =>
          insumo.estado ===
          'Stock mínimo'
      ).length


    return {

      resumen: {

        totalProductos:
          productos.length,

        totalInsumos:
          insumos.length,

        productosStockBajo,

        insumosStockBajo
      },

      productos,

      insumos
    }
  }


// ========================================
// REPORTE DE ALERTAS
// ========================================

const generarReporteAlertas = async (
  fechaInicio,
  fechaFin
) => {

  const filtro =
    construirFiltroFechas(
      'a.fecha_generacion',
      fechaInicio,
      fechaFin
    )


  const [alertas] =
    await pool.execute(
      `
        SELECT
          a.id_alerta AS idAlerta,
          a.tipo_alerta AS tipoAlerta,
          a.descripcion,

          DATE_FORMAT(
            a.fecha_generacion,
            '%Y-%m-%d %H:%i:%s'
          ) AS fechaGeneracion,

          a.estado,

          CASE
            WHEN a.id_producto IS NOT NULL
              THEN 'Producto'

            WHEN a.id_insumo IS NOT NULL
              THEN 'Insumo'

            ELSE 'General'
          END AS tipoElemento,

          COALESCE(
            p.nombre_producto,
            i.nombre_insumo,
            'Sin elemento'
          ) AS nombreElemento

        FROM alertas a

        LEFT JOIN productos p
          ON a.id_producto =
             p.id_producto

        LEFT JOIN insumos i
          ON a.id_insumo =
             i.id_insumo

        WHERE 1 = 1

        ${filtro.condicion}

        ORDER BY
          a.fecha_generacion DESC
      `,
      filtro.parametros
    )


  const resumen = {

    total:
      alertas.length,

    activas:
      alertas.filter(
        (alerta) =>
          alerta.estado ===
          'Activa'
      ).length,

    atendidas:
      alertas.filter(
        (alerta) =>
          alerta.estado ===
          'Atendida'
      ).length,

    resueltas:
      alertas.filter(
        (alerta) =>
          alerta.estado ===
          'Resuelta'
      ).length,

    stockMinimo:
      alertas.filter(
        (alerta) =>
          alerta.tipoAlerta ===
          'Stock mínimo'
      ).length,

    proximosVencer:
      alertas.filter(
        (alerta) =>
          alerta.tipoAlerta ===
          'Próximo a vencer'
      ).length,

    vencidos:
      alertas.filter(
        (alerta) =>
          alerta.tipoAlerta ===
          'Vencido'
      ).length
  }


  return {
    resumen,
    datos: alertas
  }
}


// ========================================
// GENERAR REPORTE
// ========================================

const generarReporte = async ({
  tipoReporte,
  fechaInicio,
  fechaFin,
  idUsuario
}) => {

  const usuarioExiste =
    await validarUsuario(
      idUsuario
    )


  if (!usuarioExiste) {

    const error =
      new Error(
        'El usuario indicado no existe.'
      )

    error.status = 404

    throw error
  }


  let resultado
  let descripcion


  switch (tipoReporte) {

    case 'Ventas':

      resultado =
        await generarReporteVentas(
          fechaInicio,
          fechaFin
        )

      descripcion =
        'Reporte de ventas generado.'

      break


    case 'Inventario':

      resultado =
        await generarReporteInventario()

      descripcion =
        'Reporte general de inventario generado.'

      break


    case 'Pedidos':

      resultado =
        await generarReportePedidos(
          fechaInicio,
          fechaFin
        )

      descripcion =
        'Reporte de pedidos generado.'

      break


    case 'Alertas':

      resultado =
        await generarReporteAlertas(
          fechaInicio,
          fechaFin
        )

      descripcion =
        'Reporte de alertas generado.'

      break


    default: {

      const error =
        new Error(
          'Tipo de reporte no válido.'
        )

      error.status = 400

      throw error
    }
  }


  const idReporte =
    await registrarReporte(
      tipoReporte,
      descripcion,
      idUsuario
    )


  return {

    idReporte,
    tipoReporte,
    fechaInicio:
      fechaInicio || null,

    fechaFin:
      fechaFin || null,

    ...resultado
  }
}


// ========================================
// HISTORIAL DE REPORTES
// ========================================

const listarReportes = async () => {

  const [reportes] =
    await pool.query(
      `
        SELECT
          r.id_reporte AS idReporte,
          r.tipo_reporte AS tipoReporte,
          r.descripcion,

          DATE_FORMAT(
            r.fecha_generacion,
            '%Y-%m-%d %H:%i:%s'
          ) AS fechaGeneracion,

          r.id_usuario AS idUsuario,
          u.nombre_usuario AS nombreUsuario

        FROM reportes r

        INNER JOIN usuario u
          ON r.id_usuario =
             u.id_usuario

        ORDER BY
          r.fecha_generacion DESC
      `
    )


  return reportes
}


export {
  generarReporte,
  listarReportes
}   