# إعداد الإضافات

[English](config.md) | العربية

اقبل الإعدادَ الذي يوفّره `cordis.yml`.

## عرّف نوع Config

صدّر نوعَ `Config` وschema من Schemastery بالاسم نفسه. وضع القيمَ الافتراضية على حقول schema مباشرةً:

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'

export const name = 'my-plugin'

export interface Config {
  greeting: string
  maxRetries: number
  verbose?: boolean
}

export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('Hello'),
  maxRetries: Schema.number().default(3),
  verbose: Schema.boolean().default(false),
})

export function apply(ctx: Context, config: Config) {
  console.log(config.greeting)  // User value or schema default.
}
```

أضف الإعدادَ إلى صف الإضافة المحلية المدرَج في `scratch-plugin/cordis.yml`:

```yaml
- insert:
    - id: hello
      name: './src/my-plugin.ts'
      config:
        greeting: 'Hi there'
        maxRetries: 5
```

وعند تحميل الإضافة، يستعمل Cordis الـ schema المصدَّر للتحقق من الإعداد وملء القيم الافتراضية. ولا تصدّر كائنًا عاديًا بوصفه `Config`؛ فهو لا ينفّذ واجهة Standard Schema التي يشترطها Cordis.

## التحقق بـ schema

استعمل Schemastery للتعبير عن تحقق أشد:

```ts
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'

export const name = 'validated-plugin'

export interface Config {
  apiKey: string
  timeout: number
  mode: 'fast' | 'accurate'
}

export const Config = Schema.object({
  apiKey: Schema.string().required(),
  timeout: Schema.number().default(30000),
  mode: Schema.union(['fast', 'accurate']).default('fast'),
})

export function apply(ctx: Context, config: Config) {
  // config is validated and type-safe.
}
```

ويعمل الـ schema أثناء تحميل الإضافة. والإعدادُ غير الصالح يُفشِل التحميلَ بخطأ قابل للتصرف.

## مبادئ التصميم

### لا تثبّت القيم القابلة للضبط في الشفرة

يشترط الإطار أن يكون **كل ما قد يريد نشران ضبطَه ضبطًا مختلفًا حقلَ إعداد**.

```ts
// Wrong: hardcoded timeout.
const TIMEOUT = 30000

// Correct: configurable.
export interface Config {
  timeoutMs: number  // Defaults to 30000.
}
```

والمحكُّ هل يستطيع `cordis.yml` تغييرَ القيمة بلا تعديل شفرة.

### افشل فشلًا مسموعًا عند إعداد غير صالح

عبّر عن القيود المكتفية بنفسها في الـ schema ليسقط الإعدادُ غير الصالح أثناء تحميل الإضافة. أما الإحالةُ إلى خدمات أو موارد مسجَّلة فتشترط حقنَ الاعتماديات؛ ويقدّم [درس الخدمات](../framework/service.ar.md) ذلك العقد.

## العمل مع HMR

تعديلُ الإعداد يستبدل الإضافةَ استبدالًا حارًّا: فيفرّغ الإطارُ النسخةَ القديمة ويحمّل جديدة. ولأن التسجيلات آثار تنظّف نفسها، لا يحتفظ الاستبدالُ بتسجيلات النسخة القديمة.

## الخطوات التالية

- [حزم الإضافة وتثبيتها](./publish.ar.md): اشحن الإضافةَ حزمةً قابلة للتثبيت
- [الإضافات ودورة الحياة](../framework/index.ar.md): افهم دورةَ حياة الإضافة كاملةً
- [الخدمات والاعتماديات](../framework/service.ar.md): وفّر خدمةً لإضافات أخرى
