# 3. الخدمات

[English](03-services.md) | العربية

**الخدمة** قدرةٌ مسمّاة توفّرها إضافةٌ وتستهلكها إضافاتٌ أخرى عبر `ctx`. وفي الإطار، `ctx.tools` و`ctx.llm` و`ctx.agents` خدمات. والمستهلكُ يسمّي القدرةَ، مثل `'tools'`، ولا يستورد مزوّدَها، فيستطيع الإعدادُ اختيارَ مزوّد بلا تغيير المستهلك.

## وفّر خدمة

أنشئ `greeter.ts` في `tmp/cordis-tutorial`:

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

وجزآن يعملان معًا:

- **في وقت التشغيل**: `super(ctx, 'greeter')` يسجّل النسخةَ باسم `greeter`. ومن ثَم تستطيع أي إضافة بلوغَها بـ `ctx.greeter`. والتسجيلُ أثر، فتفريغُ المزوّد يزيل الخدمة.
- **في وقت التصريف**: كتلةُ `declare module '@deepseek-ai/cordis'` دمجُ تصريحات في TypeScript. وهي تضيف `greeter` إلى واجهة `Context` ليجتاز `ctx.greeter` فحصَ الأنواع في كل موضع. وهي لا تولّد شفرة؛ وبدونها تعمل الخدمةُ في وقت التشغيل مع ذلك، لكن يفقد المستهلكون أمانَ الأنواع.

والصنفُ الفرعي من `Service` إضافةٌ بنفسه (وهي صيغةُ الصنف من الفصل الأول)، فـ `ctx.plugin(GreeterService)` يركّبه كأي إضافة أخرى.

## استهلك خدمة بـ `inject`

أنشئ `consumer.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'consumer'
export const inject = ['greeter']

export function apply(ctx: Context) {
  console.log(ctx.greeter.greet('world'))
}
```

و`inject` تعدّد الخدماتِ التي تشترطها هذه الإضافة. ويُبقي Cordis الإضافةَ في PENDING حتى توجد كلُّ خدمة مذكورة، فداخل `apply` يكون `ctx.greeter` جاهزًا مضمونًا. ولا يهم ترتيبُ التحميل في `cordis.yml`: فالاعتمادياتُ لا ترتيبُ الملف هي التي تقرّر متى تُقلع الإضافات.

ركّب وشغّل:

```yaml
- name: './greeter.ts'
- name: './consumer.ts'
```

```
Hello, world!
```

بدّل السطرين في `cordis.yml` وأعِد التشغيل: فالخرجُ نفسه. وجرّب حذفَ `./greeter.ts` كلَّه: فيبقى المستهلكُ في PENDING ولا يطبع شيئًا، بلا انهيار وبلا تشغيل جزئي. والـ fiber في PENDING لا يُبقي حلقةَ أحداث Node حيةً أيضًا، فالتركيبُ الذي لا شيء آخر يعمل فيه يخرج بالرمز 0 صامتًا. ويعرض [الفصل السادس](06-composition-and-hmr.ar.md) كيف تشخّص تلك الحالة.

## الاعتماديات متتبَّعة بعد التحميل

`inject` ليست فحصَ إقلاع لمرة واحدة. فإن اختفت خدمةٌ مطلوبة والتطبيقُ يعمل، لأن مزوّدَها فُرِّغ أو استُبدل حارًّا، فُرِّغت كلُّ إضافة تعتمد عليها أيضًا، وحُمِّلت من جديد حين تعود الخدمة. ومع الآثار ([الفصل الثاني](02-lifecycle-and-effects.ar.md)) يمنع هذا مستهلكًا عاملًا من الاحتفاظ بمرجع إلى خدمة غير متاحة: فتسجيلاتُه هو تنفكّ حين تختفي الاعتمادية.

ولهذا يعمل استبدالُ الخدمات في الإعداد أيضًا: فرّغ مدخلَ `dsh-bash-local`، وركّب مزوّدَ `shell` مختلفًا، فتُعاد كلُّ إضافة تحقن `'shell'` إقلاعًا نظيفًا مقابل التنفيذ الجديد.

## الاعتماديات الاختيارية

`inject` للاشتراطات القاطعة. أما القدرةُ التي تستطيع الإضافةُ العيشَ بدونها، فتخطَّ `inject` واسبر عند موضع الاستعمال:

```ts ignore-check
export function apply(ctx: Context) {
  // undefined when no provider is loaded; the plugin still runs.
  const greeter = ctx.get('greeter')
  console.log(greeter?.greet('maybe') ?? 'no greeter available')
}
```

## التسمية

تسكن أسماءُ الخدمات في فضاء أسماء مسطّح واحد لكل تطبيق. فضع لخدماتك بادئةً أو فضاءَ أسماء مميّزًا (فالإطارُ يحجز أسماءً مجرّدة مثل `tools` و`llm`)؛ وتعدّد مناطقُ `cordis-surface` المولَّدة في [صفحات الأنظمة الفرعية](../subsystems/core.ar.md) كلَّ اسم يسجّله الإطار.

التالي: [الأحداث](04-events.ar.md)، أي التواصل بلا خدمة مشتركة.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
