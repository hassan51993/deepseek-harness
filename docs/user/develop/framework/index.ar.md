# إضافة و دورة الحياة

[English](index.md) | العربية

هذا صفحة وسيط تعريف Cordis إضافة نموذج و دورة الحياة حالة آلة.

## Fiber حالة آلة

كل يتم تحميل إضافة كل يملك واحد **Fiber** أثر مجال، ذلك حالة مثل تحت:

```
PENDING → LOADING → ACTIVE
                 ↘ FAILED
ACTIVE → UNLOADING → DISPOSED
```

| حالة | يحتوي معنى |
|------|------|
| PENDING | قد إعلان، لكن الذي يحتاج اعتماد لم حينئذ خيط |
| LOADING | اعتماد حينئذ خيط، جارٍ تنفيذ `apply` |
| ACTIVE | إضافة تشغيل في |
| FAILED | `apply` رمي خروج استثناء |
| UNLOADING | إضافة جارٍ إزالة و تحرير مورد |
| DISPOSED | قد تماما إزالة |

## اعتماد قيادة تحميل

إعلان `inject` إضافة سوف انتظار كل مطلوب خدمة حينئذ خيط:

```ts ignore-check
export const inject = ['tools', 'llm']

export function apply(ctx: Context) {
  // ctx.tools and ctx.llm are ready here.
}
```

إذا اعتماد خدمة إزالة فقد (مثال مثل مزود يتم استبدال وقت) ، إضافة سوف يتم تلقائي إزالة (ACTIVE → DISPOSED) ، انتظار خدمة استعادة بعد إعادة تحميل.

## تلقائي تنظيف آلية

عبر `ctx` فعل أي تسجيل، في إضافة إزالة وقت كل سوف تلقائي سحب إلغاء:

```ts ignore-check
export function apply(ctx: Context) {
  // Event listener: removed automatically on unload.
  ctx.on('some-event', handler)

  // Custom resource: the returned disposer runs on unload.
  ctx.effect(() => {
    const connection = createConnection()
    return () => connection.close()
  })
}
```

التالي عملية كل سوف يتم تلقائي تتبع أثر و تنظيف:
- `ctx.on(event, handler)` — حدث استماع
- `ctx.tools.register(tool)` — أداة تسجيل
- `ctx.llm.registerAdapter(names, adapter)` — LLM(كبير لغة نموذج) مهايئ تسجيل
- `ctx.effect(() => cleanup)` — ذاتي تعريف مورد

إضافة إزالة وقت، موضع وضع جهاز حسب تسجيل ترتيب عكس ترتيب بدء استدعاء، لكن كثير عدد مختلف خطوة موضع وضع جهاز سوف تزامن تنفيذ، لا حفظ إثبات تدريجي عدد إتمام. وجود ترتيب اعتماد تنظيف خطوة يجب وضع دخول نفس عدد `ctx.effect()` إرجاع موضع وضع جهاز في، من هذا موضع وضع جهاز مسؤول سلسلة سطر انتظار.

## تضمين طقم سياق

`ctx.plugin()` إنشاء فرعي Fiber، هو وراثة أب سياق لكن لديه مستقل دورة الحياة:

```ts ignore-check
export function apply(ctx: Context) {
  // Register a child plugin.
  ctx.plugin(childPlugin)

  // The child has its own Fiber and unloads with its parent.
}
```

## dispose(مورد تحرير) دلالة

عند أنت حاجة رفع قبل إنهاء واحد إضافة نسخة:

```ts
import type { Context } from '@deepseek-ai/cordis'

declare const ctx: Context
declare function myPlugin(ctx: Context): void

const fiber = ctx.plugin(myPlugin)

// Dispose it manually later.
await fiber.dispose()
```

`dispose` حفظ إثبات:
1. هذا إضافة يملك كل تسجيل متساو يتم إزالة
2. هو فرعي إضافة أيضا يتم تمرير عودة إزالة
3. إرجاع Promise سوف في كل مختلف خطوة تنظيف إتمام بعد صرف الآن

## HMR(حار وحدة استبدال)

عبر `cordis.yml` تحميل `@deepseek-ai/dsh-hmr` بعد، تعديل إضافة مصدر ملف سوف إطلاق:

1. إزالة قديم إضافة (تنظيف كل تسجيل)
2. إعادة تحميل جديد شفرة
3. تنفيذ جديد `apply`

لأن إضافة تسجيل سوف يتم تلقائي تنظيف، الذي بـ حار استبدال لن إبقاء قديم نسخة تسجيل.

## دورة الحياة عرض مثال

```ts ignore-check
export function apply(ctx: Context) {
  console.log('plugin loading')

  ctx.effect(() => {
    console.log('effect registered')
    return () => console.log('effect cleaned up')
  })
}
```

تحميل وقت إخراج:
```
plugin loading
effect registered
```

إزالة وقت إخراج:
```
effect cleaned up
```

## تحت واحد خطوة

- [خدمة و اعتماد](./service.ar.md) — يجعل إضافة نحو أخرى إضافة توفير قدرة
- [حدث نظام](./events.ar.md) — في إضافة بين عبر معلومة
- [Cordis إطار هيكل تعليم مسار](../../../cordis-tutorial/index.ar.md) — في Cordis وقت التشغيل فوق تدريجي خطوة تركيب خروج نفس طقم دورة الحياة، خدمة و حدث
