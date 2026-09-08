import dotenv from 'dotenv'
import app from './src/app.js'
import pool from './src/config/database.js'

dotenv.config()

const PORT = process.env.PORT || 3000

const iniciarServidor = async () => {

  try {

    const conexion = await pool.getConnection()

    console.log(
      '✅ Conexión a MySQL establecida correctamente.'
    )

    conexion.release()

    app.listen(PORT, () => {

      console.log(
        `✅ Servidor ejecutándose en http://localhost:${PORT}`
      )

    })

  } catch (error) {

    console.error(
      '❌ No fue posible conectar con MySQL:'
    )

    console.error(error.message)

    process.exit(1)
  }
}

// MUY IMPORTANTE
iniciarServidor()