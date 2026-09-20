# presets الأذونات

[English](permission-presets.md) | العربية

تجمع طبقةُ presets الأذونات في [dsh-permission-presets](../../packages/interaction/permission-presets) (`ctx.permissionPresets` و`PermissionPresetService`) مقبضَي الفرض المستقلين — [وضع العزل](sandbox.ar.md) (`sandbox/mode`) و[سياسة الموافقة](approval.ar.md) (`approval/policy`) — في presets مسمّاة يعرضها العميلُ مُنتقيًا واحدًا للأذونات. ويملك الجدولُ المضبوط افتراضاتِ الجلسات المقبلة، بينما يتيح الخطّافُ الثابت `registerAuto(admit)` لتكامل [Auto review](../../packages/experimental/auto-review/README.ar.md) أن ينشر خيارَه المقتصر على الجلسة الحالية طوال عمر أثر واحد. والطبقةُ اختيارية ولا تملك سياسةَ تنفيذ: فسردُ المطالبة وإعادةُ التشغيل يبقيان يقرآن طيَّ مقبضهما، بينما يملك Auto review الفرضَ الإضافي. ويملك [README الحزمة](../../packages/interaction/permission-presets/README.ar.md) حالةَ التركيب والحدود؛ ويملك [تصميم تبديل العزل](../../.agents/notes/implemented/feature/2026-07-06-sandbox.ar.md) المسوّغَ الأصلي للمقبضين.

المصدر: [`packages/interaction/permission-presets/src/index.ts`](../../packages/interaction/permission-presets/src/index.ts)

## جدول presets

يربط preset مفتاحًا ثابتًا واحدًا بحزمة عزل وموافقة مع عرض اختياري للعميل. ويشحن الجدولُ المضبوط الافتراضي `workspace-write` (`workspace-write` مع `ask`) و`danger-full-access` (`danger-full-access` مع `never`)؛ أما `custom` و`auto` فمحجوزان ولا يمكن ضبطهما.

```ts type-equiv
/** One preset's sandbox/approval bundle and optional client presentation. */
interface PresetSpec {
  /** The `sandbox/mode` value the preset writes through. */
  sandbox: SandboxMode
  /** The `approval/policy` value the preset writes through. */
  approval: ApprovalPolicy
  /** The display label a client shows for this preset; the raw table key when omitted. */
  name?: string
  /** One user-facing sentence on what the preset means; omitted when not configured. */
  description?: string
}
```

```ts type-equiv
/** The {@link PermissionPresetService} config: preset table and composition default. */
interface Config {
  /**
   * The preset table: name → knob bundle. Defaults to `workspace-write`
   * (workspace-write + ask) and `danger-full-access` (danger-full-access +
   * never). The names `custom` and `auto` are reserved for derived state and
   * the Auto review integration respectively.
   */
  presets?: Record<string, PresetSpec>
  /**
   * Default for new sessions. When omitted, the preset matching the composed
   * sandbox and approval defaults is used.
   */
  defaultPreset?: string
}
```

وتشترط الخدمةُ منفِّذَ `ctx.shell` حاصرًا و`ctx.approval`، ويفشل سوءُ الضبط عند تحميل الإضافة: فالمداخلُ المضبوطة المسماة `custom` أو `auto` ترمي، والتركيبُ فوق منفِّذ bash لا يحصر (بلا حقيقة قدرة `sandboxMode`) يرمي لأن presets تجمع وضعَ عزل.

## تسجيل Auto الثابت للجلسة الحالية

ينادي تكاملُ Auto الدالةَ `registerAuto(admit)` طوال عمر أثره. وتثبّت هذه الخدمةُ هويةَ `auto` وحزمتَه `danger-full-access` مع `never`؛ وتملك قواميسُ لغة العميل المشحونة تسميةَ Auto ووصفَه، بينما يبقى عرضُ presets المضبوطة مملوكًا للمضيف. ولا يستطيع المستدعون نشرَ preset آخر عبر واجهة إسهام عامة. ويظهر Auto بعد presets المضبوطة، ولا يدخل قط schema إعدادات `permission.defaultPreset`، ويختفي حين يُتخلَّص من الأثر. ويعمل ردُّ النداء المتزامن `admit` قبل أن يغيّر اختيارُ Auto الجلسةَ وقبل أن تُنشر جلسةُ Auto مخزَّنة، فلا يعيد تكاملٌ غائب أو قيد الإغلاق كتابةَ الهوية الدائمة.

ويُطلق تسجيلُ Auto أو إزالتُه إشعارَ `permission-presets/catalog-changed` بلا حمولة. ويشترك مستهلكو العملية قبل نداء `catalog()`، ثم يعيدون قراءةَ الدليل القابل للانتقاء كاملًا بعد كل إشعار. ولا يحتوي إسقاطُ الجلسة `permissions` إلا على `currentValue`، فتغييراتُ الدليل لا تُلحق حدثَ جلسة، ولا تنشر إطارَ إسقاط جلسة، وتترك تسلسلَ الجلسة كما هو.

## الـpreset الحالي و`custom` المشتق

يشتق `current(session)` الـpreset الساري من إسقاط `permissions` المشترَط. وتطوي الوحدةُ وضعَ عزل الجلسة وسياسةَ موافقتها والاختيارَ المسجَّل؛ والقيمُ الغائبة داخل تلك الحالة ترتد إلى الوضع المضبوط للمنفِّذ وضبطِ خدمة الموافقة، ثم إلى `ask`. ويفشل مفتاحُ الإسقاط الغائب صراحةً. وتفضّل الخدمةُ اختيارًا لا يزال مطابقًا، ثم أولَ مدخل مضبوط مطابق، وإلا أعادت `CUSTOM_PRESET` (`'custom'`). و`custom` مشتقٌّ فقط: فقد يعرضه العملاءُ قيمةً حالية، لكنه ليس قط هدفَ تبديل ولا حمولةَ حدث.

ويعدّد `names` presets المضبوطة بترتيب تصريحها متبوعةً بـAuto ما دام تكاملُه حيًّا. ويعيد `catalog()` تلك المداخلَ القابلة للانتقاء لقطةً واحدة على مستوى العملية. ويبني `optionOf(name)` مدخلًا متاحًا (وترتد تسميتُه إلى المفتاح) أو عرضَ `custom` المشتق، ويرمي لأي اسم آخر. ويصل العملاءُ الدليلَ بإسقاط الجلسة؛ وقد يسمّي `custom` القيمةَ الحالية لكنه لا يصير مدخلًا في الدليل.

```ts type-equiv
/** Presentation for an available preset or the derived `custom` current value. */
interface PresetOption {
  /** Stable option value: a configured preset key, live `auto`, or derived `custom`. */
  value: string
  /** The display label. */
  name: string
  /** One user-facing sentence on what the value means; omitted when not configured. */
  description?: string
}
```

## التبديل وحدث `permission/preset`

يحلّ `set(session, name)` الـpreset (والأسماءُ المجهولة ترمي)، ويشغّل قبولَ Auto حين ينطبق، ويُلحق حدثَ `permission/preset` للسجل فقط ما لم يكن `name` هو الـpreset الساري سلفًا، ثم يكتب كلَّ مقبض عبر ضابطه — `setSandboxMode` من [dsh-sandbox-policy](../../packages/sandbox/sandbox-policy) و`setApprovalPolicy` من [dsh-user-approval](../../packages/interaction/user-approval) — ولا يفعل ذلك إلا حين تتغير القيمةُ السارية لذلك المقبض. ويسبق حدثُ الاختيار حدثَي المقبضين في الجولة نفسها، وإعادةُ انتقاء الـpreset الساري لا تُلحق شيئًا.

و`permission/preset` نيّةُ مستخدم دائمة للسجل فقط: فهي تبقى خارج نص المحادثة الذي يراه النموذج (إذ يملك حدثا المقبضين النتائجَ التي يراها النموذج عبر مستهلكيهما)، ووُجدت ليستطيع `current()` حفظَ أيِّ preset اختاره المستخدم حين يتشارك presetان حزمةً واحدة. ويطوي إسقاطُ `permissions` ذلك الاختيارَ مع حدثَي المقبضين، ويحتفظ بحدّ `session/end-seed` المستعمل للتمييز بين بذرة فارغة مستعادة وجلسة جديدة؛ ولا تحتاج إعادةُ التشغيل إلى حالة لحاق ولا إلى إعادة مسح السجل الخام. ويشترط اختيارُ `auto` المستعاد تسجيلَ Auto الحي قبل نشر الوكيل. وتصريحُ الحدث كاملًا في [دليل أحداث سجل الحفظ الدائم](../persistence-catalog.ar.md)؛ وتوقيعاتُ الطرائق في [دليل الخدمات](#ctxpermissionpresets--permissionpresetservice) المولَّد.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxpermissionpresets--permissionpresetservice"></a>

### `ctx.permissionPresets` — `PermissionPresetService`

Owns the deployment's configured permission presets, the fixed Auto integration hook, and their write path. Requires a confining `ctx.shell` executor and `ctx.approval`; unmatched knob values are reported as CUSTOM_PRESET, not an error.

```ts cordis-catalog
/**
 * Read the complete process-level catalog exposed to current-session UI.
 * @returns every currently selectable preset in contribution order.
 */
@Remote('catalog') catalog(): PermissionCatalog

/**
 * Publish the fixed current-session Auto preset for the calling
 * integration's effect lifetime.
 * @param admit - synchronous gate run before live Auto selection or restore.
 * @returns the async effect disposer that removes Auto.
 */
registerAuto(admit: () => void): () => Promise<void>

/**
 * Resolve the preset matching the effective knob values. A still-matching
 * last selection wins shared-bundle ties; otherwise the first configured
 * match wins. Returns
 * {@link CUSTOM_PRESET} when no available preset matches.
 * @param session - the session whose knob state is read.
 * @returns the effective preset name, or `custom` when nothing matches.
 */
current(session: Session): string

/**
 * Resolve an available preset's knob bundle.
 * @param name - the preset name to resolve.
 * @returns the configured bundle.
 * @throws when `name` is neither configured nor the currently live Auto preset.
 */
resolve(name: string): PresetSpec

/**
 * Build the client option for an available preset or {@link CUSTOM_PRESET}.
 * A missing label falls back to the preset key.
 * @param name - a configured preset key, live `auto`, or `custom`.
 * @returns the option a client renders.
 * @throws when `name` is neither a configured preset, live `auto`, nor `custom`.
 */
optionOf(name: string): PresetOption

/**
 * Record a changed preset, then update each changed knob through its own
 * setter. Selecting the effective preset again appends nothing.
 * @param session - the session the switch belongs to.
 * @param name - the preset to switch to; unknown names throw.
 */
set(session: Session, name: string): void
```

Types: [Session](session.ar.md)

Source: [`packages/interaction/permission-presets/src/index.ts`](../../packages/interaction/permission-presets/src/index.ts)

<a id="permission-presets-events"></a>

### `permission-presets/*` events

<a id="permission-presetscatalog-changed--emit"></a>

#### `permission-presets/catalog-changed` — emit

The selectable process catalog changed. Payload-free by design: consumers subscribe first, then re-read the complete catalog.

```ts cordis-catalog
/**
 * The selectable process catalog changed. Payload-free by design:
 * consumers subscribe first, then re-read the complete catalog.
 * @mode emit
 */
'permission-presets/catalog-changed'(): void
```

Source: [`packages/interaction/permission-presets/src/types.ts`](../../packages/interaction/permission-presets/src/types.ts)
<!-- END GENERATED cordis-surface -->
