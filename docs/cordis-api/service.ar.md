<!-- ملفُّ المصدر الإنجليزي مولَّد من scripts/gen-cordis-catalog.ts؛ وهذا الملف العربي جانبٌ مراجَع يُصان عبر الاقتران الثنائي اللغة.
     عند التحديث شغّل `pnpm run gen-cordis-catalog` أولًا لتحديث الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/cordis-api/service.md` لإعادة تسجيل الاقتران. -->

# Service

[English](service.md) | العربية

الصنفُ الأساس لخدمات السياق. والصنفُ الفرعي المحمَّل إضافةً يسجّل نفسه باسم `ctx.<name>`.

صنفٌ أساس للخدمات التي تكشف واجهةً مسمّاة على `ctx`.

وتستدعي الأصنافُ الفرعية `super(ctx, name)` من مُنشئها. وتُسجَّل الخدمةُ فورًا وتُزال تلقائيًا مع الـ fiber الذي يملكها.

[المصدر](../../vendor/cordis/src/service.ts#L11)

### service.name

```ts cordis-catalog
/** The service name this instance is registered under. */
public name!: string
```

اسمُ الخدمة الذي سُجِّلت به هذه النسخة.

[المصدر](../../vendor/cordis/src/service.ts#L30)

## الأعضاء الساكنة

### Service.init

```ts cordis-catalog
/** Symbol key of an instance method run after construction (class plugins). */
static readonly init: unique symbol
```

مفتاحُ الرمز لطريقة نسخة تعمل بعد البناء (في إضافات الأصناف).

[المصدر](../../vendor/cordis/src/service.ts#L13)

### Service.check

```ts cordis-catalog
/** Symbol key of the availability predicate passed to `ctx.provide()`. */
static readonly check: unique symbol
```

مفتاحُ الرمز لمُسنَد التوفّر الممرَّر إلى `ctx.provide()`.

[المصدر](../../vendor/cordis/src/service.ts#L15)

### Service.config

```ts cordis-catalog
/** Symbol key of the phantom intercept-config type parameter. */
static readonly config: unique symbol
```

مفتاحُ الرمز لمعامل نوع إعداد الاعتراض الشبحي.

[المصدر](../../vendor/cordis/src/service.ts#L17)

### Service.invoke

```ts cordis-catalog
/** Symbol key of the call body making a service callable (e.g. `ctx.logger()`). */
static readonly invoke: unique symbol
```

مفتاحُ الرمز لمتن الاستدعاء الذي يجعل الخدمةَ قابلة للاستدعاء (مثل `ctx.logger()`).

[المصدر](../../vendor/cordis/src/service.ts#L19)

### Service.extend

```ts cordis-catalog
/** Symbol key of the helper deriving an extended service instance. */
static readonly extend: unique symbol
```

مفتاحُ الرمز للمساعد الذي يشتق نسخةَ خدمة موسَّعة.

[المصدر](../../vendor/cordis/src/service.ts#L21)

### Service.tracker

```ts cordis-catalog
/** Symbol key of the tracker metadata used for context tracing. */
static readonly tracker: unique symbol
```

مفتاحُ الرمز لبيانات المتتبِّع الوصفية المستعمَلة في تتبّع السياق.

[المصدر](../../vendor/cordis/src/service.ts#L23)

### Service.resolveConfig

```ts cordis-catalog
/** Symbol key of the intercept-config resolution helper below. */
static readonly resolveConfig: unique symbol
```

مفتاحُ الرمز لمساعد تحليل إعداد الاعتراض أدناه.

[المصدر](../../vendor/cordis/src/service.ts#L25)
