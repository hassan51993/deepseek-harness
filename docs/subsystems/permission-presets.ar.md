# إذن مسبق ضبط

[English](permission-presets.md) | العربية

[dsh-permission-presets](../../packages/interaction/permission-presets) إذن مسبق ضبط طبقة (`ctx.permissionPresets`،`PermissionPresetService`) يأخذ اثنان عدد متبادل متبادل مستقل قوي صنع تنفيذ knob، أي[صندوق رملي نمط](sandbox.ar.md)(`sandbox/mode`) و[مراجعة دفعة سياسة](approval.ar.md)(`approval/policy`) ، ربط ربط صار أداة اسم مسبق ضبط، توفير عميل بصفة مفرد عدد Permissions اختيار جهاز توفير. إعداد جدول يملك لم قدوم جلسة قيمة افتراضية، بينما ثابت `registerAuto(admit)` خطاف يجعل [Auto review](../../packages/experimental/auto-review/README.ar.md) integration في واحد effect دورة الحياة داخل إصدار فقط حد حالي جلسة خيار. هذا طبقة هو اختياري قدرة، كما لا يملك تنفيذ سياسة: نص التوجيه سرد وصف و إعادة تشغيل ما زال قراءة كل منها knob طي نتيجة، مقدار خارج قوي صنع تنفيذ من Auto review يملك.[حزمة README](../../packages/interaction/permission-presets/README.ar.md) مسؤول تركيب حالة و حد؛[صندوق رملي تبديل تصميم](../../.agents/notes/implemented/feature/2026-07-06-sandbox.ar.md) مسؤول أصلي دوران زر اعتماد حسب.

شفرة المصدر:[`packages/interaction/permission-presets/src/index.ts`](../../packages/interaction/permission-presets/src/index.ts)

## مسبق ضبط جدول

مسبق ضبط يأخذ واحد مستقر key خريطة إلى واحد مجموعة صندوق رملي/مراجعة دفعة تركيب، خارج إضافة اختياري عميل عرض معلومة. افتراضي إعداد جدول ذاتي حمل `workspace-write`(`workspace-write` + `ask`) و `danger-full-access`(`danger-full-access` + `never`) ؛`custom` و `auto` هو إبقاء اسم، لا يستطيع إعداد.

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

هذا خدمة اشتراط واحد تطبيق إضافة عزل `ctx.shell` منفذ و `ctx.approval`، إعداد خطأ في إضافة تحميل وقت أي فشل: اسم لـ `custom` أو `auto` إعداد بند سوف رمي خروج استثناء؛ في لا تطبيق إضافة عزل bash منفذ (لا يوجد `sandboxMode` قدرة واقع) لـ فوق تركيب نفس مثال رمي خروج استثناء، لأن مسبق ضبط ربط ربط واحد صندوق رملي نمط.

## ثابت حالي جلسة Auto تسجيل

Auto integration سوف في ذاته effect دورة الحياة داخل استدعاء `registerAuto(admit)`. هذا خدمة ثابت `auto` هوية و `danger-full-access` إضافة `never` تركيب؛shipped عميل locale حرف قاموس يملك Auto label و description، بينما إعداد مسبق ضبط عرض معلومة ما زال عودة Host كل. استدعاء جهة لا يستطيع عبر عام contribution API إصدار أخرى مسبق ضبط.Auto ترتيب صف في إعداد مسبق ضبط بعد، أبدا سوف دخول `permission.defaultPreset` ضبط schema، و في effect dispose وقت إزالة فقد. تزامن `admit` عودة ضبط سوف في Auto اختيار تعديل Session قبل، و تخزين Auto Session إصدار قبل تشغيل، لذلك integration ناقص أو جارٍ إغلاق وقت لن تعديل كتابة حمل دائم هوية.

تسجيل أو إزالة Auto سوف إرسال خروج بلا payload `permission-presets/catalog-changed` إشعار. عملية درجة مستهلك أولا حجز قراءة، مجددا استدعاء `catalog()`؛ كل مرة استلام إلى إشعار بعد إعادة قراءة كامل اختياري دليل.`permissions` Session إسقاط فقط يتضمن `currentValue`، لذلك دليل تغير لن إلحاق Session حدث، إصدار Session إسقاط لقطة أو تغيير Session تسلسل.

## حالي مسبق ضبط و إرسال توليد `custom`

`current(session)` من مطلوب `permissions` إسقاط إرسال توليد فعلي توليد فاعلية مسبق ضبط. هذا وحدة طي جلسة صندوق رملي نمط، مراجعة دفعة سياسة و قد سجل اختيار؛ حالة داخلي ناقص قيمة رجوع إلى منفذ إعداد نمط و مراجعة دفعة خدمة إعداد، الأكثر بعد رجوع إلى `ask`. إسقاط key ناقص وقت سوف صريح فشل. خدمة أولوية أخذ ما زال مطابقة اختيار، ذلك مرة أخذ رقم واحد مطابقة إعداد بند، لا فإن إرجاع `CUSTOM_PRESET`(`'custom'`).`custom` فقط هو إرسال توليد قيمة: عميل يمكن يأخذ هو عرض لـ حالي قيمة، لكن هو أبدا هو تبديل هدف، أيضا أبدا ظهور في حدث payload في.

`names` أولا حسب إعلان ترتيب صف خروج إعداد مسبق ضبط، مجددا في Auto integration تخزين نشط وقت صف خروج Auto.`catalog()` يأخذ هذه اختياري بند بصفة واحد نسخة عملية درجة لقطة إرجاع.`optionOf(name)` لـ متاح بند (label رجوع لـ هذا key) أو إرسال توليد `custom` عرض بناء خيار، نقل دخول أخرى أي اسم كل سوف رمي خروج استثناء. عميل يأخذ دليل و Session إسقاط دمج؛`custom` يمكن علامة حالي قيمة، لكن أبدا سوف يصبح دليل بند.

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

## تبديل و `permission/preset` حدث

`set(session, name)` تحليل مسبق ضبط (لم معرفة اسم رمي خروج استثناء) ، في ملائم استخدام وقت تشغيل Auto دقيق دخول، في `name` بعد لا هو توليد فاعلية مسبق ضبط وقت إلحاق واحد بند فقط تسجيل سجل `permission/preset` حدث، لكن بعد عبر كل دوران زر ذاتي ذات setter([dsh-sandbox-policy](../../packages/sandbox/sandbox-policy) `setSandboxMode` و [dsh-user-approval](../../packages/interaction/user-approval) `setApprovalPolicy`) كتابة، كما فقط عند هذا knob توليد فاعلية قيمة حدوث تغير وقت عندئذ كتابة. نفس جولة داخل، اختيار حدث أولا في دوران زر حدث ظهور؛ إعادة اختيار حالي توليد فاعلية مسبق ضبط فإن ماذا كل لا إلحاق.

`permission/preset` هو حمل دائم، فقط تسجيل سجل مستخدم معنى رسم: هو لا دخول نموذج transcript(نص سجل) ، نموذج مرئي عاقبة من knob حدث مرور كل منها مستهلك تحمل تحمل؛ هو وجود هو لـ في اثنان عدد مسبق ضبط مشترك نفس عدد دوران زر تركيب وقت، يجعل `current()` ما زال قدرة حفظ إقامة مستخدم اختيار بحث فعلا هو أي واحد مسبق ضبط.`permissions` إسقاط يأخذ هذا اختيار و اثنان عدد knob حدث واحد نفس طي، و إبقاء لأجل منطقة قسم فارغ استعادة seed و جلسة جديدة `session/end-seed` حد؛ إعادة تشغيل لا حاجة أي تتبع لحاق حالة أو أصلي سجل إعادة مسح. استعادة `auto` اختيار في agent إصدار قبل يجب وجود live Auto تسجيل. كامل حدث إعلان رؤية[حفظ دائم سجل حدث دليل](../persistence-catalog.ar.md) ؛ طريقة توقيع رؤية توليد[خدمة دليل](#ctxpermissionpresets--permissionpresetservice).

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
