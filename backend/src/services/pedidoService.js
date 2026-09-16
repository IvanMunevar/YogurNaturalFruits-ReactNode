import pool from '../config/database.js'


// =========================
// LISTAR PEDIDOS
// =========================

const listarPedidos = async () => {

  const [filas] = await pool.query(`
    SELECT
      p.id_pedido AS idPedido,

      p.id_cliente AS idCliente,
      c.nombre_cliente AS nombreCliente,

      p.id_usuario AS idUsuario,
      u.nombre_usuario AS nombreUsuario,

      DATE_FORMAT(
        p.fecha_pedido,
        '%Y-%m-%d %H:%i:%s'
      ) AS fechaPedido,

      p.estado_pedido AS estadoPedido,
      p.total

    FROM pedidos p

    INNER JOIN clientes c
      ON p.id_cliente = c.id_cliente

    INNER JOIN usuario u
      ON p.id_usuario = u.id_usuario

    ORDER BY
      p.fecha_pedido DESC,
      p.id_pedido DESC
  `)

  return filas
}


// =========================
// BUSCAR PEDIDO
// =========================

const buscarPedidoPorId = async (
  idPedido
) => {

  const [pedidos] = await pool.query(
    `
      SELECT
        p.id_pedido AS idPedido,

        p.id_cliente AS idCliente,
        c.nombre_cliente AS nombreCliente,

        p.id_usuario AS idUsuario,
        u.nombre_usuario AS nombreUsuario,

        DATE_FORMAT(
          p.fecha_pedido,
          '%Y-%m-%d %H:%i:%s'
        ) AS fechaPedido,

        p.estado_pedido AS estadoPedido,
        p.total

      FROM pedidos p

      INNER JOIN clientes c
        ON p.id_cliente = c.id_cliente

      INNER JOIN usuario u
        ON p.id_usuario = u.id_usuario

      WHERE p.id_pedido = ?
    `,
    [idPedido]
  )


  if (pedidos.length === 0) {
    return null
  }


  const [detalles] = await pool.query(
    `
      SELECT
        dp.id_detalle_pedido AS idDetallePedido,

        dp.id_producto AS idProducto,

        pr.nombre_producto AS nombreProducto,

        dp.cantidad,

        dp.precio_unitario AS precioUnitario,

        dp.subtotal

      FROM detalle_pedido dp

      INNER JOIN productos pr
        ON dp.id_producto = pr.id_producto

      WHERE dp.id_pedido = ?

      ORDER BY
        dp.id_detalle_pedido ASC
    `,
    [idPedido]
  )


  return {
    ...pedidos[0],
    productos: detalles
  }
}


// =========================
// CREAR PEDIDO
// =========================

const crearPedido = async (
  pedido
) => {

  const {
    idCliente,
    idUsuario,
    estadoPedido,
    productos
  } = pedido


  const conexion =
    await pool.getConnection()


  try {

    await conexion.beginTransaction()


    // =========================
    // VERIFICAR CLIENTE
    // =========================

    const [clientes] =
      await conexion.execute(
        `
          SELECT id_cliente
          FROM clientes
          WHERE id_cliente = ?
        `,
        [idCliente]
      )


    if (clientes.length === 0) {

      const error =
        new Error(
          'El cliente seleccionado no existe.'
        )

      error.statusCode = 404

      throw error
    }


    // =========================
    // VERIFICAR USUARIO
    // =========================

    const [usuarios] =
      await conexion.execute(
        `
          SELECT id_usuario
          FROM usuario
          WHERE id_usuario = ?
        `,
        [idUsuario]
      )


    if (usuarios.length === 0) {

      const error =
        new Error(
          'El usuario responsable no existe.'
        )

      error.statusCode = 404

      throw error
    }


    // =========================
    // CREAR ENCABEZADO
    // =========================

    const [resultadoPedido] =
      await conexion.execute(
        `
          INSERT INTO pedidos
          (
            id_cliente,
            id_usuario,
            fecha_pedido,
            estado_pedido,
            total
          )
          VALUES (?, ?, NOW(), ?, 0)
        `,
        [
          idCliente,
          idUsuario,
          estadoPedido
        ]
      )


    const idPedido =
      resultadoPedido.insertId


    let totalPedido = 0


    // =========================
    // CREAR DETALLE
    // =========================

    for (const item of productos) {

      const [productosBD] =
        await conexion.execute(
          `
            SELECT
              id_producto,
              nombre_producto,
              precio

            FROM productos

            WHERE id_producto = ?
          `,
          [item.idProducto]
        )


      if (productosBD.length === 0) {

        const error =
          new Error(
            `El producto con ID ${item.idProducto} no existe.`
          )

        error.statusCode = 404

        throw error
      }


      const producto =
        productosBD[0]


      const precioUnitario =
        Number(producto.precio)


      const cantidad =
        Number(item.cantidad)


      const subtotal =
        precioUnitario * cantidad


      totalPedido += subtotal


      await conexion.execute(
        `
          INSERT INTO detalle_pedido
          (
            id_pedido,
            id_producto,
            cantidad,
            precio_unitario,
            subtotal
          )
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          idPedido,
          item.idProducto,
          cantidad,
          precioUnitario,
          subtotal
        ]
      )
    }


    // =========================
    // ACTUALIZAR TOTAL
    // =========================

    await conexion.execute(
      `
        UPDATE pedidos
        SET total = ?
        WHERE id_pedido = ?
      `,
      [
        totalPedido,
        idPedido
      ]
    )


    await conexion.commit()


    return {
      idPedido,
      total:
        totalPedido
    }


  } catch (error) {

    await conexion.rollback()

    throw error

  } finally {

    conexion.release()
  }
}


// =========================
// CAMBIAR ESTADO
// =========================

const actualizarEstadoPedido = async (
  idPedido,
  estadoPedido
) => {

  const [resultado] =
    await pool.execute(
      `
        UPDATE pedidos

        SET estado_pedido = ?

        WHERE id_pedido = ?
      `,
      [
        estadoPedido,
        idPedido
      ]
    )


  return resultado.affectedRows
}


export {
  listarPedidos,
  buscarPedidoPorId,
  crearPedido,
  actualizarEstadoPedido
}