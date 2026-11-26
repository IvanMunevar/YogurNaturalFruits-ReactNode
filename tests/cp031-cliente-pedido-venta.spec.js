import { test, expect } from '@playwright/test';

const URL_FRONTEND = 'http://localhost:5173';
const URL_API = 'http://localhost:3000/api';

async function obtenerJson(respuesta, codigoEsperado, operacion) {
  const contenido = await respuesta.text();

  expect(
    respuesta.status(),
    `${operacion} respondió: ${contenido}`
  ).toBe(codigoEsperado);

  return JSON.parse(contenido);
}

async function adjuntarCaptura(page, testInfo, nombre) {
  const captura = await page.screenshot({
    fullPage: true
  });

  await testInfo.attach(nombre, {
    body: captura,
    contentType: 'image/png'
  });
}

test(
  'CP-031 - Flujo E2E de cliente, pedido y venta',
  async ({ page, request }, testInfo) => {
    test.setTimeout(60000);

    const correoUsuario = process.env.YNF_E2E_EMAIL;
    const contrasenaUsuario = process.env.YNF_E2E_PASSWORD;

    if (!correoUsuario || !contrasenaUsuario) {
      throw new Error(
        'Debes configurar YNF_E2E_EMAIL y YNF_E2E_PASSWORD.'
      );
    }

    /*
     * Se genera un identificador único para evitar que
     * el cliente quede duplicado si existen datos anteriores.
     */
    const identificador = Date.now();
    const nombreCliente = `Cliente E2E CP031 ${identificador}`;
    const correoCliente = `cp031_${identificador}@yogur.test`;
    const telefonoCliente = `3${String(identificador).slice(-9)}`;

    /*
     * PASO 1: iniciar sesión desde la interfaz.
     */
    await page.goto(URL_FRONTEND);

    const campos = page.locator('input');

    await expect(campos.first()).toBeVisible();
    await expect(campos.nth(1)).toBeVisible();

    await campos.first().fill(correoUsuario);
    await campos.nth(1).fill(contrasenaUsuario);

    await page
      .getByRole('button', {
        name: /iniciar sesión|ingresar/i
      })
      .click();

    await expect(page).toHaveURL(
      /\/dashboard/,
      { timeout: 10000 }
    );

    /*
     * PASO 2: registrar un cliente mediante la API.
     */
    const respuestaCliente = await request.post(
      `${URL_API}/clientes`,
      {
        data: {
          nombreCliente,
          direccion: 'Calle 31 número 10-20',
          telefono: telefonoCliente,
          correo: correoCliente
        }
      }
    );

    const datosCliente = await obtenerJson(
      respuestaCliente,
      201,
      'Registro del cliente'
    );

    const idCliente =
      datosCliente.cliente?.idCliente ??
      datosCliente.idCliente;

    expect(idCliente).toBeTruthy();

    /*
     * Verificar el cliente en la interfaz.
     */
    await page.goto(`${URL_FRONTEND}/clientes`);

    await expect(page.locator('body')).toContainText(
      nombreCliente,
      { timeout: 10000 }
    );

    await adjuntarCaptura(
      page,
      testInfo,
      'CP031-01-cliente-registrado'
    );

    /*
     * PASO 3: registrar un pedido del producto número 3.
     */
    const respuestaPedido = await request.post(
      `${URL_API}/pedidos`,
      {
        data: {
          idCliente,
          idUsuario: 1,
          estadoPedido: 'Pendiente',
          productos: [
            {
              idProducto: 3,
              cantidad: 1
            }
          ]
        }
      }
    );

    const datosPedido = await obtenerJson(
      respuestaPedido,
      201,
      'Registro del pedido'
    );

    const idPedido =
      datosPedido.pedido?.idPedido ??
      datosPedido.idPedido;

    const totalPedido = Number(
      datosPedido.pedido?.total ??
      datosPedido.total
    );

    expect(idPedido).toBeTruthy();
    expect(totalPedido).toBe(4800);

    /*
     * PASO 4: confirmar el pedido.
     */
    const respuestaConfirmacion = await request.patch(
      `${URL_API}/pedidos/${idPedido}/estado`,
      {
        data: {
          estadoPedido: 'Confirmado'
        }
      }
    );

    expect(
      respuestaConfirmacion.status()
    ).toBe(200);

    await page.goto(`${URL_FRONTEND}/pedidos`);

    await expect(page.locator('body')).toContainText(
      nombreCliente,
      { timeout: 10000 }
    );

    await expect(page.locator('body')).toContainText(
      /Confirmado/i
    );

    await adjuntarCaptura(
      page,
      testInfo,
      'CP031-02-pedido-confirmado'
    );

    /*
     * PASO 5: convertir el pedido confirmado en venta.
     */
    const respuestaVenta = await request.post(
      `${URL_API}/ventas`,
      {
        data: {
          idPedido,
          metodoPago: 'Efectivo'
        }
      }
    );

    const datosVenta = await obtenerJson(
      respuestaVenta,
      201,
      'Registro de la venta'
    );

    const venta = datosVenta.venta ?? datosVenta;
    const idVenta = venta.idVenta;

    expect(idVenta).toBeTruthy();
    expect(Number(venta.idPedido)).toBe(Number(idPedido));
    expect(Number(venta.total)).toBe(totalPedido);
    expect(venta.metodoPago).toMatch(/Efectivo/i);

    /*
     * PASO 6: consultar el pedido y comprobar que
     * la venta lo dejó en estado Entregado.
     */
    const respuestaPedidoFinal = await request.get(
      `${URL_API}/pedidos/${idPedido}`
    );

    const datosPedidoFinal = await obtenerJson(
      respuestaPedidoFinal,
      200,
      'Consulta final del pedido'
    );

    const pedidoFinal =
      datosPedidoFinal.pedido ?? datosPedidoFinal;

    const estadoFinal =
      pedidoFinal.estadoPedido ??
      pedidoFinal.estado_pedido;

    expect(estadoFinal).toMatch(/Entregado/i);

    /*
     * Verificar el estado final del pedido en pantalla.
     */
    await page.goto(`${URL_FRONTEND}/pedidos`);

    await expect(page.locator('body')).toContainText(
      nombreCliente,
      { timeout: 10000 }
    );

    await expect(page.locator('body')).toContainText(
      /Entregado/i
    );

    await adjuntarCaptura(
      page,
      testInfo,
      'CP031-03-pedido-entregado'
    );

    /*
     * Verificar la venta desde el módulo de ventas.
     */
    await page.goto(`${URL_FRONTEND}/ventas`);

    await expect(page.locator('body')).toContainText(
      /Efectivo/i,
      { timeout: 10000 }
    );

    await adjuntarCaptura(
      page,
      testInfo,
      'CP031-04-venta-registrada'
    );

    /*
     * Incorporar al reporte los resultados principales.
     */
    const resumen = {
      caso: 'CP-031',
      cliente: {
        idCliente,
        nombreCliente,
        correoCliente
      },
      pedido: {
        idPedido,
        estadoFinal,
        total: totalPedido
      },
      venta: {
        idVenta,
        metodoPago: venta.metodoPago,
        total: Number(venta.total)
      },
      resultado: 'Aprobado'
    };

    await testInfo.attach(
      'CP031-Resumen-resultados',
      {
        body: Buffer.from(
          JSON.stringify(resumen, null, 2)
        ),
        contentType: 'application/json'
      }
    );
  }
);