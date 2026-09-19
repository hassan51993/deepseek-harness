# 5. إعداد

[English](05-config.md) | العربية

`cordis.yml` في كل Cordis بند إعداد كل يمكن يحمل `config` كتلة، إضافة فإن إعلان واحد schema، في تشغيل `apply` قبل تحقق هذا كتلة. خطأ إعداد سوف توجيه يؤدي تحميل فشل، و إعطاء خروج دقيق تأكيد خطأ: إضافة أبدا سوف في إعداد لا كامل وقت بدء.

## يمكن إعداد إضافة

إنشاء `config-demo.ts`، و سوف ذلك وضع في `tmp/cordis-tutorial` في:

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

توجيه خروج `Config` حيث هو TypeScript واجهة، أيضا هو نفس اسم وقت التشغيل schema: مستهلك نيل نيل نوع،Cordis نيل نيل تحقق جهاز. هذا مستودع استخدام [Schemastery](https://github.com/shigma/schemastery) تعريف schema؛Cordis ذاته قبول مهمة معنى [Standard Schema](https://standardschema.dev/) تحقق جهاز، لذلك سوف عادي كائن توجيه خروج لـ `Config` لا يمكن عمل.

مقابل ذلك إجراء إعداد:

```yaml
- name: './config-demo.ts'
  config:
    targets: ['alpha', 'beta']
```

تشغيل:

```
Hello, alpha!
Hello, beta!
```

لم توفير `greeting`، لذلك schema قيمة افتراضية سوف سوف ذلك تكملة متساو:`apply` بداية نهاية سوف استلام إلى كامل كما مرور مرور تحقق إعداد.

## واضح تقرير خطأ

الآن نحو هو نقل دخول بلا فاعلية محتوى:

```yaml
- name: './config-demo.ts'
  config:
    targets: 'not-an-array'
```

```
ValidationError: invalid config:
  - $.targets expected array but got not-an-array (at targets)
```

إضافة fiber دخول FAILED حالة، هذا تعليم مسار بدء جهاز ضرب طبع خطأ بعد بـ حالة رمز 1 خروج. إذا بعض عدد إضافة إعداد عبر schema تحقق، لكن منها إشارة تحديد مورد أو مزود غير ممكن استخدام، هذا إضافة أيضا ينبغي عند في قدرة تحليل هذا مرجع وقت قيام أي رفض.

## حساب حساب نيل إلى إعداد قيمة

هذا مستودع استخدام loader دعم حمل `!!js` وسم، لأجل يجب في تحميل وقت حساب حساب إعداد قيمة:

```yaml
- name: './config-demo.ts'
  config:
    greeting: !!js process.env.DEMO_GREETING ?? 'Hello'
```

`!!js` فقط في `config` و بند `disabled` حقل داخل صالح.`disabled: !!js ...` في كل مرة تركيب قرار وقت أساس في loader سياق طلب قيمة (هذا مستودع توسيع) ، يمكن حسب منصة أو بيئة باب تحكم واحد سطر؛ ذلك بقية بيانات وصفية (`name`،`id`،`inject` انتظار) إبقاء ساكن حالة، منها جدول بلوغ صيغة هو عادي حق قيمة بيانات. تفصيل رؤية [loader إعداد](../cordis-primer.ar.md#loader-configuration).

تحت واحد فصل:[تركيب و HMR(حار وحدة استبدال)](06-composition-and-hmr.ar.md): سوف `cordis.yml` نظر لـ تطبيق.

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
