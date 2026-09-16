import pool from '../config/database.js'


// =========================
// LISTAR ALERTAS
// =========================

const listarAlertas = async () => {

  const [filas] = await pool.query(`
    SELECT
      a.id_alerta AS idAlerta,
      a.tipo_alerta AS tipoAlerta,
      a.descripcion,

      DATE_FORMAT(
        a.fecha_generacion,
        '%Y-%m-%d %H:%i:%s'
      ) AS fechaGeneracion,

      a.id_insumo AS idInsumo,
      i.nombre_insumo AS nombreInsumo,

      a.id_producto AS idProducto,
      p.nombre_producto AS nombreProducto,

      a.estado,

      CASE
        WHEN a.id_producto IS NOT NULL
          THEN 'Producto'
        WHEN a.id_insumo IS NOT NULL
          THEN 'Insumo'
        ELSE 'General'
      END AS tipoElemento,

      COALESCE(
        p.nombre_producto,
        i.nombre_insumo,
        'Sin elemento'
      ) AS nombreElemento

    FROM alertas a

    LEFT JOIN productos p
      ON a.id_producto = p.id_producto

    LEFT JOIN insumos i
      ON a.id_insumo = i.id_insumo

    ORDER BY
      CASE a.estado
        WHEN 'Activa' THEN 1
        WHEN 'Atendida' THEN 2
        ELSE 3
      END,

      a.fecha_generacion DESC
  `)

  return filas
}


// =========================
// CREAR ALERTA SI NO EXISTE
// =========================

const crearSiNoExiste = async (
  conexion,
  {
    tipoAlerta,
    descripcion,
    idProducto = null,
    idInsumo = null
  }
) => {

  let consulta = `
    SELECT id_alerta
    FROM alertas
    WHERE tipo_alerta = ?
  `

  const parametros = [
    tipoAlerta
  ]


  if (idProducto !== null) {

    consulta += `
      AND id_producto = ?
      AND id_insumo IS NULL
    `

    parametros.push(
      idProducto
    )

  } else {

    consulta += `
      AND id_insumo = ?
      AND id_producto IS NULL
    `

    parametros.push(
      idInsumo
    )
  }


  // Mientras esté Activa o Atendida,
  // no generamos duplicados.
  consulta += `
    AND estado IN ('Activa', 'Atendida')
    LIMIT 1
  `


  const [existentes] =
    await conexion.execute(
      consulta,
      parametros
    )


  if (existentes.length > 0) {
    return false
  }


  await conexion.execute(
    `
      INSERT INTO alertas
      (
        tipo_alerta,
        descripcion,
        fecha_generacion,
        id_insumo,
        id_producto,
        estado
      )
      VALUES (?, ?, NOW(), ?, ?, 'Activa')
    `,
    [
      tipoAlerta,
      descripcion,
      idInsumo,
      idProducto
    ]
  )


  return true
}


// =========================
// RESOLVER ALERTAS QUE
// YA NO CUMPLEN CONDICIÓN
// =========================

const resolverAlertasElemento = async (
  conexion,
  tipoAlerta,
  idProducto,
  idInsumo
) => {

  let consulta = `
    UPDATE alertas
    SET estado = 'Resuelta'
    WHERE tipo_alerta = ?
    AND estado IN ('Activa', 'Atendida')
  `

  const parametros = [
    tipoAlerta
  ]


  if (idProducto !== null) {

    consulta += `
      AND id_producto = ?
      AND id_insumo IS NULL
    `

    parametros.push(
      idProducto
    )

  } else {

    consulta += `
      AND id_insumo = ?
      AND id_producto IS NULL
    `

    parametros.push(
      idInsumo
    )
  }


  await conexion.execute(
    consulta,
    parametros
  )
}


// =========================
// GENERAR / SINCRONIZAR
// ALERTAS
// =========================

const generarAlertas = async () => {

  const conexion =
    await pool.getConnection()


  let nuevasAlertas = 0


  try {

    await conexion.beginTransaction()


    // ==================================
    // PRODUCTOS
    // ==================================

    const [productos] =
      await conexion.query(`
        SELECT
          id_producto,
          nombre_producto,
          stock,
          stock_minimo,
          fecha_vencimiento

        FROM productos
      `)


    for (const producto of productos) {

      const stock =
        Number(producto.stock)

      const stockMinimo =
        Number(producto.stock_minimo)


      // -------------------------
      // STOCK MÍNIMO PRODUCTO
      // -------------------------

      if (stock <= stockMinimo) {

        const creada =
          await crearSiNoExiste(
            conexion,
            {
              tipoAlerta:
                'Stock mínimo',

              descripcion:
                `${producto.nombre_producto} tiene ${stock} unidades. Stock mínimo establecido: ${stockMinimo}.`,

              idProducto:
                producto.id_producto
            }
          )


        if (creada) {
          nuevasAlertas++
        }

      } else {

        await resolverAlertasElemento(
          conexion,
          'Stock mínimo',
          producto.id_producto,
          null
        )
      }


      // -------------------------
      // VENCIMIENTO PRODUCTO
      // -------------------------

      if (producto.fecha_vencimiento) {

        const [resultadoFecha] =
          await conexion.execute(
            `
              SELECT
                DATEDIFF(
                  ?,
                  CURDATE()
                ) AS dias
            `,
            [
              producto.fecha_vencimiento
            ]
          )


        const dias =
          Number(
            resultadoFecha[0].dias
          )


        if (dias < 0) {

          // Resolver posible alerta
          // "Próximo a vencer"
          await resolverAlertasElemento(
            conexion,
            'Próximo a vencer',
            producto.id_producto,
            null
          )


          const creada =
            await crearSiNoExiste(
              conexion,
              {
                tipoAlerta:
                  'Vencido',

                descripcion:
                  `${producto.nombre_producto} se encuentra vencido desde ${producto.fecha_vencimiento}.`,

                idProducto:
                  producto.id_producto
              }
            )


          if (creada) {
            nuevasAlertas++
          }

        } else if (dias <= 7) {

          // Ya no debe estar
          // marcado como vencido
          await resolverAlertasElemento(
            conexion,
            'Vencido',
            producto.id_producto,
            null
          )


          const creada =
            await crearSiNoExiste(
              conexion,
              {
                tipoAlerta:
                  'Próximo a vencer',

                descripcion:
                  `${producto.nombre_producto} vence en ${dias} día(s). Fecha: ${producto.fecha_vencimiento}.`,

                idProducto:
                  producto.id_producto
              }
            )


          if (creada) {
            nuevasAlertas++
          }

        } else {

          await resolverAlertasElemento(
            conexion,
            'Próximo a vencer',
            producto.id_producto,
            null
          )

          await resolverAlertasElemento(
            conexion,
            'Vencido',
            producto.id_producto,
            null
          )
        }

      } else {

        await resolverAlertasElemento(
          conexion,
          'Próximo a vencer',
          producto.id_producto,
          null
        )

        await resolverAlertasElemento(
          conexion,
          'Vencido',
          producto.id_producto,
          null
        )
      }
    }


    // ==================================
    // INSUMOS
    // ==================================

    const [insumos] =
      await conexion.query(`
        SELECT
          id_insumo,
          nombre_insumo,
          cantidad,
          cantidad_minima,
          unidad_medida,
          fecha_vencimiento

        FROM insumos
      `)


    for (const insumo of insumos) {

      const cantidad =
        Number(insumo.cantidad)

      const minimo =
        Number(insumo.cantidad_minima)


      // -------------------------
      // CANTIDAD MÍNIMA
      // -------------------------

      if (cantidad <= minimo) {

        const creada =
          await crearSiNoExiste(
            conexion,
            {
              tipoAlerta:
                'Stock mínimo',

              descripcion:
                `${insumo.nombre_insumo} tiene ${cantidad} ${insumo.unidad_medida}. Cantidad mínima establecida: ${minimo} ${insumo.unidad_medida}.`,

              idInsumo:
                insumo.id_insumo
            }
          )


        if (creada) {
          nuevasAlertas++
        }

      } else {

        await resolverAlertasElemento(
          conexion,
          'Stock mínimo',
          null,
          insumo.id_insumo
        )
      }


      // -------------------------
      // VENCIMIENTO INSUMO
      // -------------------------

      if (insumo.fecha_vencimiento) {

        const [resultadoFecha] =
          await conexion.execute(
            `
              SELECT
                DATEDIFF(
                  ?,
                  CURDATE()
                ) AS dias
            `,
            [
              insumo.fecha_vencimiento
            ]
          )


        const dias =
          Number(
            resultadoFecha[0].dias
          )


        if (dias < 0) {

          await resolverAlertasElemento(
            conexion,
            'Próximo a vencer',
            null,
            insumo.id_insumo
          )


          const creada =
            await crearSiNoExiste(
              conexion,
              {
                tipoAlerta:
                  'Vencido',

                descripcion:
                  `${insumo.nombre_insumo} se encuentra vencido desde ${insumo.fecha_vencimiento}.`,

                idInsumo:
                  insumo.id_insumo
              }
            )


          if (creada) {
            nuevasAlertas++
          }

        } else if (dias <= 7) {

          await resolverAlertasElemento(
            conexion,
            'Vencido',
            null,
            insumo.id_insumo
          )


          const creada =
            await crearSiNoExiste(
              conexion,
              {
                tipoAlerta:
                  'Próximo a vencer',

                descripcion:
                  `${insumo.nombre_insumo} vence en ${dias} día(s). Fecha: ${insumo.fecha_vencimiento}.`,

                idInsumo:
                  insumo.id_insumo
              }
            )


          if (creada) {
            nuevasAlertas++
          }

        } else {

          await resolverAlertasElemento(
            conexion,
            'Próximo a vencer',
            null,
            insumo.id_insumo
          )

          await resolverAlertasElemento(
            conexion,
            'Vencido',
            null,
            insumo.id_insumo
          )
        }

      } else {

        await resolverAlertasElemento(
          conexion,
          'Próximo a vencer',
          null,
          insumo.id_insumo
        )

        await resolverAlertasElemento(
          conexion,
          'Vencido',
          null,
          insumo.id_insumo
        )
      }
    }


    await conexion.commit()


    return {
      nuevasAlertas
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

const actualizarEstadoAlerta = async (
  idAlerta,
  estado
) => {

  const [resultado] =
    await pool.execute(
      `
        UPDATE alertas

        SET estado = ?

        WHERE id_alerta = ?
      `,
      [
        estado,
        idAlerta
      ]
    )


  return resultado.affectedRows
}


export {
  listarAlertas,
  generarAlertas,
  actualizarEstadoAlerta
}