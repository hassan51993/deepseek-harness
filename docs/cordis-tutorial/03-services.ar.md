# 3. خدمة

[English](03-services.md) | العربية

**خدمة**هو واحد إضافة توفير، أخرى إضافة عبر `ctx` إزالة استهلاك أداة اسم قدرة. في harness في،`ctx.tools`،`ctx.llm` و `ctx.agents` كل هو خدمة. مستهلك فقط إشارة تحديد `'tools'` لـ صنف قدرة، بينما لا استيراد ذلك مزود، لذلك إعداد يمكن اختيار مزود، بلا حاجة تعديل مستهلك.

## توفير خدمة

إنشاء `greeter.ts`، سوف هو وضع في `tmp/cordis-tutorial` في:

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context {
    greeter: GreeterService
  }
}

export class GreeterService extends Service {
  constructor(ctx: Context) {
    super(ctx, 'greeter')
  }

  greet(who: string) {
    return `Hello, ${who}!`
  }
}

export const name = 'greeter'

export function apply(ctx: Context) {
  ctx.plugin(GreeterService)
}
```

اثنان جزء تنسيق نفس عمل:

- **وقت التشغيل**:`super(ctx, 'greeter')` بـ اسم `greeter` تسجيل هذا نسخة. هذا بعد، أي إضافة كل يمكن عبر `ctx.greeter` وصول هو. تسجيل يخص effect، إزالة مزود وقت سوف إزالة هذا خدمة.
- **تحرير ترجمة وقت**:`declare module '@deepseek-ai/cordis'` كتلة استخدام TypeScript إعلان دمج، يأخذ `greeter` إضافة دخول `Context` واجهة، جعل `ctx.greeter` في كل موضع كل قدرة عبر نوع فحص. هو لن توليد شفرة؛ لا يوجد هذا إعلان وقت، خدمة في وقت التشغيل ما زال قدرة عمل، لكن مستهلك سوف فقد ذهاب نوع أمان.

`Service` فرعي صنف ذاته حينئذ هو إضافة (رقم 1 فصل وسيط تعريف صنف شكل) ، لذلك `ctx.plugin(GreeterService)` سوف مثل تركيب أخرى إضافة واحد مثال تركيب هو.

## استخدام `inject` إزالة استهلاك خدمة

إنشاء `consumer.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'consumer'
export const inject = ['greeter']

export function apply(ctx: Context) {
  console.log(ctx.greeter.greet('world'))
}
```

`inject` صف خروج هذا إضافة حاجة خدمة.Cordis سوف يجعل إضافة إبقاء PENDING، مباشر إلى صف خروج كل بند خدمة كل وجود، لذلك في `apply` داخل يمكن حفظ إثبات `ctx.greeter` قد حينئذ خيط.`cordis.yml` في تحميل ترتيب غير متصل ضيق يلزم: قرار إضافة أي وقت بدء هو اعتماد علاقة، بينما لا هو ملف ترتيب.

تركيب و تشغيل:

```yaml
- name: './greeter.ts'
- name: './consumer.ts'
```

```
Hello, world!
```

تسليم تبديل `cordis.yml` في اثنان سطر ترتيب بعد إعادة تشغيل، إخراج ما زال نفسه. محاولة تجربة تام قاع إزالة `./greeter.ts`: مستهلك سوف إبقاء PENDING، لا إخراج أي محتوى، حيث لا انهيار انهيار، أيضا لن فقط تشغيل واحد جزء. موضع في PENDING fiber أيضا لن يجعل Node حدث حلقة إبقاء نشط وثب، لذلك إذا تركيب في لا يوجد أخرى تشغيل بند، عملية سوف ساكن صامت أرض بـ حالة رمز 0 خروج.[رقم 6 فصل](06-composition-and-hmr.ar.md) وسيط تعريف مثل أي تشخيص هذا نوع حالة.

## تحميل بعد ما زال سوف تتبع أثر اعتماد علاقة

`inject` و غير مرة صفة بدء فحص. إذا تطبيق تشغيل خلال الذي يحتاج خدمة إزالة فقد، مثال مثل مزود يتم إزالة أو حار استبدال، كل اعتماد إضافة أيضا سوف مع لـ إزالة، و في خدمة استعادة بعد مجددا مرة تحميل. ربط دمج effect([رقم 2 فصل](02-lifecycle-and-effects.ar.md)) ، هذا قدرة منع توقف تشغيل في مستهلك إبقاء مقابل غير ممكن استخدام خدمة مرجع: اعتماد إزالة فقد وقت، هو ذاتي ذات تسجيل أيضا سوف سحب إلغاء.

هذا أيضا هو إعداد في يمكن استبدال خدمة سبب: إزالة Cordis بند إعداد `dsh-bash-local`، تركيب آخر عدد `shell` مزود، كل حقن `'shell'` إضافة كل سوف إعادة بدء و استخدام جديد تنفيذ.

## اختياري اعتماد

`inject` لأجل صلب صفة اعتماد. إذا بعض بند وظيفة ناقص وقت إضافة ما زال يمكن تشغيل، طلب قفز مرور `inject`، و في استخدام موضع استكشاف قياس:

```ts ignore-check
export function apply(ctx: Context) {
  // undefined when no provider is loaded; the plugin still runs.
  const greeter = ctx.get('greeter')
  console.log(greeter?.greet('maybe') ?? 'no greeter available')
}
```

## تسمية

كل تطبيق في خدمة اسم مشترك استخدام واحد مسطح مستو نطاق الأسماء. طلب لـ ذاتي لديه خدمة إضافة لديه تمييز تعرف درجة بادئة أو نطاق الأسماء (harness قد احتلال استخدام `tools` و `llm` انتظار عادي اسم) ؛[فرعي نظام صفحة](../subsystems/core.ar.md) فوق توليد `cordis-surface` منطقة كتلة صف خروج harness تسجيل كل اسم.

تحت واحد فصل:[حدث](04-events.ar.md): بلا حاجة مشترك خدمة يكفي عبر معلومة.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
