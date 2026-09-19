# تخزين

[English](storage.md) | العربية

تخزين فرعي نظام حمل دائم حفظ واحد قطع لا يخص جلسة حدث سجل بيانات (جلسة سجل لديه ذاتي ذات seam——رؤية [persistence.md](persistence.zh.md)). هو هو واحد بند اختياري قدرة، لا يخص agent loop(ذكي جسم حلقة) رئيسي جاف، و حسب[قدرة seam](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.zh.md) تفكيك قسم: محور عقدة (hub) و Service Definition([dsh-storage](../../packages/storage/storage) ،`ctx.storage`) ،Service Provider(تسجيل لـ `json` [dsh-storage-json](../../packages/storage/storage-json) و تسجيل لـ `sqlite` [dsh-storage-sqlite](../../packages/storage/storage-sqlite)) ، و Consumer بيانات شكل صيغة ([dsh-storage-domain](../../packages/storage/storage-domain) ،`ctx.storageDomain`، أيضا يمكن مرور `ctx.storage.domain` وصول)——هو هو خلفية اتفاق وحيد Consumer، أيضا هو أخرى واحد قطع الذي استخدام نوع تحويل API. محور عقدة ذاته لا فعل أي IO: خلفية يملك وسيط جودة، بيانات شكل صيغة يملك دلالة، منتج حزمة أبدا مباشر لمس اصطدام خلفية. تصميم سجل:[مجال KV تخزين Agent Note](../../.agents/notes/proposed/architecture/2026-07-24-domain-kv-storage-and-workspace.zh.md).

شفرة المصدر:[`packages/storage/storage/src/backend.ts`](../../packages/storage/storage/src/backend.ts) · [`packages/storage/storage-domain/src/spec.ts`](../../packages/storage/storage-domain/src/spec.ts) · [`packages/storage/storage-domain/src/events.ts`](../../packages/storage/storage-domain/src/events.ts)

## محور عقدة:`ctx.storage`

`Storage`([توقيع](#ctxstorage--storage)) هو تجميع دمج نقطة، لا هو تخزين هذا جسم.`ctx.storage.backend` هو واحد ورقة اسم → خلفية جدول: كثير عدد خلفية و ترتيب إبقاء تركيب، أي عدد خلفية خدمة أي عدد مستهلك من هذا مستهلك ذاتي ذات إعداد قرار (أي مجال طبقة توجيه جدول) ، أبدا هو محور عقدة عام اختيار.`register(name, backend)` إرجاع disposer؛ تكرار اسم و فحص بحث لم معرفة اسم كل رمي خروج `StorageError`.dispose(مورد تحرير) فقط ملاحظة إلغاء اسم——من يملك هو إضافة في ملاحظة إلغاء بعد ذاتي سطر إغلاق خلفية. كل خلفية إضافة أيضا سوف إصدار واحد فقط لأجل دورة الحياة خدمة مفتاح (`storageBackendServiceKey(name)`) ، بيانات شكل صيغة مزود حقن هو، جعل ذاته تنشيط لن و خلفية تسجيل حدوث تنافس حالة.

بيانات شكل صيغة بـ واحد ورقة يمكن دمج توسيع مفتاح map تركيب إلى محور عقدة فوق:

```ts type-equiv
/**
 * Data forms mountable on the hub, keyed by form name. Form owners extend
 * this map via declaration merging (the domain layer merges
 * `domain: DomainFacility`) and mount the facility in their `apply`.
 */
interface StorageForms {}
```

`mount(form, facility)` هو واحد effect، ذلك disposer مسؤول إزالة؛ مقابل نفس مفتاح ثاني مرة تركيب رمي خروج `duplicate-mount`.`form(form)` تحليل قد تركيب facility، في يملك إضافة تحميل قبل رمي خروج `form-not-mounted`——تركيب جهة ينبغي حسب هذا أمان ترتيب إضافة ترتيب، بينما لا هو ساكن صامت دفع متأخر. مجال طبقة دمج `domain: DomainFacility`، لذلك `ctx.storage.domain` و `ctx.storageDomain` هو نفس عدد كائن.

## خلفية اتفاق

```ts type-equiv
/**
 * One registered backend. A backend owns exactly one medium and shares its
 * lifecycle across all facets; facets are optional members — a backend that
 * cannot serve a data kind simply omits it, and resolution fails loud instead.
 */
interface StorageBackend {
  /** Key-value operations; absent when this backend cannot serve them. */
  readonly kv?: KvFacet

  /**
   * Drain in-flight writes across all open units and release the medium.
   * Idempotent; concurrent and repeated calls resolve once teardown finishes.
   * @returns resolution after the medium is released.
   */
  close(): Promise<void>
}
```

واحد خلفية يملك واحد وسيط جودة (واحد شجرة ملف شجرة أصل دليل، واحد قاعدة بيانات ملف) ، و توفير اختياري عملية مجموعة؛`kv` هو وحيد قد تسليم عملية مجموعة.`KvFacet.open(descriptor)` فتح واحد أداة اسم unit——`KvUnitDescriptor` يحمل اسم، حالي صيغة إصدار، اختياري توافق سجل إصدار، جدول اسم بيان، و هل وجود عام مفرد مثال slot——و إرجاع توفير `loadAll`،`putRecord`،`deleteRecord`،`setGlobal` و `close` `KvUnit`.unit اسم و جدول اسم يجب مطابقة `UNIT_NAME_RE`(حيث يمكن أمان استخدام عمل ملف اسم، أيضا يمكن أمان استخدام عمل SQL معرف رمز قطعة مقطع) ؛ سجل مفتاح هو مهمة معنى نص، أبدا دخول ملف مسار.unit لا مقابل تزامن كتابة فعل سلسلة سطر تحويل——ترتيب من استدعاء جهة مسؤول——لكن كل مرة مفرد وحيد استدعاء في وسيط جودة فوق كل هو أصل فرعي، كما resolve بعد أي قد حمل دائم.`single` وسيط جودة فوق سجل إصدار مختلف وقت رفض `version-mismatch`؛`per-record` وثيقة إصدار في قبول تجميع دمج خارج وقت قراءة عمل لا وجود. لا يمكن حسب هذا unit تحليل وسيط جودة رفض `malformed-medium`.[`backend.ts`](../../packages/storage/storage/src/backend.ts) هو تدريجي بند بند مواصفة صفة اتفاق،[`tests/contract.ts`](../../packages/storage/storage/tests/contract.ts) في مشترك متسق صفة طقم عنصر سوف إبرة مقابل كل خلفية فحص كل بند بند بند.[json خلفية](../../packages/storage/storage-json/README.zh.md) بـ أصل فرعي طريقة لـ كل unit كامل ملف إعادة إصدار واحد نسخة شخص صنف يمكن قراءة ملف؛[sqlite خلفية](../../packages/storage/storage-sqlite/README.zh.md) في مفرد عدد قاعدة بيانات في كل سطر تخزين واحد نسخة وثيقة، لأجل تردد كثيف تحديث بيانات.

## إعلان مجال

مجال من ذلك يملك حزمة إعلان مرة، شكل صيغة هو واحد spec كائن——هو هو هذا مجال هوية، تخطيط و سجل schema مفرد واحد مصدر (schema استخدام zod تحرير كتابة، لذلك `z.infer` يجعل مستهلك نوع بلا حاجة تكرار إعلان):

```ts type-equiv
/** Static declaration of one domain: identity, version, and record layout. */
interface DomainSpec {
  /** Domain name; must match `UNIT_NAME_RE` (doubles as the backend unit name). */
  readonly name: string
  /** Current domain format version; reads enforce it according to the selected layout. */
  readonly version: number
  /**
   * Medium layout for the backend unit: `single` (the default) stores the
   * whole unit as one document; `per-record` stores each record as its own
   * document, for units whose records are large, sparse, or individually
   * disposable — the projection cache — and scopes version checks per record
   * (an unaccepted record document is discarded, never migrated).
   */
  readonly layout?: 'single' | 'per-record'
  /**
   * Older domain versions whose stored records the current record schemas
   * also accept (the declaring owner vouches for that, typically by
   * declaring the fields older records lack as optional). `per-record` backends
   * read documents stamped with a listed version instead of discarding them,
   * and accept a legacy whole-unit file so stamped for the one-time
   * bootstrap; writes always stamp {@link version}.
   */
  readonly compatibleVersions?: readonly number[]
  /**
   * What `open` does with a stored table record that fails its zod schema.
   * Absent (the default), the whole open rejects with `invalid-record` —
   * right for authoritative data. `'backup-and-skip'` is for domains whose
   * records are disposable derived data: the backend moves the record's
   * document aside (`KvUnit.backupRecord`), the failure is logged with
   * its cause, and the open continues with the record absent. A backend
   * without `backupRecord` (no per-record document to move) falls back
   * to the rejecting default. The global slot always rejects.
   */
  readonly invalidRecords?: 'backup-and-skip'
  /** Optional global singleton slot. */
  readonly global?: DomainGlobalSpec<unknown>
  /** Table declarations keyed by table name; each name must match `UNIT_NAME_RE`. */
  readonly tables: Record<string, DomainTableSpec>
}
```

`defineDomain(spec)` ثابت spec حرف وجه كمية نوع، و في يملك جهة وحدة تحميل وقت، أي وسيط جودة يتم لمس اصطدام قبل حينئذ واضح تقرير خطأ: مجال اسم أو جدول اسم لا مطابقة `UNIT_NAME_RE`، إصدار لا هو غير سالب كامل عدد،global schema قبول `null`، هذه كل سوف رمي خروج (`null` هو وسيط جودة «من لم كتابة» مراقبة جندي قيمة، يمكن فارغ global واحد حالما تخزين حينئذ لا يمكن نحو إرجاع أيضا أصل).`domainTable<K, V>(schema)` إعلان واحد ورقة جدول، ذلك مفتاح نوع هو فقط وجود في تحرير ترجمة مدة phantom نوع (عبر معتاد هو[صنف لوحة تحويل id](core.zh.md#branded-ids)) ؛`descriptorOf(spec)` إسقاط خروج موجه إلى خلفية unit وصف رمز.

## فتح مجال

```ts type-equiv
/** One open domain, typed by its spec. */
interface Domain<S extends DomainSpec> {
  /** Domain name from the spec. */
  readonly name: string
  /** Global singleton handle; a spec without `global` has no usable handle (`never`). */
  readonly global: DomainGlobalHandleOf<S>
  /**
   * Resolve one declared table handle. Handles are stable — repeated calls
   * return the same instance.
   * @param name - Declared table name.
   * @returns the typed table handle.
   */
  table<N extends keyof S['tables'] & string>(name: N): KvTable<TableKeyOf<S, N>, TableValueOf<S, N>>

  /**
   * Close this domain: reject new writes immediately, drain already-queued
   * writes (their events still emit), release the backend unit, then free
   * the domain name for a later open. Idempotent — repeated calls share one
   * teardown. The consumer owns this call (typically as its own `ctx.effect`
   * disposer); the facility closes any domain left open when it unmounts.
   * @returns resolution after the unit is released.
   */
  close(): Promise<void>
}
```

قراءة هو تزامن، قدوم ذاتي مرجعي داخل تخزين حالة:`KvTable` كشف `get`/`entries`/`keys`/`size`(لقطة مكرر، في ترتيب طابور كتابة سقوط أرض خلال إبقاء مستقر) ،global جملة مقبض `get()` في رقم مرة `set` سوف slot شيء تحويل إلى وسيط جودة قبل واحد مباشر إرجاع spec `initial`. كل مرة كتابة——`put`،`delete`،`update`،`global.set`——كل في نفس بند تدريجي مجال كتابة سلسلة فوق ترتيب طابور، أولا في خلفية إتمام حفظ دائم، مجددا تحديث داخل تخزين، الأكثر بعد إرسال خروج `domain/changed`؛ خلفية كتابة يتم رفض وقت داخل تخزين أصل مثال لا حركة، لذلك قراءة أبدا سوف انحراف مغادرة وسيط جودة.`update(key, fn)` في ذلك كتابة سلسلة slot فوق هو مرة أصل فرعي قراءة-تعديل-كتابة (مفتاح ناقص وقت رفض `missing-key`) ؛`delete` واحد لا وجود مفتاح resolve لـ `false`، لا إنتاج كتابة أيضا لا إنتاج حدث. إرجاع سجل حينئذ هو تخزين كائن ذاته، لا هو فرعي هذا——طلب مرور `put`/`update` كامل جسم استبدال، أبدا يلزم حينئذ أرض تعديل.

## مجال facility:`ctx.storageDomain`

`DomainFacility`([توقيع](#ctxstoragedomain--domainfacility)) في مرور مرور توجيه خلفية لـ فوق فتح قد إعلان مجال. توجيه هو مجال إضافة إعداد، أبدا يخص محور عقدة:`backend` إشارة تحديد لا بد ملء افتراضي توجيه،`routes` حسب مجال اسم تدريجي عدد تغطية.`open(spec)` حسب صارم إطار ترتيب تنفيذ، كل واحد خطوة فشل كل جعل كامل استدعاء فشل: رفض قد فتح أو ما زال في إغلاق في اسم (`already-open`) ، تحليل توجيه (`backend-not-found`) ، اشتراط خلفية أداة تجهيز `kv` facet(`facet-unsupported`) ، فتح unit(خلفية `version-mismatch`/`malformed-medium` أصل مثال نفاذ نقل) ، و حسب spec zod schema تحقق كل بند قد تخزين سجل و global(`invalid-record`، مرفق حمل خروج خطأ جدول و مفتاح). استدعاء جهة يملك إرجاع جملة مقبض، و استخدام `Domain.close()` تحرير هو؛ إضافة إزالة وقت ما زال موضع في فتح حالة مجال من facility مسؤول إغلاق، قد إغلاق مجال اسم فقط لديه في تفكيك حذف تماما انتهاء بعد عندئذ تحرير خروج قدوم توفير إعادة فتح.`get(name)` هو بلا نوع تشخيص فحص بحث، أمر في هو كل نوع تحويل جملة مقبض خلف بعد حزمة داخل خاص `DomainImpl` وقت التشغيل؛`closeAll()` هو إزالة مسار.

## تغيير حدث:`domain/changed`

كل مرة حمل دائم كتابة كل إرسال خروج واحد حدث، صارم إطار حدوث في خلفية تأكيد حمل دائم صفة بعد، ترتيب التزام دوران هذا مجال كتابة سلسلة ([حدث بند](#domainchanged--emit)):

```ts type-equiv
/** Shared location fields of one durable domain change. */
interface DomainChangedBase {
  /** Owning domain name. */
  readonly domain: string
  /** Table name; `''` for a global-singleton write. */
  readonly table: string
  /** Record key; `''` for a global-singleton write. */
  readonly key: string
}
```

```ts type-equiv
/** One durable domain change; a closed union — switch on `operation`. */
type DomainChanged = DomainChangedPut | DomainChangedDeleted
```

`put`(إدراج دخول، تغطية كتابة و global كتابة) في `value` في يحمل جديد لقطة——أبدا يحمل قديم قيمة؛ حاجة فعل فرق مختلف مقارنة مقارنة مستهلك ذاتي سطر إبقاء فوق واحد نسخة لقطة.`deleted` هو لا يحمل قيمة قبر نصب. هذا حدث هو إشعار، لا هو أمر خدمة مشاركة و من: إرسال خروج وقت إيداع نقطة قد مرور ذهاب، لذلك تزامن رمي خروج مستمع سوف يتم التقاط إقامة و سجل واحد بند تحذير إبلاغ، بينما لن يجعل قد حمل دائم كتابة يتم رفض؛ إرسال خروج قيمة انتظار في إرسال خروج وقت لحظة داخل تخزين حالة. هذا حدث فقط حد عملية داخل؛ عبر عملية تغيير دفع إرسال هو واحد بند قد سجل حد ([حزمة README](../../packages/storage/storage-domain/README.zh.md)).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.zh.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

<a id="ctxstorage--storage"></a>

### `ctx.storage` — `Storage`

The storage hub service. Backends register under `backend`; data forms mount under their `StorageForms` key and are reached as `ctx.storage.<form>`.

```ts cordis-catalog
/**
 * Mount a data-form facility on the hub. Mounting is an effect: the
 * returned disposer unmounts the form.
 * @param form - Form key declared in {@link StorageForms}.
 * @param facility - The facility instance to expose.
 * @returns the disposer that unmounts the form.
 */
mount<K extends keyof StorageForms>(form: K, facility: StorageForms[K]): () => void

/**
 * Resolve a mounted data form.
 * @param form - Form key declared in {@link StorageForms}.
 * @returns the mounted facility.
 */
form<K extends keyof StorageForms>(form: K): StorageForms[K]
```

Source: [`packages/storage/storage/src/index.ts`](../../packages/storage/storage/src/index.ts)

<a id="ctxstoragedomain--domainfacility"></a>

### `ctx.storageDomain` — `DomainFacility`

The mounted domain facility. Opens declared domains over routed backends; one facility instance owns the open-domain table and enforces single-open per domain name.

```ts cordis-catalog
/**
 * Open one declared domain. Steps, each failing the whole call: reject a
 * name that is already open (`already-open`); resolve the backend route
 * (`backend-not-found` passes through from the hub); require its `kv` facet
 * (`facet-unsupported`); open the unit projected from the spec (backend
 * `version-mismatch`/`malformed-medium` pass through); load and validate
 * every stored record against the spec's zod schemas (`invalid-record`
 * with the offending table and key — unless the spec declares
 * `invalidRecords: 'backup-and-skip'` and the unit can move documents aside, in
 * which case the failing record is backed up, logged, and skipped);
 * construct the domain.
 *
 * Lifecycle: the CALLER owns the returned handle and closes it via
 * `Domain.close()` (typically as its own `ctx.effect` disposer) — the
 * facility does not tie the domain to any consumer fiber. Domains still
 * open when the facility unmounts are closed by the plugin disposer.
 * @param spec - The domain declaration, typically from `defineDomain`.
 * @returns the opened domain handle, typed by the spec.
 */
async open<S extends DomainSpec>(spec: S): Promise<Domain<S>>

/**
 * Look up an open domain by name, untyped. Diagnostic surface (the package
 * invariant cross-checks change events against live domain state); typed
 * consumers hold the handle returned by {@link open}.
 * @param name - Domain name.
 * @returns the open domain runtime, or `undefined` when not open.
 */
get(name: string): DomainImpl | undefined

/**
 * Close every domain still open on this facility. The unmount path for
 * consumers that never called `Domain.close()` themselves; closing is
 * idempotent, so double-closing an already-closed domain is harmless.
 * @returns resolution after every unit is released.
 */
async closeAll(): Promise<void>
```

Source: [`packages/storage/storage-domain/src/index.ts`](../../packages/storage/storage-domain/src/index.ts)

<a id="domain-events"></a>

### `domain/*` events

<a id="domainchanged--emit"></a>

#### `domain/changed` — emit

A domain record or the global singleton changed, emitted once per write strictly after the backend acknowledged durability. Events of one domain arrive in its write-chain order.

```ts cordis-catalog
/**
 * A domain record or the global singleton changed, emitted once per write
 * strictly after the backend acknowledged durability. Events of one
 * domain arrive in its write-chain order.
 * @param change - domain, table (`''` for global), key (`''` for global),
 * operation discriminant, and on `put` the new snapshot.
 * @mode emit
 */
'domain/changed'(change: DomainChanged): void
```

Source: [`packages/storage/storage-domain/src/events.ts`](../../packages/storage/storage-domain/src/events.ts)
<!-- END GENERATED cordis-surface -->
