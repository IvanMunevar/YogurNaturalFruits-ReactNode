import pool from '../config/database.js'


// =========================
// LISTAR INSUMOS
// =========================

const listarInsumos = async () => {

  const [filas] = await pool.query(`
    SELECT
      i.id_insumo AS idInsumo,
      i.nombre_insumo AS nombreInsumo,
      i.cantidad,
      i.cantidad_minima AS cantidadMinima,
      i.unidad_medida AS unidadMedida,

      DATE_FORMAT(
        i.fecha_vencimiento,
        '%Y-%m-%d'
      ) AS fechaVencimiento,

      i.id_proveedor AS idProveedor,
      p.nombre_proveedor AS nombreProveedor
      
    FROM insumos i

    INNER JOIN proveedor p
      ON i.id_proveedor = p.id_proveedor

    ORDER BY i.id_insumo DESC
  `)

  return filas
}


// =========================
// BUSCAR INSUMO POR ID
// =========================

const buscarInsumoPorId = async (idInsumo) => {

  const [filas] = await pool.query(
    `
      SELECT
        i.id_insumo AS idInsumo,
        i.nombre_insumo AS nombreInsumo,
        i.cantidad,
        i.cantidad_minima AS cantidadMinima,
        i.unidad_medida AS unidadMedida,

        DATE_FORMAT(
          i.fecha_vencimiento,
          '%Y-%m-%d'
        ) AS fechaVencimiento,

        i.id_proveedor AS idProveedor,
        p.nombre_proveedor AS nombreProveedor

      FROM insumos i

      INNER JOIN proveedor p
        ON i.id_proveedor = p.id_proveedor

      WHERE i.id_insumo = ?
    `,
    [idInsumo]
  )

  return filas[0]
}


// =========================
// CREAR INSUMO
// =========================

const crearInsumo = async (insumo) => {

  const {
    nombreInsumo,
    cantidad,
    cantidadMinima,
    unidadMedida,
    fechaVencimiento,
    idProveedor
  } = insumo


  const [resultado] = await pool.execute(
    `
      INSERT INTO insumos
      (
        nombre_insumo,
        cantidad,
        cantidad_minima,
        unidad_medida,
        fecha_vencimiento,
        id_proveedor
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      nombreInsumo,
      cantidad,
      cantidadMinima,
      unidadMedida,
      fechaVencimiento || null,
      idProveedor
    ]
  )


  return {
    idInsumo: resultado.insertId,
    nombreInsumo,
    cantidad,
    cantidadMinima,
    unidadMedida,
    fechaVencimiento,
    idProveedor
  }
}


// =========================
// ACTUALIZAR INSUMO
// =========================

const actualizarInsumo = async (
  idInsumo,
  insumo
) => {

  const {
    nombreInsumo,
    cantidad,
    cantidadMinima,
    unidadMedida,
    fechaVencimiento,
    idProveedor
  } = insumo


  const [resultado] = await pool.execute(
    `
      UPDATE insumos

      SET
        nombre_insumo = ?,
        cantidad = ?,
        cantidad_minima = ?,
        unidad_medida = ?,
        fecha_vencimiento = ?,
        id_proveedor = ?

      WHERE id_insumo = ?
    `,
    [
      nombreInsumo,
      cantidad,
      cantidadMinima,
      unidadMedida,
      fechaVencimiento || null,
      idProveedor,
      idInsumo
    ]
  )

  return resultado.affectedRows
}


// =========================
// ELIMINAR INSUMO
// =========================

const eliminarInsumo = async (idInsumo) => {

  const [resultado] = await pool.execute(
    `
      DELETE FROM insumos
      WHERE id_insumo = ?
    `,
    [idInsumo]
  )

  return resultado.affectedRows
}


export {
  listarInsumos,
  buscarInsumoPorId,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
}