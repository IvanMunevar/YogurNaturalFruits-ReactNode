import pool from '../config/database.js'


// =========================
// LISTAR VENTAS
// =========================

const listarVentas = async () => {

  const [filas] = await pool.query(`
    SELECT
      v.id_venta AS idVenta,
      v.id_pedido AS idPedido,

      DATE_FORMAT(
        v.fecha_venta,
        '%Y-%m-%d %H:%i:%s'
      ) AS fechaVenta,

      v.total,
      v.metodo_pago AS metodoPago,

      p.id_cliente AS idCliente,
      c.nombre_cliente AS nombreCliente,

      p.id_usuario AS idUsuario,
      u.nombre_usuario AS nombreUsuario

    FROM ventas v

    INNER JOIN pedidos p
      ON v.id_pedido = p.id_pedido

    INNER JOIN clientes c
      ON p.id_cliente = c.id_cliente

    INNER JOIN usuario u
      ON p.id_usuario = u.id_usuario

    ORDER BY
      v.fecha_venta DESC,
      v.id_venta DESC
  `)

  return filas
}


// =========================
// BUSCAR VENTA POR ID
// =========================

const buscarVentaPorId = async (
  idVenta
) => {

  const [ventas] = await pool.query(
    `
      SELECT
        v.id_venta AS idVenta,
        v.id_pedido AS idPedido,

        DATE_FORMAT(
          v.fecha_venta,
          '%Y-%m-%d %H:%i:%s'
        ) AS fechaVenta,

        v.total,
        v.metodo_pago AS metodoPago,

        p.id_cliente AS idCliente,
        c.nombre_cliente AS nombreCliente,

        p.id_usuario AS idUsuario,
        u.nombre_usuario AS nombreUsuario

      FROM ventas v

      INNER JOIN pedidos p
        ON v.id_pedido = p.id_pedido

      INNER JOIN clientes c
        ON p.id_cliente = c.id_cliente

      INNER JOIN usuario u
        ON p.id_usuario = u.id_usuario

      WHERE v.id_venta = ?
    `,
    [idVenta]
  )


  if (ventas.length === 0) {
    return null
  }


  const [detalles] = await pool.query(
    `
      SELECT
        dv.id_detalle AS idDetalle,
        dv.id_producto AS idProducto,
        pr.nombre_producto AS nombreProducto,
        dv.cantidad,
        dv.precio_unitario AS precioUnitario,

        (
          dv.cantidad *
          dv.precio_unitario
        ) AS subtotal

      FROM detalle_venta dv

      INNER JOIN productos pr
        ON dv.id_producto = pr.id_producto

      WHERE dv.id_venta = ?

      ORDER BY dv.id_detalle ASC
    `,
    [idVenta]
  )


  return {
    ...ventas[0],
    productos: detalles
  }
}


// =========================
// REGISTRAR VENTA
// =========================

const crearVenta = async (
  idPedido,
  metodoPago
) => {

  const conexion =
    await pool.getConnection()


  try {

    await conexion.beginTransaction()


    // =========================
    // CONSULTAR Y BLOQUEAR PEDIDO
    // =========================

    const [pedidos] =
      await conexion.execute(
        `
          SELECT
            id_pedido,
            id_cliente,
            id_usuario,
            estado_pedido,
            total

          FROM pedidos

          WHERE id_pedido = ?

          FOR UPDATE
        `,
        [idPedido]
      )


    if (pedidos.length === 0) {

      const error =
        new Error(
          'El pedido seleccionado no existe.'
        )

      error.statusCode = 404

      throw error
    }


    const pedido =
      pedidos[0]


    // Solo pedidos confirmados
    if (
      pedido.estado_pedido !==
      'Confirmado'
    ) {

      const error =
        new Error(
          'Solo los pedidos confirmados pueden convertirse en venta.'
        )

      error.statusCode = 400

      throw error
    }


    // =========================
    // EVITAR VENTA DUPLICADA
    // =========================

    const [ventasExistentes] =
      await conexion.execute(
        `
          SELECT id_venta
          FROM ventas
          WHERE id_pedido = ?
          FOR UPDATE
        `,
        [idPedido]
      )


    if (
      ventasExistentes.length > 0
    ) {

      const error =
        new Error(
          'Este pedido ya tiene una venta registrada.'
        )

      error.statusCode = 409

      throw error
    }


    // =========================
    // CONSULTAR DETALLE PEDIDO
    // =========================

    const [detallesPedido] =
      await conexion.execute(
        `
          SELECT
            dp.id_producto,
            dp.cantidad,
            dp.precio_unitario

          FROM detalle_pedido dp

          WHERE dp.id_pedido = ?
        `,
        [idPedido]
      )


    if (
      detallesPedido.length === 0
    ) {

      const error =
        new Error(
          'El pedido no contiene productos.'
        )

      error.statusCode = 400

      throw error
    }


    // =========================
    // VALIDAR STOCK
    // =========================

    for (
      const detalle of detallesPedido
    ) {

      const [productos] =
        await conexion.execute(
          `
            SELECT
              nombre_producto,
              stock

            FROM productos

            WHERE id_producto = ?

            FOR UPDATE
          `,
          [detalle.id_producto]
        )


      if (
        productos.length === 0
      ) {

        const error =
          new Error(
            `El producto con ID ${detalle.id_producto} no existe.`
          )

        error.statusCode = 404

        throw error
      }


      const producto =
        productos[0]


      if (
        Number(producto.stock) <
        Number(detalle.cantidad)
      ) {

        const error =
          new Error(
            `Stock insuficiente para ${producto.nombre_producto}.`
          )

        error.statusCode = 400

        throw error
      }
    }


    // =========================
    // CREAR VENTA
    // =========================

    const [resultadoVenta] =
      await conexion.execute(
        `
          INSERT INTO ventas
          (
            id_pedido,
            fecha_venta,
            total,
            metodo_pago
          )
          VALUES (?, NOW(), ?, ?)
        `,
        [
          idPedido,
          pedido.total,
          metodoPago
        ]
      )


    const idVenta =
      resultadoVenta.insertId


    // =========================
    // DETALLES + STOCK +
    // MOVIMIENTOS INVENTARIO
    // =========================

    for (
      const detalle of detallesPedido
    ) {

      // Copiar a detalle_venta
      await conexion.execute(
        `
          INSERT INTO detalle_venta
          (
            id_venta,
            id_producto,
            cantidad,
            precio_unitario
          )
          VALUES (?, ?, ?, ?)
        `,
        [
          idVenta,
          detalle.id_producto,
          detalle.cantidad,
          detalle.precio_unitario
        ]
      )


      // Descontar stock
      await conexion.execute(
        `
          UPDATE productos

          SET stock =
            stock - ?

          WHERE id_producto = ?
        `,
        [
          detalle.cantidad,
          detalle.id_producto
        ]
      )


      // Registrar salida
      // en inventario
      await conexion.execute(
        `
          INSERT INTO inventario
          (
            tipo_movimiento,
            fecha_movimiento,
            cantidad,
            id_insumo,
            id_producto,
            id_usuario
          )
          VALUES
          (
            'Salida',
            NOW(),
            ?,
            NULL,
            ?,
            ?
          )
        `,
        [
          detalle.cantidad,
          detalle.id_producto,
          pedido.id_usuario
        ]
      )
    }


    // =========================
    // FINALIZAR PEDIDO
    // =========================

    await conexion.execute(
      `
        UPDATE pedidos

        SET estado_pedido =
          'Entregado'

        WHERE id_pedido = ?
      `,
      [idPedido]
    )


    await conexion.commit()


    return {
      idVenta,
      idPedido,
      total:
        Number(pedido.total),
      metodoPago
    }


  } catch (error) {

    await conexion.rollback()

    throw error

  } finally {

    conexion.release()
  }
}


export {
  listarVentas,
  buscarVentaPorId,
  crearVenta
}