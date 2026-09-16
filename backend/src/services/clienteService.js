import pool from '../config/database.js'


// =========================
// LISTAR CLIENTES
// =========================

const listarClientes = async () => {

  const [filas] = await pool.query(`
    SELECT
      id_cliente AS idCliente,
      nombre_cliente AS nombreCliente,
      direccion,
      telefono,
      correo,

      DATE_FORMAT(
        fecha_registro,
        '%Y-%m-%d'
      ) AS fechaRegistro

    FROM clientes

    ORDER BY id_cliente DESC
  `)

  return filas
}


// =========================
// BUSCAR CLIENTE POR ID
// =========================

const buscarClientePorId = async (
  idCliente
) => {

  const [filas] = await pool.query(
    `
      SELECT
        id_cliente AS idCliente,
        nombre_cliente AS nombreCliente,
        direccion,
        telefono,
        correo,

        DATE_FORMAT(
          fecha_registro,
          '%Y-%m-%d'
        ) AS fechaRegistro

      FROM clientes

      WHERE id_cliente = ?
    `,
    [idCliente]
  )

  return filas[0]
}


// =========================
// CREAR CLIENTE
// =========================

const crearCliente = async (cliente) => {

  const {
    nombreCliente,
    direccion,
    telefono,
    correo
  } = cliente


  const [resultado] = await pool.execute(
    `
      INSERT INTO clientes
      (
        nombre_cliente,
        direccion,
        telefono,
        correo,
        fecha_registro
      )
      VALUES (?, ?, ?, ?, CURDATE())
    `,
    [
      nombreCliente,
      direccion || null,
      telefono,
      correo || null
    ]
  )


  return {
    idCliente: resultado.insertId,
    nombreCliente,
    direccion,
    telefono,
    correo
  }
}


// =========================
// ACTUALIZAR CLIENTE
// =========================

const actualizarCliente = async (
  idCliente,
  cliente
) => {

  const {
    nombreCliente,
    direccion,
    telefono,
    correo
  } = cliente


  const [resultado] = await pool.execute(
    `
      UPDATE clientes

      SET
        nombre_cliente = ?,
        direccion = ?,
        telefono = ?,
        correo = ?

      WHERE id_cliente = ?
    `,
    [
      nombreCliente,
      direccion || null,
      telefono,
      correo || null,
      idCliente
    ]
  )


  return resultado.affectedRows
}


// =========================
// ELIMINAR CLIENTE
// =========================

const eliminarCliente = async (
  idCliente
) => {

  const [resultado] = await pool.execute(
    `
      DELETE FROM clientes
      WHERE id_cliente = ?
    `,
    [idCliente]
  )


  return resultado.affectedRows
}


export {
  listarClientes,
  buscarClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
}