<!-- إنجليزي نص مصدر ملف من scripts/gen-cordis-catalog.ts توليد؛ هذا العربية ملف هو عبر مزدوج لغة إعداد مقابل صيانة مرور مراجعة مقابل جانب.
     تحديث وقت أولا تشغيل `pnpm run gen-cordis-catalog` تحديث إنجليزي نص، مجددا تحديث هذا ملف و تشغيل `pnpm run verify-translation-pairing --write docs/cordis-api/registry.md` إعادة سجل إعداد مقابل. -->

# سجل التسجيل

[English](registry.md) | العربية

إضافة تحميل و اعتماد حقن.

### ctx.inject(deps, callback)

```ts cordis-catalog
/**
 * Run a callback once the requested services are available.
 *
 * Shorthand for `ctx.plugin({ inject, apply: callback })`: the callback
 * is unloaded and re-run whenever a required service changes.
 *
 * @param deps — required services, as an array or a name → config map.
 * @param callback — plugin body called with `(ctx, config)`.
 * @returns the fiber; awaiting it settles once loading finished.
 */
inject(deps: Inject, callback: Plugin.Function<void>): Fiber & PromiseLike<Fiber>
```

طلب خدمة متاح بعد، تشغيل عودة ضبط.

هذا هو `ctx.plugin({ inject, apply: callback })` بسيط كتابة شكل صيغة: كل عند بعض عدد مطلوب خدمة حدوث تغير وقت، نظام كل سوف إزالة و إعادة تشغيل هذا عودة ضبط.

- `deps`: مطلوب خدمة، شكل صيغة يمكن هو عدد مجموعة، أيضا يمكن هو من اسم إلى إعداد خريطة.
- `callback`: بـ `(ctx, config)` استدعاء إضافة رئيسي جسم.

**إرجاع** fiber؛ مقابل ذلك تنفيذ await سوف في تحميل إتمام بعد انتهاء انتظار.

[شفرة المصدر](../../vendor/cordis/src/registry.ts#L176)

### ctx.plugin(plugin, ...args)

```ts cordis-catalog
/**
 * Load a plugin in the current context.
 *
 * @param plugin — a function, class, or `{ apply }` object plugin.
 * @param args — the plugin config, validated against its `Config` schema.
 * @returns the fiber; awaiting it settles once loading finished
 * (rejecting on config or startup errors).
 */
plugin<P extends Plugin>(plugin: P, ...args: Spread<GetPluginConfig<P>>): Fiber & PromiseLike<Fiber>
```

في حالي سياق في تحميل إضافة.

- `plugin`: دالة، صنف أو `{ apply }` كائن شكل صيغة إضافة.
- `args`: إضافة إعداد، سوف أصل حسب ذلك `Config` schema إجراء تحقق.

**إرجاع** fiber؛ مقابل ذلك تنفيذ await سوف في تحميل إتمام بعد انتهاء انتظار (إذا حدوث إعداد خطأ أو بدء خطأ، فإن سوف يتم رفض).

[شفرة المصدر](../../vendor/cordis/src/registry.ts#L185)

## Plugin

دعم حمل إضافة مدخل نقطة شكل صيغة.

```ts cordis-catalog
/** Supported plugin entrypoint shapes. */
type Plugin<T = any> =
  | Plugin.Function<T>
  | Plugin.Constructor<T>
  | Plugin.Object<T>

/** Types associated with plugin entrypoints and runtime records. */
namespace Plugin {
  /** Shared metadata understood by the plugin registry and related tooling. */
  export interface Base<T = any> {
    /** Display name used for fiber diagnostics and logger names. */
    name?: string
    /** Standard-schema validator applied to config before the plugin starts. */
    Config?: StandardSchemaV1<any, T>
    /** Services the plugin requires; it only loads while all are available. */
    inject?: Inject
    /** Service name(s) the plugin provides (read by `Service` and by loaders). */
    provide?: string | string[]
    /** Service names whose intercept config the plugin declares it consumes. */
    intercept?: Dict<boolean>
  }

  export interface Transform<S, T> {
    /** Marks the transform object as a schema/config transform. */
    schema?: true
    /** Convert user-facing config to runtime config. */
    Config: (config: S) => T
  }

  /** Function plugin called with `(ctx, config)`. */
  export interface Function<T = any> extends Base<T> {
    (ctx: Context, config: T): any
  }

  /** Class plugin constructed with `(ctx, config)`. */
  export interface Constructor<T = any> extends Base<T> {
    new (ctx: Context, config: T): any
  }

  /** Object plugin with an `apply(ctx, config)` method. */
  export interface Object<T = any> extends Base<T> {
    apply(ctx: Context, config: T): any
  }

  /** Mutable registry record shared by all fibers of one plugin callback. */
  export interface Runtime {
    /** Display name copied from the first registered plugin shape. */
    name?: string
    /** Every live fiber of this plugin (one per `ctx.plugin()` call). */
    fibers: DisposableList<Fiber>
    /** The executable entrypoint all fibers share (registry identity key). */
    callback: globalThis.Function
    /** Standard-schema validator applied to each fiber's config. */
    Config?: StandardSchemaV1
  }
}
```

[شفرة المصدر](../../vendor/cordis/src/registry.ts#L92)

## Inject

إضافة و `@Inject` تركيب زينة جهاز قبول خدمة اعتماد إعلان.

عدد مجموعة شكل صيغة طلب لا حمل اعتراض قطع إعداد خدمة. كائن شكل صيغة سوف كل خدمة اسم خريطة إلى إضافة سياق في اختياري اعتراض قطع إعداد.

```ts cordis-catalog
/**
 * Service dependency declaration accepted by plugins and the `@Inject`
 * decorator.
 *
 * Array form requests services without intercept config. Object form maps each
 * service name to optional intercept config for the plugin context.
 */
type Inject<M = Dict> = (keyof M)[] | { [K in keyof M]?: M[K] }

/** Utilities for normalizing plugin dependency declarations. */
namespace Inject {
  /**
   * Convert array/object/class-inherited inject metadata into a plain map.
   *
   * @param inject — the declaration to normalize; `null`/`undefined` add nothing.
   * @param result — the map to fill (service name → intercept config or `null`).
   * @returns `result`.
   */
  export function resolve(inject: Inject | null | undefined, result: Dict = Object.create(null))
}
```

[شفرة المصدر](../../vendor/cordis/src/registry.ts#L19)
