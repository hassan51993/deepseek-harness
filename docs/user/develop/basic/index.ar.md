# رقم واحد إضافة

[English](index.md) | العربية

هذا تعليم مسار سوف إنشاء واحد الأكثر صغير Harness إضافة، و سوف ذلك تحميل إلى Web UI في. طلب من قد إتمام[من شفرة المصدر تشغيل مسار](../../../../README.ar.md#run-from-source) مستودع فحص خروج بدء.

## إنشاء محلي مشروع

في مستودع أصل دليل إنشاء هذا تعليم مسار استخدام مؤقت مشروع:

```sh
mkdir -p scratch-plugin/src
```

## إضافة هو ماذا

في Harness في، إضافة هو واحد توجيه خروج `apply` دالة TypeScript وحدة. إطار هيكل في تحميل وقت استدعاء `apply`، نقل دخول واحد `ctx`(سياق كائن) ، أنت عبر `ctx` تسجيل قدرة:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-plugin'

export function apply(ctx: Context) {
  // Register capabilities here.
}
```

هذا حينئذ هو كامل إعداد.

## إنشاء إضافة ملف

إنشاء `scratch-plugin/src/my-plugin.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  // Required dependencies are ready before apply runs.
  console.log('[hello-plugin] plugin loaded!')
}
```

## تسجيل إلى cordis.yml

في مستودع أصل دليل تشغيل `pwd`، لكن بعد إنشاء `scratch-plugin/cordis.yml`، بصفة إدراج دخول محلي إضافة Web تغطية طبقة. طلب سوف تحت نص `/absolute/path/to/deepseek-harness` استبدال لـ أمر ضرب طبع مسار:

```yaml
- insert:
    - id: hello
      name: '/absolute/path/to/deepseek-harness/scratch-plugin/src/my-plugin.ts'
```

إضافة مسار يجب هو قطعا مقابل مسار.patch ملف فقط مساهمة إعداد، لن تغيير loader تحليل وحدة مسار وقت استخدام profile دليل.

استخدام هذا تغطية طبقة بدء Web UI:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

فتح `http://127.0.0.1:3080`. بدء خلال، طرفية سوف ضرب طبع `[hello-plugin] plugin loaded!`.

## تلقائي تنظيف

عبر `ctx` تسجيل أي شرق غرب——حدث استماع، أداة، تحديد وقت جهاز——في إضافة إزالة وقت كل سوف يتم تلقائي تنظيف. أنت لا حاجة يد حركة removeListener أو clearInterval.

إذا أنت لديه حاجة يد حركة تنظيف مورد (مقارنة مثل واحد شبكة شبكة اتصال) ، استخدام `ctx.effect()` إبلاغ إبلاغ إطار هيكل كيف ما تنظيف:

```ts
import type { Context } from '@deepseek-ai/cordis'

export function apply(ctx: Context) {
  ctx.effect(() => {
    const timer = setInterval(() => {
      console.log('heartbeat')
    }, 5000)

    // The returned function runs when the plugin unloads.
    return () => clearInterval(timer)
  })
}
```

## إعلان اعتماد

إذا أنت إضافة حاجة استخدام أخرى خدمة (مثل `tools`،`llm`) ، حاجة إعلان `inject`:

```ts ignore-check
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-tool-plugin'
export const inject = ['tools']

export function apply(ctx: Context) {
  // ctx.tools is ready here.
  ctx.tools.register(/* ... */)
}
```

إطار هيكل سوف تأكيد حفظ اعتماد خدمة حينئذ خيط بعد عندئذ تحميل أنت إضافة.

## إضافة ثلاثة نوع شكل

حذف دالة شكل صيغة، إضافة أيضا دعم حمل كائن شكل صيغة و صنف شكل صيغة:

### كائن شكل صيغة

```ts
import type { Context } from '@deepseek-ai/cordis'

export default {
  name: 'my-plugin',
  inject: ['tools'],
  apply(ctx: Context) {
    // ...
  },
}
```

### صنف شكل صيغة

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

export default class MyService extends Service {
  static inject = ['tools']

  constructor(ctx: Context) {
    super(ctx, 'myService')
    // Perform synchronous initialization in the constructor.
  }
}
```

كبير كثير عدد حال حال تحت، دالة شكل صيغة كاف كاف. عند إضافة حاجة نحو أخرى إضافة توفير خدمة وقت، يمكن استخدام صنف شكل صيغة (رؤية [خدمة و اعتماد](../framework/service.ar.md)).

## تحت واحد خطوة

- [تطوير واحد أداة](./tool.ar.md) — حل أداة تعريف DSL
- [إضافة إعداد](./config.ar.md) — يجعل إضافة قبول مستخدم إعداد
- [Cordis إطار هيكل تعليم مسار](../../../cordis-tutorial/index.ar.md) — قاع طبقة إضافة إطار هيكل، في مؤقت دليل في حركة يد بناء، بلا حاجة API مفتاح
