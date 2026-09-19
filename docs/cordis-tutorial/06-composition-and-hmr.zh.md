# 6. تركيب و HMR(حار وحدة استبدال)

[English](06-composition-and-hmr.md) | العربية

إلى هدف قبل لـ توقف بناء كل بند قدرة كل هو إضافة،`cordis.yml` فإن اختيار تطبيق إضافة شجرة. هذا فصل سوف تغيير هذا نوع تركيب، حار إعادة تحميل واحد إضافة، و تشخيص بداية نهاية لا يمكن تحميل إضافة.

## Cordis بند إعداد لا فقط لديه اسم

Cordis بند إعداد حذف `name` و `config`، أيضا قبول أخرى بيانات وصفية:

```yaml
- id: greeter          # stable identity for this entry
  name: './greeter.ts'
- id: consumer
  name: './consumer.ts'
  disabled: true       # keep the entry, skip mounting it
```

`id` لـ Cordis بند إعداد توفير مستقر معرف، جعل loader قدرة منطقة قسم تعديل قائم Cordis بند إعداد و أولا حذف مجددا إضافة.`disabled: true` سوف إزالة إضافة بينما لا حذف ذلك Cordis بند إعداد؛ تعديل عودة أصل قيمة بعد، إضافة و كل بسبب اعتماد ذلك خدمة بينما موضع في PENDING إضافة كل سوف مجددا مرة تحميل.

مجموعة يمكن تضمين طقم واحد نسخة Cordis بند إعداد فرعي قائمة، و سوف ذلك بصفة واحد وحدة تحميل و إزالة؛`isolate` فإن لـ واحد مجموعة توفير بعض بند خدمة اسم مستقل نسخة، لذلك اثنان عدد مجموعة يمكن كل منها يرى إعداد مختلف `shell` مزود، متبادل لا أثر.[Cordis دخول باب](../cordis-primer.zh.md) و[خدمة عزل عرض مثال](../user/develop/framework/service.zh.md#service-isolation) وسيط تعريف تفصيل دقيق محتوى.

## حار وحدة استبدال

إزالة سوف تحرير effect([رقم 2 فصل](02-lifecycle-and-effects.zh.md)) ، تحميل فإن التزام دوران اعتماد علاقة ([رقم 3 فصل](03-services.zh.md)) ، لذلك HMR يمكن أولا إزالة، مجددا تحميل، بـ استبدال صحيح في تشغيل إضافة.`@deepseek-ai/dsh-hmr` إضافة سوف مراقبة نظر ملف، و في حفظ وقت تنفيذ هذا واحد مرور مسار.

في `tmp/cordis-tutorial` في تحرير كتابة `cordis.yml`:

```yaml
- id: logger
  name: '@deepseek-ai/cordis-plugin-logger-console'
- id: timer
  name: '@deepseek-ai/cordis-plugin-timer'
- id: hmr
  name: '@deepseek-ai/dsh-hmr'
  config:
    root: ['.']
- id: hello
  name: './hello.ts'
```

قائمة في زيادة اثنان عدد مساعد مساعدة إضافة:HMR عبر Cordis logger خدمة سجل سجل، لذلك لا يوجد تحكم منصة توجيه خروج جهاز وقت نظر لا إلى ذلك رسالة؛ هو أيضا سوف `inject` `timer` خدمة قدوم تنفيذ ذهاب اهتزاز، إذا لا يوجد `@deepseek-ai/cordis-plugin-timer`، هو حينئذ سوف دائم بعيد توقف في PENDING، بينما كما لا إرسال خروج أي تلميح. تحت واحد عقدة حينئذ نقاش نقاش هذا نوع ساكن صامت حالة.

HMR عبر Loader أصلي مساعد مساعدة أداة قراءة Node loader داخلي بنية. طلب في tsx تحت تشغيل Cordis:

```sh
node --import tsx ../../vendor/cordis/bin.js
```

الآن تحرير `hello.ts`، تعديل سجل رسالة و حفظ:

```
hello from my first plugin
2026-07-22 15:44:36 [I] hmr watching [ '.' ]
2026-07-22 15:44:39 [I] hmr reload plugin at hello.ts
hello from my EDITED plugin
```

قديم نسخة أولا إزالة (ذلك كل effect كل سوف عودة لفة) ، جديد شفرة مع بعد تحميل،`apply` مجددا مرة تشغيل. حسب Ctrl-C إيقاف عملية. تحرير `cordis.yml` ذاته أيضا سوف إطلاق تحديث:loader حسب `id` مقارنة مقارنة Cordis بند إعداد، فقط تركيب، إزالة أو إعادة إعداد حدوث تغير جزء. هذا حينئذ هو فوق وصف Cordis بند إعداد صريح يحمل `id` سبب: لا حمل هذا حقل Cordis بند إعداد في كل مرة قراءة وقت كل سوف نيل نيل واحد جديد توليد id، الذي بـ فقط يلزم ملف إعداد حدوث أي تحرير، أي جعل ذاته نص لم تغيير، هو أيضا سوف يتم نظر لـ أولا حذف مجددا إضافة و إعادة تركيب.

## تشخيص بداية نهاية لا يمكن تحميل إضافة

اعتماد قيادة تحميل أيضا لديه آخر وجه: إذا إضافة `inject` إشارة تحديد بلا شخص توفير خدمة، هو حينئذ سوف واحد مباشر انتظار، لا إخراج أي محتوى. هذا لا هو خطأ، لأن PENDING هو دمج قاعدة حالة، مزود ممكن قليلا بعد عندئذ تركيب.

أنت يمكن مباشر فحص نظر هذه حالة. كل سياق كل قدرة قطعة رفع إضافة سجل التسجيل؛ إنشاء `diagnose.ts`:

```ts
import { FiberState, type Context } from '@deepseek-ai/cordis'

export const name = 'diagnose'

export function apply(ctx: Context) {
  setTimeout(() => {
    for (const runtime of ctx.registry.values()) {
      for (const fiber of runtime.fibers) {
        if (fiber.state === FiberState.PENDING) {
          console.log(`${fiber.name} is PENDING — a required service is missing`)
        }
      }
    }
  }, 500)
}
```

مجددا إنشاء واحد اعتماد لا يمكن ممتلئ كاف إضافة `needs-timer.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'needs-timer'
export const inject = ['timer']

export function apply(ctx: Context) {
  console.log('needs-timer loaded')
}
```

```yaml
- name: './needs-timer.ts'
- name: './diagnose.ts'
```

تشغيل هو (مباشر تنفيذ `node --import tsx ../../vendor/cordis/bin.js`، حسب Ctrl-C إيقاف):

```
needs-timer is PENDING — a required service is missing
```

`inject: ['timer']` لا يوجد مزود. نحو قائمة إضافة `- name: '@deepseek-ai/cordis-plugin-timer'` بعد، إضافة حينئذ سوف تحميل. إذا إضافة حيث لا تنفيذ أي عملية، أيضا لا تقرير إبلاغ أي محتوى، طلب فحص ذلك fiber حالة. لا إضافة PENDING مرور ترشيح شرط إجراء تكرار بديل وقت، أيضا سوف يرى loader ذاته إضافة (Loader،Include) موضع في ACTIVE، لأن ملف إعداد ذاته أيضا هو عبر إضافة تركيب.

تحت واحد فصل:[دخول harness](07-into-the-harness.zh.md): يأخذ نفسه نمط لأجل حقيقي harness خدمة.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
