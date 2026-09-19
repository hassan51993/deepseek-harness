# إضافة إعداد

[English](config.md) | العربية

يجعل أنت إضافة قبول مستخدم في `cordis.yml` في نقل دخول إعداد.

## تعريف Config نوع

في إضافة في توجيه خروج واحد `Config` نوع و نفس اسم Schemastery schema؛ قيمة افتراضية مباشر كتابة في schema في:

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

في `scratch-plugin/cordis.yml` جديد إدراج دخول محلي إضافة سطر في إضافة إعداد:

```yaml
- insert:
    - id: hello
      name: './src/my-plugin.ts'
      config:
        greeting: 'Hi there'
        maxRetries: 5
```

إضافة تحميل وقت،Cordis سوف عبر توجيه خروج schema تحقق إعداد، و ملء ملء لم توفير حقل قيمة افتراضية. لا يلزم توجيه خروج عادي كائن بصفة `Config`، لأن هو لا ممتلئ كاف Cordis اشتراط Standard Schema واجهة.

## Schema تحقق

مقابل في حاجة صارم إطار تحقق مشهد، استخدام Schemastery تعريف schema:

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

Schema في إضافة تحميل وقت تنفيذ تحقق. إذا إعداد لا دمج قاعدة، إضافة سوف تحميل فشل و إعطاء خروج واضح خطأ معلومة.

## تصميم أصل فإن

### بلا صلب تحرير رمز يمكن ضبط معامل

Harness اتفاق:**كل هو مختلف نشر ممكن حاجة اعتماد مختلف قيمة معامل، كل يجب تعريف لـ إعداد حقل**.

```ts
// Wrong: hardcoded timeout.
const TIMEOUT = 30000

// Correct: configurable.
export interface Config {
  timeoutMs: number  // Defaults to 30000.
}
```

فحص تحقق معيار: قدرة لا في `cordis.yml` في تغيير هذا عدد قيمة، بينما لا حاجة تعديل شفرة؟

### إعداد خطأ يلزم صدى مضيء

في schema في جدول بلوغ ذاته تمام تجهيز قيد، جعل بلا فاعلية إعداد في إضافة تحميل وقت فشل. مقابل خدمة أو قد تسجيل مورد مرجع حاجة اعتماد حقن؛[خدمة تعليم مسار](../framework/service.ar.md) سوف وسيط تعريف هذا بند اتفاق.

## إعداد دمج HMR

إعداد تغيير سوف إطلاق إضافة حار استبدال: تعديل `cordis.yml` في بعض عدد إضافة `config` بعد، إطار هيكل سوف إزالة قديم نسخة و تحميل جديد نسخة. من في تسجيل كل يخص effect و سوف تلقائي تنظيف، استبدال بعد لن إبقاء قديم نسخة تسجيل.

## تحت واحد خطوة

- [تحزيم و تثبيت إضافة](./publish.ar.md) — يأخذ إضافة بـ يمكن تثبيت حزمة شكل صيغة تسليم
- [إضافة و دورة الحياة](../framework/index.ar.md) — عميق دخول حل إضافة كامل دورة الحياة
- [خدمة و اعتماد](../framework/service.ar.md) — يجعل أنت إضافة مقابل خارج توفير خدمة
