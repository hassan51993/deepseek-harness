# 6. التركيب وHMR

[English](06-composition-and-hmr.md) | العربية

كلُّ قدرة بنيتها حتى الآن إضافة، و`cordis.yml` يختار شجرةَ إضافات التطبيق. ويغيّر هذا الفصل ذلك التركيب، ويعيد تحميلَ إضافة حارًّا، ويشخّص إضافةً لا تُحمَّل قط.

## المداخل أكثر من اسم

يقبل مدخلُ الإعداد بياناتٍ وصفية تتجاوز `name` و`config`:

```yaml
- id: greeter          # stable identity for this entry
  name: './greeter.ts'
- id: consumer
  name: './consumer.ts'
  disabled: true       # keep the entry, skip mounting it
```

و`id` يعطي المدخلَ هويةً ثابتة ليميّز المحمِّلُ تعديلَ مدخل قائم من حذفه وإضافة غيره. و`disabled: true` يفكّ تركيبَ إضافة بلا حذف مدخلها؛ فأعِدها وتُحمَّل الإضافةُ (وكلُّ ما ينتظر خدماتِها في PENDING) من جديد.

والمجموعاتُ تُدخل قائمةً فرعية من المداخل تُحمَّل وتُفرَّغ وحدةً واحدة، و`isolate` يعطي المجموعةَ نسخةً خاصة من اسم خدمة، فترى مجموعتان مزوّدَ `shell` مضبوطًا ضبطًا مختلفًا كلٌّ منهما بلا أثر على الأخرى. ويغطي [مدخل Cordis](../cordis-primer.ar.md) و[مثال عزل الخدمات](../user/develop/framework/service.ar.md#service-isolation) التفاصيل.

## الاستبدال الحارّ للوحدات

لأن التفريغَ يطلق الآثار ([الفصل الثاني](02-lifecycle-and-effects.ar.md)) ولأن التحميلَ يتبع الاعتماديات ([الفصل الثالث](03-services.ar.md))، يستطيع HMR استبدالَ إضافة عاملة بتفريغها وتحميلها. وإضافةُ `@deepseek-ai/dsh-hmr` تراقب ملفاتك وتفعل ذلك بالضبط عند الحفظ.

في `tmp/cordis-tutorial`، اكتب `cordis.yml`:

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

وانضمت إضافتا دعم إلى القائمة: فـ HMR يسجّل عبر خدمة التسجيل في Cordis، فبلا مصدِّر لوحة تحكم لن ترى رسائلَه، وهو يحقن خدمةَ `timer` للتهدئة؛ فبلا `@deepseek-ai/cordis-plugin-timer` يجلس في PENDING إلى الأبد، صامتًا. وذلك الصمتُ موضوعُ القسم التالي.

ويقرأ HMR داخليّاتِ محمِّل Node عبر المساعد الأصيل في Loader. فشغّل Cordis تحت tsx:

```sh
node --import tsx ../../vendor/cordis/bin.js
```

والآن عدّل `hello.ts` بتغيير رسالة السجل واحفظ:

```
hello from my first plugin
2026-07-22 15:44:36 [I] hmr watching [ '.' ]
2026-07-22 15:44:39 [I] hmr reload plugin at hello.ts
hello from my EDITED plugin
```

فتُفرَّغ النسخةُ القديمة (وتنفكّ كلُّ آثارها)، وتُحمَّل الشفرةُ الجديدة، ويعمل `apply` ثانيةً. أوقف العمليةَ بـ Ctrl-C. وتعديلُ `cordis.yml` نفسه يُلتقط أيضًا: فالمحمِّلُ يقارن المداخلَ بـ `id` ولا يركّب ولا يفكّ ولا يعيد ضبط إلا ما تغيّر. ولهذا تحمل المداخلُ أعلاه `id` صريحًا؛ فالمدخلُ بلا `id` يأخذ معرّفًا مولَّدًا عند كل قراءة، فبعد أي تعديل لملف الإعداد يُعَدّ محذوفًا ومضافًا ويُعاد تركيبُه وإن لم تتغيّر أسطرُه هو.

## تشخيص إضافة لا تُحمَّل قط

والوجهُ الآخر للتحميل بقيادة الاعتماديات: أن الإضافةَ التي تسمّي `inject` عندها خدمةً لا يوفّرها أحد تنتظر إلى الأبد ولا تطبع شيئًا. ولا خطأ، فـ PENDING حالةٌ مشروعة، إذ قد يُركَّب المزوّد لاحقًا.

وتستطيع رؤيةَ الحالات مباشرةً. فكلُّ سياق يستطيع تعدادَ registry الإضافات؛ أنشئ `diagnose.ts`:

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

وإضافةً باعتمادية لا تُستوفى، `needs-timer.ts`:

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

شغّله (بـ `node --import tsx ../../vendor/cordis/bin.js` مجرّدًا؛ وأوقفه بـ Ctrl-C):

```
needs-timer is PENDING — a required service is missing
```

فـ `inject: ['timer']` لا مزوّد لها. أضف `- name: '@deepseek-ai/cordis-plugin-timer'` إلى القائمة فتُحمَّل الإضافة. وحين لا تفعل إضافةٌ شيئًا ولا تبلّغ بشيء، افحص حالةَ fiber عندها. والتعدادُ بلا ترشيح PENDING يعرض أيضًا إضافات المحمِّل نفسه (Loader وInclude) في حالة ACTIVE، لأن الإضافات تركّب ملفَّ الإعداد نفسه.

التالي: [إلى الإطار](07-into-the-harness.ar.md)، أي الأنماطُ نفسها مقابل خدمات الإطار الحقيقية.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
