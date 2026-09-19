// @vitest-environment jsdom
import type { GlobalStandardProps } from '@deepseek-ai/dsh-client-ui-slots'
import { useSyncExternalStore } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import { PendingQuestion, type QuestionComposerProps } from '../src/client/contract/slots.ts'
import { createQuestionDraftStore } from '../src/client/draft-store.ts'
import { QuestionComposer, parseRecommendedLabel } from '../src/client/QuestionComposer.tsx'
import { en, ar } from '../src/client/locales.ts'
import { en as commonEn } from '@deepseek-ai/dsh-client-locale/src/locales/en.ts'
import { ar as commonAr } from '@deepseek-ai/dsh-client-locale/src/locales/ar.ts'

// Every session-scope fixture carries the resource hook the resources plugin merges into GlobalStandardProps.
const useResource = (() => ({ status: 'none' as const, value: undefined, failure: undefined, reload: () => {} })) as GlobalStandardProps['useResource']
const usePanelInfo: GlobalStandardProps['usePanelInfo'] = selector => selector({ activePanelId: null })

afterEach(cleanup)


const SID = 's1' as SessionId

const seatOver = (dict: Record<string, string>, common: Record<string, string>): QuestionComposerProps['t'] =>
  (key => dict[key] ?? common[key] ?? key)

type SessionState = Parameters<Parameters<QuestionComposerProps['useSession']>[0]>[0]
type ConversationState = Parameters<Parameters<QuestionComposerProps['useConversation']>[0]>[0]
type ChatState = Parameters<Parameters<QuestionComposerProps['useChat']>[0]>[0]
type TrajectoryState = Parameters<Parameters<QuestionComposerProps['useTrajectory']>[0]>[0]
type InputState = Parameters<Parameters<QuestionComposerProps['useInput']>[0]>[0]
type AttentionState = Parameters<Parameters<QuestionComposerProps['useSessionStatus']>[0]>[0]

const sessionState: SessionState = {
  sessionId: SID,
  pendingSubmissions: [],
  running: false,
  subagent: null,
  removed: false,
  openState: 'open',
  openError: null,
  hasMore: false,
  loadingOlder: false,
  promptError: null,
  blank: false,
  lastAgentError: null,
  promptAttempted: false,
  awaitingFirstTurn: false,
}
const sessionList = {
  ids: [SID],
  byId: { [SID]: { id: SID, displayTitle: 'Session', running: false, retainedBy: {}, blank: false, updatedAt: 0 } },
  phase: 'ready' as const,
  subagentsByParent: {},
  jobsBySession: {},
}
const attentionState: AttentionState = new Map()
const workspaceState = {
  items: [],
  archivedSessionIds: [],
  state: 'idle' as const,
  phase: 'ready' as const,
  error: null,
}
const conversationState: ConversationState = {
  views: { get: () => undefined },
  activeTargets: new Set(),
}
const emptyKeys: readonly string[] = []
const emptyNodeSource = { getSnapshot: () => undefined, subscribe: () => () => {} }
const chatState: ChatState = {
  order: emptyKeys,
  nodes: {
    get: () => undefined,
    source: () => emptyNodeSource,
    processSource: () => emptyNodeSource,
    values: () => [],
  },
  locations: { getTurn: () => emptyKeys, getStep: () => emptyKeys },
  navigation: { items: () => [] },
  timeline: { turnOrder: [], turns: new Map() },
  legacy: {
    nodes: [],
    turnTimings: new Map(),
    turnEnds: new Map(),
    partial: null,
    runningCalls: [],
  },
}
const trajectoryState: TrajectoryState = {
  eventNodes: [],
  eventLocations: new Map(),
  requests: [],
  callSchemas: new Map(),
  partial: null,
  runningCalls: [],
}
const inputState: InputState = {
  draft: '',
  attachmentIds: [],
  draftRev: 0,
  phase: 'plain',
  occurrences: [],
  queue: [],
}

/** Framework standard-kit stubs: the composer consumes the locale and draft-store seats;
 *  the composed props type mandates delivery of the rest (framework hooks are
 *  plain stubs per the client testing discipline). */
const kitBase: Omit<QuestionComposerProps, 'matched' | 'useStore' | 'actions'> = {
  renderSlot: () => null,
  SessionProvider: ({ children }) => children,
  session: undefined,
  sessionId: SID,
  pendingInteraction: undefined,
  useSession: selector => selector(sessionState),
  useSessions: selector => selector(sessionList),
  usePanelInfo, useResource,
  useSessionStatus: selector => selector(attentionState),
  useSessionRetainInfo: () => undefined,
  useWorkspaces: selector => selector(workspaceState),
  useConversation: selector => selector(conversationState),
  useChat: selector => selector(chatState),
  useTrajectory: selector => selector(trajectoryState),
  useProjection: (() => undefined),
  useInput: selector => selector(inputState),
  inputActions: {
    setDraft: () => { throw new Error('unused') },
    addAttachments: () => { throw new Error('unused') },
    removeAttachment: () => { throw new Error('unused') },
    pruneAttachments: () => { throw new Error('unused') },
    submit: () => { throw new Error('unused') },
  },
  // The seat's key domain is question ∪ common.
  t: seatOver(ar, commonAr),
}

let kit: Omit<QuestionComposerProps, 'matched'>

beforeEach(() => {
  const instance = createQuestionDraftStore().create(SID)
  const useStore: QuestionComposerProps['useStore'] = selector => useSyncExternalStore(
    listener => instance.subscribe(listener),
    () => selector(instance.getSnapshot()),
    () => selector(instance.getSnapshot()),
  )
  kit = { ...kitBase, useStore, actions: instance.actions }
})

const QUESTIONS: PendingQuestion['questions'] = [
  {
    id: 'profile', header: 'انحراف جيد', question: 'اختيار مرشح شخص نوع',
    detail: 'حسب حالي فارغ نقص موقع موضع أولوية درجة اختيار.',
    options: [
      { label: 'عمل مسار سقوط أرض نوع (Recommended)', description: 'أولوية عمل مسار تسليم.' },
      { label: 'بحث بحث كامن قوة نوع', description: 'أولوية بحث بحث قدرة.' },
    ],
  },
  {
    id: 'detail', question: 'تكملة ملء أنت اشتراط',
  },
  {
    id: 'signals', question: 'اختيار إعادة يلزم إشارة (يمكن كثير اختيار)', multiSelect: true,
    options: [{ label: 'نظام تصميم' }, { label: 'شفرة جودة كمية' }, { label: 'منتج حكم قطع' }],
  },
]

/** Pending waterfall fixture with observable Client response methods. */
function wait(questions: PendingQuestion['questions'] = QUESTIONS) {
  const carrier = new PendingQuestion(SID, questions)
  const answer = vi.spyOn(carrier, 'answer')
  const cancel = vi.spyOn(carrier, 'cancel')
  void carrier.result.catch(() => {})
  return { carrier, answer, cancel }
}

const answerBatch = (answers: object[]) => ({ answers })

describe('QuestionComposer', () => {
  it('collects single, custom, and multi-select answers before one batch submit', () => {
    const { carrier, answer } = wait()
    render(<QuestionComposer matched={carrier} {...kit} />)

    expect(screen.getByText('انحراف جيد')).toBeTruthy()
    expect(screen.getByText('1 / 3')).toBeTruthy()
    expect(screen.getByText('دفع ترشيح')).toBeTruthy()
    expect(screen.getByText('عمل مسار سقوط أرض نوع')).toBeTruthy()
    const detail = screen.getByText('حسب حالي فارغ نقص موقع موضع أولوية درجة اختيار.')
    const scrollRegion = detail.closest('[data-question-scroll]')
    expect(scrollRegion).toBeTruthy()
    expect(scrollRegion?.contains(screen.getByRole('radio', { name: /عمل مسار سقوط أرض نوع/ }))).toBe(true)
    expect(scrollRegion?.contains(screen.getByText('تحت واحد عنوان').closest('button'))).toBe(false)
    fireEvent.keyDown(screen.getByRole('radio', { name: /عمل مسار سقوط أرض نوع/ }), { key: 'Enter' })
    expect(answer).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('radio', { name: /عمل مسار سقوط أرض نوع/ }))

    expect(screen.getByText('2 / 3')).toBeTruthy()
    // detail is per-question: the second question carries none.
    expect(screen.queryByText('حسب حالي فارغ نقص موقع موضع أولوية درجة اختيار.')).toBeNull()
    expect(screen.queryByRole('button', { name: 'ملء كتابة جواب سجل' })).toBeNull()
    const custom = screen.getByPlaceholderText('إدخال أنت جواب سجل')
    fireEvent.change(custom, { target: { value: 'يلزم قدرة مستقل ترتيب فحص خط فوق مشكلة' } })
    fireEvent.keyDown(custom, { key: 'Enter' })

    expect(screen.getByText('3 / 3')).toBeTruthy()
    // The model's question text renders verbatim — no marker filtering.
    expect(screen.getByText('اختيار إعادة يلزم إشارة (يمكن كثير اختيار)')).toBeTruthy()
    fireEvent.click(screen.getByRole('checkbox', { name: 'نظام تصميم' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'نظام تصميم' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'نظام تصميم' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'شفرة جودة كمية' }))
    const multiCustom = screen.getByPlaceholderText('إدخال أنت جواب سجل')
    fireEvent.change(multiCustom, { target: { value: 'خندق عبر قدرة' } })
    fireEvent.click(screen.getByRole('checkbox', { name: 'منتج حكم قطع' }))
    expect(screen.getByRole('checkbox', { name: 'نظام تصميم' }).getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('checkbox', { name: 'شفرة جودة كمية' }).getAttribute('aria-checked')).toBe('true')
    expect((multiCustom as HTMLInputElement).value).toBe('خندق عبر قدرة')
    fireEvent.keyDown(multiCustom, { key: 'Enter' })

    // The domain face encoded the whole batch into one carrier envelope.
    expect(answer).toHaveBeenCalledWith(answerBatch([
      { id: 'profile', selected: ['عمل مسار سقوط أرض نوع (Recommended)'] },
      { id: 'detail', selected: [], custom: 'يلزم قدرة مستقل ترتيب فحص خط فوق مشكلة' },
      { id: 'signals', selected: ['نظام تصميم', 'شفرة جودة كمية', 'منتج حكم قطع'], custom: 'خندق عبر قدرة' },
    ]))
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'صحيح في إيداع…' }).disabled).toBe(true)
  })

  it('renders plan detail through the shared assistant Markdown primitive', () => {
    const { carrier } = wait([{
      id: 'plan',
      question: 'دفعة دقيق هذا عدد حساب تخطيط هل؟',
      detail: '# فعلي تطبيق حساب تخطيط\n\n- **أولا تحقق**الآن حالة\n- تعديل `QuestionComposer`',
      options: [{ label: 'دفعة دقيق' }],
    }])
    const view = render(<QuestionComposer matched={carrier} {...kit} />)

    expect(screen.getByRole('heading', { level: 1, name: 'فعلي تطبيق حساب تخطيط' })).toBeTruthy()
    expect(view.container.querySelector('strong')?.textContent).toBe('أولا تحقق')
    expect(view.container.querySelector('code')?.textContent).toBe('QuestionComposer')
    expect(view.container.querySelectorAll('li')).toHaveLength(2)
  })

  it('skips individual questions without discarding earlier answers', () => {
    const { carrier, answer } = wait()
    render(<QuestionComposer matched={carrier} {...kit} />)

    expect((screen.getByText('تحت واحد عنوان').closest('button') as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole('radio', { name: 'بحث بحث كامن قوة نوع' }))
    expect(screen.getByText('2 / 3')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'قفز مرور' }))
    expect(screen.getByText('3 / 3')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'قفز مرور' }))

    expect(answer).toHaveBeenCalledWith(answerBatch([
      { id: 'profile', selected: ['بحث بحث كامن قوة نوع'] },
      { id: 'detail', selected: [] },
      { id: 'signals', selected: [] },
    ]))
  })

  it('keeps IME Enter inside the custom input until composition finishes', () => {
    const { carrier, answer } = wait()
    render(<QuestionComposer matched={carrier} {...kit} />)

    fireEvent.click(screen.getByRole('radio', { name: 'بحث بحث كامن قوة نوع' }))
    const custom = screen.getByPlaceholderText('إدخال أنت جواب سجل')
    fireEvent.change(custom, { target: { value: 'العربية إدخال' } })

    fireEvent.keyDown(custom, { key: 'Enter', isComposing: true })
    expect(screen.getByText('2 / 3')).toBeTruthy()
    expect(answer).not.toHaveBeenCalled()

    fireEvent.keyDown(custom, { key: 'Enter', keyCode: 229 })
    expect(screen.getByText('2 / 3')).toBeTruthy()
    expect(answer).not.toHaveBeenCalled()

    fireEvent.keyDown(custom, { key: 'Enter' })
    expect(screen.getByText('3 / 3')).toBeTruthy()
  })

  it('shows the inline custom input, reports missing answers, and supports pager navigation', () => {
    const { carrier, answer } = wait()
    render(<QuestionComposer matched={carrier} {...kit} />)

    expect(screen.getByPlaceholderText('إدخال أنت جواب سجل')).toBeTruthy()
    fireEvent.click(screen.getByRole('radio', { name: 'عمل مسار سقوط أرض نوع' }))
    const emptyCustom = screen.getByPlaceholderText('إدخال أنت جواب سجل')
    fireEvent.keyDown(emptyCustom, { key: 'Enter', shiftKey: true })
    expect(screen.getByText('2 / 3')).toBeTruthy()
    fireEvent.keyDown(emptyCustom, { key: 'Enter' })
    expect(screen.getByText('طلب اختيار واحد خيار أو ملء كتابة ذاتي تعريف جواب سجل.')).toBeTruthy()

    fireEvent.click(screen.getByLabelText('تحت واحد عنوان'))
    fireEvent.click(screen.getByRole('checkbox', { name: 'منتج حكم قطع' }))
    fireEvent.click(screen.getByRole('button', { name: 'إيداع' }))
    expect(screen.getByText('طلب أولا إتمام هذا طريق مشكلة.')).toBeTruthy()
    expect(screen.getByText('2 / 3')).toBeTruthy()
    fireEvent.click(screen.getByLabelText('فوق واحد عنوان'))
    expect(screen.getByText('1 / 3')).toBeTruthy()
    expect(answer).not.toHaveBeenCalled()
  })

  it('answers over multiple lines: both fields grow with the draft and keep Shift+Enter a newline', () => {
    const { carrier, answer } = wait()
    render(<QuestionComposer matched={carrier} {...kit} />)

    // Both question shapes answer into a textarea, so the engine soft-wraps a
    // long answer and Shift+Enter breaks the line natively.
    const inline = screen.getByPlaceholderText('إدخال أنت جواب سجل')
    expect(inline.tagName).toBe('TEXTAREA')

    const multiline = 'رقم واحد سطر\nثاني سطر'
    fireEvent.change(inline, { target: { value: multiline } })
    // The hidden height ruler carries the draft plus the trailing newline the
    // textarea's own last line needs, so the box is as tall as the answer.
    expect(inline.previousElementSibling?.textContent).toBe(`${multiline}\n`)
    // Shift+Enter belongs to the field, never to the flow.
    fireEvent.keyDown(inline, { key: 'Enter', shiftKey: true })
    expect(screen.getByText('1 / 3')).toBeTruthy()

    fireEvent.keyDown(inline, { key: 'Enter' })
    const optionless = screen.getByPlaceholderText('إدخال أنت جواب سجل')
    expect(optionless.tagName).toBe('TEXTAREA')
    fireEvent.change(optionless, { target: { value: multiline } })
    expect(optionless.previousElementSibling?.textContent).toBe(`${multiline}\n`)
    fireEvent.keyDown(optionless, { key: 'Enter', shiftKey: true })
    expect(screen.getByText('2 / 3')).toBeTruthy()

    fireEvent.keyDown(optionless, { key: 'Enter' })
    fireEvent.click(screen.getByRole('checkbox', { name: 'نظام تصميم' }))
    fireEvent.click(screen.getByRole('button', { name: 'إيداع' }))
    // Line breaks reach the model verbatim: nothing along the way flattens them.
    expect(answer).toHaveBeenCalledWith(answerBatch([
      { id: 'profile', selected: [], custom: multiline },
      { id: 'detail', selected: [], custom: multiline },
      { id: 'signals', selected: ['نظام تصميم'] },
    ]))
  })

  it('surfaces cancellation failures and re-arms the controls', async () => {
    const { carrier, cancel } = wait()
    cancel
      .mockRejectedValueOnce(new Error('رقم مرة إلغاء فشل'))
      .mockRejectedValueOnce(new Error('ثاني مرة إلغاء فشل'))
    render(<QuestionComposer matched={carrier} {...kit} />)

    fireEvent.click(screen.getByRole('button', { name: 'وضع ترك كامل مجموعة مشكلة' }))
    expect(await screen.findByText('رقم مرة إلغاء فشل')).toBeTruthy()
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'قفز مرور' }).disabled).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: 'وضع ترك كامل مجموعة مشكلة' }))
    expect(await screen.findByText('ثاني مرة إلغاء فشل')).toBeTruthy()
  })

  it('surfaces answer rejection and resets local drafts for a different request', async () => {
    const first = wait()
    const view = render(<QuestionComposer matched={first.carrier} {...kit} />)

    fireEvent.click(screen.getByRole('radio', { name: /بحث بحث كامن قوة نوع/ }))
    expect(screen.getByText('2 / 3')).toBeTruthy()
    const second = wait()
    second.answer
      .mockRejectedValueOnce(new Error('شبكة شبكة في قطع'))
      .mockRejectedValueOnce('نص خطأ')
    view.rerender(<QuestionComposer matched={second.carrier} {...kit} />)
    expect(screen.getByRole('radio', { name: /بحث بحث كامن قوة نوع/ }).getAttribute('aria-checked')).toBe('false')

    fireEvent.click(screen.getByRole('radio', { name: /عمل مسار سقوط أرض نوع/ }))
    const custom = screen.getByPlaceholderText('إدخال أنت جواب سجل')
    fireEvent.change(custom, { target: { value: 'x' } })
    fireEvent.keyDown(custom, { key: 'Enter' })
    fireEvent.click(screen.getByRole('checkbox', { name: 'نظام تصميم' }))
    fireEvent.click(screen.getByRole('button', { name: 'إيداع' }))
    expect(second.answer).toHaveBeenNthCalledWith(1, answerBatch([
      { id: 'profile', selected: ['عمل مسار سقوط أرض نوع (Recommended)'] },
      { id: 'detail', selected: [], custom: 'x' },
      { id: 'signals', selected: ['نظام تصميم'] },
    ]))
    expect(await screen.findByText('شبكة شبكة في قطع')).toBeTruthy()
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'إيداع' }).disabled).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: 'إيداع' }))
    expect(await screen.findByText('نص خطأ')).toBeTruthy()
  })

  it('renders chrome copy through the English dictionary', () => {
    const { carrier } = wait([{ id: 'detail', question: 'تكملة ملء أنت اشتراط' }])
    render(<QuestionComposer matched={carrier} {...kit} t={seatOver(en, commonEn)} />)
    expect(screen.getByLabelText('Dismiss all questions')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Skip' })).toBeTruthy()
    expect(screen.getByPlaceholderText('Type your answer')).toBeTruthy()
  })

  it('restores the current page and drafts after the strict Session entry remounts', () => {
    const pending = wait()
    const view = render(<QuestionComposer matched={pending.carrier} {...kit} />)
    fireEvent.click(screen.getByRole('radio', { name: /بحث بحث كامن قوة نوع/ }))
    const custom = screen.getByPlaceholderText('إدخال أنت جواب سجل')
    fireEvent.change(custom, { target: { value: 'إبقاء هذا مقطع مسودة مسودة' } })
    expect(screen.getByText('2 / 3')).toBeTruthy()

    view.unmount()
    render(<QuestionComposer matched={pending.carrier} {...kit} />)

    expect(screen.getByText('2 / 3')).toBeTruthy()
    expect(screen.getByPlaceholderText<HTMLTextAreaElement>('إدخال أنت جواب سجل').value).toBe('إبقاء هذا مقطع مسودة مسودة')
    fireEvent.click(screen.getByLabelText('فوق واحد عنوان'))
    expect(screen.getByRole('radio', { name: /بحث بحث كامن قوة نوع/ }).getAttribute('aria-checked')).toBe('true')
  })
})

describe('PendingQuestion domain face', () => {
  it('resolves the waterfall result with the answer batch and settles once', async () => {
    const question = new PendingQuestion(SID, QUESTIONS)
    const batch = { answers: [{ id: 'mode', selected: ['Fast'] }] }
    await expect(question.answer(batch)).resolves.toBeUndefined()
    await expect(question.result).resolves.toBe(batch)
    await expect(question.answer(batch)).rejects.toThrow(/already settled/)
  })

  it('rejects the waterfall result with ASK_CANCELLED and settles once', async () => {
    const question = new PendingQuestion(SID, QUESTIONS)
    const result = question.result.catch((error: unknown) => error)
    await expect(question.cancel()).resolves.toBeUndefined()
    await expect(result).resolves.toMatchObject({
      name: 'UserQuestionError',
      code: 'ASK_CANCELLED',
      message: 'the user cancelled ask_user_question',
    })
    await expect(question.cancel()).rejects.toThrow(/already settled/)
  })

  it('exposes its Client render identity and scoped request values', () => {
    const question = new PendingQuestion(SID, QUESTIONS)
    expect(question.key).toMatch(/^question:\d+$/)
    expect(question.sessionId).toBe(SID)
    expect(question.questions).toBe(QUESTIONS)
  })

  it('collapses the card to the header strip and expands it back', () => {
    const { carrier } = wait()
    render(<QuestionComposer matched={carrier} {...kit} />)
    // Expanded: the option list is visible.
    expect(screen.getByRole('radiogroup')).toBeTruthy()
    // Collapse: options leave the tree; the title and minimize toggle stay.
    fireEvent.click(screen.getByLabelText(ar['nav.minimize']))
    expect(screen.queryByRole('radiogroup')).toBeNull()
    expect(screen.getByText('اختيار مرشح شخص نوع')).toBeTruthy()
    // Expand: the options return (the toggle label flips while collapsed).
    fireEvent.click(screen.getByLabelText(ar['nav.maximize']))
    expect(screen.getByRole('radiogroup')).toBeTruthy()
    // Expanded again: the toggle reports expanded and the option list is back.
    expect(screen.getByLabelText(ar['nav.minimize']).getAttribute('aria-expanded')).toBe('true')
  })

  it('keeps the collapse toggle out of the cancel path and preserves drafts across collapse', () => {
    const { carrier, answer } = wait()
    render(<QuestionComposer matched={carrier} {...kit} />)
    fireEvent.click(screen.getByRole('radio', { name: /عمل مسار سقوط أرض نوع/ }))
    // Single-select auto-advances to the second question; collapse and expand
    // must not lose either the picked option or the current position.
    fireEvent.click(screen.getByLabelText(ar['nav.minimize']))
    fireEvent.click(screen.getByLabelText(ar['nav.maximize']))
    const custom = screen.getByPlaceholderText(ar['custom.placeholder'])
    fireEvent.change(custom, { target: { value: 'يلزم قدرة مستقل ترتيب فحص خط فوق مشكلة' } })
    // Re-expanding must not steal focus back into the textarea: it was
    // autofocused on first presentation, so focus stays on the expand toggle.
    expect(document.activeElement).not.toBe(custom)
    fireEvent.click(screen.getByLabelText('تحت واحد عنوان'))
    fireEvent.click(screen.getByRole('checkbox', { name: 'نظام تصميم' }))
    fireEvent.click(screen.getByRole('button', { name: 'إيداع' }))
    expect(answer).toHaveBeenCalledWith(answerBatch([
      { id: 'profile', selected: ['عمل مسار سقوط أرض نوع (Recommended)'] },
      { id: 'detail', custom: 'يلزم قدرة مستقل ترتيب فحص خط فوق مشكلة', selected: [] },
      { id: 'signals', selected: ['نظام تصميم'] },
    ]))
  })
})

describe('parseRecommendedLabel', () => {
  it('recognizes English and Arabic suffixes without changing ordinary labels', () => {
    expect(parseRecommendedLabel('Fast (Recommended)')).toEqual({ label: 'Fast', recommended: true })
    expect(parseRecommendedLabel('مستقر ملائم (دفع ترشيح)')).toEqual({ label: 'مستقر ملائم', recommended: true })
    expect(parseRecommendedLabel('مستقر ملائم (دفع ترشيح)')).toEqual({ label: 'مستقر ملائم', recommended: true })
    expect(parseRecommendedLabel('Plain')).toEqual({ label: 'Plain', recommended: false })
  })
})
