# نظام الأحداث

[English](events.md) | العربية

الأحداث هي آلية التواصل الأساسية بين إضافات Cordis. ويستعملها الإطار كثيرًا في نقاط امتداد مرتخية الاقتران.

## الاستعمال الأساسي

### الاستماع إلى حدث

```ts ignore-check
ctx.on('event-name', (payload) => {
  // Handle the event.
})
```

### إرسال حدث

```ts ignore-check
ctx.emit('event-name', payload)
```

## أوضاع الأحداث

يوفّر Cordis عدة أوضاع للأحداث بعقود تفاعل مختلفة.

### emit: البث

كل مستمع يعمل تزامنيًا وتُتجاهَل القيمُ الراجعة:

```ts ignore-check
// Emit
ctx.emit('my-plugin/ready', { id: 'worker-1' })

// Listen
ctx.on('my-plugin/ready', ({ id }) => {
  console.log(`${id} is ready`)
})
```

### bail: القطع المبكر

يعمل المستمعون بالترتيب؛ وأولُ نتيجة ليست `null` ولا `false` ولا `undefined` تصير النتيجةَ النهائية:

```ts ignore-check
// Dispatch
const result = ctx.bail('some-check', input)

// Listen: a returned value stops later listeners.
ctx.on('some-check', (input) => {
  if (shouldBlock(input)) return 'blocked'
  // Return null, false, or undefined to continue to the next listener.
})
```

### serial: التنفيذ بالترتيب

يعمل المستمعون بترتيب التسجيل وتُنتظر النتائجُ اللاتزامنية. وأولُ نتيجة ليست `null` ولا `false` ولا `undefined` توقف ما بعدها:

```ts ignore-check
await ctx.serial('setup-phase', context)
```

### waterfall: خط المعالجة

يجوز لكل مستمع أن يلفّ نتيجةَ من بعده فتتكوّن سلسلةُ معالجة. و**على المستمع أن يستدعي `next()` ليفوّض إلى ما بعده**؛ وحذفُ الاستدعاء يقطع السلسلة:

```ts ignore-check
// Dispatch
const output = await ctx.waterfall('my-plugin/transform', input, async () => input)

// Listen: next() is mandatory.
ctx.on('my-plugin/transform', async (_input, next) => {
  const downstream = await next()
  return downstream.trim()
})
```

::: warning
على مستمع waterfall أن **يستدعي `next()`**. وحذفُه يقطع السلسلة عن قصد، فيتيح الاعتراضَ وسلوكَ البوابة.
:::

## الأحداث المنمَّطة

يستعمل الإطارُ دمجَ التصريحات في TypeScript لأحداث آمنة الأنواع:

```ts
import '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Events {
    'my-plugin/ready': (payload: { id: string }) => void
    'my-plugin/check': (input: string) => boolean | undefined
    'my-plugin/transform': (input: string, next: () => Promise<string>) => Promise<string>
  }
}

// ctx.on('my-plugin/ready', ...) and ctx.emit('my-plugin/ready', ...)
// are now inferred correctly.
```

## أحداث Cordis وسجلات الجلسة

تستعمل أحداثُ Cordis في الإطار أسماءً بصيغة `namespace/action`، منها `agent/pre-step` و`agent/request` و`agent/request-error` و`tools/result` و`session/event`. وتسجّل مناطقُ `cordis-surface` المولَّدة في [صفحات الأنظمة الفرعية](../../../subsystems/core.ar.md) التوقيعاتِ والأوضاعَ كاملةً.

أما `turn/*` و`step/*` و`tool/call` و`tool/result` و`compaction/*` فأنواعُ أحداث جلسة دائمة، لا أحداثَ Cordis بالأسماء نفسها. ولمراقبتها استمع إلى `session/event` وافحص `event.type`.

## مستمعو الأحداث آثار

المستمعُ المسجَّل بـ `ctx.on()` يُزال تلقائيًا حين تُفرَّغ إضافته:

```ts ignore-check
export function apply(ctx: Context) {
  // This listener is removed when the plugin disposes.
  ctx.on('tools/result', handler)
}
```

## مثال: إضافة تسجيل

تسجّل هذه الإضافةُ استدعاءاتِ الأدوات ونتائجَها:

```ts
import type { Context } from '@deepseek-ai/cordis'
import '@deepseek-ai/dsh-tools'

export const name = 'tool-logger'

export function apply(ctx: Context) {
  ctx.on('tools/result', (exec, result) => {
    console.log(`[tool] ${exec.name}(${JSON.stringify(exec.arguments)})`)
    const text = result.content
      .map(block => block.type === 'text' ? block.text : '')
      .join('')
    console.log(`[tool result] ${text.slice(0, 100)}`)
  })
}
```

## الخطوات التالية

- [طبقات القدرات](../practice/index.ar.md): افهم الأحداث داخل واجهات القدرات
- [مهايئات LLM](../practice/llm-adapter.ar.md): نفّذ خلفيةَ LLM كاملة
