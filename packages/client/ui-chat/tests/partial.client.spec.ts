/**
 * PartialAccumulator: six-variant chunk folding, sparse-index compaction, and
 * the block/snapshot reference discipline (a delta swaps only that block).
 */

import { describe, expect, it } from 'vitest'
import type { StreamChunk } from '@deepseek-ai/dsh-api-remotes/client'
import { PartialAccumulator } from '../src/client/conversation-nodes/partial.ts'

const chunk = (c: Record<string, unknown>): StreamChunk => c as unknown as StreamChunk

describe('PartialAccumulator', () => {
  it('builds empty blocks per block-start type, unknown type falls to other', () => {
    const acc = new PartialAccumulator(1, 0)
    acc.push(chunk({ type: 'block-start', index: 0, blockType: 'text' }))
    acc.push(chunk({ type: 'block-start', index: 1, blockType: 'reasoning' }))
    acc.push(chunk({ type: 'block-start', index: 2, blockType: 'tool-call' }))
    acc.push(chunk({ type: 'block-start', index: 3, blockType: 'no-such' }))
    expect(acc.toPartial().blocks).toEqual([
      { kind: 'text', text: '' },
      { kind: 'reasoning', text: '' },
      { kind: 'tool-call', callId: '', name: '', argsRaw: '' },
      { kind: 'other', block: null },
    ])
  })

  it('accumulates text deltas, starting from empty when prev is missing or another kind', () => {
    const acc = new PartialAccumulator(1, 0)
    acc.push(chunk({ type: 'text-delta', index: 0, text: 'بلا start ' })) // prev missing
    acc.push(chunk({ type: 'text-delta', index: 0, text: 'أيضا تراكم تراكم' }))
    expect(acc.toPartial().blocks).toEqual([{ kind: 'text', text: 'بلا start أيضا تراكم تراكم' }])
    acc.push(chunk({ type: 'reasoning-delta', index: 0, text: 'تبديل نوع إعادة بدء' })) // prev is text → restart
    expect(acc.toPartial().blocks).toEqual([{ kind: 'reasoning', text: 'تبديل نوع إعادة بدء' }])
  })

  it('accumulates reasoning deltas on the reasoning lane', () => {
    const acc = new PartialAccumulator(1, 0)
    acc.push(chunk({ type: 'block-start', index: 0, blockType: 'reasoning' }))
    acc.push(chunk({ type: 'reasoning-delta', index: 0, text: 'تفكير' }))
    acc.push(chunk({ type: 'reasoning-delta', index: 0, text: 'اعتبار' }))
    expect(acc.toPartial().blocks).toEqual([{ kind: 'reasoning', text: 'تفكير اعتبار' }])
  })

  it('continues from a materialized history prefix', () => {
    const acc = new PartialAccumulator(1, 0, [{ kind: 'text', text: 'قد لديه' }])
    acc.push(chunk({ type: 'text-delta', index: 0, text: 'زيادة كمية' }))
    expect(acc.toPartial().blocks).toEqual([{ kind: 'text', text: 'قد لديه زيادة كمية' }])
  })

  it('folds tool-call deltas: first id pins callId, late name overrides, argsRaw concatenates', () => {
    const acc = new PartialAccumulator(1, 0)
    acc.push(chunk({ type: 'tool-call-delta', index: 0, id: 'c1', argumentsDelta: '{"a"' }))
    acc.push(chunk({ type: 'tool-call-delta', index: 0, id: 'c2-late', name: 'echo', argumentsDelta: ':1}' }))
    expect(acc.toPartial().blocks).toEqual([
      { kind: 'tool-call', callId: 'c1', name: 'echo', argsRaw: '{"a":1}' },
    ])
  })

  it('replaces the accumulated block wholesale on block-end', () => {
    const acc = new PartialAccumulator(1, 0)
    acc.push(chunk({ type: 'text-delta', index: 0, text: 'في بين حالة' }))
    acc.push(chunk({ type: 'block-end', index: 0, block: { type: 'text', text: 'تحديد مسودة كل نص' } }))
    expect(acc.toPartial().blocks).toEqual([{ kind: 'text', text: 'تحديد مسودة كل نص' }])
  })

  it('returns false (no notification) for usage/finish/unknown variants and keeps blocks', () => {
    const acc = new PartialAccumulator(1, 0)
    acc.push(chunk({ type: 'text-delta', index: 0, text: 'x' }))
    const before = acc.toPartial()
    expect(acc.push(chunk({ type: 'usage', usage: {} }))).toBe(false)
    expect(acc.push(chunk({ type: 'finish', reason: 'stop' }))).toBe(false)
    expect(acc.push(chunk({ type: 'future-variant' }))).toBe(false)
    expect(acc.toPartial()).toBe(before) // unchanged: same snapshot reference
  })

  it('compacts sparse indexes into a dense render-order array', () => {
    const acc = new PartialAccumulator(1, 0)
    acc.push(chunk({ type: 'block-start', index: 2, blockType: 'text' }))
    acc.push(chunk({ type: 'text-delta', index: 2, text: 'أولا إلى عال موضع' }))
    acc.push(chunk({ type: 'block-start', index: 0, blockType: 'reasoning' }))
    const { blocks } = acc.toPartial()
    expect(blocks).toHaveLength(2) // no undefined holes
    expect(blocks[0]).toEqual({ kind: 'reasoning', text: '' })
    expect(blocks[1]).toEqual({ kind: 'text', text: 'أولا إلى عال موضع' })
  })

  it('keeps the snapshot reference stable without changes and swaps it once per mutation', () => {
    const acc = new PartialAccumulator(3, 1)
    const first = acc.toPartial()
    expect(first).toMatchObject({ turn: 3, step: 1, blocks: [] })
    expect(acc.toPartial()).toBe(first)
    acc.push(chunk({ type: 'text-delta', index: 0, text: 'a' }))
    const second = acc.toPartial()
    expect(second).not.toBe(first)
    expect(acc.toPartial()).toBe(second)
  })
})
