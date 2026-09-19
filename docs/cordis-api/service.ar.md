<!-- إنجليزي نص مصدر ملف من scripts/gen-cordis-catalog.ts توليد؛ هذا العربية ملف هو عبر مزدوج لغة إعداد مقابل صيانة مرور مراجعة مقابل جانب.
     تحديث وقت أولا تشغيل `pnpm run gen-cordis-catalog` تحديث إنجليزي نص، مجددا تحديث هذا ملف و تشغيل `pnpm run verify-translation-pairing --write docs/cordis-api/service.md` إعادة سجل إعداد مقابل. -->

# Service

[English](service.md) | العربية

سياق خدمة أساس صنف. بـ إضافة شكل صيغة تحميل فرعي صنف سوف سوف ذاته تسجيل لـ `ctx.<name>`.

لأجل في `ctx` فوق عام أداة اسم API خدمة أساس صنف.

فرعي صنف في بنية صنع دالة في استدعاء `super(ctx, name)`. خدمة سوف قيام أي تسجيل، و مع الذي تابع fiber تلقائي إزالة.

[شفرة المصدر](../../vendor/cordis/src/service.ts#L11)

### service.name

```ts cordis-catalog
/** The service name this instance is registered under. */
public name!: string
```

هذا نسخة تسجيل وقت استخدام خدمة اسم.

[شفرة المصدر](../../vendor/cordis/src/service.ts#L30)

## ساكن حالة عضو

### Service.init

```ts cordis-catalog
/** Symbol key of an instance method run after construction (class plugins). */
static readonly init: unique symbol
```

بنية صنع إتمام بعد تشغيل نسخة طريقة الذي استخدام رمز رقم مفتاح (صنف إضافة).

[شفرة المصدر](../../vendor/cordis/src/service.ts#L13)

### Service.check

```ts cordis-catalog
/** Symbol key of the availability predicate passed to `ctx.provide()`. */
static readonly check: unique symbol
```

نقل إعطاء `ctx.provide()` متاح صفة يسمى كلمة الذي استخدام رمز رقم مفتاح.

[شفرة المصدر](../../vendor/cordis/src/service.ts#L15)

### Service.config

```ts cordis-catalog
/** Symbol key of the phantom intercept-config type parameter. */
static readonly config: unique symbol
```

وهمي ضبط اعتراض قطع إعداد نوع معامل الذي استخدام رمز رقم مفتاح.

[شفرة المصدر](../../vendor/cordis/src/service.ts#L17)

### Service.invoke

```ts cordis-catalog
/** Symbol key of the call body making a service callable (e.g. `ctx.logger()`). */
static readonly invoke: unique symbol
```

جعل خدمة يمكن يتم استدعاء استدعاء جسم الذي استخدام رمز رقم مفتاح (مثال مثل `ctx.logger()`).

[شفرة المصدر](../../vendor/cordis/src/service.ts#L19)

### Service.extend

```ts cordis-catalog
/** Symbol key of the helper deriving an extended service instance. */
static readonly extend: unique symbol
```

لأجل إرسال توليد توسيع خدمة نسخة مساعد مساعدة طريقة الذي استخدام رمز رقم مفتاح.

[شفرة المصدر](../../vendor/cordis/src/service.ts#L21)

### Service.tracker

```ts cordis-catalog
/** Symbol key of the tracker metadata used for context tracing. */
static readonly tracker: unique symbol
```

سياق تتبع أثر الذي استخدام تتبع أثر جهاز بيانات وصفية رمز رقم مفتاح.

[شفرة المصدر](../../vendor/cordis/src/service.ts#L23)

### Service.resolveConfig

```ts cordis-catalog
/** Symbol key of the intercept-config resolution helper below. */
static readonly resolveConfig: unique symbol
```

تحت وصف اعتراض قطع إعداد تحليل مساعد مساعدة طريقة الذي استخدام رمز رقم مفتاح.

[شفرة المصدر](../../vendor/cordis/src/service.ts#L25)
