<!-- ملفُّ المصدر الإنجليزي مولَّد من scripts/gen-cordis-catalog.ts؛ وهذا الملف العربي جانبٌ مراجَع يُصان عبر الاقتران الثنائي اللغة.
     عند التحديث شغّل `pnpm run gen-cordis-catalog` أولًا لتحديث الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/cordis-api/registry.md` لإعادة تسجيل الاقتران. -->

# Registry

[English](registry.md) | العربية

تحميلُ الإضافات وحقنُ الاعتماديات.

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

شغّل استدعاءً راجعًا متى صارت الخدماتُ المطلوبة متاحة.

اختصارٌ لـ `ctx.plugin({ inject, apply: callback })`: فيُفرَّغ الاستدعاءُ الراجع ويُعاد تشغيله كلما تغيّرت خدمةٌ مطلوبة.

- `deps`: الخدماتُ المطلوبة، مصفوفةً أو خريطةَ اسم إلى إعداد.
- `callback`: متنُ الإضافة يُستدعى بـ `(ctx, config)`.

**يعيد** الـ fiber؛ وانتظارُه يستقر متى انتهى التحميل.

[المصدر](../../vendor/cordis/src/registry.ts#L176)

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

حمّل إضافةً في السياق الحالي.

- `plugin`: دالةٌ أو صنف أو إضافةُ كائن `{ apply }`.
- `args`: إعدادُ الإضافة، متحقَّقًا منه مقابل schema الخاص بها في `Config`.

**يعيد** الـ fiber؛ وانتظارُه يستقر متى انتهى التحميل (ويُرفَض عند أخطاء الإعداد أو الإقلاع).

[المصدر](../../vendor/cordis/src/registry.ts#L185)

## Plugin

صيغُ مداخل الإضافات المدعومة.

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

[المصدر](../../vendor/cordis/src/registry.ts#L92)

## Inject

تصريحُ اعتماديات الخدمات الذي تقبله الإضافاتُ والمزخرِف `@Inject`.

وصيغةُ المصفوفة تطلب الخدماتِ بلا إعداد اعتراض. وصيغةُ الكائن تربط كل اسم خدمة بإعداد اعتراض اختياري لسياق الإضافة.

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

[المصدر](../../vendor/cordis/src/registry.ts#L19)
