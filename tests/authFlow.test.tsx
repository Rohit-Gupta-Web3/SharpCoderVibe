/** @vitest-environment jsdom */

import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { LoginForm } from '../components/login-form'
import { SignupForm } from '../components/signup-form'

const loginMock = vi.fn()
const signupMock = vi.fn()
const pushMock = vi.fn()

vi.mock('../contexts/auth-context', () => ({
  useAuth: () => ({ login: loginMock, signup: signupMock })
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock })
}))

describe('Authentication forms', () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('logs in user and redirects to profile', async () => {
    loginMock.mockResolvedValueOnce(undefined)
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@test.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => expect(loginMock).toHaveBeenCalledWith('a@test.com', 'pw'))
    expect(pushMock).toHaveBeenCalledWith('/profile')
  })

  it('shows login error', async () => {
    loginMock.mockRejectedValueOnce(new Error('Invalid credentials'))
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@test.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'bad' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => screen.getByRole('alert'))
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials')
  })

  it('signs up user and redirects', async () => {
    signupMock.mockResolvedValueOnce(undefined)
    render(<SignupForm />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'b@test.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => expect(signupMock).toHaveBeenCalledWith('b@test.com', 'pw'))
    expect(pushMock).toHaveBeenCalledWith('/profile')
  })

  it('shows signup error', async () => {
    signupMock.mockRejectedValueOnce(new Error('Email already registered'))
    render(<SignupForm />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'b@test.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => screen.getByRole('alert'))
    expect(screen.getByRole('alert')).toHaveTextContent('Email already registered')
  })
})
