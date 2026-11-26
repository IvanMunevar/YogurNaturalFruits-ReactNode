import pool from '../config/database.js'


// =========================
// LISTAR USUARIOS
// =========================

const listarUsuarios = async () => {

  const [filas] = await pool.query(`
    SELECT
      u.id_usuario AS idUsuario,
      u.nombre_usuario AS nombreUsuario,
      u.correo,
      u.id_rol AS idRol,
      r.nombre_rol AS rol
    FROM usuario AS u
    INNER JOIN roles AS r
      ON u.id_rol = r.id_rol
    ORDER BY u.id_usuario DESC
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
        u.id_usuario AS idUsuario,
        u.nombre_usuario AS nombreUsuario,
        u.correo,
        u.id_rol AS idRol,
        r.nombre_rol AS rol
      FROM usuario AS u
      INNER JOIN roles AS r
        ON u.id_rol = r.id_rol
      WHERE u.id_usuario = ?
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
        u.id_usuario AS idUsuario,
        u.nombre_usuario AS nombreUsuario,
        u.correo,
        u.contraseña,
        u.id_rol AS idRol,
        r.nombre_rol AS rol
      FROM usuario AS u
      INNER JOIN roles AS r
        ON u.id_rol = r.id_rol
      WHERE u.correo = ?
      LIMIT 1
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
    contrasena,
    idRol
  } = usuario

  const [resultado] = await pool.execute(
    `
      INSERT INTO usuario
      (
        nombre_usuario,
        correo,
        contraseña,
        id_rol
      )
      VALUES (?, ?, ?, ?)
    `,
    [
      nombreUsuario,
      correo,
      contrasena,
      idRol
    ]
  )

  return {
    idUsuario: resultado.insertId,
    nombreUsuario,
    correo,
    idRol
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
    correo,
    idRol
  } = usuario

  const [resultado] = await pool.execute(
    `
      UPDATE usuario
      SET
        nombre_usuario = ?,
        correo = ?,
        id_rol = ?
      WHERE id_usuario = ?
    `,
    [
      nombreUsuario,
      correo,
      idRol,
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
    contrasena,
    idRol
  } = usuario

  const [resultado] = await pool.execute(
    `
      UPDATE usuario
      SET
        nombre_usuario = ?,
        correo = ?,
        contraseña = ?,
        id_rol = ?
      WHERE id_usuario = ?
    `,
    [
      nombreUsuario,
      correo,
      contrasena,
      idRol,
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