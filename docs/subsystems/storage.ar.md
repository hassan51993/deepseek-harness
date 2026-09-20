# التخزين

[English](storage.md) | العربية

يحفظ نظامُ التخزين كلَّ ما ليس سجلَّ أحداث جلسة (فلسجلات الجلسات seam خاص — [persistence.md](persistence.ar.md)). وهو قدرةٌ اختيارية واحدة، لا جزءٌ من عمود agent loop، مقسومٌ [seam قدرة](../../.agents/notes/implemented/architecture/2026-06-13-capability-seams.ar.md): المحورُ وتعريفُ الخدمة ([dsh-storage](../../packages/storage/storage)، `ctx.storage`)، ومزوّدا الخدمة ([dsh-storage-json](../../packages/storage/storage-json) المسجَّل باسم `json`، و[dsh-storage-sqlite](../../packages/storage/storage-sqlite) المسجَّل باسم `sqlite`)، وصيغةُ بيانات المستهلك ([dsh-storage-domain](../../packages/storage/storage-domain)، `ctx.storageDomain`، ويمكن بلوغُها أيضًا بـ`ctx.storage.domain`) — وهي المستهلكُ الوحيد لعقد الخلفيات والواجهةُ المنوَّعة التي يستعملها كلُّ ما عداها. ولا يجري المحورُ عملياتِ إدخال وإخراج بنفسه: فالخلفياتُ تملك الوسائط، وصيغُ البيانات تملك الدلالات، وحزمُ المنتَج لا تمسّ الخلفياتِ مباشرةً قط. وسجلُّ التصميم: [ملاحظة الوكيل عن تخزين KV المجالي](../../.agents/notes/proposed/architecture/2026-07-24-domain-kv-storage-and-workspace.ar.md).

المصادر: [`packages/storage/storage/src/backend.ts`](../../packages/storage/storage/src/backend.ts) · [`packages/storage/storage-domain/src/spec.ts`](../../packages/storage/storage-domain/src/spec.ts) · [`packages/storage/storage-domain/src/events.ts`](../../packages/storage/storage-domain/src/events.ts)

## المحور: `ctx.storage`

`Storage` ([التوقيعات](#ctxstorage--storage)) ملتقًى لا مخزن. و`ctx.storage.backend` جدولُ اسم إلى خلفية: فتبقى خلفياتٌ عدة مركَّبةً جنبًا إلى جنب، وأيُّ خلفية تخدم أيَّ مستهلك أمرٌ يخص ضبطَ ذلك المستهلك (جدولُ توجيه طبقة المجالات)، لا خيارًا عامًّا في المحور. ويعيد `register(name, backend)` المُفكِّكَ؛ وترمي الأسماءُ المكررة والبحوثُ المجهولة `StorageError`. ولا يفعل التخلصُ إلا إلغاءَ تسجيل الاسم — فالإضافةُ المالكة تغلق الخلفيةَ بعد إلغاء التسجيل. وتنشر كلُّ إضافة خلفية أيضًا مفتاحَ خدمة لدورة الحياة وحدها (`storageBackendServiceKey(name)`) تحقنه مزوّداتُ الصيغ فلا يتسابق تفعيلُها مع تسجيل الخلفية.

وتُركَّب صيغُ البيانات على المحور تحت خريطة مفاتيح قابلة للتوسعة بالدمج:

```ts type-equiv
/**
 * Data forms mountable on the hub, keyed by form name. Form owners extend
 * this map via declaration merging (the domain layer merges
 * `domain: DomainFacility`) and mount the facility in their `apply`.
 */
interface StorageForms {}
```

و`mount(form, facility)` أثرٌ يُفكِّكه مُفكِّكُه؛ وتركيبٌ ثانٍ للمفتاح نفسِه يرمي `duplicate-mount`. ويحلّ `form(form)` مرفقًا مركَّبًا ويرمي `form-not-mounted` حتى تُحمَّل الإضافةُ المالكة — فترتّب التجميعاتُ الإضافاتِ تبعًا لذلك بدل التأجيل الصامت. وتدمج طبقةُ المجالات `domain: DomainFacility`، فـ`ctx.storage.domain` و`ctx.storageDomain` كائنٌ واحد.

## عقد الخلفيات

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

وتملك الخلفيةُ وسيطًا واحدًا (جذرَ شجرة ملفات، أو ملفَّ قاعدة بيانات) وتكشف مجموعاتِ عمليات اختيارية؛ و`kv` هي المجموعةُ المشحونة الوحيدة. ويفتح `KvFacet.open(descriptor)` وحدةً مسمّاة واحدة — ويحمل `KvUnitDescriptor` الاسمَ وإصدارَ الصيغة الحالي وإصداراتِ السجلات المتوافقة اختياريًا وأسماءَ الجداول وما إذا كانت هناك خانةٌ مفردة عامة — ويعيد `KvUnit` فيه `loadAll` و`putRecord` و`deleteRecord` و`setGlobal` و`close`. ويجب أن تطابق أسماءُ الوحدات والجداول `UNIT_NAME_RE` (فتكون آمنةً اسمَ ملف ومقطعَ معرّف SQL)؛ أما مفاتيحُ السجلات فسلاسلُ كيفما كانت ولا تبلغ مساراتِ الملفات قط. ولا تسلسل الوحدةُ الكتاباتِ المتزامنة — فالترتيبُ يخص المستدعي — لكن كلَّ نداء مفرد ذرّيٌّ على الوسيط ودائمٌ حالما يُحلّ. والوسيطُ `single` المختوم بإصدار مختلف يرفض بـ`version-mismatch`؛ والوثيقةُ `per-record` المختومة خارج المجموعة المقبولة تُقرأ غائبةً. والوسيطُ الذي يتعذّر تحليلُه بوصفه الوحدةَ يرفض بـ`malformed-medium`. و[`backend.ts`](../../packages/storage/storage/src/backend.ts) هو العقدُ المعياري بندًا بندًا، وتفحص مجموعةُ المطابقة المشتركة في [`tests/contract.ts`](../../packages/storage/storage/tests/contract.ts) كلَّ بند في مقابل كل خلفية. وتعيد [خلفيةُ json](../../packages/storage/storage-json/README.ar.md) نشرَ ملف واحد كامل مقروء للبشر لكل وحدة ذرّيًّا؛ وتخزّن [خلفيةُ sqlite](../../packages/storage/storage-sqlite/README.ar.md) وثيقةً واحدة لكل صف في قاعدة بيانات واحدة للبيانات كثيرة التحديث.

## إعلان مجال

تعلن الحزمةُ المالكة المجالَ مرةً واحدة كائنَ مواصفة — وهو المصدرُ الوحيد لهوية المجال وتخطيطه وschemas سجلاته (بـzod، فيُبقي `z.infer` أنواعَ المستهلك بلا تكرار):

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

ويثبّت `defineDomain(spec)` الأنواعَ الحرفية للمواصفة ويفشل بصوت عالٍ عند تحميل وحدة المالك، قبل أن يُمَسّ أيُّ وسيط: فاسمُ مجال أو جدول خارج `UNIT_NAME_RE`، أو إصدارٌ ليس عددًا صحيحًا غيرَ سالب، أو schema عام يقبل `null` — كلُّها ترمي (فـ`null` هي علامةُ الوسيط على «لم يُكتب قط»، فالقيمةُ العامة المخزَّنة القابلة للعدم لا تستطيع العودةَ سليمة). ويعلن `domainTable<K, V>(schema)` جدولًا واحدًا بنوع مفتاح وهمي عند الترجمة (عادةً [معرّف موسوم](core.ar.md#branded-ids))؛ ويُسقط `descriptorOf(spec)` واصفَ الوحدة تجاه الخلفية.

## المجال المفتوح

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

والقراءاتُ متزامنة من حالة مرجعية في الذاكرة: فـ`KvTable` يكشف `get` و`entries` و`keys` و`size` (وهي مكرِّرات لقطات تبقى ثابتة بينما تحطّ الكتاباتُ المصطفّة)، ويقدّم `get()` في المقبض العام قيمةَ `initial` في المواصفة حتى يجسّد أولُ `set` الخانةَ على الوسيط. وكلُّ كتابة — `put` و`delete` و`update` و`global.set` — تصطف على سلسلة واحدة لكل مجال وتبلغ متانةَ الخلفية أولًا، ثم تغيّر الذاكرةَ، ثم تُطلق `domain/changed`؛ والكتابةُ التي ترفضها الخلفيةُ تترك الذاكرةَ بلا مساس، فلا تنحرف القراءاتُ عن الوسيط قط. و`update(key, fn)` قراءةٌ وتعديل وكتابة ذرّية في خانتها على السلسلة (والمفتاحُ المفقود يرفض بـ`missing-key`)؛ و`delete` لمفتاح غائب يحلّ بـ`false` بلا كتابة وبلا حدث. والسجلاتُ المعادة هي الكائناتُ المخزَّنة نفسُها لا نسخًا — فاستبدلها بـ`put` أو `update` ولا تغيّرها في موضعها.

## مرفق المجالات: `ctx.storageDomain`

يفتح `DomainFacility` ([التوقيعات](#ctxstoragedomain--domainfacility)) المجالاتِ المعلَنة فوق خلفيات مسلوكة. والتوجيهُ ضبطُ إضافة المجالات لا ضبطُ المحور: فـ`backend` يسمّي المسارَ الافتراضي المشترَط، و`routes` يتجاوزه لكل اسم مجال. ويجري `open(spec)` تسلسلًا صارمًا يُفشل كلُّ خطوة فيه النداءَ كلَّه: فيرفض اسمًا مفتوحًا سلفًا أو ما زال يُغلق (`already-open`)، ويحلّ المسارَ (`backend-not-found`)، ويشترط وجهَ `kv` في الخلفية (`facet-unsupported`)، ويفتح الوحدةَ (وتمرّ `version-mismatch` و`malformed-medium` من الخلفية كما هي)، ويتحقق من كل سجل وقيمة عامة مخزَّنة في مقابل schemas zod في المواصفة (`invalid-record` مع الجدول والمفتاح المخالفين). ويملك المستدعي المقبضَ المعاد ويحرّره بـ`Domain.close()`؛ والمجالاتُ التي تبقى مفتوحة حين تُفكَّك الإضافةُ يغلقها المرفق، ولا يتحرر اسمُ مجال مغلق لإعادة الفتح إلا بعد اكتمال التفكيك تمامًا. و`get(name)` بحثٌ تشخيصي بلا أنواع في بيئة `DomainImpl` الخاصة بالحزمة خلف كل مقبض منوَّع؛ و`closeAll()` هو مسارُ التفكيك.

## حدث التغيير: `domain/changed`

تُطلق كلُّ كتابة دائمة حدثًا واحدًا بعد أن تقرّ الخلفيةُ بالمتانة قطعًا، بترتيب سلسلة كتابة المجال ([مدخل الحدث](#domainchanged--emit)):

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

ويحمل `put` (وهو الإدراجُ والاستبدالُ والكتاباتُ العامة) اللقطةَ الجديدة في `value` — لا القيمةَ القديمة قط؛ ويُبقي المستهلكُ الذي يقارن لقطتَه السابقة عنده. و`deleted` شاهدةٌ بلا قيمة. والحدثُ إشعارٌ لا طرفٌ في معاملة: فنقطةُ الإيداع قد مضت عند الإطلاق، فيُحتوى المستمعُ الرامي متزامنًا بتحذير مسجَّل بدل رفض كتابة صارت دائمة، وتساوي القيمُ المُطلقة الحالةَ في الذاكرة عند الإطلاق. والحدثُ داخل العملية فقط؛ ودفعُ التغييرات بين العمليات حدٌّ مسجَّل ([README الحزمة](../../packages/storage/storage-domain/README.ar.md)).

<!-- BEGIN GENERATED cordis-surface (gen-cordis-catalog.ts) — do not edit between markers -->

<a id="cordis-surface"></a>

## Cordis API

Generated from source by `scripts/gen-cordis-catalog.ts` (verified fresh by `pnpm run verify-cordis-catalog` in doc-sync; regenerate with `pnpm run gen-cordis-catalog`) — the language sides differ only in locale-specific paired document paths. Signature blocks use a `ts cordis-catalog` fence and keep the original source JSDoc; dispatch modes are defined in the [primer](../cordis-primer.ar.md#dispatch-modes), and the framework-inherited `ctx` API lives in [cordis-api/inherited.md](../cordis-api/inherited.md).

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
