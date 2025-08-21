/** @vitest-environment jsdom */

import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import Home from '../app/page'

const replaceMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock })
}))

describe('landing page redirects', () => {
  beforeEach(() => {
    localStorage.clear()
    replaceMock.mockReset()
  })

  it('redirects to signup when missing session', async () => {
    render(<Home />)
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/signup'))
  })

  it('redirects to login when email stored but no token', async () => {
    localStorage.setItem('scv_user_email', 'a@test.com')
    render(<Home />)
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/login'))
  })

  it('redirects to login when expired', async () => {
    localStorage.setItem('scv_token', 't')
    localStorage.setItem('scv_user_email', 'a@test.com')
    localStorage.setItem('scv_token_expiry', String(Date.now() - 1000))
    render(<Home />)
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/login'))
  })

  it('shows dashboard when session valid', async () => {
    localStorage.setItem('scv_token', 't')
    localStorage.setItem('scv_user_email', 'a@test.com')
    localStorage.setItem('scv_token_expiry', String(Date.now() + 10000))
    const { getByText } = render(<Home />)
    await waitFor(() => expect(replaceMock).not.toHaveBeenCalled())
    expect(getByText('Create an Application')).toBeInTheDocument()
  })
})
