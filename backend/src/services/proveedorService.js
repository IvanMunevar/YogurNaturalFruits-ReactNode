import pool from '../config/database.js'


// =========================
// LISTAR PROVEEDORES
// =========================

const listarProveedores = async () => {

  const [filas] = await pool.query(`
    SELECT
      id_proveedor AS idProveedor,
      nombre_proveedor AS nombreProveedor,
      contacto,
      telefono,
      correo,
      direccion,
      estado
    FROM proveedor
    ORDER BY id_proveedor DESC
  `)

  return filas
}


// =========================
// BUSCAR PROVEEDOR POR ID
// =========================

const buscarProveedorPorId = async (idProveedor) => {

  const [filas] = await pool.query(
    `
      SELECT
        id_proveedor AS idProveedor,
        nombre_proveedor AS nombreProveedor,
        contacto,
        telefono,
        correo,
        direccion,
        estado
      FROM proveedor
      WHERE id_proveedor = ?
    `,
    [idProveedor]
  )

  return filas[0]
}


// =========================
// CREAR PROVEEDOR
// =========================

const crearProveedor = async (proveedor) => {

  const {
    nombreProveedor,
    contacto,
    telefono,
    correo,
    direccion,
    estado
  } = proveedor

  const [resultado] = await pool.execute(
    `
      INSERT INTO proveedor
      (
        nombre_proveedor,
        contacto,
        telefono,
        correo,
        direccion,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      nombreProveedor,
      contacto,
      telefono,
      correo,
      direccion,
      estado
    ]
  )

  return {
    idProveedor: resultado.insertId,
    nombreProveedor,
    contacto,
    telefono,
    correo,
    direccion,
    estado
  }
}


// =========================
// ACTUALIZAR PROVEEDOR
// =========================

const actualizarProveedor = async (
  idProveedor,
  proveedor
) => {

  const {
    nombreProveedor,
    contacto,
    telefono,
    correo,
    direccion,
    estado
  } = proveedor

  const [resultado] = await pool.execute(
    `
      UPDATE proveedor
      SET
        nombre_proveedor = ?,
        contacto = ?,
        telefono = ?,
        correo = ?,
        direccion = ?,
        estado = ?
      WHERE id_proveedor = ?
    `,
    [
      nombreProveedor,
      contacto,
      telefono,
      correo,
      direccion,
      estado,
      idProveedor
    ]
  )

  return resultado.affectedRows
}


// =========================
// ELIMINAR PROVEEDOR
// =========================

const eliminarProveedor = async (idProveedor) => {

  const [resultado] = await pool.execute(
    `
      DELETE FROM proveedor
      WHERE id_proveedor = ?
    `,
    [idProveedor]
  )

  return resultado.affectedRows
}


export {
  listarProveedores,
  buscarProveedorPorId,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
}