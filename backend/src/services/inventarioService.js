import pool from '../config/database.js'


// =========================
// LISTAR MOVIMIENTOS
// =========================

const listarMovimientos = async () => {

  const [filas] = await pool.query(`
    SELECT
      inv.id_inventario AS idInventario,
      inv.tipo_movimiento AS tipoMovimiento,

      DATE_FORMAT(
        inv.fecha_movimiento,
        '%Y-%m-%d %H:%i:%s'
      ) AS fechaMovimiento,

      inv.cantidad,

      inv.id_insumo AS idInsumo,
      i.nombre_insumo AS nombreInsumo,

      inv.id_producto AS idProducto,
      p.nombre_producto AS nombreProducto,

      inv.id_usuario AS idUsuario,
      u.nombre_usuario AS nombreUsuario,

      CASE
        WHEN inv.id_producto IS NOT NULL
          THEN 'Producto'
        ELSE 'Insumo'
      END AS tipoElemento,

      COALESCE(
        p.nombre_producto,
        i.nombre_insumo
      ) AS nombreElemento

    FROM inventario inv

    LEFT JOIN productos p
      ON inv.id_producto = p.id_producto

    LEFT JOIN insumos i
      ON inv.id_insumo = i.id_insumo

    INNER JOIN usuario u
      ON inv.id_usuario = u.id_usuario

    ORDER BY inv.fecha_movimiento DESC,
             inv.id_inventario DESC
  `)

  return filas
}


// =========================
// BUSCAR MOVIMIENTO POR ID
// =========================

const buscarMovimientoPorId = async (
  idInventario
) => {

  const [filas] = await pool.query(
    `
      SELECT
        inv.id_inventario AS idInventario,
        inv.tipo_movimiento AS tipoMovimiento,

        DATE_FORMAT(
          inv.fecha_movimiento,
          '%Y-%m-%d %H:%i:%s'
        ) AS fechaMovimiento,

        inv.cantidad,

        inv.id_insumo AS idInsumo,
        i.nombre_insumo AS nombreInsumo,

        inv.id_producto AS idProducto,
        p.nombre_producto AS nombreProducto,

        inv.id_usuario AS idUsuario,
        u.nombre_usuario AS nombreUsuario,

        CASE
          WHEN inv.id_producto IS NOT NULL
            THEN 'Producto'
          ELSE 'Insumo'
        END AS tipoElemento,

        COALESCE(
          p.nombre_producto,
          i.nombre_insumo
        ) AS nombreElemento

      FROM inventario inv

      LEFT JOIN productos p
        ON inv.id_producto = p.id_producto

      LEFT JOIN insumos i
        ON inv.id_insumo = i.id_insumo

      INNER JOIN usuario u
        ON inv.id_usuario = u.id_usuario

      WHERE inv.id_inventario = ?
    `,
    [idInventario]
  )

  return filas[0]
}


// =========================
// REGISTRAR MOVIMIENTO
// =========================

const registrarMovimiento = async (
  movimiento
) => {

  const {
    tipoMovimiento,
    cantidad,
    idProducto,
    idInsumo,
    idUsuario
  } = movimiento


  const conexion =
    await pool.getConnection()


  try {

    await conexion.beginTransaction()


    // =========================
    // MOVIMIENTO DE PRODUCTO
    // =========================

    if (idProducto !== null) {

      const [productos] =
        await conexion.execute(
          `
            SELECT stock
            FROM productos
            WHERE id_producto = ?
            FOR UPDATE
          `,
          [idProducto]
        )


      if (productos.length === 0) {

        const error =
          new Error(
            'El producto seleccionado no existe.'
          )

        error.statusCode = 404

        throw error
      }


      const stockActual =
        Number(productos[0].stock)


      let nuevoStock


      if (tipoMovimiento === 'Entrada') {

        nuevoStock =
          stockActual + Number(cantidad)

      } else {

        nuevoStock =
          stockActual - Number(cantidad)


        if (nuevoStock < 0) {

          const error =
            new Error(
              'No existe stock suficiente del producto.'
            )

          error.statusCode = 400

          throw error
        }
      }


      await conexion.execute(
        `
          UPDATE productos
          SET stock = ?
          WHERE id_producto = ?
        `,
        [
          nuevoStock,
          idProducto
        ]
      )
    }


    // =========================
    // MOVIMIENTO DE INSUMO
    // =========================

    if (idInsumo !== null) {

      const [insumos] =
        await conexion.execute(
          `
            SELECT cantidad
            FROM insumos
            WHERE id_insumo = ?
            FOR UPDATE
          `,
          [idInsumo]
        )


      if (insumos.length === 0) {

        const error =
          new Error(
            'El insumo seleccionado no existe.'
          )

        error.statusCode = 404

        throw error
      }


      const cantidadActual =
        Number(insumos[0].cantidad)


      let nuevaCantidad


      if (tipoMovimiento === 'Entrada') {

        nuevaCantidad =
          cantidadActual + Number(cantidad)

      } else {

        nuevaCantidad =
          cantidadActual - Number(cantidad)


        if (nuevaCantidad < 0) {

          const error =
            new Error(
              'No existe cantidad suficiente del insumo.'
            )

          error.statusCode = 400

          throw error
        }
      }


      await conexion.execute(
        `
          UPDATE insumos
          SET cantidad = ?
          WHERE id_insumo = ?
        `,
        [
          nuevaCantidad,
          idInsumo
        ]
      )
    }


    // =========================
    // REGISTRAR HISTORIAL
    // =========================

    const [resultado] =
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
          VALUES (?, NOW(), ?, ?, ?, ?)
        `,
        [
          tipoMovimiento,
          cantidad,
          idInsumo,
          idProducto,
          idUsuario
        ]
      )


    await conexion.commit()


    return {
      idInventario:
        resultado.insertId
    }


  } catch (error) {

    await conexion.rollback()

    throw error

  } finally {

    conexion.release()
  }
}


export {
  listarMovimientos,
  buscarMovimientoPorId,
  registrarMovimiento
}