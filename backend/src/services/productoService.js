import pool from '../config/database.js'

const listarProductos = async () => {

  const [filas] = await pool.query(`
    SELECT
      id_producto AS idProducto,
      nombre_producto AS nombreProducto,
      descripcion,
      precio,
      stock
    FROM productos
    ORDER BY id_producto DESC
  `)

  return filas
}

const buscarProductoPorId = async (idProducto) => {

  const [filas] = await pool.query(
    `
      SELECT
        id_producto AS idProducto,
        nombre_producto AS nombreProducto,
        descripcion,
        precio,
        stock
      FROM productos
      WHERE id_producto = ?
    `,
    [idProducto]
  )

  return filas[0]
}

const crearProducto = async (producto) => {

  const {
    nombreProducto,
    descripcion,
    precio,
    stock
  } = producto

  const [resultado] = await pool.execute(
    `
      INSERT INTO productos
      (
        nombre_producto,
        descripcion,
        precio,
        stock
      )
      VALUES (?, ?, ?, ?)
    `,
    [
      nombreProducto,
      descripcion,
      precio,
      stock
    ]
  )

  return {
    idProducto: resultado.insertId,
    nombreProducto,
    descripcion,
    precio,
    stock
  }
}


const actualizarProducto = async (
  idProducto,
  producto
) => {

  const {
    nombreProducto,
    descripcion,
    precio,
    stock
  } = producto

  const [resultado] = await pool.execute(
    `
      UPDATE productos
      SET
        nombre_producto = ?,
        descripcion = ?,
        precio = ?,
        stock = ?
      WHERE id_producto = ?
    `,
    [
      nombreProducto,
      descripcion,
      precio,
      stock,
      idProducto
    ]
  )

  return resultado.affectedRows
}


const eliminarProducto = async (idProducto) => {

  const [resultado] = await pool.execute(
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