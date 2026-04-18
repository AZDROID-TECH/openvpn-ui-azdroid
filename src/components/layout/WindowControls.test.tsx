import { fireEvent, render, screen } from '@testing-library/react'
import { WindowControls } from './WindowControls'
import type { RendererApi } from '../../types/ipc'

function createMockApi(): RendererApi {
  return {
    onVpnStatusChanged: vi.fn(() => vi.fn()),
    onAuthFailed: vi.fn(() => vi.fn()),
    getInitialConfig: vi.fn(),
    openFileDialog: vi.fn(),
    saveCredentials: vi.fn(),
    retryAuthWithNewPassword: vi.fn(),
    resetApp: vi.fn(),
    connectVpn: vi.fn(),
    disconnectVpn: vi.fn(),
    minimizeWindow: vi.fn(),
    closeToTray: vi.fn(),
  }
}

describe('WindowControls', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'api', {
      value: createMockApi(),
      writable: true,
      configurable: true,
    })
  })

  it('minimize və close düymələri düzgün API çağırışları edir', () => {
    render(<WindowControls />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    fireEvent.click(buttons[1])

    expect(window.api.minimizeWindow).toHaveBeenCalledTimes(1)
    expect(window.api.closeToTray).toHaveBeenCalledTimes(1)
  })
})

