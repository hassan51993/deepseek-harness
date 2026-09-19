# 7. دخول harness

[English](07-into-the-harness.md) | العربية

هذا فصل سوف نحو harness `tools` خدمة تسجيل واحد يمكن من نموذج استدعاء أداة، عبر harness أداة خط الإنتاج تنفيذ هو، و مراقبة نتيجة حدث. كامل عرض مثال بلا حاجة مفتاح، أيضا لن استدعاء نموذج.

## أداة إضافة

إنشاء `greet-tool.ts`، سوف هو وضع في `tmp/cordis-tutorial` في:

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

هذا داخل كل نمط كل قدوم ذاتي قبل بضعة فصل:`inject: ['tools']`([رقم 3 فصل](03-services.zh.md)) سوف يجعل إضافة انتظار أداة سجل التسجيل حينئذ خيط؛`ctx.tools.register(...)` سوف يأخذ تسجيل disposer مرفق حال إلى إضافة ([رقم 2 فصل](02-lifecycle-and-effects.zh.md)) ، لذلك إزالة وقت سوف ملاحظة إلغاء أداة.`defineTool` سوف `parameters` قاعدة نحو تحويل لـ نحو نموذج عرض JSON Schema، دفع توجيه `args` نوع، و في `execute` تشغيل قبل تحقق نموذج توفير معامل. أداة إرجاع من `output.schema` إعلان مواصفة قيمة؛`output.render` فإن بصفة Native renderer(أصلي مصير) ، آخر سطر توليد يمكن حفظ دائم نتيجة محتوى.

## مراقبة إضافة

إنشاء `tool-logger.ts`. هذا هو واحد مستقل إضافة، عبر harness `tools/result` حدث مراقبة تطبيق في كل مرة أداة استدعاء:

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

`import type {} from '@deepseek-ai/dsh-tools'` سطر سوف جذب دخول هذا حزمة إعلان دمج، جعل `'tools/result'` و ذلك payload أداة لديه نوع. هذا و رقم 4 فصل استيراد `stats.ts` فعل قاعدة نفسه، فقط هو توسيع إلى حزمة درجة آخر.

## تركيب و تشغيل

```yaml
- name: '@deepseek-ai/dsh-system-prompt'
- name: '@deepseek-ai/dsh-tools'
- name: './tool-logger.ts'
- name: './greet-tool.ts'
```

`@deepseek-ai/dsh-tools` سوف حقن `systemPrompt` خدمة، لأن أداة حاجة نحو توجيه النظام مساهمة schema، الذي بـ تركيب في أيضا يلزم صف خروج هذا خدمة مزود. نقص قليل مزود وقت، أداة إضافة سوف مثل[رقم 6 فصل](06-composition-and-hmr.zh.md) الذي وصف ذلك مثال إبقاء PENDING.

```sh
node --import tsx ../../vendor/cordis/bin.js
```

```
[tool-logger] greet -> Hello, Cordis!
tool replied: [{"type":"text","text":"Hello, Cordis!"}]
```

logger سوف أولا إطلاق:`tools/result` في نتيجة شيء تحويل مرور مسار في إرسال خروج، حدوث في `execute` نحو استدعاء جهة إرجاع promise صرف الآن قبل. اثنان عدد إضافة كل لا معرفة طريق آخر عدد إضافة وجود، هو جمع من سجل التسجيل خدمة و حدث اتصال.

## من هذا داخل مشي نحو كامل agent(ذكي جسم)

حقيقي agent حينئذ هو هذا طقم تركيب مجددا إضافة فوق أكثر كثير إضافة:LLM(كبير لغة نموذج) مهايئ،agent loop(ذكي جسم حلقة) ، حفظ دائم و تطبيق مدخل. مقابل وفق [base profile طبقة](../../packages/bundle/base/cordis.patch.yml) و [headless طبقة](../../packages/bundle/headless/cordis.patch.yml) ، أنت الآن قد يمكن قراءة فهم منها كل بند. عبر واحد صغير نوع `--patch` overlay إضافة دخول `greet-tool.ts` يكفي.

لاحق يمكن قراءة قراءة:

- [بناء أداة](../user/develop/basic/tool.zh.md): عميق دخول حل `defineTool`، يشمل عرض و أكثر وفير غني schema.
- [ثلاثة طبقة قدرة تصميم](../user/develop/practice/index.zh.md):harness مثل أي مجموعة نسج يمكن استبدال قدرة.
- [فرعي نظام صفحة](../subsystems/core.zh.md) فوق توليد `cordis-surface` منطقة كتلة: يمكن حقن و استماع كل محتوى، كل في ذلك الذي تابع صفحة فوق.
- [هيكل بنية](../architecture.zh.md): هذه إضافة الذي موضع نظام أرض رسم.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
