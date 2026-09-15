import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('vitest setup', () => {
  it('runs plain assertions', () => {
    expect(1 + 1).toBe(2)
  })

  it('renders with jsdom + React Testing Library', () => {
    render(<p>hello</p>)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
})