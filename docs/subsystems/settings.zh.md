# مستخدم ضبط

[English](settings.md) | العربية

[dsh-settings](../../packages/settings/settings) مستخدم ضبط seam يحتفظ واحد نسخة حسب namespace قسم عقدة مستخدم وثيقة، و يأخذ كل قد تسجيل namespace تحليل لـ:schema قيمة افتراضية، لكن بعد تسجيل جهة تركيب `base`، الأكثر بعد مستخدم قسم عقدة.[dsh-settings-file](../../packages/settings/settings-file) هذا صنف مزود تخزين أصلي وثيقة و دفع إرسال خارجي تحرير؛ مستهلك إضافة تسجيل schema بعد قراءة أو مراقبة تحليل قيمة. تركيب إعداد ما زال إبقاء في `cordis.yml`——namespace فقط تحمل تحميل مستخدم يمكن تحرير فرعي تجميع.

مصدر:[`packages/settings/settings/src/index.ts`](../../packages/settings/settings/src/index.ts)

## معرف

namespace تسمية مستخدم وثيقة في واحد عودة إضافة كل قسم عقدة.brand منع توقف استدعاء جهة سوف ضبط namespace و في حزمة أو عملية بين نقل تمرير أخرى id خلط استخدام؛ بنية صنع وقت تحقق صغير كتابة kebab-case لغة قاعدة.

```ts type-equiv
/** Nominal id of one registered settings namespace. */
type SettingsNamespace = Branded<'SettingsNamespace'>
```

## تسجيل

تسجيل يأخذ schemastery schema ربط إلى استدعاء جهة إضافة fiber فوق namespace——dispose(مورد تحرير) هذا fiber أي إزالة namespace و ذلك مراقبة من.options يحمل تركيب طبقة،owner توليد فاعلية وقت آلة، و واحد اختياري، لأجل تحقق schema جدول بلوغ لا قيد خطاف.

```ts type-equiv
/** Registration options beyond the namespace schema. */
interface SettingsRegisterOptions<T> {
  /** Composition-layer values resolved below the user layer (entry-config subset). */
  base?: Partial<T>
  /** Owner's effect timing, surfaced to configuration UIs; defaults to `live`. */
  applies?: SettingsApplies
  /**
   * Reject a resolved section the owner could not act on, for constraints its
   * schema cannot express — a cross-field requirement, or one field's validity
   * depending on another's. Throwing here refuses the *write* that produced the
   * value, so a caller learns at `update`/`replace`/`mutate` instead of storing
   * something that would silently disable the owner.
   *
   * Kept separate from the schema because the schema is also what a
   * configuration surface renders and what an absent section resolves through;
   * folding a cross-field check into it would change both.
   *
   * Once the owner is registered, a stored section that fails this keeps the
   * namespace's last good value and warns, exactly as a schema failure does,
   * so an externally edited document cannot strand a running owner. At
   * registration there is no last good value yet, so a stored section that
   * already fails rejects the registration itself — again exactly as a schema
   * failure does.
   * @param value - the resolved section, schema-valid by construction.
   */
  validate?: (value: T) => void
}
```

`validate` في schema وصل قبول هذا قيمة بعد تشغيل، لذلك هو يرى قيمة افتراضية و تركيب base و owner فعلي يرى تماما متسق.`dsh-llm-pi-ai` استخدام هو في كتابة موضع رفض ذاتي ذات لا يمكن خدمة مزود profile، بينما لا هو أولا تخزين تحت قدوم، مجددا يجعل هذا namespace تحت كل بند توجيه بطلان.

`applies` هو UI تلميح بينما غير آلية:`restart` owner من لا watch، ذلك قيمة في بنية صنع مدة قراءة مرة، إعداد واجهة يمكن لـ انتظار توليد فاعلية تغيير إضافة علامة.

```ts type-equiv
/** When a namespace's changes take effect for its owner. */
type SettingsApplies = 'live' | 'restart'
```

## Owner scope

scope هو موجه إلى owner جملة مقبض.`update` يأخذ نادر متباعد patch فقط دمج دخول مستخدم قسم عقدة (أبدا دخول `base`) ؛`replace` كامل جسم استبدال قسم عقدة، هو حذف/إعادة وضع مسار——استبدال في نقص مقعد مفتاح إعادة وراثة `base` و schema قيمة افتراضية. نفس namespace كتابة حسب استدعاء ترتيب سلسلة سطر، تحليل قيمة هو عميق تجميد ربط لقطة.

```ts type-equiv
/** Owner-facing handle for one registered namespace. */
interface SettingsScope<T> {
  /** Current resolved value: schema defaults, then `base`, then the user layer. */
  get(): T
  /**
   * Observe committed changes to this namespace's resolved value. Invocations
   * of one callback run asynchronously, one at a time, in commit order; a
   * rejection is contained and logged like a sync throw. After the disposer
   * returns, no further invocation starts — one already queued is skipped;
   * one already started still settles, and service disposal waits for it.
   * @param callback - invoked after each commit with the next and previous values.
   * @returns the disposer removing this observer.
   */
  watch(callback: (next: T, prev: T) => void | Promise<void>): () => void
  /**
   * Merge a partial patch into this namespace's user layer and persist it.
   * @param patch - plain-object patch over the user section; JSON-compatible data
   * only (non-JSON values reject with their path before anything persists).
   */
  update(patch: object): Promise<void>
  /**
   * Replace this namespace's user section wholesale; absent keys re-inherit
   * the composition `base` and schema defaults (`replace({})` resets all).
   * @param section - the complete next user section; JSON-compatible data only,
   * as for {@link update}.
   */
  replace(section: object): Promise<void>
}
```

## وصف رمز

`describe()` لـ إعداد واجهة تسلسل تحويل كل قد تسجيل namespace:schemastery `toJSON()` غلاف تركيب بنية قيادة schema تصيير جدول مفرد، تحليل قيمة ملء ملء جدول مفرد، قسم مغادرة خروج `base`/`user` طبقة يجعل جدول مفرد حسب حقل هل ظهور في user طبقة علامة ملاحظة «مستخدم قد تغطية».`describe({ redactSecrets: true })`——كل مقابل خارج نقل واجهة كل يجب نقل دخول——من ثلاثة طبقة تقشير مغادرة `role('secret')` حقل و قطعة رفع ذلك `{path, set}` slot، صفحة لذلك قدرة تصيير فقط كتابة إدخال إطار بينما دائم بعيد استلام لا إلى آلة سري قيمة.

```ts type-equiv
/** One registered namespace as surfaced to configuration UIs. */
interface SettingsDescriptor {
  /** The registered namespace. */
  ns: SettingsNamespace
  /** Serialized schemastery schema (`schema.toJSON()`). */
  schema: unknown
  /** Current resolved value. */
  value: unknown
  /**
   * Monotonic revision of the raw user section this descriptor was read at.
   * Send it back as `expectedRevision` on a write to refuse a stale one.
   */
  revision: number
  /** Registrant's composition `base` layer (detached), when one was declared. */
  base?: unknown
  /**
   * Raw user section from the stored document (detached), when one exists and
   * is well-formed; a field's presence here is what marks it user-overridden.
   */
  user?: unknown
  /** Owner's declared effect timing. */
  applies: SettingsApplies
  /** Schema-declared secret positions; present only under `redactSecrets`. */
  secrets?: RedactedSecret[]
}
```

فقط يحتفظ انفصال حساس descriptor استدعاء جهة لا يمكن أمان أرض إعادة بناء قسم عقدة، لذلك حذف تعديل بـ مسار op نقل تمرير. كل descriptor أيضا يحمل إبرة مقابل أصلي قسم عقدة `revision`؛ كتابة يمكن يأخذ هو بصفة `expectedRevision` إرسال عودة، لم يعد مطابقة كتابة سوف يتم رفض، بينما لن تغطية أولا سقوط أرض كتابة.
```ts type-equiv
/**
 * One path-addressed edit to a namespace's user section. Path mutation exists
 * for a caller holding an INCOMPLETE view of the section — a configuration UI
 * reads the redacted descriptor, which by construction never received the
 * `role('secret')` fields. Such a caller can name the field it means without
 * restating the section: a wholesale `replace` rebuilt from a redacted
 * document silently deletes every secret the wire never returned.
 */
type SettingsPathOp =
  | { op: 'set'; path: readonly string[]; value: unknown }
  | { op: 'unset'; path: readonly string[] }
```

```ts type-equiv
/** Options for {@link SettingsProvider.describe}. */
interface SettingsDescribeOptions {
  /**
   * Strip `role('secret')` fields from `value`/`base`/`user` and enumerate
   * them in each descriptor's `secrets`. Every wire surface MUST pass this;
   * the verbatim default exists for same-process configuration UIs only.
   */
  redactSecrets?: boolean
}
```

## تغيير إيداع

كل مرة إيداع تغيير——عملية داخل كتابة أو مزود مراقبة إلى خارجي تحرير——في جديد قيمة يصبح مرجعي قيمة بعد إرسال خروج `settings/updated (ns, next, prev, source)`، تحليل قيمة عميق متبادل انتظار وقت أبدا إرسال خروج.source علامة منطقة قسم اثنان بند مدخل مسار.

```ts type-equiv
/** Origin of one committed settings change. */
type SettingsUpdateSource = 'update' | 'provider'
```

## أصلي وثيقة عملية

`SettingsDocumentOpenValue` تأكيد `settings/openSettingsDocument` قد دقيق تجهيز جيد provider يحتفظ وثيقة، و سوف ذلك تسليم إعطاء أصلي نص تحرير جهاز.`AgentPresetDirectoryOpenValue` تقرير إبلاغ قد إتمام أصلي تسليم وصل، أو في طاولة وجه فتح غير ممكن استخدام وقت إرجاع تحليل بعد مستخدم preset دليل. اثنان بند عملية كل لا قبول من متصفح اختيار Host مسار.

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxsettings--settingsprovider-abstract-seam"></a>

### `ctx.settings` — `SettingsProvider` (abstract seam)

Abstract settings service. Providers implement raw-document storage (`load`/`persist`) and push external changes through Settings.publish; the base class owns namespace registration, resolution, validation, change detection, and the `settings/updated` commit event.

```ts cordis-catalog
/**
 * Prepare the provider's user-editable document for a native editor. File
 * providers may materialize an absent document before returning its path;
 * non-file providers return undefined.
 * @returns the absolute local document path, or undefined for non-file storage.
 */
prepareDocument(): Promise<string | undefined>

/**
 * Register a namespace schema and receive its owner scope. The registration
 * is an effect on the calling plugin's fiber: disposing that fiber removes
 * the namespace and its observers. An invalid stored section fails the
 * registration itself — the earliest point where the schema can judge it.
 * @param ns - unique namespace; duplicate registration fails loud.
 * @param schema - schemastery schema resolving this namespace's value.
 * @param options - composition `base` layer and effect timing.
 * @returns the owner scope for reads, observation, and updates.
 * @throws {TypeError} when `ns` is not a lowercase hyphenated identifier.
 */
register<const Namespace extends string, T>( ns: Namespace & SettingsNamespaceInput<Namespace>, schema: z<T>, options?: SettingsRegisterOptions<T>, ): SettingsScope<T>

/**
 * Attach one optional-settings consumer to this provider. The consumer
 * registers its composition entry as the base layer while this provider is
 * present, then falls back to that entry if the provider detaches.
 * @param owner - consumer context whose unload suppresses fallback work.
 * @param ns - consumer-owned settings namespace.
 * @param schema - schema resolving the namespace.
 * @param entry - composition entry used as the base and fallback value.
 * @param hooks - source sink, change notification, and optional validation.
 * @throws {TypeError} when `ns` is not a lowercase hyphenated identifier.
 */
installSection<const Namespace extends string, T>( owner: Context, ns: Namespace & SettingsNamespaceInput<Namespace>, schema: z<T>, entry: T, hooks: SettingsSectionHooks<T>, ): void

/**
 * Describe every registered namespace for configuration surfaces, including
 * the composition `base` and raw user layers so a form can mark which fields
 * the user overrode (presence in `user`) and what a reset returns to.
 * @param options - redaction switch; wire surfaces must redact.
 * @returns one descriptor per registered namespace, in registration order.
 */
describe(options?: SettingsDescribeOptions): SettingsDescriptor[]

/**
 * Read one registered namespace's resolved value.
 * @param ns - the namespace to read.
 * @returns the resolved value, or `undefined` while unregistered.
 * @throws {TypeError} when `ns` is not a lowercase hyphenated identifier.
 */
get<const Namespace extends string>(ns: Namespace & SettingsNamespaceInput<Namespace>): unknown

/**
 * Merge a patch into one registered namespace's user layer, validate the
 * resolved candidate, persist through the provider, then commit and emit.
 * A validation failure rejects before anything is persisted. Writes to one
 * namespace are serialized: concurrent updates apply in call order, each
 * merging over the previous write's committed section.
 * @param ns - the registered namespace to update.
 * @param patch - plain-object patch over the user section.
 * @param expectedRevision - the descriptor `revision` the caller read; a
 *   namespace that moved past it rejects with {@link SettingsConflictError}.
 * @throws {TypeError} when `ns` is not a lowercase hyphenated identifier.
 */
async update<const Namespace extends string>( ns: Namespace & SettingsNamespaceInput<Namespace>, patch: object, expectedRevision?: number, ): Promise<void>

/**
 * Replace one registered namespace's user section wholesale, validate,
 * persist, then commit and emit. Keys absent from `section` fall back to the
 * composition `base` and schema defaults — this is the removal/reset path a
 * merge-only patch cannot express (`replace({})` re-inherits everything).
 * @param ns - the registered namespace to replace.
 * @param section - the complete next user section.
 * @param expectedRevision - the descriptor `revision` the caller read; a
 *   namespace that moved past it rejects with {@link SettingsConflictError}.
 * @throws {TypeError} when `ns` is not a lowercase hyphenated identifier.
 */
async replace<const Namespace extends string>( ns: Namespace & SettingsNamespaceInput<Namespace>, section: object, expectedRevision?: number, ): Promise<void>

/**
 * Apply path-addressed edits to one registered namespace's user section,
 * validate, persist, then commit and emit. The ops are applied to the
 * section as it stands when the write reaches the front of the queue, so a
 * caller never has to restate fields it did not touch — and, crucially,
 * cannot delete fields it never saw. This is the write path for any caller
 * holding a redacted view; `replace` remains the wholesale reset.
 * @param ns - the registered namespace to edit.
 * @param ops - ordered path edits; later ops observe earlier ones.
 * @param expectedRevision - the descriptor `revision` the caller read; a
 *   namespace that moved past it rejects with {@link SettingsConflictError}.
 * @throws {TypeError} when `ns` is not a lowercase hyphenated identifier.
 */
async mutate<const Namespace extends string>( ns: Namespace & SettingsNamespaceInput<Namespace>, ops: readonly SettingsPathOp[], expectedRevision?: number, ): Promise<void>
```

Source: [`packages/settings/settings/src/index.ts`](../../packages/settings/settings/src/index.ts)

<a id="ctxsettingscontroller--settingscontroller"></a>

### `ctx.settingsController` — `SettingsController`

Host service backing the generated `ctx.remote.settings` namespace. Every remote read uses `redactSecrets: true`, so a `role('secret')` field cannot ride a response. Writes expose the settings service's merge, replacement, and path-addressed operations, and classify every provider refusal as `settings/conflict` or `settings/rejected` with the service's message.

```ts cordis-catalog
/**
 * Describe every registered namespace for a configuration page: redacted
 * layered values plus the serialized schema the page renders its form from.
 * @returns provider writability, local-document presence, and one view per namespace.
 * @throws RemoteError when no settings provider is mounted.
 */
@Remote describe(): SettingsDescribeValue

/**
 * Report whether this deployment can open an authored Agent preset directory natively.
 * @returns true when the matching open operation is available.
 */
@Remote canOpenAgentPresetDirectory(): boolean

/**
 * Merge a patch into one namespace's stored user section.
 * @param ns - namespace key to write.
 * @param patch - fields to merge into the user section.
 * @param expectedRevision - revision the caller read; `undefined` writes unconditionally.
 * @returns the namespace's redacted view after the write.
 * @throws RemoteError when the request is invalid, no provider is mounted, or the provider refuses the write.
 */
@Remote update( ns: string, patch: Record<string, JsonValue>, expectedRevision: number | undefined, ): Promise<SettingsNamespaceView>

/**
 * Replace one namespace's stored user section wholesale.
 * @param ns - namespace key to write.
 * @param section - complete replacement user section.
 * @param expectedRevision - revision the caller read; `undefined` writes unconditionally.
 * @returns the namespace's redacted view after the write.
 * @throws RemoteError when the request is invalid, no provider is mounted, or the provider refuses the write.
 */
@Remote replace( ns: string, section: Record<string, JsonValue>, expectedRevision: number | undefined, ): Promise<SettingsNamespaceView>

/**
 * Apply path-addressed edits to one namespace's user section, resolved against
 * the section as stored rather than against whatever the caller last read,
 * then answer with that namespace's new redacted view.
 * @param ns - namespace key to write.
 * @param ops - the edits to apply, in order.
 * @param expectedRevision - revision the caller read; `undefined` writes unconditionally.
 * @returns the namespace's redacted view after the write.
 * @throws RemoteError when the request is invalid, no provider is mounted, or the provider refuses the write.
 */
@Remote async mutate( ns: string, ops: SettingsPathOpView[], expectedRevision: number | undefined, ): Promise<SettingsNamespaceView>

/**
 * Materialize the provider-owned settings document and open it in a native text editor.
 * @param signal - caller lifetime; abort terminates preparation or the native command.
 * @returns confirmation after the native opener accepts the document.
 * @throws RemoteError when no document exists, preparation fails, or opening fails.
 */
@Remote async openSettingsDocument(signal: AbortSignal): Promise<SettingsDocumentOpenValue>

/**
 * Open one user-authored Agent preset directory or return its path when no native opener exists.
 * @param agentPreset - preset id resolved against Host-owned roots.
 * @param signal - caller lifetime; abort terminates the native command.
 * @returns an opened confirmation or the resolved directory for text display.
 * @throws RemoteError when the preset is missing, read-only, invalid, or cannot be opened.
 */
@Remote async openAgentPresetDirectory( agentPreset: string, signal: AbortSignal, ): Promise<AgentPresetDirectoryOpenValue>
```

Source: [`packages/api/settings-controller/src/index.ts`](../../packages/api/settings-controller/src/index.ts)

<a id="settings-events"></a>

### `settings/*` events

<a id="settingsdocument-updated--emit"></a>

#### `settings/document-updated` — emit

One registered namespace's RAW user section changed, whether or not the resolved value did. `settings/updated` is the consumer-facing event and stays deep-equal-gated; this one exists for configuration surfaces, which must learn that a field went from inherited to overridden (same resolved value, different meaning) and that their held revision is stale. Listener containment matches `settings/updated`.

```ts cordis-catalog
/**
 * One registered namespace's RAW user section changed, whether or not the
 * resolved value did. `settings/updated` is the consumer-facing event and
 * stays deep-equal-gated; this one exists for configuration surfaces,
 * which must learn that a field went from inherited to overridden (same
 * resolved value, different meaning) and that their held revision is
 * stale. Listener containment matches `settings/updated`.
 * @param ns - the namespace whose stored section changed.
 * @param revision - the namespace's new revision.
 * @mode emit
 */
'settings/document-updated'(ns: SettingsNamespace, revision: number): void
```

Source: [`packages/settings/settings/src/types.ts`](../../packages/settings/settings/src/types.ts)

<a id="settingsupdated--emit"></a>

#### `settings/updated` — emit

Committed change to one registered namespace's resolved value. Emitted after the provider persisted (for `update`) or published (`provider`) the change; never emitted when the resolved value is deep-equal. Listener failures are contained and logged — a sync throw and an async rejection alike — except `INVARIANT`-coded failures, which rethrow after every listener ran; that rethrow reaches the emitter only from synchronous listeners, so invariant checks on this event must not be async functions.

```ts cordis-catalog
/**
 * Committed change to one registered namespace's resolved value. Emitted
 * after the provider persisted (for `update`) or published (`provider`)
 * the change; never emitted when the resolved value is deep-equal.
 * Listener failures are contained and logged — a sync throw and an async
 * rejection alike — except `INVARIANT`-coded failures, which rethrow
 * after every listener ran; that rethrow reaches the emitter only from
 * synchronous listeners, so invariant checks on this event must not be
 * async functions.
 * @param ns - the namespace whose resolved value changed.
 * @param next - the new resolved value.
 * @param prev - the previous resolved value.
 * @param source - whether the change entered through `update()` or the provider.
 * @mode emit
 */
'settings/updated'(ns: SettingsNamespace, next: unknown, prev: unknown, source: SettingsUpdateSource): void
```

Source: [`packages/settings/settings/src/types.ts`](../../packages/settings/settings/src/types.ts)
<!-- END GENERATED cordis-surface -->
