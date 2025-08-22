/** @vitest-environment jsdom */

import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { LoginForm } from '../components/login-form'
import { SignupForm } from '../components/signup-form'

const loginMock = vi.fn()
const signupMock = vi.fn()
const verifyOtpMock = vi.fn()
const pushMock = vi.fn()

vi.mock('../contexts/auth-context', () => ({
  useAuth: () => ({ login: loginMock, signup: signupMock, verifyOtp: verifyOtpMock })
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock })
}))

describe('Authentication forms', () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('logs in user', async () => {
    loginMock.mockResolvedValueOnce(undefined)
    verifyOtpMock.mockResolvedValueOnce(undefined)
    render(<LoginForm />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@test.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => expect(loginMock).toHaveBeenCalledWith('a@test.com', 'pw'))
    fireEvent.change(screen.getByLabelText(/authenticator code/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /verify/i }))
    await waitFor(() => expect(verifyOtpMock).toHaveBeenCalledWith('a@test.com', '123456'))
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/'))
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

  it('signs up user and verifies otp', async () => {
    signupMock.mockResolvedValueOnce('dataurl')
    verifyOtpMock.mockResolvedValueOnce(undefined)
    render(<SignupForm />)
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Bob' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'b@test.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => expect(signupMock).toHaveBeenCalledWith('Bob', 'User', 'b@test.com', 'pw'))
    await waitFor(() => screen.getByLabelText(/authenticator code/i))
    fireEvent.change(screen.getByLabelText(/authenticator code/i), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: /verify/i }))
    await waitFor(() => expect(verifyOtpMock).toHaveBeenCalledWith('b@test.com', '123456'))
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/'))
  })

  it('shows signup error', async () => {
    signupMock.mockRejectedValueOnce(new Error('Email already registered'))
    render(<SignupForm />)
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Bob' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } })
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'b@test.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } })
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    await waitFor(() => screen.getByRole('alert'))
    expect(screen.getByRole('alert')).toHaveTextContent('Email already registered')
  })
})
