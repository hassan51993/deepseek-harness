/**
 * Local submission echoes: synchronous insertion, observed/failed retirement,
 * and settlement callbacks. Prompts and the follow stream cross the assembled
 * Gateway client and are answered by endpoint name.
 */

import { afterEach, describe, expect, vi } from 'vitest'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import type { FileAttachmentRef, ImageAttachmentRef } from '@deepseek-ai/dsh-attachment'
import { SessionSeq, type SessionEvent } from '@deepseek-ai/dsh-session/types'
import type { SessionId } from '@deepseek-ai/dsh-api-remotes/client'
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol'
import { createClientTest, webApp } from '@deepseek-ai/dsh-client-test-runtime/src/assembly/index.ts'
import type { PendingSubmissionRetirement } from '../src/client/contract/session.ts'
import type { SessionRequestId } from '../src/types.ts'
import { sessionBench } from './remote/bench.client.ts'
import {
  FOLLOW, err, fileRef, followScript, history, imageRef, pushEvent,
} from './remote/session.client.ts'

/** A Session talks through the Gateway client; its dependency cone is the Typert registry and the Connection. */
const API_ROSTER = webApp.closure(['@deepseek-ai/dsh-api-gateway'])
const it = createClientTest({ roster: API_ROSTER })
const SID = 'fk-s1' as SessionId
/** The first client boot pays the cold module transform of the api cone. */
const COLD_BOOT_TIMEOUT_MS = 60_000

afterEach(() => {
  vi.unstubAllGlobals()
})

type AttachmentRef = ImageAttachmentRef | FileAttachmentRef

function attachmentBlock(attachment: AttachmentRef) {
  return 'mediaType' in attachment
    ? { type: 'image' as const, attachment }
    : { type: 'file' as const, attachment }
}

/** A durable browser-prompt user/message whose source echoes `rpcId`. */
function promptEvent(seq: SessionSeq, rpcId: SessionRequestId, refs: readonly AttachmentRef[] = []): SessionEvent {
  return {
    seq,
    time: 1_700_000_000_000 + seq,
    type: 'user/message',
    surfaceOp: 'append',
    data: createUserMessage({
      content: [
        ...refs.map(attachmentBlock),
        { type: 'text' as const, text: 'إرسال' },
      ],
      source: { kind: 'user', rpcId },
    }),
  } as unknown as SessionEvent
}

function queuedItem(rpcId: SessionRequestId, refs: readonly AttachmentRef[] = []) {
  return createUserMessage({
    source: { kind: 'user', rpcId },
    content: refs.map(attachmentBlock),
  })
}

/** Let the frame-delayed retirement (setTimeout fallback in this node environment) run. */
async function settleFrames(): Promise<void> {
  await Promise.resolve()
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('beginSubmission', () => {
  it('inserts the echo synchronously and flips the engaging edge before any prompt call', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    expect(session.getSnapshot()).toMatchObject({ pendingSubmissions: [], promptAttempted: false })
    const handle = session.beginSubmission({
      mode: 'queue',
      text: 'أنت جيد',
      attachments: [{
        type: 'image', value: { previewUrl: 'blob:p1', name: 'a.png', width: 4, height: 3 },
      }],
    })
    expect(session.getSnapshot().promptAttempted).toBe(true)
    expect(session.getSnapshot().pendingSubmissions).toMatchObject([{
      requestId: handle.requestId,
      placement: 'transcript',
      text: 'أنت جيد',
      attachments: [{
        type: 'image', value: { previewUrl: 'blob:p1', name: 'a.png', width: 4, height: 3 },
      }],
    }])
    expect(mock.log.requests()).toEqual([])
  }, COLD_BOOT_TIMEOUT_MS)

  it('derives and captures the echo placement from running state and delivery mode', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    session.beginSubmission({ mode: 'queue', text: 'خامل', attachments: [] })
    session.handleRunning(true)
    session.beginSubmission({ mode: 'queue', text: 'ترتيب طابور', attachments: [] })
    session.beginSubmission({ mode: 'steer', text: 'تصحيح انحراف', attachments: [] })
    session.handleRunning(false)
    expect(session.getSnapshot().pendingSubmissions.map(({ text, placement }) => ({ text, placement }))).toEqual([
      { text: 'خامل', placement: 'transcript' },
      { text: 'ترتيب طابور', placement: 'queued' },
      { text: 'تصحيح انحراف', placement: 'steering' },
    ])
  })

  it('abandon retires the echo as failed exactly once', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    const retirements: PendingSubmissionRetirement[] = []
    const handle = session.beginSubmission({
      mode: 'queue',
      text: 'وضع ترك',
      attachments: [],
      onRetire: retirement => retirements.push(retirement),
    })
    handle.abandon()
    handle.abandon()
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
    expect(retirements).toEqual([{ reason: 'failed' }])
  })
})

describe('prompt-coupled retirement', () => {
  it('a rejected identified prompt retires its echo immediately alongside promptError', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    mock.remote.session.prompt.mockResolvedValue(err(new RemoteError('session/agent-busy', 'مشغول', { reason: 'busy' })))
    const retirements: PendingSubmissionRetirement[] = []
    const handle = session.beginSubmission({
      mode: 'queue',
      text: 'فشل',
      attachments: [],
      onRetire: retirement => retirements.push(retirement),
    })
    const result = await session.prompt([{ type: 'text', text: 'فشل' }], 'queue', undefined, handle.requestId)
    expect(result.ok).toBe(false)
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
    expect(session.getSnapshot().promptError).toMatchObject({ op: 'send', error: { code: 'session/agent-busy' } })
    expect(retirements).toEqual([{ reason: 'failed' }])
  })

  it('sends the echo identity as the prompt requestId', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    const handle = session.beginSubmission({ mode: 'queue', text: 'حمل id', attachments: [] })
    await session.prompt([{ type: 'text', text: 'حمل id' }], 'queue', undefined, handle.requestId)
    expect(mock.log.requests('session/prompt')).toMatchObject([{ requestId: handle.requestId, sessionId: SID }])
  })

  it('an unidentified prompt failure leaves registered echoes alone', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    mock.remote.session.prompt.mockResolvedValue(err(new RemoteError('session/agent-busy', 'مشغول', { reason: 'busy' })))
    session.beginSubmission({ mode: 'queue', text: 'أيضا في', attachments: [] })
    await session.prompt([{ type: 'text', text: 'آخر عدد' }], 'queue')
    expect(session.getSnapshot().pendingSubmissions).toHaveLength(1)
  })
})

describe('observed retirement', () => {
  it('a live durable event carrying the rpcId retires the echo one frame later with the admitted refs', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    await session.open()
    const retirements: PendingSubmissionRetirement[] = []
    const handle = session.beginSubmission({
      mode: 'queue',
      text: 'إرسال',
      attachments: [{ type: 'image', value: { previewUrl: 'blob:p1' } }],
      onRetire: retirement => retirements.push(retirement),
    })
    const refs = [imageRef('att-1')]
    await pushEvent(mock, promptEvent(SessionSeq(0), handle.requestId, refs))
    // Synchronously after the append the echo is still in the snapshot; the
    // render-time dedupe owns the overlap frame.
    expect(session.getSnapshot().pendingSubmissions).toHaveLength(1)
    await settleFrames()
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
    expect(retirements).toEqual([{ reason: 'observed', attachments: refs }])
  })

  it('retires an accepted echo when a claim clears the projection before its notification', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    await session.open()
    const onRetire = vi.fn()
    const handle = session.beginSubmission({ mode: 'steer', text: 'accepted', attachments: [], onRetire })
    const refs = [imageRef('claimed-image')]
    const message = queuedItem(handle.requestId, refs)
    session.projections.apply('inbox', { 'next-turn': [], 'next-step': [message] }, SessionSeq(0))
    session.projections.apply('inbox', { 'next-turn': [], 'next-step': [] }, SessionSeq(1))
    await pushEvent(mock, {
      type: 'agent/inbox/spliced', seq: SessionSeq(0), time: 1,
      data: { target: 'next-step', start: 0, inserted: [message] },
    })
    await settleFrames()
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
    expect(onRetire).toHaveBeenCalledExactlyOnceWith({ reason: 'observed', attachments: refs })
  })

  it('a queue occurrence carrying the rpcId retires the echo (running-turn submissions)', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    const retirements: PendingSubmissionRetirement[] = []
    session.handleRunning(true)
    const handle = session.beginSubmission({
      mode: 'queue',
      text: 'ترتيب طابور',
      attachments: [{ type: 'image', value: { previewUrl: 'blob:p1' } }],
      onRetire: retirement => retirements.push(retirement),
    })
    const refs = [imageRef('att-q')]
    session.projections.apply('inbox', { 'next-turn': [queuedItem(handle.requestId, refs)], 'next-step': [] }, SessionSeq(1))
    await settleFrames()
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
    expect(retirements).toEqual([{ reason: 'observed', attachments: refs }])
    // The queue projection keeps the correlation id for render-time dedupe.
    expect(session.projections.get('inbox')).toMatchObject({
      'next-turn': [{ source: { rpcId: handle.requestId } }],
    })
  })

  it('retires a mixed echo with durable references in original selection order', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    await session.open()
    const retirements: PendingSubmissionRetirement[] = []
    const file = fileRef('file-1')
    const handle = session.beginSubmission({
      mode: 'queue',
      text: 'mixed',
      attachments: [
        { type: 'image', value: { previewUrl: 'blob:first' } },
        { type: 'file', value: file },
        { type: 'image', value: { previewUrl: 'blob:last' } },
      ],
      onRetire: retirement => retirements.push(retirement),
    })
    const refs = [imageRef('image-1'), file, imageRef('image-2')]
    await pushEvent(mock, promptEvent(SessionSeq(0), handle.requestId, refs))
    await settleFrames()
    expect(retirements).toEqual([{ reason: 'observed', attachments: refs }])
  })

  it('a full-window install (reconnect resync) retires echoes observed in the window', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    const handle = session.beginSubmission({ mode: 'queue', text: 'إعادة وصل', attachments: [] })
    mock.stream(FOLLOW, followScript(history([promptEvent(SessionSeq(12), handle.requestId)])))
    await session.open()
    await settleFrames()
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
  })

  it('the first observation wins: a later prompt failure cannot re-retire an observed echo', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    await session.open()
    const retirements: PendingSubmissionRetirement[] = []
    const handle = session.beginSubmission({
      mode: 'queue',
      text: 'أولا مراقبة',
      attachments: [],
      onRetire: retirement => retirements.push(retirement),
    })
    await pushEvent(mock, promptEvent(SessionSeq(0), handle.requestId))
    handle.abandon()
    await settleFrames()
    expect(retirements).toEqual([{ reason: 'observed', attachments: [] }])
  })

  it('retires once when the queue and durable event report the same request id', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    await session.open()
    const retirements: PendingSubmissionRetirement[] = []
    const handle = session.beginSubmission({
      mode: 'queue',
      text: 'نفس طلب',
      attachments: [],
      onRetire: retirement => retirements.push(retirement),
    })
    session.projections.apply('inbox', { 'next-turn': [queuedItem(handle.requestId, [])], 'next-step': [] }, SessionSeq(1))
    await pushEvent(mock, promptEvent(SessionSeq(0), handle.requestId))
    await settleFrames()
    expect(retirements).toEqual([{ reason: 'observed', attachments: [] }])
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
  })

  it('uses requestAnimationFrame for the retirement delay when the runtime provides one', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    await session.open()
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
      frames.push(fn)
      return frames.length
    })
    const handle = session.beginSubmission({ mode: 'queue', text: 'لقطة', attachments: [] })
    await pushEvent(mock, promptEvent(SessionSeq(0), handle.requestId))
    expect(session.getSnapshot().pendingSubmissions).toHaveLength(1)
    expect(frames).toHaveLength(1)
    frames[0]?.(0)
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
  })
})

describe('disposal', () => {
  it('retires unsettled echoes as failed and preserves an already-observed settlement', async ({ mock, start }) => {
    const session = await sessionBench(mock, start, SID)
    await session.open()
    const retirements: { text: string; retirement: PendingSubmissionRetirement }[] = []
    const observed = session.beginSubmission({
      mode: 'queue',
      text: 'قد مراقبة',
      attachments: [],
      onRetire: retirement => retirements.push({ text: 'قد مراقبة', retirement }),
    })
    session.beginSubmission({
      mode: 'queue',
      text: 'لمsettle',
      attachments: [],
      onRetire: retirement => retirements.push({ text: 'لمsettle', retirement }),
    })
    await pushEvent(mock, promptEvent(SessionSeq(0), observed.requestId))
    await session.dispose()
    await settleFrames()
    expect(retirements).toEqual([
      { text: 'لمsettle', retirement: { reason: 'failed' } },
      { text: 'قد مراقبة', retirement: { reason: 'observed', attachments: [] } },
    ])
    expect(session.getSnapshot().pendingSubmissions).toEqual([])
  })
})
