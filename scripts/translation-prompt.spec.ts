/** Unit tests for the prompt-v7 content and unchanged three-section protocol. */

import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  consumeTranslationResponse,
  parseTranslationResponse,
  renderTranslationPrompt,
  renderTranslationRequest,
  renderTranslationResponse,
} from './translation-prompt.ts'

const root = resolve(import.meta.dirname, '..')
const document = readFileSync(join(root, 'docs/i18n/translation-prompt.md'), 'utf8')
const terminology = '| English | العربية |\n|---|---|\n| agent | agent |'

const retainedExamples = [
  ['### Colloquial verb → Professional verb', 'The repo pins pnpm@11.7.0 in package.json', 'هذا مستودع في package.json في ثابت استخدام pnpm@11.7.0'],
  ['### Run-on sentence → Natural phrasing with pause', 'Read docs/architecture.md before changing anything under packages/.', 'في تعديل packages/ دليل تحت أي محتوى قبل، طلب أولا قراءة قراءة docs/architecture.md.'],
  ['### Stiff passive voice → Active and natural', 'a green gate means the pair was confirmed consistent at these exact contents, not that the confirmation was sound.', 'بوابة عبر معنى طعم حال هذا مجموعة وثيقة في حالي محتوى فوق متسق صفة نيل إلى تأكيد، لا بديل جدول تأكيد ذاته صحيح تأكيد يمكن اعتماد.'],
  ['### Invented word → Natural expression', 'A sidecar record of both blob hashes makes consistency checkable', 'مرافق مع سجل حفظ اثنان جانب blob hash، جعل متسق صفة يمكن فحص'],
  ['### Em-dash → Colon/period', 'FIXME — an issue that should block a new release.', 'FIXME: ينبغي عند منع سد جديد إصدار إصدار مشكلة.'],
  ['### Overly literal → Meaningful rendering', 'awkward phrasing is easier to notice when you read the translation without comparing it with the source', 'لا مقابل وفق أصل نص قراءة قراءة ترجمة نص وقت، أكثر سعة سهل ملاحظة شعور آخر لي جدول بلوغ'],
  ['### Terminology — do not translate what should be kept in English', 'typed service seams, and explicit extension points', 'نوع تحويل خدمة seam و صريح نقطة توسيع'],
  ['### Slang/jargon → Professional phrasing', 'The committed agent workflow lives in .agents/skills/dsh-translate-docs', 'مستودع داخل وضع agent سير العمل رؤية .agents/skills/dsh-translate-docs'],
  ['### "For humans" — translate the intent, not the word', 'For humans, start with the development guide', 'موجه إلى تطوير من: طلب أولا قراءة قراءة تطوير إشارة جنوب'],
  ['### Code block comments — NEVER translate', '# full-screen TUI coding agent (needs DEEPSEEK_API_KEY)', 'keep exactly as-is, byte-for-byte'],
  ['### Language switcher — flip direction', 'English | [العربية](README.zh.md)', '[English](README.md) | العربية'],
]

describe('translation prompt rendering', () => {
  it('renders both directions with every placeholder resolved', () => {
    const en = renderTranslationPrompt(document, { sourceLanguage: 'English', sourceFilename: 'guide.md', terminology })
    expect(en).toContain('from English to Chinese')
    expect(en).toContain(terminology)
    expect(en).not.toContain('{{')
    expect(en).toContain('plain source stays plain (يجب)')
    expect(en).toContain('For an English target, use the established English technical term')
    expect(en).toContain('does a Chinese target use an established Chinese rendering')
    expect(en).toContain('does an English target use the established English technical term')
    expect(en).toContain('The parser removes exactly one framing escape')
    const zh = renderTranslationPrompt(document, { sourceLanguage: 'Chinese', sourceFilename: 'guide.zh.md', terminology })
    expect(zh).toContain('from Chinese to English')
  })

  it('contains every embedded example', () => {
    for (const example of retainedExamples) {
      for (const fragment of example) expect(document).toContain(fragment)
    }
  })

  it('states the selected v7 safeguards', () => {
    const rendered = renderTranslationPrompt(document, { sourceLanguage: 'English', sourceFilename: 'guide.md', terminology })
    expect(rendered).toContain('## Priority')
    expect(rendered).toContain('### Faithfulness')
    expect(rendered).toContain('do not invent a filename or switcher')
    expect(rendered).toContain('Markdown emphasis markers do not create a word boundary')
    expect(rendered).toContain('Never invent responsibility merely to avoid a passive construction')
    expect(rendered).toContain('Never vary a terminology-table form, defined concept, or contract verb merely for stylistic variety')
    expect(rendered).toContain('Chinese output uses its `.zh.md` path')
    expect(rendered).toContain('belongs to the active bilingual corpus')
    expect(rendered).toContain('a missing counterpart in that corpus is an error')
    expect(rendered).toContain('exact query/fragment suffix')
    expect(rendered).toContain('Return exactly three raw XML sections')
  })

  it('rejects a template with unknown or missing placeholders', () => {
    const alien = document.replaceAll('{{terminology}}', '{{terms_prompt}}')
    expect(() => renderTranslationPrompt(alien, { sourceLanguage: 'English', sourceFilename: 'guide.md', terminology })).toThrow(/unsupported placeholder/)
    const missing = document.replaceAll('{{terminology}}', '')
    expect(() => renderTranslationPrompt(missing, { sourceLanguage: 'English', sourceFilename: 'guide.md', terminology })).toThrow(/required placeholder/)
  })

  it('rejects unmatched placeholder delimiters', () => {
    for (const delimiter of ['{{', '}}']) {
      const malformed = document.replace('Your task is to translate', `Your task ${delimiter} is to translate`)
      expect(() => renderTranslationPrompt(malformed, {
        sourceLanguage: 'English',
        sourceFilename: 'guide.md',
        terminology,
      })).toThrow(/malformed placeholder syntax/)
    }
  })

  it('assembles bare few-shot turns before the real source document', () => {
    const request = renderTranslationRequest(document, {
      sourceLanguage: 'English',
      sourceFilename: 'guide.md',
      sourceDocument: '# Guide\n\nNew source.',
      terminology,
      examples: [{ english: '# Example\n\nEnglish.', chinese: '# عرض مثال\n\nالعربية.' }],
    })
    expect(request.targetFilename).toBe('guide.zh.md')
    expect(request.messages.map(message => message.role)).toEqual(['system', 'user', 'assistant', 'user'])
    expect(request.messages.slice(1).map(message => message.content)).toEqual([
      '# Example\n\nEnglish.',
      '# عرض مثال\n\nالعربية.',
      '# Guide\n\nNew source.',
    ])

    const reverse = renderTranslationRequest(document, {
      sourceLanguage: 'Chinese',
      sourceFilename: 'guide.zh.md',
      sourceDocument: '# إشارة جنوب\n\nجديد مصدر نص.',
      terminology,
      examples: [{ english: '# Example\n\nEnglish.', chinese: '# عرض مثال\n\nالعربية.' }],
    })
    expect(reverse.targetFilename).toBe('guide.md')
    expect(reverse.messages.slice(1).map(message => message.content)).toEqual([
      '# عرض مثال\n\nالعربية.',
      '# Example\n\nEnglish.',
      '# إشارة جنوب\n\nجديد مصدر نص.',
    ])
  })
})

describe('translation response sections', () => {
  it('round-trips Markdown bodies', () => {
    const response = { translation: '# عنوان\n\nمتن **إضافة خشن**.', review: '- [Tone] إصلاح صحيح واحد موضع.\n- بلا إصلاح صحيح', final: '# عنوان\n\nتحديد مسودة.' }
    expect(parseTranslationResponse(renderTranslationResponse(response))).toEqual(response)
  })

  it('tolerates a fenced xml wrapper around the whole response', () => {
    const fenced = '```xml\n<translation>\nA\n</translation>\n\n<review>\n- بلا إصلاح صحيح\n</review>\n\n<final>\nA\n</final>\n```'
    expect(parseTranslationResponse(fenced).final).toBe('A')
  })

  it('keeps an inline close tag inside prose from terminating the section', () => {
    const doc = { translation: 'the wire format uses </translation> as its close tag', review: '- بلا إصلاح صحيح', final: 'F' }
    expect(parseTranslationResponse(renderTranslationResponse(doc))).toEqual(doc)
  })

  it('round-trips wrapper-tag lines inside Markdown bodies', () => {
    const doc = {
      translation: '```xml\n</translation>\n```',
      review: '- [Structure] Preserved `<final>` on its own line.',
      final: 'literal delimiters\n</final>\n\\</final>',
    }
    const rendered = renderTranslationResponse(doc)
    expect(parseTranslationResponse(rendered)).toEqual(doc)
    expect(() => parseTranslationResponse(rendered.replace('\\</translation>', '</translation>'))).toThrow(/duplicate <translation>/)
  })

  it('rejects a duplicate section appearing before final', () => {
    const early = '<translation>\nA\n</translation>\n<translation>\nB\n</translation>\n<review>\nR\n</review>\n<final>\nF\n</final>'
    expect(() => parseTranslationResponse(early)).toThrow(/duplicate <translation>/)
  })

  it('rejects missing, unterminated, or duplicated sections', () => {
    expect(() => parseTranslationResponse('<translation>\nA\n</translation>')).toThrow(/missing or unterminated <review>/)
    expect(() => parseTranslationResponse('<translation>\nA')).toThrow(/missing or unterminated <translation>/)
    const dup = '<translation>\nA\n</translation>\n<review>\nR\n</review>\n<final>\nF\n</final>\n<final>\nG\n</final>'
    expect(() => parseTranslationResponse(dup)).toThrow(/duplicate <final>/)
    expect(() => parseTranslationResponse(`${renderTranslationResponse({ translation: 'A', review: 'R', final: 'F' })}\nstray`))
      .toThrow(/content is not allowed outside/)
  })

  it('inserts or corrects the target switcher after parsing a new-pair response', () => {
    const response = renderTranslationResponse({
      translation: '# إشارة جنوب\n\nأول مسودة.',
      review: '- بلا إصلاح صحيح',
      final: '# إشارة جنوب\n\nEnglish | [العربية](guide.zh.md)\n\nتحديد مسودة.',
    })
    expect(consumeTranslationResponse(response, { sourceLanguage: 'English', sourceFilename: 'guide.md' }).final).toBe([
      '# إشارة جنوب',
      '',
      '[English](guide.md) | العربية',
      '',
      'تحديد مسودة.',
      '',
    ].join('\n'))
  })

  it('preserves YAML frontmatter before inserting the target switcher', () => {
    const response = renderTranslationResponse({
      translation: '# إشارة جنوب\n\nأول مسودة.',
      review: '- بلا إصلاح صحيح',
      final: [
        '---',
        'layout: home',
        '---',
        '',
        '# إشارة جنوب',
        '',
        'تحديد مسودة.',
      ].join('\n'),
    })
    expect(consumeTranslationResponse(response, { sourceLanguage: 'English', sourceFilename: 'guide.md' }).final).toBe([
      '---',
      'layout: home',
      '---',
      '',
      '# إشارة جنوب',
      '',
      '[English](guide.md) | العربية',
      '',
      'تحديد مسودة.',
      '',
    ].join('\n'))
  })

  it('rejects unterminated YAML frontmatter before the target H1', () => {
    const response = renderTranslationResponse({
      translation: '# إشارة جنوب\n\nأول مسودة.',
      review: '- بلا إصلاح صحيح',
      final: '---\nlayout: home\n\n# إشارة جنوب\n\nتحديد مسودة.',
    })
    expect(() => consumeTranslationResponse(response, {
      sourceLanguage: 'English',
      sourceFilename: 'guide.md',
    })).toThrow(/unterminated YAML frontmatter/)
  })

  it('rejects a source filename that contradicts the translation direction', () => {
    expect(() => renderTranslationPrompt(document, {
      sourceLanguage: 'Chinese',
      sourceFilename: 'guide.md',
      terminology,
    })).toThrow(/does not match source language Chinese/)
  })

  it('inserts the English target switcher for a Chinese source', () => {
    const response = renderTranslationResponse({
      translation: '# Guide\n\nDraft.',
      review: '- [None] No corrections.',
      final: '# Guide\n\nFinal.',
    })
    expect(consumeTranslationResponse(response, {
      sourceLanguage: 'Chinese',
      sourceFilename: 'guide.zh.md',
    }).final).toContain('\n\nEnglish | [العربية](guide.zh.md)\n\n')
  })
})
