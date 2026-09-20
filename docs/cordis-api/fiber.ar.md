<!-- ملفُّ المصدر الإنجليزي مولَّد من scripts/gen-cordis-catalog.ts؛ وهذا الملف العربي جانبٌ مراجَع يُصان عبر الاقتران الثنائي اللغة.
     عند التحديث شغّل `pnpm run gen-cordis-catalog` أولًا لتحديث الإنجليزي، ثم حدّث هذا الملف وشغّل `pnpm run verify-translation-pairing --write docs/cordis-api/fiber.md` لإعادة تسجيل الاقتران. -->

# Fiber

[English](fiber.md) | العربية

الـ fiber نسخةُ إضافة محمَّلة واحدة: حالةُ دورة حياتها، وإعدادُها المتحقَّق منه، وآثارُها المسجَّلة. و`ctx.fiber` هو الـ fiber الحالي، و`ctx.effect()` يفوّض إليه.

### ctx.effect(execute, label?)

```ts cordis-catalog
/**
 * Register a cleanup-aware effect on this fiber.
 *
 * `execute` runs immediately; the disposers it produces are collected and
 * run (in reverse order) either when the returned disposer is called or
 * when the fiber unloads, whichever comes first. Calling the disposer twice
 * is a no-op. Throws `CordisError('INACTIVE_EFFECT')` if the fiber is
 * already disposed, and `TypeError` if `execute` returns an invalid shape.
 *
 * @param execute — the effect body; see {@link Effect} for accepted shapes.
 * @param label — effect label shown in `getEffects()` diagnostics.
 * @returns a disposer that tears the effect down and settles once done.
 */
effect(execute: () => SyncEffect, label?: string): Disposable<Promise<void>>
effect(execute: () => Effect, label?: string): AsyncDisposable<Promise<void>>
```

سجّل أثرًا يراعي التنظيف على هذا الـ fiber.

ويعمل `execute` فورًا؛ وتُجمع المحرِّراتُ التي ينتجها وتعمل (بعكس الترتيب) إما عند استدعاء المحرِّر المعاد وإما عند تفريغ الـ fiber، أيهما أسبق. واستدعاءُ المحرِّر مرتين بلا أثر. ويرمي `CordisError('INACTIVE_EFFECT')` إن كان الـ fiber محرَّرًا أصلًا، و`TypeError` إن أعاد `execute` صيغةً غير صالحة.

- `execute`: متنُ الأثر؛ انظر `Effect` للصيغ المقبولة.
- `label`: وسمُ الأثر الظاهر في تشخيصات `getEffects()`.

**يعيد** محرِّرًا يفكّ الأثرَ ويستقر متى انتهى.

[المصدر](../../vendor/cordis/src/fiber.ts#L415)

### ctx.fiber

```ts cordis-catalog
/** The fiber (plugin runtime instance) that owns this context. */
fiber: Fiber
```

الـ fiber (نسخةُ وقت تشغيل الإضافة) الذي يملك هذا السياق.

[المصدر](../../vendor/cordis/src/fiber.ts#L12)

## صنف Fiber

نسخةُ وقت التشغيل لتطبيق إضافة واحد.

ويتتبع الـ fiber حالةَ الاعتماديات، والإعدادَ المتحقَّق منه، وآثارَ دورة الحياة، والتنظيفَ لسياق الإضافة الذي يعيده `ctx.plugin()`.

[المصدر](../../vendor/cordis/src/fiber.ts#L184)

### fiber.uid

```ts cordis-catalog
/** Unique id within the registry; 0 for the root fiber, `null` once disposed. */
public uid: number | null
```

معرّفٌ فريد داخل الـ registry؛ وهو 0 للـ fiber الجذر، و`null` بعد التحرير.

[المصدر](../../vendor/cordis/src/fiber.ts#L186)

### fiber.ctx

```ts cordis-catalog
/** The context this fiber's plugin runs in (extends the parent context). */
public readonly ctx: Context
```

السياقُ الذي تعمل فيه إضافةُ هذا الـ fiber (ويوسّع السياقَ الأب).

[المصدر](../../vendor/cordis/src/fiber.ts#L188)

### fiber.config

```ts cordis-catalog
/** The validated plugin config (updated by `update()`). */
public config: any
```

إعدادُ الإضافة المتحقَّق منه (ويحدّثه `update()`).

[المصدر](../../vendor/cordis/src/fiber.ts#L190)

### fiber.state

```ts cordis-catalog
/** Current lifecycle state; transitions emit `internal/status`. */
public state
```

حالةُ دورة الحياة الراهنة؛ والانتقالاتُ ترسل `internal/status`.

[المصدر](../../vendor/cordis/src/fiber.ts#L194)

### fiber.dispose

```ts cordis-catalog
/** Dispose this fiber: unload the plugin, then settle once cleanup finished. */
public readonly dispose: () => Promise<void>
```

حرّر هذا الـ fiber: فرّغ الإضافة، ثم استقر متى انتهى التنظيف.

[المصدر](../../vendor/cordis/src/fiber.ts#L196)

### fiber.store

```ts cordis-catalog
/** Snapshot of required service implementations while loaded; `undefined` otherwise. */
public store: Dict<Impl> | undefined
```

لقطةٌ لتنفيذات الخدمات المطلوبة أثناء التحميل؛ و`undefined` فيما عدا ذلك.

[المصدر](../../vendor/cordis/src/fiber.ts#L198)

### fiber.inertia

```ts cordis-catalog
/** The in-flight load/unload transition, if one is currently running. */
public inertia: Promise<void> | undefined
```

انتقالُ التحميل أو التفريغ الجاري، إن كان أحدهما يعمل حاليًا.

[المصدر](../../vendor/cordis/src/fiber.ts#L200)

### fiber.name

```ts cordis-catalog
/** The plugin's display name, inherited from the nearest named ancestor, else `'root'`. */
get name()
```

اسمُ عرض الإضافة، موروثًا من أقرب سلف مسمًّى، وإلا فـ `'root'`.

[المصدر](../../vendor/cordis/src/fiber.ts#L336)

### fiber.assertActive()

```ts cordis-catalog
/**
 * Throw if the fiber has already been disposed.
 *
 * @returns nothing when the fiber is still active.
 * @throws {CordisError} `INACTIVE_EFFECT` when the fiber's uid has been cleared.
 */
assertActive()
```

ارمِ إن كان الـ fiber محرَّرًا أصلًا.

**يعيد** لا شيء ما دام الـ fiber نشطًا.

[المصدر](../../vendor/cordis/src/fiber.ts#L351)

### fiber.effect(execute, label?)

```ts cordis-catalog
/**
 * Register a cleanup-aware effect on this fiber.
 *
 * `execute` runs immediately; the disposers it produces are collected and
 * run (in reverse order) either when the returned disposer is called or
 * when the fiber unloads, whichever comes first. Calling the disposer twice
 * is a no-op. Throws `CordisError('INACTIVE_EFFECT')` if the fiber is
 * already disposed, and `TypeError` if `execute` returns an invalid shape.
 *
 * @param execute — the effect body; see {@link Effect} for accepted shapes.
 * @param label — effect label shown in `getEffects()` diagnostics.
 * @returns a disposer that tears the effect down and settles once done.
 */
effect(execute: () => SyncEffect, label?: string): Disposable<Promise<void>>
effect(execute: () => Effect, label?: string): AsyncDisposable<Promise<void>>
```

سجّل أثرًا يراعي التنظيف على هذا الـ fiber.

ويعمل `execute` فورًا؛ وتُجمع المحرِّراتُ التي ينتجها وتعمل (بعكس الترتيب) إما عند استدعاء المحرِّر المعاد وإما عند تفريغ الـ fiber، أيهما أسبق. واستدعاءُ المحرِّر مرتين بلا أثر. ويرمي `CordisError('INACTIVE_EFFECT')` إن كان الـ fiber محرَّرًا أصلًا، و`TypeError` إن أعاد `execute` صيغةً غير صالحة.

- `execute`: متنُ الأثر؛ انظر `Effect` للصيغ المقبولة.
- `label`: وسمُ الأثر الظاهر في تشخيصات `getEffects()`.

**يعيد** محرِّرًا يفكّ الأثرَ ويستقر متى انتهى.

[المصدر](../../vendor/cordis/src/fiber.ts#L415)

### fiber.getEffects()

```ts cordis-catalog
/**
 * Return metadata for currently registered effects.
 *
 * @returns one {@link EffectMeta} tree per labeled live effect.
 */
getEffects()
```

أعِد بياناتِ الآثار المسجَّلة حاليًا الوصفية.

**يعيد** شجرةَ `EffectMeta` واحدة لكل أثر حي موسوم.

[المصدر](../../vendor/cordis/src/fiber.ts#L568)

### fiber.await()

```ts cordis-catalog
/**
 * Wait for current lifecycle work and rethrow startup errors.
 *
 * @returns this fiber, once it has settled into a stable state.
 * @throws the config-validation or plugin-startup error, if any.
 */
async await()
```

انتظر عملَ دورة الحياة الحالي وأعِد رميَ أخطاء الإقلاع.

**يعيد** هذا الـ fiber، متى استقر في حالة مستقرة.

[المصدر](../../vendor/cordis/src/fiber.ts#L704)

### fiber.restart()

```ts cordis-catalog
/**
 * Dispose and immediately reload this plugin with its current config.
 *
 * @returns a promise resolving once the reload settled.
 * @throws {CordisError} `INACTIVE_EFFECT` when the fiber is already disposed.
 */
async restart()
```

حرّر هذه الإضافة وأعِد تحميلها فورًا بإعدادها الحالي.

**يعيد** وعدًا يتحلّل متى استقرت إعادةُ التحميل.

[المصدر](../../vendor/cordis/src/fiber.ts#L718)

### fiber.update(config, noSave?)

```ts cordis-catalog
/**
 * Validate and apply new config, then restart the plugin.
 *
 * Runs the `internal/update` waterfall first, so update hooks (and HMR)
 * can veto or replace the restart.
 *
 * @param config — the new raw config; validated before anything restarts.
 * @param noSave — hint for persistence hooks not to write the change back.
 * @returns nothing; the restart runs behind the `internal/update` waterfall.
 * @throws {ValidationError} when the new config fails validation.
 */
update(config: any, noSave = false)
```

تحقّق من إعداد جديد وطبّقه، ثم أعِد إقلاع الإضافة.

ويشغّل waterfall المسمّى `internal/update` أولًا، فتستطيع خطافاتُ التحديث (وHMR) نقضَ إعادة الإقلاع أو استبدالَها.

- `config`: الإعدادُ الخام الجديد؛ ويُتحقَّق منه قبل أن يُعاد إقلاعُ أي شيء.
- `noSave`: تلميحٌ لخطافات الحفظ ألّا تكتب التغييرَ رجوعًا.

**يعيد** لا شيء؛ وإعادةُ الإقلاع تجري خلف waterfall المسمّى `internal/update`.

[المصدر](../../vendor/cordis/src/fiber.ts#L736)

## Effect

نتيجةُ متن الأثر التي يقبلها `ctx.effect()` وإقلاعُ الإضافة.

وهي إما محرِّرٌ واحد، أو وعدٌ بمحرِّر، أو كائنٌ قابل للتكرار (وقد يكون لاتزامنيًا) ينتج عدةَ محرِّرات؛ فآثارُ المولِّدات تسجّل كلَّ محرِّر تنتجه حال إنتاجه.

```ts cordis-catalog
/**
 * Effect body result accepted by `ctx.effect()` and plugin startup.
 *
 * Either a single disposer, a promise of one, or a (possibly async) iterable
 * yielding several — generator effects register each yielded disposer as it
 * is produced.
 */
type Effect<T = any> =
  | SyncEffect<T>
  | AsyncEffect<T>
```

[المصدر](../../vendor/cordis/src/fiber.ts#L83)

## Disposable

الدالةُ التي يعيدها الأثرُ لتحرير الموارد أثناء التحرير.

وتعمل المحرِّراتُ بعكس ترتيب التسجيل حين يُفرَّغ الـ fiber المالك؛ وقد تكون لاتزامنية، فينتظرها التفريغُ عندئذ.

```ts cordis-catalog
/**
 * Function returned by an effect to release resources during disposal.
 *
 * Disposers run in reverse registration order when the owning fiber unloads;
 * they may be async, in which case unloading awaits them.
 */
type Disposable<T = any> = () => T
```

[المصدر](../../vendor/cordis/src/fiber.ts#L74)

## EffectMeta

عقدةُ شجرة تكشف وسومَ الآثار المتداخلة للتشخيص.

```ts cordis-catalog
/** Tree node used to expose nested effect labels for diagnostics. */
interface EffectMeta {
  /** Human-readable effect label, e.g. `ctx.on("event")` or `ctx.provide("name")`. */
  label: string
  /** Metadata of nested effects registered while this effect ran. */
  children: EffectMeta[]
}
```

[المصدر](../../vendor/cordis/src/fiber.ts#L96)

## CordisError

خطأُ الإطار برمز ثابت تقرؤه الآلة.

```ts cordis-catalog
/** Framework error with a stable machine-readable code. */
class CordisError extends Error {
  /**
   * @param code — the stable error code; also the default message.
   * @param message — optional human-readable override.
   */
  constructor(public code: CordisError.Code, message?: string)
}

/** Cordis error code definitions. */
namespace CordisError {
  export type Code = keyof typeof Code

  export const Code = {
    INACTIVE_EFFECT: 'cannot create effect on inactive context',
  } as const
}
```

[المصدر](../../vendor/cordis/src/fiber.ts#L157)

## ValidationError

الخطأُ المرفوع حين يسقط إعدادُ الإضافة في تحقق standard-schema.

```ts cordis-catalog
/** Error raised when plugin configuration fails standard-schema validation. */
class ValidationError extends TypeError {
  name = 'ValidationError'

  /**
   * Build the aggregated message from schema issues.
   *
   * @param issues — the standard-schema issues, one message line each.
   */
  constructor(issues: readonly StandardSchemaV1.Issue[])
}
```

[المصدر](../../vendor/cordis/src/fiber.ts#L19)
