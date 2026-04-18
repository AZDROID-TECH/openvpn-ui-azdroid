import { act, renderHook } from '@testing-library/react'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
  })

  it('tema dəyişəndə html class və localStorage yenilənir', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('openvpn-ui-theme')).toBe('dark')

    act(() => {
      result.current.toggleTheme()
    })

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('openvpn-ui-theme')).toBe('light')
  })
})

