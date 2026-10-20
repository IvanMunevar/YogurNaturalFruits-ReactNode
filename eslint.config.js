import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

import {
  defineConfig,
  globalIgnores
} from 'eslint/config'


export default defineConfig([

  /*
   * Carpetas generadas automáticamente
   * que no deben analizarse.
   */
  globalIgnores([
    'dist/**',
    'coverage/**',
    'node_modules/**',
    'backend/node_modules/**'
  ]),


  /*
   * =====================================================
   * FRONTEND REACT
   * =====================================================
   */
  {
    files: [
      'src/**/*.{js,jsx}'
    ],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],

    languageOptions: {

      globals: globals.browser,

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    rules: {

      /*
       * Los componentes realizan consultas a la API
       * cuando son cargados.
       *
       * Las funciones cargarProductos, cargarClientes,
       * cargarAlertas, etc., actualizan el estado después
       * de consultar los servicios.
       */
      'react-hooks/set-state-in-effect': 'off'
    }
  },


  /*
   * =====================================================
   * BACKEND NODE.JS
   * =====================================================
   */
  {
    files: [
      'backend/**/*.js'
    ],

    extends: [
      js.configs.recommended
    ],

    languageOptions: {

      /*
       * Habilita process, console, Buffer y demás
       * variables propias de Node.js.
       */
      globals: globals.node
    }
  },


  /*
   * =====================================================
   * ARCHIVOS DE CONFIGURACIÓN
   * =====================================================
   */
  {
    files: [
      '**/*.config.js'
    ],

    extends: [
      js.configs.recommended
    ],

    languageOptions: {
      globals: globals.node
    }
  }
])