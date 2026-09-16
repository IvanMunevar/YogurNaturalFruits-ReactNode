import pool from '../config/database.js'


// =========================
// LISTAR PRODUCTOS
// =========================

const listarProductos = async () => {

  const [filas] = await pool.query(`
    SELECT
      id_producto AS idProducto,
      nombre_producto AS nombreProducto,
      descripcion,
      precio,
      stock,
      stock_minimo AS stockMinimo,

      DATE_FORMAT(
        fecha_vencimiento,
        '%Y-%m-%d'
      ) AS fechaVencimiento

    FROM productos

    ORDER BY id_producto DESC
  `)

  return filas
}


// =========================
// BUSCAR PRODUCTO POR ID
// =========================

const buscarProductoPorId = async (
  idProducto
) => {

  const [filas] = await pool.query(
    `
      SELECT
        id_producto AS idProducto,
        nombre_producto AS nombreProducto,
        descripcion,
        precio,
        stock,
        stock_minimo AS stockMinimo,

        DATE_FORMAT(
          fecha_vencimiento,
          '%Y-%m-%d'
        ) AS fechaVencimiento

      FROM productos

      WHERE id_producto = ?
    `,
    [idProducto]
  )

  return filas[0]
}


// =========================
// CREAR PRODUCTO
// =========================

const crearProducto = async (
  producto
) => {

  const {
    nombreProducto,
    descripcion,
    precio,
    stock,
    stockMinimo,
    fechaVencimiento
  } = producto


  const [resultado] =
    await pool.execute(
      `
        INSERT INTO productos
        (
          nombre_producto,
          descripcion,
          precio,
          stock,
          stock_minimo,
          fecha_vencimiento
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        nombreProducto,
        descripcion || null,
        precio,
        stock,
        stockMinimo,
        fechaVencimiento || null
      ]
    )


  return {

    idProducto:
      resultado.insertId,

    nombreProducto,
    descripcion,
    precio,
    stock,
    stockMinimo,
    fechaVencimiento
  }
}


// =========================
// ACTUALIZAR PRODUCTO
// =========================

const actualizarProducto = async (
  idProducto,
  producto
) => {

  const {
    nombreProducto,
    descripcion,
    precio,
    stock,
    stockMinimo,
    fechaVencimiento
  } = producto


  const [resultado] =
    await pool.execute(
      `
        UPDATE productos

        SET
          nombre_producto = ?,
          descripcion = ?,
          precio = ?,
          stock = ?,
          stock_minimo = ?,
          fecha_vencimiento = ?

        WHERE id_producto = ?
      `,
      [
        nombreProducto,
        descripcion || null,
        precio,
        stock,
        stockMinimo,
        fechaVencimiento || null,
        idProducto
      ]
    )


  return resultado.affectedRows
}


// =========================
// ELIMINAR PRODUCTO
// =========================

const eliminarProducto = async (
  idProducto
) => {

  const [resultado] =
    await pool.execute(
      `
        DELETE FROM productos
        WHERE id_producto = ?
      `,
      [idProducto]
    )


  return resultado.affectedRows
}


export {
  listarProductos,
  buscarProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
}