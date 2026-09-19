# 2. دورة الحياة و effect

[English](02-lifecycle-and-effects.md) | العربية

Cordis إضافة ممكن بسبب تعديل إعداد، حار إعادة تحميل، صريح مورد تحرير أو الذي يحتاج خدمة إزالة فقد بينما إزالة. عبر Cordis API بناء قيام تسجيل يخص effect، سوف في الذي تابع إضافة إزالة وقت سحب إلغاء؛ في هذه API خارج إدارة مورد يجب حزمة تركيب في `ctx.effect()` في.

## Effect

مقابل في Cordis بعد لم إدارة مورد، مثال مثل تحديد وقت جهاز، اتصال أو watcher، ينبغي سوف ذلك حزمة تركيب في `ctx.effect()` في و إرجاع disposer(مورد تحرير دالة):

إنشاء `lifecycle.ts`، سوف هو وضع في `tmp/cordis-tutorial` في:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'lifecycle-demo'

function heartbeat(ctx: Context) {
  console.log('heartbeat plugin loading')
  ctx.effect(() => {
    const timer = setInterval(() => console.log('tick'), 200)
    return () => {
      clearInterval(timer)
      console.log('heartbeat cleaned up')
    }
  })
}

export function apply(ctx: Context) {
  // Mount a child plugin and keep its fiber to dispose it later.
  const fiber = ctx.plugin(heartbeat)
  // The demo timer is itself an effect: if THIS plugin is unloaded first,
  // the pending callback is cancelled instead of firing on a dead app.
  ctx.effect(() => {
    const timer = setTimeout(async () => {
      await fiber.dispose()
      console.log('disposed')
      process.exit(0)
    }, 700)
    return () => clearTimeout(timer)
  })
}
```

يجعل `cordis.yml` إشارة نحو هذا ملف:

```yaml
- name: './lifecycle.ts'
```

تشغيل (`node --import tsx ../../vendor/cordis/bin.js`) بعد سوف نيل إلى:

```
heartbeat plugin loading
tick
tick
tick
heartbeat cleaned up
disposed
```

طلب إبقاء معنى ثلاثة نقطة:

- `ctx.plugin(heartbeat)` سوف يأخذ واحد**قدوم ذاتي شفرة**دالة تركيب لـ إضافة، هذا و YAML loader لـ كل بند إعداد تنفيذ عملية نفسه. دالة إضافة لا حاجة `apply` طريقة:Cordis سوف مباشر استدعاء هذا دالة، ذلك اسم فقط لأجل تشخيص. فقط لديه كائن شكل عندئذ اشتراط `apply` طريقة، مثال مثل `ctx.plugin({ apply(ctx) { /* ... */ } })`. استدعاء سوف إرجاع واحد **fiber**، أي واحد قد تحميل إضافة نسخة وقت التشغيل جملة مقبض.
- effect رئيسي جسم في تحميل خلال تشغيل؛ هو إرجاع disposer في إزالة خلال تشغيل. مقابل في دورة الحياة و إضافة متسق مورد، أنت أبدا حاجة ذاتي سطر استدعاء disposer.
- `fiber.dispose()` سوف انتظار هذا إضافة كل تنظيف عمل (يشمل مختلف خطوة disposer) إتمام بعد عندئذ انتهاء، و تمرير عودة إزالة هو تركيب كل فرعي إضافة.

## Fiber حالة آلة

كل قد تحميل إضافة نسخة كل يملك واحد fiber، و في التالي حالة بين تحويل:

```
PENDING → LOADING → ACTIVE → UNLOADING → DISPOSED
                 ↘ FAILED
```

- **PENDING**: قد إعلان، لكن الذي يحتاج خدمة (رقم 3 فصل) بعد غير ممكن استخدام.
- **LOADING / ACTIVE**:`apply` جارٍ تشغيل/اكتمل.
- **FAILED**:`apply` أو إعداد تحقق رمي خروج استثناء.
- **UNLOADING / DISPOSED**:disposer جارٍ تشغيل/واحد قطع متساو قد تفكيك حذف.

أنت سوف في[رقم 6 فصل](06-composition-and-hmr.ar.md) مجددا مرة لقاء إلى PENDING، هو عبر معتاد حينئذ هو «لـ ماذا أنا إضافة لا يوجد إخراج» جواب سجل.

## قد يخص effect عملية

أنت جدا قليل حاجة قريب ذاتي تحرير كتابة `ctx.effect()`، لأن داخل وضع تسجيل API ذاته قد هو effect:

- `ctx.on(event, listener)`: مستمع سوف في إزالة وقت إزالة ([رقم 4 فصل](04-events.ar.md)).
- `ctx.plugin(child)`: فرعي إضافة سوف مع أب إضافة واحد نفس dispose(مورد تحرير).
- خدمة تسجيل يخص effect.`ctx.tools.register(...)` انتظار harness سجل التسجيل أيضا سوف يأخذ إرجاع disposer مرفق حال إلى استدعاء إضافة فوق، لذلك سوف تلقائي سحب إلغاء ([رقم 7 فصل](07-into-the-harness.ar.md)).

مقابل في Cordis لا إدارة مورد، ينبغي في `ctx.effect()` داخل نيل أخذ هو، و إرجاع لأجل تحرير مورد disposer. هذا بعد Cordis سوف في إزالة خلال استدعاء هذا تحرير منطق، حار إعادة تحميل وقت أيضا لا مثال خارج.

لديه واحد بند ترتيب ملاحظة معنى أمر بند:disposer سوف حسب تسجيل ترتيب عكس ترتيب بدء، لكن كثير عدد**مختلف خطوة** disposer سوف تزامن تشغيل. إذا تفكيك حذف خطوة يجب حسب ترتيب تنفيذ، طلب يأخذ هو جمع وضع في نفس عدد disposer في، و في منها اعتماد مرة انتظار كل خطوة إتمام.

تحت واحد فصل:[خدمة](03-services.ar.md): إضافة مثل أي مشترك وظيفة.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
