# 7. إلى الإطار

[English](07-into-the-harness.md) | العربية

يسجّل هذا الفصل أداةً يستدعيها النموذج في خدمة `tools` في الإطار، وينفّذها عبر خط معالجة أدوات الإطار، ويراقب حدثَ النتيجة. وهو يبقى بلا مفاتيح ولا يستدعي نموذجًا.

## إضافة أداة

أنشئ `greet-tool.ts` في `tmp/cordis-tutorial`:

```ts
import type { Context } from '@deepseek-ai/cordis'
import { brandString } from '@deepseek-ai/dsh-brand'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ToolCallId } from '@deepseek-ai/dsh-llm'

export const name = 'greet-tool'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Greet the named person.',
    parameters: {
      name: { type: 'string', required: true, description: 'Who to greet' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `Hello, ${args.name}!`
    },
  }))

  // Drive one call through the real execution pipeline, standing in for
  // the model. ToolCallId brands the correlation id a provider would issue.
  void (async () => {
    const result = await ctx.tools.execute({
      callId: brandString<ToolCallId>('demo-1'),
      name: 'greet',
      arguments: { name: 'Cordis' },
      signal: new AbortController().signal,
    })
    console.log('tool replied:', JSON.stringify(result.content))
  })()
}
```

وكلُّ نمط هنا من الفصول السابقة: فـ `inject: ['tools']` ([الفصل الثالث](03-services.ar.md)) يُبقي الإضافةَ حتى يوجد registry الأدوات؛ و`ctx.tools.register(...)` يلحق محرِّرَ التسجيل بالإضافة ([الفصل الثاني](02-lifecycle-and-effects.ar.md))، فيلغي التفريغُ تسجيلَ الأداة. ويحوّل `defineTool` مواصفةَ `parameters` إلى JSON Schema المعروض للنموذج، ويستنتج نوعَ `args`، ويتحقق من الوسائط التي يوفّرها النموذج قبل تشغيل `execute`. وتعيد الأداةُ القيمةَ المعيارية التي يعلنها `output.schema`؛ وينتج `output.render` منفصلًا المحتوى الأصيل والنتيجةَ الدائمة.

## إضافة مراقِبة

أنشئ `tool-logger.ts`، وهي إضافةٌ منفصلة تراقب كلَّ استدعاء أداة في التطبيق عبر حدث `tools/result` في الإطار:

```ts
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-tools'

export const name = 'tool-logger'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.on('tools/result', (exec, result) => {
    const text = result.content
      .map(block => (block.type === 'text' ? block.text : ''))
      .join('')
    console.log(`[tool-logger] ${exec.name} -> ${text}`)
  })
}
```

والسطر `import type {} from '@deepseek-ai/dsh-tools'` يجلب دمجَ التصريحات في الحزمة لتصير `'tools/result'` وحمولتُها منمَّطتين، وهي الحركةُ نفسها التي في استيراد `stats.ts` في الفصل الرابع، لكن على مستوى حزمة.

## ركّب وشغّل

```yaml
- name: '@deepseek-ai/dsh-system-prompt'
- name: '@deepseek-ai/dsh-tools'
- name: './tool-logger.ts'
- name: './greet-tool.ts'
```

وتحقن `@deepseek-ai/dsh-tools` خدمةَ `systemPrompt` لأن الأدوات تسهم بـ schemas في توجيه النظام، فيعدّد التركيبُ مزوّدَها أيضًا. وبدونه تبقى إضافةُ الأدوات في PENDING كما وُصف في [الفصل السادس](06-composition-and-hmr.ar.md).

```sh
node --import tsx ../../vendor/cordis/bin.js
```

```
[tool-logger] greet -> Hello, Cordis!
tool replied: [{"type":"text","text":"Hello, Cordis!"}]
```

وقد أطلق المسجّلُ أولًا: فـ `tools/result` يُرسَل ضمن تجسيد النتيجة، قبل أن يتحلّل وعدُ `execute` للمستدعي. ولا تعرف أيٌّ من إضافتيك أن الأخرى موجودة؛ وإنما توصلهما خدمةُ الـ registry والحدث.

## من هنا إلى وكيل كامل

الوكيلُ الحقيقي هذا التركيبُ مع إضافات أكثر: مهايئُ LLM، وagent loop، والحفظُ الدائم، ومدخلُ تطبيق. فقارن [طبقة profile الأساس](../../packages/bundle/base/cordis.patch.yml) و[طبقة headless](../../packages/bundle/headless/cordis.patch.yml)؛ وتستطيع قراءةَ مداخلهما الآن. وأضف `greet-tool.ts` عندك عبر طبقة `--patch` صغيرة.

وإلى أين بعد ذلك:

- [بناء أداة](../user/develop/basic/tool.ar.md): مزيدٌ من `defineTool`، بما فيه العرضُ وschemas الأغنى.
- [تصميم القدرات ذات الطبقات الثلاث](../user/develop/practice/index.ar.md): كيف يبني الإطارُ القدراتِ القابلة للاستبدال.
- مناطقُ `cordis-surface` المولَّدة في [صفحات الأنظمة الفرعية](../subsystems/core.ar.md): كلُّ ما تستطيع حقنَه والاستماعَ إليه، كلٌّ في صفحته المالكة.
- [المعمارية](../architecture.ar.md): خريطةُ النظام التي تسكن فيها هذه الإضافات.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
