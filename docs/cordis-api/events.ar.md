<!-- ملفُّ المصدر الإنجليزي مولَّد من scripts/gen-cordis-catalog.ts؛ وهذا الملف العربي جانبٌ مراجَع يُصان عبر الاقتران الثنائي اللغة.
     عند التحديث شغّل `pnpm run gen-cordis-catalog` أولًا لتحديث الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/cordis-api/events.md` لإعادة تسجيل الاقتران. -->

# Events

[English](events.md) | العربية

واجهةُ توزيع الأحداث الممزوجة في كل سياق. وتصريحاتُ أحداث الإطار وأوضاعُ توزيعها مولَّدة في [صفحة النظام الفرعي](../subsystems/core.ar.md) المالكة لكلٍّ منها.

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

وزّع حدثًا، وشغّل كلَّ المستمعين على التوازي.

- `name`: اسمُ الحدث.
- `args`: الوسائطُ الممرَّرة إلى كل مستمع.

**يعيد** وعدًا يتحلّل متى استقر كلُّ مستمع.

[المصدر](../../vendor/cordis/src/events.ts#L44)

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

وزّع حدثًا تزامنيًا، متجاهلًا القيمَ التي يعيدها المستمعون.

- `name`: اسمُ الحدث.
- `args`: الوسائطُ الممرَّرة إلى كل مستمع.

[المصدر](../../vendor/cordis/src/events.ts#L53)

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

وزّع حدثًا، وانتظر المستمعين بالترتيب حتى يتوقف أحدهم.

- `name`: اسمُ الحدث.
- `args`: الوسائطُ الممرَّرة إلى كل مستمع.

**يعيد** أولَ قيمة توقّف (ليست null ولا false ولا undefined)، إن وُجدت.

[المصدر](../../vendor/cordis/src/events.ts#L63)

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

وزّع حدثًا، واستدعِ المستمعين بالترتيب حتى يتوقف أحدهم.

- `name`: اسمُ الحدث.
- `args`: الوسائطُ الممرَّرة إلى كل مستمع.

**يعيد** أولَ قيمة توقّف (ليست null ولا false ولا undefined)، إن وُجدت.

[المصدر](../../vendor/cordis/src/events.ts#L73)

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

وزّع حدثًا وسيطُه الأخير متابعةُ `next`.

وكلُّ مستمع يلفّ بقيةَ السلسلة: فاستدعاءُ `next()` يستدعي المستمعَ التالي (وأخيرًا السلوكَ المدمج)؛ وعدمُ استدعائه نقضٌ.

- `name`: اسمُ الحدث.
- `args`: وسائطُ المستمع؛ وآخرُها `next` الأعمق.

**يعيد** القيمةَ التي يعيدها المستمعُ الأخير من الخارج.

[المصدر](../../vendor/cordis/src/events.ts#L86)

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

سجّل مستمعَ حدث يملكه الـ fiber الحالي.

- `name`: اسمُ الحدث المستمَع إليه.
- `listener`: يُستدعى بوسائط التوزيع.
- `options`: خياراتُ المستمع؛ والقيمةُ المنطقية اختصارٌ لـ `prepend`.

**يعيد** محرِّرًا يزيل المستمع؛ و`true` إن كان لا يزال مسجَّلًا.

[المصدر](../../vendor/cordis/src/events.ts#L97)

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

مثل `on()`، إلا أن المستمع يحرّر نفسه بعد أول استدعاء.

- `name`: اسمُ الحدث المستمَع إليه.
- `listener`: يُستدعى مرةً واحدة على الأكثر بوسائط التوزيع.
- `options`: خياراتُ المستمع؛ والقيمةُ المنطقية اختصارٌ لـ `prepend`.

**يعيد** محرِّرًا يزيل المستمع؛ و`true` إن كان لا يزال مسجَّلًا.

[المصدر](../../vendor/cordis/src/events.ts#L106)

## EventOptions

الخياراتُ التي يقبلها `ctx.on()` و`ctx.once()`.

```ts cordis-catalog
/** Options accepted by `ctx.on()` and `ctx.once()`. */
interface EventOptions {
  /** Add the listener before existing listeners for the same event. */
  prepend?: boolean
  /** Receive the event regardless of context filter checks. */
  global?: boolean
}
```

[المصدر](../../vendor/cordis/src/events.ts#L112)

## DispatchMode

استراتيجيةُ توزيع الأحداث التي تستعملها خدمةُ الأحداث.

فـ `emit` يشغّل المستمعين التزامنيين بلا انتظارهم، و`parallel` ينتظرهم جميعًا معًا، و`serial` ينتظرهم بالترتيب حتى يتوقف أحدهم، و`bail` يتوقف عند أول قيمة توقّف تزامنية، و`waterfall` يركّب المستمعين حول استدعاء `next` نهائي.

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

[المصدر](../../vendor/cordis/src/events.ts#L32)
