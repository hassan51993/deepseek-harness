// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { DropOverlay } from '../src/DropOverlay.tsx'

afterEach(cleanup)

describe('DropOverlay', () => {
  it('portals the invitation with its title and limits desc to the body', () => {
    const view = render(
      <DropOverlay disabled={false} labels={{ title: 'صورة سحب حركة إلى هذا موضع يكفي إضافة', desc: 'الالمزيد 20 ورقة، كل ورقة 5MB' }} />,
    )
    const overlay = view.getByRole('status')
    expect(overlay.parentElement).toBe(document.body)
    expect(overlay.textContent).toContain('صورة سحب حركة إلى هذا موضع يكفي إضافة')
    expect(overlay.textContent).toContain('الالمزيد 20 ورقة، كل ورقة 5MB')
  })

  it('omits the desc line when none is resolved', () => {
    const view = render(<DropOverlay disabled={false} labels={{ title: 'صورة سحب حركة إلى هذا موضع يكفي إضافة' }} />)
    expect(view.getByRole('status').textContent).toBe('صورة سحب حركة إلى هذا موضع يكفي إضافة')
  })

  it('drops the desc and switches the illustration while disabled', () => {
    const enabled = render(
      <DropOverlay disabled={false} labels={{ title: 'سحب دخول', desc: 'حد' }} />,
    )
    const enabledSvg = enabled.getByRole('status').querySelector('svg')!.innerHTML
    enabled.unmount()
    const disabled = render(
      <DropOverlay disabled labels={{ title: 'حالي لا يمكن إضافة صورة', desc: 'حد' }} />,
    )
    const overlay = disabled.getByRole('status')
    expect(overlay.textContent).toBe('حالي لا يمكن إضافة صورة')
    expect(overlay.querySelector('svg')!.innerHTML).not.toBe(enabledSvg)
  })
})
