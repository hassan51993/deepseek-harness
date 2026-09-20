# إضافتك الأولى

[English](index.md) | العربية

ينشئ هذا الدرس إضافةَ إطار دنيا ويحمّلها في واجهة Web. ابدأ من نسخة عمل للمستودع أكملت [مسار التشغيل من المصدر](../../../../README.ar.md#run-from-source).

## أنشئ مشروعًا محليًا

من جذر المستودع، أنشئ مشروعًا مؤقتًا للدرس:

```sh
mkdir -p scratch-plugin/src
```

## ما الإضافة؟

الإضافةُ في الإطار وحدةُ TypeScript تصدّر دالةَ `apply`. ويستدعي الإطارُ `apply` عند تحميل الإضافة ويمرّر كائنَ سياق `ctx` تسجّل الإضافةُ قدراتِها عبره:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-plugin'

export function apply(ctx: Context) {
  // Register capabilities here.
}
```

وهذا هو الإعداد كله.

## أنشئ ملف الإضافة

أنشئ `scratch-plugin/src/my-plugin.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  // Required dependencies are ready before apply runs.
  console.log('[hello-plugin] plugin loaded!')
}
```

## سجّلها في cordis.yml

شغّل `pwd` من جذر المستودع، ثم أنشئ `scratch-plugin/cordis.yml` طبقةً لـ Web تدرج الإضافةَ المحلية. واستبدل `/absolute/path/to/deepseek-harness` أدناه بالمسار المطبوع:

```yaml
- insert:
    - id: hello
      name: '/absolute/path/to/deepseek-harness/scratch-plugin/src/my-plugin.ts'
```

ويجب أن يكون مسار الإضافة مطلقًا. فملفُّ patch يسهم بإعداد لكنه لا يغيّر دليلَ الـ profile الذي يحلّ المحمِّلُ مساراتِ الوحدات منه.

أقلع واجهة Web بتلك الطبقة:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

افتح `http://127.0.0.1:3080`. فتطبع الطرفيةُ `[hello-plugin] plugin loaded!` أثناء الإقلاع.

## التنظيف التلقائي

كل ما يُسجَّل عبر `ctx`، من مستمعي أحداث وأدوات ومؤقّتات، يُنظَّف عند تفريغ الإضافة. فلا حاجة إلى استدعاء removeListener ولا clearInterval يدويًا.

أما المورد الذي يحتاج تنظيفًا صريحًا، مثل اتصال شبكة، فاستعمل `ctx.effect()` لتوفير محرِّره:

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

## أعلن الاعتماديات

إن استهلكت الإضافةُ خدمةً أخرى مثل `tools` أو `llm`، فأعلنها في `inject`:

```ts ignore-check
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-tool-plugin'
export const inject = ['tools']

export function apply(ctx: Context) {
  // ctx.tools is ready here.
  ctx.tools.register(/* ... */)
}
```

وينتظر الإطارُ كلَّ خدمة مطلوبة قبل تحميل الإضافة.

## صيغ الإضافات الثلاث

إضافةً إلى وحدة الدالة، تستطيع الإضافةُ استعمالَ صيغة الكائن أو صيغة الصنف.

### صيغة الكائن

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

### صيغة الصنف

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

وصيغةُ الدالة تكفي في معظم الحالات. واستعمل صيغةَ الصنف حين توفّر الإضافةُ خدمةً لإضافات أخرى؛ انظر [الخدمات والاعتماديات](../framework/service.ar.md).

## الخطوات التالية

- [بناء أداة](./tool.ar.md): تعلّم اللغةَ الوصفية لتعريف الأدوات
- [إعداد الإضافات](./config.ar.md): اقبل إعدادَ المستخدم
- [درس Cordis](../../../cordis-tutorial/index.ar.md): إطارُ الإضافات الذي تحتها، مبنيًّا من دليل مؤقت بلا مفتاح واجهة
