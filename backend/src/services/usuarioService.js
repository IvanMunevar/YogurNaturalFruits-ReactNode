import pool from '../config/database.js'


// =========================
// LISTAR USUARIOS
// =========================

const listarUsuarios = async () => {

  const [filas] = await pool.query(`
    SELECT
      id_usuario AS idUsuario,
      nombre_usuario AS nombreUsuario,
      correo
    FROM usuario
    ORDER BY id_usuario DESC
  `)

  return filas
}


// =========================
// BUSCAR POR ID
// =========================

const buscarUsuarioPorId = async (idUsuario) => {

  const [filas] = await pool.query(
    `
      SELECT
        id_usuario AS idUsuario,
        nombre_usuario AS nombreUsuario,
        correo
      FROM usuario
      WHERE id_usuario = ?
    `,
    [idUsuario]
  )

  return filas[0]
}


// =========================
// BUSCAR POR CORREO
// =========================

const buscarUsuarioPorCorreo = async (correo) => {

  const [filas] = await pool.query(
    `
      SELECT
        id_usuario AS idUsuario,
        nombre_usuario AS nombreUsuario,
        correo,
        contraseña
      FROM usuario
      WHERE correo = ?
    `,
    [correo]
  )

  return filas[0]
}


// =========================
// CREAR USUARIO
// =========================

const crearUsuario = async (usuario) => {

  const {
    nombreUsuario,
    correo,
    contrasena
  } = usuario


  const [resultado] = await pool.execute(
    `
      INSERT INTO usuario
      (
        nombre_usuario,
        correo,
        contraseña
      )
      VALUES (?, ?, ?)
    `,
    [
      nombreUsuario,
      correo,
      contrasena
    ]
  )


  return {
    idUsuario: resultado.insertId,
    nombreUsuario,
    correo
  }
}


// =========================
// ACTUALIZAR SIN CONTRASEÑA
// =========================

const actualizarUsuario = async (
  idUsuario,
  usuario
) => {

  const {
    nombreUsuario,
    correo
  } = usuario


  const [resultado] = await pool.execute(
    `
      UPDATE usuario
      SET
        nombre_usuario = ?,
        correo = ?
      WHERE id_usuario = ?
    `,
    [
      nombreUsuario,
      correo,
      idUsuario
    ]
  )


  return resultado.affectedRows
}


// =========================
// ACTUALIZAR CON CONTRASEÑA
// =========================

const actualizarUsuarioConContrasena = async (
  idUsuario,
  usuario
) => {

  const {
    nombreUsuario,
    correo,
    contrasena
  } = usuario


  const [resultado] = await pool.execute(
    `
      UPDATE usuario
      SET
        nombre_usuario = ?,
        correo = ?,
        contraseña = ?
      WHERE id_usuario = ?
    `,
    [
      nombreUsuario,
      correo,
      contrasena,
      idUsuario
    ]
  )


  return resultado.affectedRows
}


// =========================
// ELIMINAR
// =========================

const eliminarUsuario = async (idUsuario) => {

  const [resultado] = await pool.execute(
    `
      DELETE FROM usuario
      WHERE id_usuario = ?
    `,
    [idUsuario]
  )


  return resultado.affectedRows
}


export {
  listarUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorCorreo,
  crearUsuario,
  actualizarUsuario,
  actualizarUsuarioConContrasena,
  eliminarUsuario
}