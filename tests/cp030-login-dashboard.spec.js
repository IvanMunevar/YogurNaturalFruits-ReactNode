import { test, expect } from '@playwright/test'

test(
  'CP-030 - Inicio de sesión hasta el dashboard',
  async ({ page }, testInfo) => {

    // Las credenciales se reciben desde variables de entorno.
    const correo =
      process.env.YNF_E2E_EMAIL

    const contrasena =
      process.env.YNF_E2E_PASSWORD

    expect(
      correo,
      'Debe configurar YNF_E2E_EMAIL'
    ).toBeTruthy()

    expect(
      contrasena,
      'Debe configurar YNF_E2E_PASSWORD'
    ).toBeTruthy()


    // Abrir la pantalla de inicio de sesión.
    await page.goto(
      'http://localhost:5173/'
    )


   // Obtener los campos del formulario de login.
// El primer campo corresponde al correo o usuario
// y el segundo corresponde a la contraseña.
const camposLogin =
  page.locator('input')

const campoCorreo =
  camposLogin.nth(0)

const campoContrasena =
  camposLogin.nth(1)


// Verificar que ambos campos estén visibles.
await expect(
  campoCorreo
).toBeVisible()

await expect(
  campoContrasena
).toBeVisible()


    // Escribir las credenciales.
    await campoCorreo.fill(correo)

    await campoContrasena.fill(
      contrasena
    )


    // Presionar el botón de acceso.
    await page.getByRole(
      'button',
      {
        name:
          /iniciar sesión|ingresar/i
      }
    ).click()


    // Comprobar la navegación.
    await expect(page).toHaveURL(
      /\/dashboard\/?$/,
      {
        timeout: 10000
      }
    )


    // Comprobar elementos principales.
    await expect(
      page.getByRole(
        'heading',
        {
          name: /dashboard/i
        }
      )
    ).toBeVisible()

    await expect(
      page.getByText(
        /resumen general/i
      )
    ).toBeVisible()


    // Confirmar que la contraseña no se muestre.
    await expect(
      page.locator('body')
    ).not.toContainText(
      contrasena
    )


    // Adjuntar captura al reporte de Playwright.
    const captura =
      await page.screenshot({
        fullPage: true
      })

    await testInfo.attach(
      'CP030 - Dashboard autenticado',
      {
        body: captura,
        contentType: 'image/png'
      }
    )
  }
)