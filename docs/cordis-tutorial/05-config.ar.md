# 5. الإعداد

[English](05-config.md) | العربية

يستطيع كل مدخل في `cordis.yml` حملَ كتلة `config`، وتعلن الإضافةُ schema يتحقق منها قبل تشغيل `apply`. والإعدادُ السيّئ يُفشِل التحميل بخطأ دقيق، فلا تُقلع الإضافةُ ناقصةَ الإعداد قط.

## إضافة قابلة للضبط

أنشئ `config-demo.ts` في `tmp/cordis-tutorial`:

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'

export const name = 'config-demo'

export interface Config {
  greeting: string
  targets: string[]
}

export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello'),
  targets: Schema.array(String).default(['world']),
})

export function apply(ctx: Context, config: Config) {
  for (const target of config.targets) {
    console.log(`${config.greeting}, ${target}!`)
  }
}
```

و`Config` المصدَّر واجهةُ TypeScript وschema في وقت التشغيل بالاسم نفسه: فيأخذ المستهلكون النوعَ، ويأخذ Cordis المدقّق. ويستعمل هذا المستودع [Schemastery](https://github.com/shigma/schemastery) في schemas؛ ويقبل Cordis نفسه أي مدقّق [Standard Schema](https://standardschema.dev/)، فالكائنُ العادي المصدَّر بوصفه `Config` لن يعمل.

اضبطها:

```yaml
- name: './config-demo.ts'
  config:
    targets: ['alpha', 'beta']
```

شغّل:

```
Hello, alpha!
Hello, beta!
```

وقد حُذف `greeting`، فملأه افتراضُ الـ schema؛ فـ `apply` يتلقى دائمًا إعدادًا كاملًا متحقَّقًا منه.

## السقوط المسموع

والآن أطعِمها شيئًا غيرَ صالح:

```yaml
- name: './config-demo.ts'
  config:
    targets: 'not-an-array'
```

```
ValidationError: invalid config:
  - $.targets expected array but got not-an-array (at targets)
```

فينتقل fiber الإضافة إلى FAILED، ويخرج مُقلِعُ هذا الدرس بالحالة 1 بعد طباعة الخطأ. وينبغي للإضافة أيضًا أن ترفض إعدادًا صالحًا في الـ schema لكنه يسمّي موردًا أو مزوّدًا غيرَ متاح، حالما تستطيع تحليلَ تلك الإحالة.

## قيم الإعداد المحسوبة

يدعم المحمِّلُ المستعمَل في هذا المستودع الوسمَ `!!js` لقيم الإعداد التي يجب حسابُها وقتَ التحميل:

```yaml
- name: './config-demo.ts'
  config:
    greeting: !!js process.env.DEMO_GREETING ?? 'Hello'
```

و`!!js` لا تعمل إلا داخل `config` وفي حقل `disabled` في المدخل. و`disabled: !!js ...` تُقيَّم مقابل سياق المحمِّل عند كل قرار تركيب (وهذا امتدادُ هذا المستودع)، فيستطيع الصفُّ أن يقيّد نفسه بالمنصة أو البيئة؛ أما بقيةُ البيانات الوصفية (`name` و`id` و`inject` وغيرها) فتبقى ساكنة، والتعبيرُ فيها بياناتٌ صادقة عادية. انظر [إعداد Loader](../cordis-primer.ar.md#loader-configuration).

التالي: [التركيب وHMR](06-composition-and-hmr.ar.md)، أي معاملة `cordis.yml` بوصفه التطبيق.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
