import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import {
  obtenerProductos,
  crearProducto
} from './productoService'


describe('Servicio de productos', () => {

  let fetchMock


  beforeEach(() => {

    fetchMock = vi.fn()

    vi.stubGlobal(
      'fetch',
      fetchMock
    )

    vi.spyOn(
      console,
      'log'
    ).mockImplementation(() => {})
  })


  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })


  it('consulta la lista de productos', async () => {

    const productos = [
      {
        idProducto: 1,
        nombreProducto: 'Yogur de fresa'
      }
    ]

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => productos
    })

    await expect(
      obtenerProductos()
    ).resolves.toEqual(productos)

    expect(
      fetchMock
    ).toHaveBeenCalledWith(
      'http://localhost:3000/api/productos'
    )
  })


  it('envía un producto en formato JSON', async () => {

    const producto = {
      nombreProducto: 'Yogur natural',
      precio: 8000,
      stock: 10,
      stockMinimo: 5
    }

    fetchMock.mockResolvedValue({
      ok: true,

      json: async () => ({
        mensaje:
          'Producto registrado correctamente.'
      })
    })

    await crearProducto(producto)

    expect(
      fetchMock
    ).toHaveBeenCalledWith(
      'http://localhost:3000/api/productos',

      expect.objectContaining({
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(producto)
      })
    )
  })


  it('genera un error cuando la consulta falla', async () => {

    fetchMock.mockResolvedValue({
      ok: false
    })

    await expect(
      obtenerProductos()
    ).rejects.toThrow(
      'No fue posible consultar los productos.'
    )
  })
})