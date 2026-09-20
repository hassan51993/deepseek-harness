<!-- ملفُّ المصدر الإنجليزي مولَّد من scripts/gen-cordis-catalog.ts؛ وهذا الملف العربي جانبٌ مراجَع يُصان عبر الاقتران الثنائي اللغة.
     عند التحديث شغّل `pnpm run gen-cordis-catalog` أولًا لتحديث الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/cordis-api/context.md` لإعادة تسجيل الاقتران. -->

# Context

[English](context.md) | العربية

السياقُ هو كائن Cordis الأساسي: فكلُّ خدمة وحدث وواجهةِ دورة حياة تُبلغ عبر `ctx`. وطرقُ الأحداث موثَّقة في [Events](events.ar.md)، والآثارُ والـ fiber الحالي في [Fiber](fiber.ar.md)، وتحميلُ الإضافات في [Registry](registry.ar.md).

حاوياتُ اعتماديات جذرًا وأبناءَ لإضافات Cordis.

والسياقُ وسيط: فقراءاتُ الخصائص العادية تمر بمحلِّل الخدمات، بينما تنشئ `extend()` و`isolate()` و`intercept()` سياقاتٍ ابنةً محدودةَ النطاق بلا تغيير أبيها.

[المصدر](../../vendor/cordis/src/context.ts#L42)

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

أنشئ سياقًا ابنًا ببيانات وصفية إضافية فوق النطاق الحالي.

ويرث الابنُ نموذجيًا كلَّ خاصية في هذا السياق؛ وخصائصُ `meta` الذاتية تظلّل الموروثة. ولا يتغيّر الأب.

- `meta`: الخصائصُ الذاتية (بما فيها مفاتيح الرموز) التي تُعرَّف على الابن.

**يعيد** سياقًا ابنًا يرث من هذا السياق.

[المصدر](../../vendor/cordis/src/context.ts#L99)

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

أنشئ سياقًا ابنًا بنطاق خدمة مستقل للاسم `name`.

وتحت السياق المعاد، تتحلّل قراءةُ الخدمة `name` وكتابتُها مقابل الوسم الجديد لا مقابل وسم الأب، فيمكن توفير تنفيذ مختلف بلا أثر على نطاق الأب. وتمريرُ `label` نفسه إلى استدعاءَي `isolate()` يصل نطاقيهما.

- `name`: اسمُ الخدمة المعزولة.
- `label`: وسمُ النطاق الذي يُوصَل؛ وافتراضُه رمزٌ فريد جديد.

**يعيد** سياقًا ابنًا تتحلّل فيه خدمةُ `name` في النطاق الجديد.

[المصدر](../../vendor/cordis/src/context.ts#L121)

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

أضف إعدادَ اعتراض خاصًّا بخدمة للإضافات التي تُقلع تحت هذا السياق.

والإضافاتُ المحمَّلة تحت السياق المعاد ترى `config` مدموجًا في الإعداد المحلول للخدمة (ومداخلُ الأسلاف أولًا؛ انظر `Service[symbols.resolveConfig]`). ولا يتأثر السياقُ الأب.

- `name`: اسمُ الخدمة التي يُعترَض إعدادُها.
- `config`: إعدادُ الاعتراض الذي يُدمج لتلك الخدمة.

**يعيد** سياقًا ابنًا يحمل مدخلَ الاعتراض الإضافي.

[المصدر](../../vendor/cordis/src/context.ts#L139)

### ctx.root

```ts cordis-catalog
/** The root context of the application (every child context shares it). @experimental */
root: this
```

السياقُ الجذر للتطبيق (ويتشاركه كل سياق ابن). @experimental

[المصدر](../../vendor/cordis/src/context.ts#L22)

### ctx.baseUrl

```ts cordis-catalog
/** Base URL used to resolve relative plugin/module specifiers, if the runtime sets one. */
baseUrl?: string
```

الرابطُ الأساسي المستعمَل لتحليل محدِّدات الإضافات والوحدات النسبية، إن ضبطه وقتُ التشغيل.

[المصدر](../../vendor/cordis/src/context.ts#L24)

### ctx.events

```ts cordis-catalog
/** The event bus. Its methods are also mixed onto `ctx` (`ctx.on`, `ctx.emit`, ...). */
events: EventsService
```

ناقلُ الأحداث. وطرقُه ممزوجة على `ctx` أيضًا (`ctx.on` و`ctx.emit` وغيرهما).

[المصدر](../../vendor/cordis/src/context.ts#L26)

### ctx.logger

```ts cordis-catalog
/** The logging service. Call `ctx.logger(name)` for a named logger. */
logger: LoggerService
```

خدمةُ التسجيل. استدعِ `ctx.logger(name)` لمسجّل مسمًّى.

[المصدر](../../vendor/cordis/src/context.ts#L28)

### ctx.reflect

```ts cordis-catalog
/** The reflection layer backing the context proxy (`ctx.get`, `ctx.provide`, ...). */
reflect: ReflectService
```

طبقةُ الانعكاس التي تسند وسيطَ السياق (`ctx.get` و`ctx.provide` وغيرهما).

[المصدر](../../vendor/cordis/src/context.ts#L30)

### ctx.registry

```ts cordis-catalog
/** The plugin registry. Its methods are mixed onto `ctx` (`ctx.plugin`, `ctx.inject`). */
registry: RegistryService
```

registry الإضافات. وطرقُه ممزوجة على `ctx` (`ctx.plugin` و`ctx.inject`).

[المصدر](../../vendor/cordis/src/context.ts#L32)

## الأعضاء الساكنة

### Context.effect

```ts cordis-catalog
/** Symbol key under which a disposer exposes its {@link EffectMeta} diagnostics tree. */
static readonly effect: unique symbol
```

مفتاحُ الرمز الذي يكشف المحرِّرُ تحته شجرةَ تشخيصات EffectMeta.

[المصدر](../../vendor/cordis/src/context.ts#L44)

### Context.filter

```ts cordis-catalog
/** Symbol key for a context's listener filter, consulted on every event dispatch. */
static readonly filter: unique symbol
```

مفتاحُ الرمز لمرشِّح مستمعي السياق، ويُستشار عند كل توزيع حدث.

[المصدر](../../vendor/cordis/src/context.ts#L46)

### Context.isolate

```ts cordis-catalog
/** Symbol key of the isolation map (see the `Context[symbols.isolate]` property). */
static readonly isolate: unique symbol
```

مفتاحُ الرمز لخريطة العزل (انظر الخاصية `Context[symbols.isolate]`).

[المصدر](../../vendor/cordis/src/context.ts#L48)

### Context.intercept

```ts cordis-catalog
/** Symbol key of the intercept map (see the `Context[symbols.intercept]` property). */
static readonly intercept: unique symbol
```

مفتاحُ الرمز لخريطة الاعتراض (انظر الخاصية `Context[symbols.intercept]`).

[المصدر](../../vendor/cordis/src/context.ts#L50)

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

يعيد true لوسطاء سياق Cordis ولنماذج السياق الأولية.

وهو يعمل عبر المجالات وعبر نسخ متعددة من cordis، لأن العلامةَ مفهرسة برمز عام لا بـ `instanceof`.

- `value`: القيمةُ المختبَرة.

**يعيد** `true` إن كانت `value` سياقَ Cordis، ويضيّق نوعَها.

[المصدر](../../vendor/cordis/src/context.ts#L61)

## مخزن الخدمات والمزائج

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

اقرأ خدمةً من المخزن بلا اشتراط الحقن.

- `name`: اسمُ الخدمة.
- `strict`: حين تكون `true` (وهو الافتراض)، لا تُعاد إلا التنفيذاتُ التي يكون الـ fiber الموفِّر لها نشطًا حاليًا.

**يعيد** قيمةَ الخدمة، أو `undefined` حين لا تكون موفَّرة بعد.

[المصدر](../../vendor/cordis/src/reflect.ts#L17)

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

اكتب فوق قيمة خدمة موفَّرة.

ولا يجوز ضبطُها إلا للـ fiber الذي وفّر الخدمة؛ وضبطُ اسم غير موفَّر يرمي.

- `name`: اسمُ الخدمة.
- `value`: قيمةُ الخدمة الجديدة.

[المصدر](../../vendor/cordis/src/reflect.ts#L29)

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

سجّل تنفيذَ خدمة يملكه الـ fiber الحالي.

وتصير الخدمةُ ظاهرةً للمعتمدين عليها في نطاق العزل نفسه متى صار الـ fiber نشطًا؛ ويُلغى تسجيلُها (فيستيقظ المعتمدون) حين يعمل المحرِّرُ المعاد أو حين يُفرَّغ الـ fiber. ويرمي إن كان الاسمُ موفَّرًا أصلًا في هذا النطاق أو معلَنًا وصولةً.

- `name`: اسمُ الخدمة.
- `value`: قيمةُ الخدمة.

**يعيد** محرِّرًا يلغي تسجيلَ الخدمة.

[المصدر](../../vendor/cordis/src/reflect.ts#L44)

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

عرّف خاصيةَ سياق محسوبة تسندها خطافا get وset.

وتُزال الوصولةُ حين يُفرَّغ الـ fiber الحالي. وترمي إن كان الاسمُ معلَنًا أصلًا.

- `name`: اسمُ خاصية السياق.
- `options`: خطافُ `get` وخطافُ `set` الاختياري.

[المصدر](../../vendor/cordis/src/reflect.ts#L56)

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

اكشف أعضاءً مختارة من خدمة على `ctx` مباشرةً.

وكلُّ مفتاح ممزوج يصير وصولةً تمرّر إلى الخدمة (وتربط الطرقَ بها)، فـ `ctx.on` مثلًا يمرّر إلى `ctx.events.on`. وتُزال المزائجُ حين يُفرَّغ الـ fiber الحالي.

- `name`: خاصيةُ السياق التي تحمل الخدمةَ المصدر.
- `mixins`: المفاتيحُ التي تُمرَّر، أو خريطةُ مفتاح المصدر إلى مفتاح ctx.

[المصدر](../../vendor/cordis/src/reflect.ts#L67)
