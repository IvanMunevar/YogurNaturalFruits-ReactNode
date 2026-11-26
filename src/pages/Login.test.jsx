import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import {
  render,
  screen
} from '@testing-library/react'

import userEvent from '@testing-library/user-event'

import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import Login from './Login'

import {
  iniciarSesion
} from '../services/usuarioService'


vi.mock('../services/usuarioService', () => ({
  iniciarSesion: vi.fn()
}))


function renderizarLogin() {

  return render(

    <MemoryRouter initialEntries={['/']}>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <h1>Panel de control</h1>
          }
        />

      </Routes>

    </MemoryRouter>
  )
}


describe('Componente Login', () => {

  beforeEach(() => {
    vi.resetAllMocks()
    sessionStorage.clear()
  })


  it('muestra los campos y el botón de ingreso', () => {

    renderizarLogin()

    expect(
      screen.getByLabelText(
        /correo electrónico/i
      )
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText(
        /contraseña/i
      )
    ).toBeInTheDocument()

    expect(
      screen.getByRole(
        'button',
        {
          name: /ingresar al sistema/i
        }
      )
    ).toBeInTheDocument()
  })


  it('rechaza el formulario cuando hay campos vacíos', async () => {

    const usuarioSimulado =
      userEvent.setup()

    renderizarLogin()

    await usuarioSimulado.click(
      screen.getByRole(
        'button',
        {
          name: /ingresar/i
        }
      )
    )

    expect(
      await screen.findByText(
        /debe completar todos los campos/i
      )
    ).toBeInTheDocument()

    expect(
      iniciarSesion
    ).not.toHaveBeenCalled()
  })


  it('guarda el usuario y navega al dashboard', async () => {

    const usuarioSimulado =
      userEvent.setup()

    const usuario = {
    idUsuario: 1,
    nombreUsuario: 'Juan Prueba',
    correo: 'juan@naturalfruits.com',
    idRol: 1,
    rol: 'ADMINISTRADOR'
}

    iniciarSesion.mockResolvedValue({
    token: 'token-prueba-administrador',
    usuario
    })

    renderizarLogin()

    await usuarioSimulado.type(
      screen.getByLabelText(/correo/i),
      'juan@naturalfruits.com'
    )

    await usuarioSimulado.type(
      screen.getByLabelText(/contraseña/i),
      'Clave123'
    )

    await usuarioSimulado.click(
      screen.getByRole(
        'button',
        {
          name: /ingresar/i
        }
      )
    )

    expect(
      await screen.findByRole(
        'heading',
        {
          name: /panel de control/i
        }
      )
    ).toBeInTheDocument()

    expect(
      iniciarSesion
    ).toHaveBeenCalledWith(
      'juan@naturalfruits.com',
      'Clave123'
    )

    expect(
      sessionStorage.getItem('usuario')
    ).toBe(
      JSON.stringify(usuario)
    )
    expect(sessionStorage.getItem('usuario')).toBe(JSON.stringify(usuario))
    expect(sessionStorage.getItem('token')).toBe('token-prueba-administrador')
  })


  it('informa el error de autenticación', async () => {

    const usuarioSimulado =
      userEvent.setup()

    vi.spyOn(
      console,
      'error'
    ).mockImplementation(() => {})

    iniciarSesion.mockRejectedValue(
      new Error(
        'Credenciales incorrectas.'
      )
    )

    renderizarLogin()

    await usuarioSimulado.type(
      screen.getByLabelText(/correo/i),
      'error@correo.com'
    )

    await usuarioSimulado.type(
      screen.getByLabelText(/contraseña/i),
      'incorrecta'
    )

    await usuarioSimulado.click(
      screen.getByRole(
        'button',
        {
          name: /ingresar/i
        }
      )
    )

    expect(
      await screen.findByText(
        /credenciales incorrectas/i
      )
    ).toBeInTheDocument()
  })
})