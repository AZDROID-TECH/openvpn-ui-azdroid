import { configureStore } from '@reduxjs/toolkit'
import reducer, {
  connectVpn,
  disconnectVpn,
  initializeApp,
  retryAuthWithNewPassword,
  selectAppStatus,
  selectConnectionState,
  selectHasConfig,
  setAuthFailed,
} from './appSlice'
import type { RendererApi } from '../../types/ipc'

function createMockApi(): RendererApi {
  return {
    onVpnStatusChanged: vi.fn(() => vi.fn()),
    onAuthFailed: vi.fn(() => vi.fn()),
    getInitialConfig: vi.fn().mockResolvedValue({ hasConfig: true }),
    openFileDialog: vi.fn().mockResolvedValue(true),
    saveCredentials: vi.fn().mockResolvedValue(undefined),
    retryAuthWithNewPassword: vi.fn().mockResolvedValue(undefined),
    resetApp: vi.fn().mockResolvedValue(undefined),
    connectVpn: vi.fn(),
    disconnectVpn: vi.fn(),
    minimizeWindow: vi.fn(),
    closeToTray: vi.fn(),
  }
}

function createStore() {
  return configureStore({
    reducer: {
      app: reducer,
    },
  })
}

describe('appSlice', () => {
  beforeEach(() => {
    const mockApi = createMockApi()
    Object.defineProperty(window, 'api', {
      value: mockApi,
      writable: true,
      configurable: true,
    })
  })

  it('initializeApp thunk nəticəsində hasConfig true olur', async () => {
    const store = createStore()
    await store.dispatch(initializeApp())

    const state = store.getState()
    expect(selectHasConfig(state)).toBe(true)
    expect(selectAppStatus(state)).toBe('ready')
  })

  it('initializeApp uğursuz olduqda loading-də ilişmir', async () => {
    const getInitialConfigMock = window.api.getInitialConfig as ReturnType<typeof vi.fn>
    getInitialConfigMock.mockRejectedValueOnce(new Error('init failed'))

    const store = createStore()
    await store.dispatch(initializeApp())

    const state = store.getState()
    expect(selectHasConfig(state)).toBe(false)
    expect(selectAppStatus(state)).toBe('ready')
  })

  it('retryAuthWithNewPassword uğurlu olduqda modal bağlanır və connecting olur', async () => {
    const store = createStore()
    store.dispatch(setAuthFailed())
    expect(selectConnectionState(store.getState())).toBe('disconnected')

    await store.dispatch(retryAuthWithNewPassword('new-secret'))
    expect(window.api.retryAuthWithNewPassword).toHaveBeenCalledWith('new-secret')
    expect(selectConnectionState(store.getState())).toBe('connecting')
  })

  it('connect və disconnect thunk-ları API funksiyalarını çağırır', async () => {
    const store = createStore()
    await store.dispatch(connectVpn())
    await store.dispatch(disconnectVpn())

    expect(window.api.connectVpn).toHaveBeenCalledTimes(1)
    expect(window.api.disconnectVpn).toHaveBeenCalledTimes(1)
  })
})
