// @vitest-environment jsdom
/**
 * Todo display acceptance: the TodoPanel plan strip (empty-hidden, status rows
 * including several `in_progress` at once, collapse), and its TodoDock
 * adapter (selects the plan off the session snapshot and follows changes).
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { bindSnapshotSelector, makeTranslate } from '@deepseek-ai/dsh-client-test-runtime'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { TodoItem } from '@deepseek-ai/dsh-tool-todo/client'
import { ar as commonAr } from '@deepseek-ai/dsh-client-locale/src/locales/ar.ts'
import type { TodoDockProps } from '../src/client/skeleton/TodoPanel.tsx'
import { TodoDock, TodoPanel, todoDockEntry } from '../src/client/skeleton/TodoPanel.tsx'
import { NS, ar } from '../src/client/locales.ts'

const t: TodoDockProps['t'] = makeTranslate(ar, commonAr)

afterEach(cleanup)

const LIST: TodoItem[] = [
  { content: 'تركيب هيكل هيكل', status: 'completed' },
  { content: 'كتابة مكون', status: 'in_progress' },
  { content: 'تكملة اختبار', status: 'pending' },
]

/** A parallel plan: three tasks running at once (concurrent subagents). */
const PARALLEL: TodoItem[] = [
  { content: 'تركيب هيكل هيكل', status: 'completed' },
  { content: 'كتابة مكون', status: 'in_progress' },
  { content: 'ركض خلفية بناء', status: 'in_progress' },
  { content: 'قراءة شفرة المصدر', status: 'in_progress' },
  { content: 'تكملة اختبار', status: 'pending' },
]

describe('TodoPanel', () => {
  it('renders nothing while the list is empty', () => {
    const { container } = render(<TodoPanel todos={[]} t={t} />)
    expect(container.innerHTML).toBe('')
  })

  it('starts collapsed with the per-status count summary visible', () => {
    render(<TodoPanel todos={LIST} t={t} />)
    expect(screen.getByTestId('todo-panel')).toBeTruthy()
    expect(screen.getByText('مهمة')).toBeTruthy()
    expect(screen.getByText('1 قد إتمام · 1 إجراء في · 1 انتظار معالجة')).toBeTruthy()
    expect(screen.getByRole('button', { expanded: false })).toBeTruthy()
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('omits the completed segment while nothing is done yet', () => {
    render(<TodoPanel todos={[
      { content: 'كتابة مكون', status: 'in_progress' },
      { content: 'تكملة اختبار', status: 'pending' },
    ]} t={t} />)
    expect(screen.getByText('1 إجراء في · 1 انتظار معالجة')).toBeTruthy()
    expect(screen.queryByText(/قد إتمام/)).toBeNull()
  })

  it('expands to show one row per item with its status glyph', () => {
    render(<TodoPanel todos={LIST} t={t} />)
    fireEvent.click(screen.getByRole('button', { expanded: false }))
    const items = screen.getAllByRole('listitem')
    expect(items.map(li => li.getAttribute('data-status'))).toEqual(['completed', 'in_progress', 'pending'])
    expect(screen.getByText('تركيب هيكل هيكل')).toBeTruthy()
    expect(screen.getByText('كتابة مكون')).toBeTruthy()
    // Each status row carries an SVG glyph (not a text bullet).
    expect(items.every(li => li.querySelector('svg') !== null)).toBe(true)
  })

  it('collapse hides an expanded list; expand restores; header keeps the count summary', () => {
    render(<TodoPanel todos={LIST} t={t} />)
    fireEvent.click(screen.getByRole('button', { expanded: false }))
    const header = screen.getByRole('button', { expanded: true })
    fireEvent.click(header)
    expect(screen.queryByRole('list')).toBeNull()
    // Collapsed header is title + progress only (no in-progress content hint).
    expect(screen.getByText('1 قد إتمام · 1 إجراء في · 1 انتظار معالجة')).toBeTruthy()
    expect(screen.queryByText('كتابة مكون')).toBeNull()
    fireEvent.click(screen.getByRole('button', { expanded: false }))
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('marks every parallel active item, and counts them all in the header', () => {
    render(<TodoPanel todos={PARALLEL} t={t} />)
    fireEvent.click(screen.getByRole('button', { expanded: false }))
    // An unconditional in-progress cap would make this list unreachable: three
    // items carry the in-progress glyph at once, and the header counts all three.
    const statuses = screen.getAllByRole('listitem').map(li => li.getAttribute('data-status'))
    expect(statuses.filter(s => s === 'in_progress')).toHaveLength(3)
    expect(screen.getByText('ركض خلفية بناء')).toBeTruthy()
    expect(screen.getByText('قراءة شفرة المصدر')).toBeTruthy()
    expect(screen.getByText('1 قد إتمام · 3 إجراء في · 1 انتظار معالجة')).toBeTruthy()
  })

  it('an all-completed list collapses the summary to the done count alone', () => {
    render(<TodoPanel todos={[{ content: 'كل تمام', status: 'completed' }]} t={t} />)
    expect(screen.getByRole('button', { expanded: false })).toBeTruthy()
    expect(screen.queryByText('كل تمام')).toBeNull()
    expect(screen.getByText('1 قد إتمام')).toBeTruthy()
    expect(screen.queryByText(/إجراء في|انتظار معالجة/)).toBeNull()
  })
})

/** Dock props stub: the adapter reads the 'todos' projection only; the rest of the owner share is unused. */
function dockProps(store: ReturnType<typeof createSnapshotStore<{ value: readonly TodoItem[] | null | undefined }>>): TodoDockProps {
  const useProjection = (_key: string, selector?: (v: unknown) => unknown) =>
    bindSnapshotSelector(store)(s => (selector ?? (v => v))(s.value))
  return { useProjection, t } as unknown as TodoDockProps
}

describe('TodoDock', () => {
  it('reads the host-computed todos projection and follows pushed updates', () => {
    const store = createSnapshotStore<{ value: readonly TodoItem[] | null | undefined }>({ value: undefined })
    render(<TodoDock {...dockProps(store)} />)
    // Capability absent (no baseline/frame yet) renders nothing.
    expect(screen.queryByTestId('todo-panel')).toBeNull()
    act(() => { store.set({ value: LIST }) })
    expect(screen.getByText('1 قد إتمام · 1 إجراء في · 1 انتظار معالجة')).toBeTruthy()
    // The pre-first-write whole value (null) retires the strip (the panel owns no data).
    act(() => { store.set({ value: null }) })
    expect(screen.queryByTestId('todo-panel')).toBeNull()
  })

  it('registers before the goal and queue entries', () => {
    expect(todoDockEntry.name).toBe('conversation-todo-dock')
    expect(todoDockEntry.inject).toEqual(['slots'])
    const register = vi.fn(() => () => undefined)
    const inject = vi.fn((_name: string, callback: () => () => void) => callback())
    todoDockEntry.apply({ slots: { inject, register } } as never)
    expect(inject).toHaveBeenCalledWith('conversation.input.dock', expect.any(Function))
    expect(register).toHaveBeenCalledWith({ name: 'conversation.input.dock', id: 'todo', order: 0, locale: NS }, TodoDock)
  })
})
