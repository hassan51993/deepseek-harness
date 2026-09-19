// @vitest-environment jsdom
/**
 * Inline projection of sent user text: decoration never breaks a single-line
 * message (bubble regression), and wire session forms fold to their label
 * (queue-row readability).
 */
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { projectUserText } from '../src/user-text.tsx'

const project = (
  text: string,
  labels: readonly string[] = [],
  slashNames: readonly string[] = [],
  slashKind: 'skill' | 'command' = 'skill',
) =>
  render(<div data-host>{projectUserText(text, labels, slashNames, slashKind)}</div>).container.querySelector('[data-host]')!

describe('projectUserText', () => {
  it('keeps a decorated single-line message on one line: every part is inline', () => {
    const host = project('عكس عكس تكرار تكرار /dsh-acp-test @تنفيذ بضعة عدد أمر اختبار', ['تنفيذ بضعة عدد أمر اختبار'], ['dsh-acp-test'])
    expect(host.querySelectorAll('div').length).toBe(0)
    expect(host.textContent).toBe('عكس عكس تكرار تكرار /dsh-acp-test تنفيذ بضعة عدد أمر اختبار')
    const chips = host.querySelectorAll('[data-ref-chip]')
    expect([...chips].map(c => c.getAttribute('data-ref-chip'))).toEqual(['skill', 'session'])
    // The whitespace between tokens survives as its own inline run.
    const runs = [...host.querySelectorAll('span')].filter(s => !s.hasAttribute('data-ref-chip') && s.closest('[data-ref-chip]') === null)
    expect(runs.map(r => r.textContent)).toEqual(['عكس عكس تكرار تكرار ', ' '])
  })

  it('folds the wire session form to its label with the session glyph', () => {
    const host = project('نظر نظر @[عرض و قسم تحليل صورة](dsh-session:InNlc3Npb24tNDM0) ربط نقاش')
    const chip = host.querySelector('[data-ref-chip="session"]')!
    expect(chip.textContent).toBe('عرض و قسم تحليل صورة')
    expect(chip.getAttribute('title')).toBe('@[عرض و قسم تحليل صورة](dsh-session:InNlc3Npb24tNDM0)')
    expect(chip.querySelector('svg')).not.toBeNull()
    expect(host.textContent).toBe('نظر نظر عرض و قسم تحليل صورة ربط نقاش')
  })

  it('prefers the wire fold over the bare-token scan on the same range', () => {
    const host = project('@[a](dsh-session:x)', [])
    expect(host.querySelectorAll('[data-ref-chip]').length).toBe(1)
    expect(host.querySelector('[data-ref-chip="session"]')!.textContent).toBe('a')
  })

  it('decorates recall-associated labels, files, folders, and quoted paths', () => {
    const host = project('@الجلسات واحد قول @src/deep/file.txt و @dir/ و @"a b.md"', ['الجلسات واحد'])
    const kinds = [...host.querySelectorAll('[data-ref-chip]')].map(c =>
      [c.getAttribute('data-ref-chip'), c.textContent])
    expect(kinds).toEqual([
      ['session', 'الجلسات واحد'],
      ['file', 'file.txt'],
      ['folder', 'dir'],
      ['file', 'a b.md'],
    ])
  })

  it('repeated recall labels decorate every occurrence once', () => {
    const host = project('@مجددا نظر قبل حال @مجددا نظر', ['مجددا نظر', 'مجددا نظر'])
    expect(host.querySelectorAll('[data-ref-chip="session"]').length).toBe(2)
  })

  it('keeps a punctuation-glued slash token plain and skips degenerate tokens', () => {
    // The host skill gesture ends at whitespace or the text end, so `/plan.`
    // never loads a skill; the bubble must not suggest otherwise.
    const host = project('استخدام /plan. تجربة تجربة @.', [], ['plan'])
    expect(host.querySelectorAll('[data-ref-chip]').length).toBe(0)
    expect(host.textContent).toBe('استخدام /plan. تجربة تجربة @.')
  })

  it('decorates a slash token only when the host resolved it as a skill in that step', () => {
    const bare = project('/123')
    expect(bare.querySelectorAll('[data-ref-chip]').length).toBe(0)
    expect(bare.textContent).toBe('/123')
    const unresolved = project('استخدام /plan نظر نظر')
    expect(unresolved.querySelectorAll('[data-ref-chip]').length).toBe(0)
    const resolved = project('استخدام /plan نظر نظر', [], ['plan'])
    expect([...resolved.querySelectorAll('[data-ref-chip]')].map(c => [c.getAttribute('data-ref-chip'), c.textContent]))
      .toEqual([['skill', '/plan']])
  })

  it('marks a resolved slash token as a command chip when the caller says so', () => {
    const host = project('/goal ship it\nsecond line', [], ['goal'], 'command')
    const chips = [...host.querySelectorAll('[data-ref-chip]')]
    expect(chips.map(c => [c.getAttribute('data-ref-chip'), c.textContent])).toEqual([['command', '/goal']])
    expect(host.textContent).toBe('/goal ship it\nsecond line')
  })

  it('leaves slash paths undecorated even for a resolved name: a /name token ends at whitespace', () => {
    const text = 'اختبار واحد تحتui، لا استخدام إدارة أنا:\n/nfs-hg/xxx/yyy و /root-dir/ و /plan.md'
    const host = project(text, [], ['nfs-hg', 'root-dir', 'plan'])
    expect(host.querySelectorAll('[data-ref-chip]').length).toBe(0)
    expect(host.textContent).toBe(text)
  })

  it('prefers the longer recall label when one nests inside another', () => {
    const host = project('@الجلسات واحد استلام ذيل', ['الجلسات', 'الجلسات واحد'])
    const chips = [...host.querySelectorAll('[data-ref-chip="session"]')]
    expect(chips.map(c => c.textContent)).toEqual(['الجلسات واحد'])
    expect(host.textContent).toBe('الجلسات واحد استلام ذيل')
  })

  it('falls back to the raw quoted label when the path has no basename', () => {
    const host = project('نظر @"/" تحت وجه')
    const chip = host.querySelector('[data-ref-chip="folder"]')!
    expect(chip.textContent).toBe('"/"')
  })

  it('opens decoded files and loaded skills without activating session, folder, or command references', () => {
    const openFile = vi.fn()
    const openSkill = vi.fn()
    const view = render(<div>{projectUserText(
      '@src/a.ts @"notes a.md" /review @history @dir/ @"dir a/"', ['history'], ['review'], 'skill',
      { openFile, openSkill },
    )}</div>)
    fireEvent.click(view.getByRole('button', { name: 'a.ts' }))
    fireEvent.click(view.getByRole('button', { name: 'notes a.md' }))
    fireEvent.click(view.getByRole('button', { name: '/review' }))
    expect(openFile.mock.calls).toEqual([['src/a.ts'], ['notes a.md']])
    expect(openSkill).toHaveBeenCalledWith('review')
    expect(view.container.querySelectorAll('button')).toHaveLength(3)
    const command = render(<div>{projectUserText('/help', [], ['help'], 'command', { openFile, openSkill })}</div>)
    expect(command.container.querySelector('button')).toBeNull()
  })

  it('preserves text-selection gestures and keyboard activation', () => {
    const openFile = vi.fn()
    const view = render(<div>{projectUserText('@notes.md', [], [], 'skill', { openFile, openSkill: vi.fn() })}</div>)
    const button = view.getByRole('button', { name: 'notes.md' })
    const selection = document.getSelection()!
    const range = document.createRange()
    range.selectNodeContents(button)
    selection.addRange(range)
    fireEvent.click(button, { detail: 1 })
    expect(openFile).not.toHaveBeenCalled()
    fireEvent.click(button, { detail: 0 })
    expect(openFile).toHaveBeenCalledWith('notes.md')
    selection.removeAllRanges()
    openFile.mockClear()
    fireEvent.click(button, { detail: 2 })
    expect(openFile).not.toHaveBeenCalled()
  })

  it('renders undecorated text as one inline run', () => {
    const host = project('نص عادي، بلا مرجع')
    expect(host.querySelectorAll('div').length).toBe(0)
    expect(host.querySelectorAll('[data-ref-chip]').length).toBe(0)
    expect(host.textContent).toBe('نص عادي، بلا مرجع')
  })
})
