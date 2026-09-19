# حدث نظام

[English](events.md) | العربية

حدث هو Cordis إضافة بين عبر معلومة نواة قلب آلية.Harness كبير كمية استخدام حدث قدوم تنفيذ رخو اقتران دمج نقطة توسيع.

## أساس هذا استخدام قاعدة

### استماع حدث

```ts ignore-check
ctx.on('event-name', (payload) => {
  // Handle the event.
})
```

### إطلاق حدث

```ts ignore-check
ctx.emit('event-name', payload)
```

## حدث نمط

Cordis توفير كثير نوع حدث نمط، ملائم لأجل مختلف تفاعل عقد نحو:

### emit — واسع بث

كل مستمع تزامن تنفيذ، قيمة راجعة سوف يتم تجاهل اختصار:

```ts ignore-check
// Emit
ctx.emit('my-plugin/ready', { id: 'worker-1' })

// Listen
ctx.on('my-plugin/ready', ({ id }) => {
  console.log(`${id} is ready`)
})
```

### bail — قصير مسار

مستمع حسب ترتيب تشغيل، رقم واحد لا هو `null`،`false` أو `undefined` قيمة راجعة سوف يصبح نهائي نتيجة:

```ts ignore-check
// Dispatch
const result = ctx.bail('some-check', input)

// Listen: a returned value stops later listeners.
ctx.on('some-check', (input) => {
  if (shouldBlock(input)) return 'blocked'
  // Return null, false, or undefined to continue to the next listener.
})
```

### serial — ترتيب تنفيذ

مستمع حسب تسجيل ترتيب اعتماد مرة تنفيذ، و انتظار مختلف خطوة نتيجة؛ رقم واحد لا هو `null`،`false` أو `undefined` قيمة راجعة سوف إنهاء لاحق تنفيذ:

```ts ignore-check
await ctx.serial('setup-phase', context)
```

### waterfall(شلال نشر صيغة حدث)— خط الإنتاج

كل مستمع يمكن حزمة تركيب تحت تنقل قيمة راجعة، شكل صار معالجة سلسلة.**يجب استدعاء `next()` نقل تمرير إعطاء تحت تنقل**، لا استدعاء أي سوف قصير مسار خط الإنتاج:

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
waterfall مستمع**يجب استدعاء `next()`**. لا استدعاء `next` سوف قصير مسار كامل خط الإنتاج، هذا هو لذا معنى لـ لـ تصميم——لأجل تنفيذ اعتراض قطع/شبكة صلة منطق.
:::

## نوع أمان حدث

Harness استخدام TypeScript إعلان دمج قدوم لـ حدث توفير نوع أمان:

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

## Cordis حدث و جلسة سجل

Harness Cordis حدث التزام دوران `namespace/action` تسمية، مثال مثل `agent/pre-step`،`agent/request`،`agent/request-error`،`tools/result` و `session/event`. كامل توقيع و إطلاق نمط رؤية[فرعي نظام صفحة](../../../subsystems/core.ar.md) فوق توليد `cordis-surface` منطقة كتلة.

`turn/*`،`step/*`،`tool/call`،`tool/result` و `compaction/*` هو حفظ دائم جلسة حدث نوع، لا هو نفس اسم Cordis حدث. حاجة مراقبة هو جمع وقت، استماع `session/event` و فحص `event.type`.

## حدث مستمع أيضا هو فاعلية نتيجة

عبر `ctx.on()` تسجيل مستمع سوف في إضافة إزالة وقت تلقائي إزالة:

```ts ignore-check
export function apply(ctx: Context) {
  // This listener is removed when the plugin disposes.
  ctx.on('tools/result', handler)
}
```

## عرض مثال: سجل إضافة

هذا عدد إضافة سجل أداة استدعاء و أداة نتيجة:

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

## تحت واحد خطوة

- [قدرة قسم طبقة](../practice/index.ar.md) — حل قدرة واجهة في حدث
- [LLM(كبير لغة نموذج) مهايئ](../practice/llm-adapter.ar.md) — تنفيذ واحد كامل LLM خلفية
