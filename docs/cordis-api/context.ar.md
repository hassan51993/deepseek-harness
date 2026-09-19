<!-- إنجليزي نص مصدر ملف من scripts/gen-cordis-catalog.ts توليد؛ هذا العربية ملف هو عبر مزدوج لغة إعداد مقابل صيانة مرور مراجعة مقابل جانب.
     تحديث وقت أولا تشغيل `pnpm run gen-cordis-catalog` تحديث إنجليزي نص، مجددا تحديث هذا ملف و تشغيل `pnpm run verify-translation-pairing --write docs/cordis-api/context.md` إعادة سجل إعداد مقابل. -->

# سياق

[English](context.md) | العربية

سياق هو Cordis نواة قلب كائن: كل خدمة، حدث و دورة الحياة API كل عبر `ctx` وصول. حدث طريقة رؤية[حدث](events.ar.md) ، فرعي أثر و حالي fiber رؤية [Fiber](fiber.ar.md) ، إضافة تحميل رؤية[سجل التسجيل](registry.ar.md).

Cordis إضافة أصل اعتماد حاوية و فرعي اعتماد حاوية.

سياق هو واحد بديل إدارة: عادي خاصية قراءة عبر خدمة محلل إجراء، بينما `extend()`،`isolate()` و `intercept()` سوف إنشاء لديه أثر مجال فرعي سياق، كما لا تعديل ذلك أب سياق.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L42)

### ctx.extend(meta?)

```ts cordis-catalog
/**
 * Create a child context with extra metadata on top of the current scope.
 *
 * The child prototypally inherits every property of this context; own
 * properties of `meta` shadow the inherited ones. The parent is not mutated.
 *
 * @param meta — own properties (including symbol keys) to define on the child.
 * @returns a child context inheriting from this one.
 */
extend(meta = {}): this
```

في حالي أثر مجال لـ فوق إنشاء واحد حمل لديه مقدار خارج بيانات وصفية فرعي سياق.

فرعي سياق عبر أصل نوع وراثة حالي سياق كل خاصية؛`meta` ذاتي لديه خاصية سوف حجب حجب وراثة نفس اسم خاصية. أب سياق لن يتم تعديل.

- `meta`: يلزم في فرعي سياق فوق تعريف ذاتي لديه خاصية، يشمل بـ symbol لـ مفتاح خاصية.

**إرجاع**وراثة ذاتي حالي سياق فرعي سياق.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L99)

### ctx.isolate(name, label?)

```ts cordis-catalog
/**
 * Create a child context with an independent service scope for `name`.
 *
 * Below the returned context, reads and writes of the service `name`
 * resolve against the new label instead of the parent's, so a different
 * implementation can be provided without affecting the parent scope.
 * Passing the same `label` to two `isolate()` calls joins their scopes.
 *
 * @param name — the service name to isolate.
 * @param label — scope label to join; defaults to a fresh unique symbol.
 * @returns a child context whose `name` service resolves in the new scope.
 */
isolate(name: string, label?: symbol)
```

إنشاء واحد فرعي سياق، جعل `name` يملك مستقل خدمة أثر مجال.

في إرجاع سياق لـ تحت، مقابل خدمة `name` قراءة كتابة سوف أصل حسب جديد وسم تحليل، بينما لم يعد أصل حسب أب سياق وسم تحليل، لذلك يمكن توفير مختلف تنفيذ بينما لا أثر أب أثر مجال. سوف نفس عدد `label` نقل إعطاء اثنان مرة `isolate()` استدعاء، يمكن جعل اثنان من إضافة دخول نفس أثر مجال.

- `name`: يلزم عزل خدمة اسم.
- `label`: يلزم إضافة دخول أثر مجال وسم؛ افتراضي لـ واحد جديد بناء وحيد symbol.

**إرجاع**واحد فرعي سياق، ذلك `name` خدمة في جديد أثر مجال في تحليل.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L121)

### ctx.intercept(name, config)

```ts cordis-catalog
/**
 * Add service-specific intercept config for plugins started below this
 * context.
 *
 * Plugins loaded under the returned context see `config` merged into the
 * service's resolved config (ancestor entries first; see
 * `Service[symbols.resolveConfig]`). The parent context is not affected.
 *
 * @param name — the service name whose config to intercept.
 * @param config — the intercept config to merge for that service.
 * @returns a child context carrying the additional intercept entry.
 */
intercept<K extends InjectKey>(name: K, config: Context[K] extends { [symbols.config]: infer T } ? T : never): this
intercept(name: string, config: any): this
```

لـ في هذا سياق لـ تحت بدء إضافة إضافة خدمة مخصص تابع اعتراض قطع إعداد.

في إرجاع سياق تحت تحميل إضافة سوف يرى `config` قد دمج إلى خدمة تحليل بعد إعداد في (أصل أولا بند في قبل؛ رؤية `Service[symbols.resolveConfig]`). أب سياق لا تلقي أثر.

- `name`: يلزم اعتراض قطع ذلك إعداد خدمة اسم.
- `config`: يلزم لـ هذا خدمة دمج اعتراض قطع إعداد.

**إرجاع**واحد يحمل مقدار خارج اعتراض قطع بند فرعي سياق.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L139)

### ctx.root

```ts cordis-catalog
/** The root context of the application (every child context shares it). @experimental */
root: this
```

تطبيق أصل سياق، كل فرعي سياق متساو مشترك هو.@experimental

[شفرة المصدر](../../vendor/cordis/src/context.ts#L22)

### ctx.baseUrl

```ts cordis-catalog
/** Base URL used to resolve relative plugin/module specifiers, if the runtime sets one. */
baseUrl?: string
```

لأجل تحليل متبادل مقابل إضافة/وحدة شرح رمز أساس أساس URL، قبل رفع هو وقت التشغيل ضبط هذا قيمة.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L24)

### ctx.events

```ts cordis-catalog
/** The event bus. Its methods are also mixed onto `ctx` (`ctx.on`, `ctx.emit`, ...). */
events: EventsService
```

حدث مجموع خط. هو طريقة أيضا سوف خلط دخول `ctx`(`ctx.on`،`ctx.emit` انتظار).

[شفرة المصدر](../../vendor/cordis/src/context.ts#L26)

### ctx.logger

```ts cordis-catalog
/** The logging service. Call `ctx.logger(name)` for a named logger. */
logger: LoggerService
```

سجل خدمة. استدعاء `ctx.logger(name)` يمكن نيل أخذ أداة اسم logger.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L28)

### ctx.reflect

```ts cordis-catalog
/** The reflection layer backing the context proxy (`ctx.get`, `ctx.provide`, ...). */
reflect: ReflectService
```

لـ سياق بديل إدارة توفير دعم حمل عكس إطلاق طبقة (`ctx.get`،`ctx.provide` انتظار).

[شفرة المصدر](../../vendor/cordis/src/context.ts#L30)

### ctx.registry

```ts cordis-catalog
/** The plugin registry. Its methods are mixed onto `ctx` (`ctx.plugin`, `ctx.inject`). */
registry: RegistryService
```

إضافة سجل التسجيل. هو طريقة سوف خلط دخول `ctx`(`ctx.plugin`،`ctx.inject`).

[شفرة المصدر](../../vendor/cordis/src/context.ts#L32)

## ساكن حالة عضو

### Context.effect

```ts cordis-catalog
/** Symbol key under which a disposer exposes its {@link EffectMeta} diagnostics tree. */
static readonly effect: unique symbol
```

مورد تحرير دالة لأجل عام ذلك EffectMeta تشخيص شجرة symbol مفتاح.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L44)

### Context.filter

```ts cordis-catalog
/** Symbol key for a context's listener filter, consulted on every event dispatch. */
static readonly filter: unique symbol
```

سياق مستمع مرور ترشيح جهاز symbol مفتاح، كل مرة قسم إرسال حدث وقت كل سوف استعلام هذا مرور ترشيح جهاز.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L46)

### Context.isolate

```ts cordis-catalog
/** Symbol key of the isolation map (see the `Context[symbols.isolate]` property). */
static readonly isolate: unique symbol
```

عزل خريطة symbol مفتاح (رؤية `Context[symbols.isolate]` خاصية).

[شفرة المصدر](../../vendor/cordis/src/context.ts#L48)

### Context.intercept

```ts cordis-catalog
/** Symbol key of the intercept map (see the `Context[symbols.intercept]` property). */
static readonly intercept: unique symbol
```

اعتراض قطع خريطة symbol مفتاح (رؤية `Context[symbols.intercept]` خاصية).

[شفرة المصدر](../../vendor/cordis/src/context.ts#L50)

### Context.is(value)

```ts cordis-catalog
/**
 * Returns true for Cordis context proxies and context prototypes.
 *
 * Works across realms and across multiple copies of cordis, because the
 * brand is keyed by a global symbol rather than by `instanceof`.
 *
 * @param value — the value to test.
 * @returns `true` if `value` is a Cordis context, narrowing its type.
 */
static is(value: any): value is Context
```

مقابل في Cordis سياق بديل إدارة و سياق أصل نوع، إرجاع true.

هذا طريقة يمكن عبر realm و كثير عدد cordis فرعي هذا عمل، لأن ذلك صنف لوحة معرف بـ عام symbol لـ مفتاح، بينما لا هو عبر `instanceof` حكم قطع.

- `value`: يلزم اختبار قيمة.

**إرجاع** `true` وقت،`value` هو Cordis سياق، و سوف استلام ضيق ذلك نوع.

[شفرة المصدر](../../vendor/cordis/src/context.ts#L61)

## خدمة تخزين و خلط دخول

### ctx.get(name, strict?)

```ts cordis-catalog
/**
 * Read a service from the store without the inject requirement.
 *
 * @param name — the service name.
 * @param strict — when `true` (default), only return implementations
 * whose providing fiber is currently active.
 * @returns the service value, or `undefined` when not (yet) provided.
 */
get<K extends string & keyof this>(name: K, strict?: boolean): undefined | this[K]
get(name: string, strict?: boolean): any
```

من تخزين في قراءة خدمة، بلا حاجة ممتلئ كاف حقن اشتراط.

- `name`: خدمة اسم.
- `strict`: ضبط لـ `true`(قيمة افتراضية) وقت، فقط إرجاع ذلك مزود fiber حالي موضع في نشط حركة حالة تنفيذ.

**إرجاع**خدمة قيمة؛ إذا بعد لم توفير، فإن إرجاع `undefined`.

[شفرة المصدر](../../vendor/cordis/src/reflect.ts#L17)

### ctx.set(name, value)

```ts cordis-catalog
/**
 * Overwrite a provided service's value.
 *
 * Only the fiber that provided the service may set it; setting an
 * unprovided name throws.
 *
 * @param name — the service name.
 * @param value — the new service value.
 */
set<K extends string & keyof this>(name: K, value: undefined | this[K]): void
set(name: string, value: any): void
```

تغطية قد توفير خدمة قيمة.

فقط لديه توفير هذا خدمة fiber عندئذ قدرة ضبط هو؛ ضبط بعد لم توفير اسم سوف رمي خروج استثناء.

- `name`: خدمة اسم.
- `value`: جديد خدمة قيمة.

[شفرة المصدر](../../vendor/cordis/src/reflect.ts#L29)

### ctx.provide(name, value)

```ts cordis-catalog
/**
 * Register a service implementation owned by the current fiber.
 *
 * The service becomes visible to dependents in the same isolation scope
 * once the fiber is active; it is unregistered (waking dependents) when
 * the returned disposer runs or the fiber unloads. Throws if the name is
 * already provided in this scope or declared as an accessor.
 *
 * @param name — the service name.
 * @param value — the service value.
 * @returns a disposer that unregisters the service.
 */
provide<K extends string & keyof this>(name: K, value: undefined | this[K]): () => void
provide(name: string, value?: any): () => void
```

تسجيل واحد عودة حالي fiber كل خدمة تنفيذ.

fiber تنشيط بعد، هذا خدمة مقابل نفس عزل أثر مجال داخل اعتماد جهة مرئي؛ عند إرجاع مورد تحرير دالة تشغيل أو fiber إزالة وقت، هذا خدمة سوف يتم إلغاء تسجيل، و نداء تنبيه اعتماد جهة. إذا هذا اسم قد في هذا أثر مجال في يتم توفير، أو قد إعلان لـ وصول جهاز، فإن رمي خروج استثناء.

- `name`: خدمة اسم.
- `value`: خدمة قيمة.

**إرجاع**واحد لأجل إلغاء تسجيل هذا خدمة مورد تحرير دالة.

[شفرة المصدر](../../vendor/cordis/src/reflect.ts#L44)

### ctx.accessor(name, options)

```ts cordis-catalog
/**
 * Define a computed context property backed by get/set hooks.
 *
 * The accessor is removed when the current fiber unloads. Throws if the
 * name is already declared.
 *
 * @param name — the context property name.
 * @param options — the `get` hook and optional `set` hook.
 */
accessor(name: string, options: Omit<Property.Accessor, 'type'>): void
```

تعريف واحد من get/set خطاف دعم حمل حساب حساب نوع سياق خاصية.

حالي fiber إزالة وقت سوف إزالة هذا وصول جهاز. إذا هذا اسم قد يتم إعلان، فإن رمي خروج استثناء.

- `name`: سياق خاصية اسم.
- `options`:`get` خطاف و اختياري `set` خطاف.

[شفرة المصدر](../../vendor/cordis/src/reflect.ts#L56)

### ctx.mixin(name, mixins)

```ts cordis-catalog
/**
 * Expose selected members of a service directly on `ctx`.
 *
 * Each mixed-in key becomes an accessor that forwards to the service
 * (binding methods to it), so e.g. `ctx.on` forwards to `ctx.events.on`.
 * Mixins are removed when the current fiber unloads.
 *
 * @param name — the context property holding the source service.
 * @param mixins — keys to forward, or a source-key → ctx-key map.
 */
mixin<K extends string & keyof this>(name: K, mixins: (keyof this & keyof this[K])[] | Dict<string>): void
mixin<T extends {}>(source: T, mixins: (keyof this & keyof T)[] | Dict<string>): void
```

مباشر في `ctx` فوق عام خدمة إشارة تحديد عضو.

كل خلط دخول مفتاح كل سوف يصبح واحد تحويل إرسال إلى هذا خدمة وصول جهاز، و سوف طريقة ربط إلى هذا خدمة. مثال مثل،`ctx.on` سوف تحويل إرسال إلى `ctx.events.on`. حالي fiber إزالة وقت سوف إزالة هذه خلط دخول.

- `name`: تخزين وضع مصدر خدمة سياق خاصية.
- `mixins`: يلزم تحويل إرسال مفتاح، أو من مصدر مفتاح إلى ctx مفتاح خريطة.

[شفرة المصدر](../../vendor/cordis/src/reflect.ts#L67)
