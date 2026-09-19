<!-- إنجليزي نص مصدر ملف من scripts/gen-cordis-catalog.ts توليد؛ هذا العربية ملف هو عبر مزدوج لغة إعداد مقابل صيانة مرور مراجعة مقابل جانب.
     تحديث وقت أولا تشغيل `pnpm run gen-cordis-catalog` تحديث إنجليزي نص، مجددا تحديث هذا ملف و تشغيل `pnpm run verify-translation-pairing --write docs/cordis-api/events.md` إعادة سجل إعداد مقابل. -->

# حدث

[English](events.md) | العربية

كل سياق في كل خلط دخول حدث توزيع API.Harness حدث إعلان و ذلك توزيع نمط سوف توليد إلى كل منها الذي تابع[فرعي نظام صفحة](../subsystems/core.ar.md).

### ctx.parallel(name, ...args)

```ts cordis-catalog
/**
 * Dispatch an event, running all listeners concurrently.
 *
 * @param name — the event name.
 * @param args — arguments passed to every listener.
 * @returns a promise resolving once every listener has settled.
 */
parallel<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): Promise<void>
parallel<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): Promise<void>
```

توزيع واحد حدث، تزامن تشغيل كل مستمع.

- `name`: حدث اسم.
- `args`: نقل تمرير إعطاء كل مستمع معامل.

**قيمة راجعة**: واحد Promise، في كل مستمع متساو قد إتمام بعد صرف الآن.

[شفرة المصدر](../../vendor/cordis/src/events.ts#L44)

### ctx.emit(name, ...args)

```ts cordis-catalog
/**
 * Dispatch an event synchronously, ignoring listener return values.
 *
 * @param name — the event name.
 * @param args — arguments passed to every listener.
 */
emit<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): void
emit<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): void
```

تزامن توزيع واحد حدث، تجاهل اختصار مستمع قيمة راجعة.

- `name`: حدث اسم.
- `args`: نقل تمرير إعطاء كل مستمع معامل.

[شفرة المصدر](../../vendor/cordis/src/events.ts#L53)

### ctx.serial(name, ...args)

```ts cordis-catalog
/**
 * Dispatch an event, awaiting listeners in order until one bails.
 *
 * @param name — the event name.
 * @param args — arguments passed to each listener.
 * @returns the first bail value (non-null, non-false, non-undefined), if any.
 */
serial<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): Promisify<ReturnType<Events[K]>>
serial<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): Promisify<ReturnType<Events[K]>>
```

توزيع واحد حدث، اعتماد مرة انتظار كل مستمع، مباشر إلى منها واحد رفع قبل إنهاء توزيع.

- `name`: حدث اسم.
- `args`: نقل تمرير إعطاء كل مستمع معامل.

**قيمة راجعة**: رقم واحد رفع قبل إنهاء قيمة (غير null، غير false كما غير undefined) ؛ إذا لا يوجد، فإن لا إرجاع هذا صنف قيمة.

[شفرة المصدر](../../vendor/cordis/src/events.ts#L63)

### ctx.bail(name, ...args)

```ts cordis-catalog
/**
 * Dispatch an event, calling listeners in order until one bails.
 *
 * @param name — the event name.
 * @param args — arguments passed to each listener.
 * @returns the first bail value (non-null, non-false, non-undefined), if any.
 */
bail<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): ReturnType<Events[K]>
bail<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): ReturnType<Events[K]>
```

توزيع واحد حدث، اعتماد مرة استدعاء كل مستمع، مباشر إلى منها واحد رفع قبل إنهاء توزيع.

- `name`: حدث اسم.
- `args`: نقل تمرير إعطاء كل مستمع معامل.

**قيمة راجعة**: رقم واحد رفع قبل إنهاء قيمة (غير null، غير false كما غير undefined) ؛ إذا لا يوجد، فإن لا إرجاع هذا صنف قيمة.

[شفرة المصدر](../../vendor/cordis/src/events.ts#L73)

### ctx.waterfall(name, ...args)

```ts cordis-catalog
/**
 * Dispatch an event whose last argument is a `next` continuation.
 *
 * Each listener wraps the rest of the chain: calling `next()` invokes the
 * next listener (finally the built-in behavior); not calling it vetoes.
 *
 * @param name — the event name.
 * @param args — listener arguments; the final one is the innermost `next`.
 * @returns the outermost listener's return value.
 */
waterfall<K extends keyof Events>(name: K, ...args: Parameters<Events[K]>): ReturnType<Events[K]>
waterfall<K extends keyof Events>(thisArg: NoInfer<ThisType<Events[K]>>, name: K, ...args: Parameters<Events[K]>): ReturnType<Events[K]>
```

توزيع واحد حدث، ذلك الأكثر بعد واحد معامل هو متابعة وصل تنفيذ `next` عودة ضبط.

كل مستمع كل سوف حزمة تركيب استدعاء سلسلة ذلك بقية جزء: استدعاء `next()` سوف تنفيذ تحت واحد مستمع، نهائي تنفيذ داخل وضع سلوك؛ لا استدعاء فإن سوف مرفوض لاحق تنفيذ.

- `name`: حدث اسم.
- `args`: مستمع معامل؛ الأكثر بعد واحد معامل هو الأكثر داخل طبقة `next`.

**قيمة راجعة**: الأكثر خارج طبقة مستمع قيمة راجعة.

[شفرة المصدر](../../vendor/cordis/src/events.ts#L86)

### ctx.on(name, listener, options?)

```ts cordis-catalog
/**
 * Register an event listener owned by the current fiber.
 *
 * @param name — the event name to listen for.
 * @param listener — called with the dispatch arguments.
 * @param options — listener options; a boolean is shorthand for `prepend`.
 * @returns a disposer removing the listener; `true` if it was still registered.
 */
on<K extends keyof Events>(name: K, listener: Events[K], options?: boolean | EventOptions): () => boolean
```

تسجيل واحد عودة حالي fiber كل حدث مستمع.

- `name`: يلزم استماع حدث اسم.
- `listener`: استخدام توزيع معامل استدعاء مستمع.
- `options`: مستمع خيار؛ قيمة منطقية يمكن بصفة `prepend` بسيط كتابة.

**قيمة راجعة**: واحد لأجل إزالة مستمع مورد تحرير دالة؛ إذا استدعاء هذا دالة وقت مستمع ما زال موضع في تسجيل حالة، فإن إرجاع `true`.

[شفرة المصدر](../../vendor/cordis/src/events.ts#L97)

### ctx.once(name, listener, options?)

```ts cordis-catalog
/**
 * Same as `on()`, but the listener disposes itself after its first call.
 *
 * @param name — the event name to listen for.
 * @param listener — called at most once with the dispatch arguments.
 * @param options — listener options; a boolean is shorthand for `prepend`.
 * @returns a disposer removing the listener; `true` if it was still registered.
 */
once<K extends keyof Events>(name: K, listener: Events[K], options?: boolean | EventOptions): () => boolean
```

و `on()` نفسه، لكن مستمع في أول مرة استدعاء بعد سوف ذاتي سطر ملاحظة إلغاء.

- `name`: يلزم استماع حدث اسم.
- `listener`: استخدام توزيع معامل استدعاء، الأكثر كثير استدعاء مرة.
- `options`: مستمع خيار؛ قيمة منطقية يمكن بصفة `prepend` بسيط كتابة.

**قيمة راجعة**: واحد لأجل إزالة مستمع مورد تحرير دالة؛ إذا استدعاء هذا دالة وقت مستمع ما زال موضع في تسجيل حالة، فإن إرجاع `true`.

[شفرة المصدر](../../vendor/cordis/src/events.ts#L106)

## EventOptions

`ctx.on()` و `ctx.once()` قبول خيار.

```ts cordis-catalog
/** Options accepted by `ctx.on()` and `ctx.once()`. */
interface EventOptions {
  /** Add the listener before existing listeners for the same event. */
  prepend?: boolean
  /** Receive the event regardless of context filter checks. */
  global?: boolean
}
```

[شفرة المصدر](../../vendor/cordis/src/events.ts#L112)

## DispatchMode

حدث خدمة استخدام حدث توزيع سياسة.

`emit` تشغيل تزامن مستمع لكن لا انتظار هو جمع،`parallel` معا انتظار كل مستمع،`serial` اعتماد مرة انتظار مستمع مباشر حتى منها واحد رفع قبل إنهاء توزيع،`bail` لقاء إلى رقم واحد تزامن رفع قبل إنهاء قيمة وقت إيقاف،`waterfall` فإن محيط التفاف نهائي `next` عودة ضبط تركيب مستمع.

```ts cordis-catalog
/**
 * Event dispatch strategy used by the event service.
 *
 * `emit` runs synchronous listeners without awaiting them, `parallel` awaits
 * all listeners together, `serial` awaits them in order until one bails,
 * `bail` stops on the first synchronous bail value, and `waterfall` composes
 * listeners around a final `next` callback.
 */
type DispatchMode = 'emit' | 'parallel' | 'serial' | 'bail' | 'waterfall'
```

[شفرة المصدر](../../vendor/cordis/src/events.ts#L32)
