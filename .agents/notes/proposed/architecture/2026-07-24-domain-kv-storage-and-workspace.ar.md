# Agent Note: مجال KV تخزين قدرة seam و workspace فعلي جسم

Status: proposed

[English](2026-07-24-domain-kv-storage-and-workspace.md) | العربية

## مشكلة

host جانب وحيد حفظ دائم وجه هو session حدث سجل (`packages/session/session-persistence`: فقط إلحاق، واحد session واحد ملف). كل هو"لا يخص بعض عدد session"معلومة حينئذ لا يوجد سقوط قرص موضع، وجود اثنان عدد قد تسليم يحتاج طلب:

- **workspace فعلي جسم**.GUI يلزم يأخذ workspace فعل صار حقيقي كائن: مسار، عنوان، صلة ربط session بيان. ملكية علاقة من workspace يحتفظ——"أي بعض session يخص هذا عدد workspace"لا هو أي مفرد عدد session ذاتي ذات واقع، سد دخول session log دلالة لا صار قيام. في هذا تصميم قبل،workspace فقط هو sidebar فوق حسب cwd قسم مجموعة نظر شعور عام فكرة، لا يوجد فعلي جسم.
- **session حركة حالة عنصر معلومة**(يمكن مسبق رؤية ثاني عدد مستهلك). بارد جلسة قائمة فقط قراءة سجل أول سطر header(إنشاء وقت غير ممكن تغيير لقطة) ،title، انتهاء حالة هذا صنف مع جلسة دفع دخول تغير معلومة أخذ لا إلى؛ تكملة متساو جهة نحو هو sidecar بيانات وصفية جدول——صحيح هو واحد ورقة حسب key عال تردد نقطة تحديث KV جدول.

آخر خارج،Session حذف حاجة `SessionPersistence` حذف أصل لغة و `session.delete` طرف نقطة. هذا فارغ أبيض تصميم مع هذا Note تحديد سجل، لكن تنفيذ ما زال تابع لم قدوم عمل.

لاحق [Workspace تسجيل سجل حذف قرار](../../implemented/feature/2026-07-27-workspace-registration-deletion.ar.md) يحل محل فقط هو فوق وصف اقتران دمج علاقة: حذف Workspace تسجيل سجل سوف إبقاء متبادل صلة Session و ذلك سجل،Session حذف ما زال هو مستقل لم قدوم عمل. لذلك، تحت نص درجة ربط تصميم و لا هو Workspace GUI حذف دلالة.

## خطة

جديد بناء `packages/storage/` مجموعة——`ctx.storage` تخزين محور عقدة (خلفية تسجيل وجه + بيانات شكل صيغة تركيب وجه) ، اثنان عدد خلفية،domain مجال بيانات شكل صيغة——و workspace مستهلك حزمة؛ إعطاء `SessionPersistence` توسيع حذف أصل لغة.

| حزمة | مسار | ctx وجه | هذا مدة |
| --- | --- | --- | --- |
| `@deepseek-ai/dsh-storage` | `packages/storage/storage/` | `ctx.storage`(محور عقدة) | ✓ |
| `@deepseek-ai/dsh-storage-json` | `packages/storage/storage-json/` | تسجيل خلفية `json` | ✓ |
| `@deepseek-ai/dsh-storage-sqlite` | `packages/storage/storage-sqlite/` | تسجيل خلفية `sqlite` | ✓ |
| `@deepseek-ai/dsh-storage-domain` | `packages/storage/storage-domain/` | تركيب `ctx.storage.domain` | ✓ |
| `@deepseek-ai/dsh-workspace` | `packages/workspace/workspace/` | `ctx.workspaceRegistry` | ✓ |
| `SessionPersistence.delete` توسيع وجه + درجة ربط حذف تحرير ترتيب | `packages/session/*` | قائم seam جديد طريقة | ✗ future work(هذا مدة لا حركة session جانب) |
| `workspace.*` / `session.delete` RPC،GUI وصل خط،boot تجميع | — | — | ✗ تحت مدة |

(workspace وضع مستقل مجموعة لا وضع `packages/host/`:host مجموعة تسمية قاعدة اشتراط `dsh-host-*` بادئة، بينما حزمة اسم تحديد لـ `dsh-workspace`؛ كما workspace فعلي جسم هو مجال عام فكرة، لا ربط host تركيب إعداد طبقة. و قائم `agent-instructions` حزمة غير متصل——ذلك هو AGENTS.md إشارة أمر تحميل جهاز.)

اعتماد جهة نحو:`dsh-workspace` → `dsh-domain` → `dsh-storage` ← اثنان خلفية.`dsh-workspace` آخر اعتماد `ctx.sessionPersistence` فقط قراءة وجه (attach cwd تحقق قراءة session header؛ خدمة نقص مقعد وقت attach مباشر رفض——لا يمكن تحقق أي لا كتابة حساب).session حذف متبادل صلة `ctx.sessions` تشغيل في فحص مع درجة ربط حذف واحد و عودة دخول future work.

### `dsh-storage`: تخزين محور عقدة

صاف تسجيل محور عقدة، ذاته لا فعل IO، بلا Config.`Storage` خدمة تعليق `ctx.storage`، اثنان عدد وجه:`backend`(`BackendRegistry`:`register(name, backend)` إرجاع disposer، إعادة اسم throw؛`get(name)` لم معرفة اسم throw `backend-not-found`) و بيانات شكل صيغة تركيب (`mount(form, facility)` إعداد merge-extensible `StorageForms` map،`dsh-domain` merge دخول `domain` مفتاح؛ لم تركيب وصول throw `form-not-mounted`). توقيع متن رؤية `packages/storage/storage/src/index.ts` و `src/registry.ts`.

**كثير خلفية معا تركيب**؛ مجال→خلفية اختيار هو `dsh-domain` إعداد (رؤية تحت) ، لا هو عام اثنان اختيار واحد.disposer دلالة = من جدول في اقتباس اسم؛ خلفية ذاته close من خلفية حزمة effect إغلاق حزمة مسؤول، ترتيب أولا اقتباس اسم بعد close.

واحد خلفية هو واحد**وسيط جودة owner**(واحد شجرة ملف شجرة root / واحد db ملف) ، عبر**بيانات شكل حالة facet** كشف أصل لغة——هذا مدة فقط لديه `kv`؛session ترحيل مدة إضافة `log`(رؤية ترحيل عقدة).facet هو اختياري عضو، نقص مقعد أي هذا خلفية لا دعم حمل هذا شكل حالة، تحليل وقت fail loud.`kv` facet أصل لغة وجه:`open(descriptor)`(descriptor = اسم حرف/إصدار/جدول اسم بيان/لديه بلا global، اسم حرف و جدول اسم حد `^[a-z][a-z0-9_]*$` كذلك عمل ملف اسم و SQL جدول اسم مقطع) إرجاع unit،unit توفير `loadAll` / `putRecord` / `deleteRecord`(نقص key لـ no-op)/ `setGlobal` / `close`(قوة انتظار) ؛ قيمة مقابل خلفية هو لا نفاذ واضح JSON. مواصفة متن (يحتوي تدريجي طريقة JSDoc) في `packages/storage/storage/src/backend.ts`.

خلفية اتفاق (مشترك اتفاق اختبار تدريجي بند تأكيد، اثنان خلفية نفس طقم عنصر):

1. `open` مقابل لا وجود وسيط جودة إنشاء (كسول شيء تحويل سماح: يمكن تأخير متأخر إلى أول كتابة، لكن `loadAll` قيام يكفي استخدام إرجاع فارغ جدول) ؛ مقابل قد وجود وسيط جودة تحميل دخول.
2. وسيط جودة فوق إصدار ≠ descriptor.version → `StorageError('version-mismatch')`، لا ترحيل لا إعادة بناء.
3. حمل دائم صفة: كتابة أصل لغة resolve بعد عملية انهيار انهيار مجددا open،`loadAll` يجب عكس عكس هذا كتابة.
4. خلفية لا تحمل وعد unit داخل كتابة تزامن ترتيب——**استدعاء جهة مسؤول سلسلة سطر**؛ خلفية فقط حفظ إثبات مفرد مرة استدعاء أصل فرعي (JSON كامل ملف استبدال / SQLite مفرد لغة جملة).
5. `deleteRecord` قوة انتظار؛`putRecord` تغطية كتابة.
6. مهمة معنى نص key / مهمة معنى JSON قيمة أمان (key لا دخول ملف مسار، بنية صفة جودة).
7. `close` قوة انتظار؛close بعد أي عملية → `StorageError('closed')`.

خطأ مفردات هو حمل code حكم آخر `StorageError`، رمز جدول:`backend-not-found` / `form-not-mounted` / `duplicate-backend` / `duplicate-mount` / `version-mismatch` / `malformed-medium` / `closed`(`packages/storage/storage/src/error.ts`).

### `dsh-storage-json`

Config فقط `root`(لا بد ملء بلا افتراضي،schemastery) ؛apply في `ctx.effect()` داخل تسجيل خلفية `json`،disposer أولا اقتباس اسم مجددا `backend.close()`.

- تخطيط `<root>/<unitName>.json`، واحد unit واحد ملف؛ دليل 0o700، ملف 0o600.
- ملف صيغة (إصدار ختم في رأس، ملف أي حالي صاف قيمة،`JSON.stringify(…, null, 2)` لحم عين يمكن قراءة——هذا هو هذا خلفية وجود إدارة من):

```json
{
  "unit": { "name": "workspace", "version": 1 },
  "global": null,
  "tables": { "workspaces": { "<key>": {} } }
}
```

- كتابة: أي مرة كتابة أصل لغة = داخل تخزين حالة كل كمية تسلسل تحويل → temp كتابة + fsync → rename أصل فرعي إصدار (Windows تغيير جسم وفق نسخ session-persistence-jsonl win32 مسار). داخل تخزين حالة هو مرجعي، قرص هو إسقاط.
- `loadAll`:open وقت كامل ملف parse؛ نقص `unit` رأس،tables غير كائن انتظار → `malformed-medium`. ملف لا وجود = فارغ وحدة، أول كتابة عندئذ سقوط قرص.

### `dsh-storage-sqlite`

Config لـ `path`(لا بد ملء،`':memory:'` سماح)+ `journalMode`(قطعة رفع، افتراضي `wal`) ؛apply نفس json، تسجيل خلفية `sqlite`.

- `node:sqlite` `DatabaseSync`؛ فتح تسلسل لـ mkdir 0o700 → لا وجود فإن `open(path,'wx',0o600)` وحيد احتلال بناء ملف → `PRAGMA foreign_keys=ON` → journal_mode → إصدار فحص → بناء جدول.
- شيء إدارة تخطيط إصدار `STORAGE_SQLITE_SCHEMA_VERSION = 1` تخزين `PRAGMA user_version`:0 → غطاء فصل؛≠ → `version-mismatch`.
- DDL(كل STRICT؛ جدول اسم من تلقي حد محرف تجميع تجميع وصل إضافة `u_` بادئة، منع قطعا خارجي إدخال دخول DDL):

```sql
CREATE TABLE IF NOT EXISTS units (name TEXT PRIMARY KEY, version INTEGER NOT NULL) STRICT;
CREATE TABLE IF NOT EXISTS unit_globals (
  unit TEXT PRIMARY KEY REFERENCES units(name), value TEXT NOT NULL) STRICT;
-- One table per unit/table pair:
CREATE TABLE IF NOT EXISTS "u_<unit>_<table>" (
  key TEXT PRIMARY KEY, value TEXT NOT NULL) STRICT;             -- value = record JSON document
```

- unit إصدار تخزين `units` سطر،descriptor لا رمز → `version-mismatch`. سطر حبة درجة document-per-row، حفظ إقامة حسب key دقيق سقوط قرص تحديث (لـ session sidecar هذا صنف عال تردد نقطة تحديث كبير جدول إبقاء مسار) ؛ استعلام يحتاج طلب ظهور وقت JSON1 مباشر فحص value صف.
- كتابة أصل لغة مفرد لغة جملة أي أصل فرعي، بلا عبر لغة جملة أمر خدمة يحتاج طلب (domain طبقة بلا عبر جدول أمر خدمة، رؤية لا فعل بيان).

### `dsh-domain`: مجال بيانات شكل صيغة

مفرد تنفيذ لا سحب كائن؛ مستهلك فقط اعتماد هذا طبقة، لا مباشر لمس خلفية.

```ts ignore-check
export const Config = z.object({
  backend: z.string().required(),                // required default backend name
  routes: z.dict(z.string()).default({}),        // per-domain override: { workspace: 'sqlite' }
})

export function apply(ctx: Context, config: Config) {
  ctx.effect(() => ctx.storage.mount('domain', new DomainFacility(ctx, config)))
}
```

(facility إزالة ترتيب: أولا dispose كل مجال (ترتيب فارغ كتابة سلسلة) مجددا من محور عقدة اقتباس اسم——ترتيب فارغ خلال في طريق كتابة ما زال إرسال `domain/changed`، حدث متسق صفة invariant مرور facility عكس فحص مجال، اشتراط هذا وقت مجال اسم ما زال يمكن تحليل.)

مجال إعلان (spec كائن من يملك هذا مجال حزمة تعريف تصدير، هو نوع و وقت التشغيل وحيد حق مصدر؛schema استخدام zod،`z.infer` دفع توجيه نوع لا تكرار إعلان——سجل نموذج تحت مدة يلزم إسقاط صار RPC wire schema،wire حد كل هو zod؛schemastery ما زال فقط إدارة إضافة Config):

```ts ignore-check
export interface DomainGlobalSpec<G> { readonly schema: ZodType<G>; readonly initial: G }
export interface DomainTableSpec<K extends string, V> { readonly valueSchema: ZodType<V> }

export interface DomainSpec {
  readonly name: string                          // ^[a-z][a-z0-9_]*$
  readonly version: number
  readonly global?: DomainGlobalSpec<unknown>
  readonly tables: Record<string, DomainTableSpec<string, unknown>>
}

export function defineDomain<S extends DomainSpec>(spec: S): S
export function domainTable<K extends string, V>(schema: ZodType<V>): DomainTableSpec<K, V>
```

`DomainFacility.open(spec)` دقيق دلالة (ترتيب تنفيذ، مهمة واحد خطوة فشل أي كامل جسم فشل):

1. نفس اسم مجال قد فتح → `DomainError('already-open')`.
2. خلفية اسم = `config.routes[spec.name] ?? config.backend`؛`ctx.storage.backend.get(name)`(لم تركيب اختراق نفاذ `backend-not-found`——misconfiguration fails loud).
3. خلفية بلا `kv` facet → `DomainError('facet-unsupported')`.
4. `kv.open(descriptorOf(spec))`(descriptor من spec مباشر إسقاط).
5. `loadAll()`؛ كل بند سجل `valueSchema.parse`،global مرور schema(null أخذ `initial`، لا سقوط قرص، أول كتابة عندئذ سقوط قرص). فشل → `DomainError('invalid-record', { table, key })`(durable حد يجب تحقق؛ كتابة جانب لا تكرار تحقق).
6. بنية صنع `Domain` و تسجيل `ctx.effect()`:disposer ترتيب فارغ كتابة سلسلة → `unit.close()`.

```ts ignore-check
export interface Domain</* inferred from spec */> {
  readonly name: string
  readonly global: { get(): G; set(value: G): Promise<void> }   // only when spec.global exists
  table<N extends keyof S['tables']>(name: N): KvTable<KeyOf<N>, ValueOf<N>>
}

export interface KvTable<K extends string, V> {
  get(key: K): V | undefined                     // synchronous in-memory snapshot
  entries(): IterableIterator<[K, V]>
  keys(): IterableIterator<K>
  readonly size: number
  put(key: K, value: V): Promise<void>
  delete(key: K): Promise<boolean>               // false when already absent
  /** Atomic read-modify-write on the domain's single write chain; fn is sync-pure. */
  update(key: K, fn: (current: V) => V): Promise<V>   // missing key -> DomainError('missing-key')
}
```

قاعدة:

- **واحد درجة mapping**:key → سجل، لا فعل تضمين طقم جدول؛ طبقة درجة يحتاج طلب استخدام تكرار دمج key أو قيمة داخل حقل. اثنان خلفية لذلك نفس بنية (JSON object واحد طبقة ↔ SQLite واحد سطر).
- **سجل هو صاف بيانات**: يمكن مباشر JSON تسلسل تحويل غير ممكن تغيير POJO؛`get`/`entries` قيمة راجعة لا نيل أصل أرض تعديل (TypeScript readonly إسقاط، لا فعل وقت التشغيل تجميد ربط). حمل سلوك مجال كائن يخص مستهلك حزمة.
- **كتابة سلسلة سطر**: مجال داخل واحد بند promise سلسلة،`put`/`delete`/`update`/`global.set` كل ترتيب طابور؛`update` fn في سلسلة فوق تنفيذ، تزامن لا تسليم خطأ. لا فعل active-record(أخذ خروج متغير كائن تلقائي سقوط قرص——سقوط قرص وقت آلة غير ممكن تحكم، و كامل مجال أصل فرعي تغطية كتابة اندفاع مفاجئ).
- **إصدار fail loud**: قرص فوق إصدار و spec لا رمز مباشر تقرير خطأ، لا ترحيل لا إعادة بناء (بيانات غير ممكن مجددا توليد،pre-release رفض قديم صيغة).
- **تغيير حدث**: كل مرة كتابة سقوط قرص resolve بعد emit `domain/changed`(`@mode emit`) ، تدريجي بند إرسال، لا حمل قديم قيمة (مقابل متساو مستودع"جديد لقطة + عملية حكم آخر"معتاد مثال، نطاق هذا `goal/changed`) ؛payload `DomainChanged` هو put/deleted حكم آخر ربط دمج——مجال اسم + جدول اسم + key(global تغيير اثنان من لـ `''`)+ operation،put دعم حمل جديد لقطة value،deleted دعم بلا value(`packages/storage/storage-domain/src/events.ts`). هذا لـ تحت مدة RPC دفع لقطة حدث مصدر. خطأ مفردات `DomainError`، رمز جدول:`already-open` / `facet-unsupported` / `invalid-record`(حمل `{ table, key }`)/ `missing-key` / `closed`.

### Future work:session جانب حذف (تصميم تحديد سجل، هذا مدة لا فعلي تطبيق)

هذا عقدة هو تحديد سجل تطبيق عمل مواصفة، فعلي تطبيق مدة لا حركة دلالة فقط حركة شفرة؛ هذا مدة session-persistence أي ملف كل لا تعديل.

```ts ignore-check
export abstract class SessionPersistence extends Service {
  /**
   * Permanently delete one session's stored log.
   * Queued on the per-id write chain (serialized with in-flight appends).
   * Unknown id → reject; un-materialized create intent → cancel it and resolve.
   * After deletion the id behaves as unknown for every subsequent operation.
   */
  abstract delete(id: SessionId): Promise<void>
}
```

- JSONL خلفية:unlink هذا session ملف (يحتوي `.zstd` تغيير جسم) ؛ ملف و intent متساو بلا → reject.
- مستودع خارج خلفية في ذاتي ذات وسيط جودة في أصل فرعي حذف، و إبقاء نفسه لم معرفة id و قد إلغاء intent نتيجة؛ هذا رفع سجل لا تعريف أخرى first-party شيء إدارة مسار.
- حذف نجاح بعد emit `'session-persistence/deleted'(id: SessionId)`(`@mode emit`؛session-persistence طبقة حدث وجه، و `domain/changed` غير متصل). إرسال توليد بيانات (session-query كل نص بحث جذب انتظار) حجز قراءة ذاتي صاف؛ حمل دائم طبقة لا مباشر وصل بحث جذب، انهيار انهيار نافذة اعتماد إرسال توليد بحث جذب يمكن إسقاط إعادة بناء التقاط قاع.

تحرير ترتيب طبقة قاعدة (مع درجة ربط حذف واحد بدء فعلي تطبيق؛`session.delete` RPC و workspace درجة ربط إعادة استخدام نفس قاعدة):

| فحص (حسب ترتيب) | لا ممتلئ كاف وقت |
| --- | --- |
| هدف (تمرير عودة وقت يحتوي كامل شجرة فرعي شجرة) بلا واحد في `ctx.sessions` تشغيل | throw، ماذا كل لا حذف؛ استدعاء جهة أولا cancel مجددا حذف، حمل دائم طبقة لا عكس نحو جر حركة وقت التشغيل |
| غير تمرير عودة وقت هدف بلا بعد بديل (بعد بديل = `parentSessionId` نقل تمرير إغلاق حزمة، من `list()` header طلب نيل) | throw: افتراضي فقط قدرة حذف ورقة فرعي،`recursive: true` صريح تمرير عودة |
| تمرير عودة ترتيب ذاتي قاع نحو فوق (ورقة→أصل) | ——في طريق انهيار انهيار فقط إبقاء"فرعي شجرة حذف واحد نصف، أصل أولا في"، إعادة ركض استلام جمع، أي وقت لحظة بلا معلق فارغ parent |
| درجة ربط في بعض id قد لا في قرص فوق | قفز مرور (قوة انتظار متابعة حذف) ؛ ذلك بقية خطأ في توقف |

### `dsh-workspace`

حزمة يملك `WorkspaceId` brand، كشف `ctx.workspaceRegistry`. سجل key لـ توليد uuid——path لا فعل key: مواصفة تحويل سوف تعديل كتابة هو، مرجع مرساة نقطة يجب مستقر.

```ts ignore-check
export type WorkspaceId = Branded<'WorkspaceId'>
export function WorkspaceId(id: string): WorkspaceId

const workspaceRecord = z.object({
  path: z.string(),                              // realpath، رؤية تحت
  title: z.string(),
  sessionIds: z.array(z.string().transform(SessionId)),
  createdAt: z.string(),                         // ISO
  updatedAt: z.string(),
})
export type WorkspaceRecord = z.infer<typeof workspaceRecord>

export const workspaceDomainSpec = defineDomain({
  name: 'workspace', version: 1,
  tables: { workspaces: domainTable<WorkspaceId, WorkspaceRecord>(workspaceRecord) },
})

declare module 'cordis' { interface Context { workspace: WorkspaceRegistry } }

export interface Workspace {
  readonly id: WorkspaceId
  readonly path: string
  readonly title: string
  readonly sessionIds: readonly SessionId[]      // وحيد حق متبادل كما لديه ترتيب: عدد مجموعة ترتيب أي عرض ترتيب
  setTitle(title: string): Promise<void>
  /** Record a session under this workspace (idempotent). Rejects when the session
   *  header's cwd (realpath) differs from this workspace's path. */
  attachSession(sessionId: SessionId): Promise<void>
  detachSession(sessionId: SessionId): Promise<void>
  /** Live directory check, uncached. */
  status(): Promise<'ok' | 'missing-dir'>
}

export class WorkspaceRegistry extends Service {
  constructor(ctx: Context)                      // super(ctx, 'workspaceRegistry')
  // start(): this.domain = await ctx.storage.domain.open(workspaceDomainSpec)
  //          فعلي جسم ذاكرة مؤقتة Map<WorkspaceId, WorkspaceEntity> إعادة بناء
  create(path: string, title?: string): Promise<Workspace>   // realpath بعد اصطدام قد لديه → reject
  get(id: WorkspaceId): Workspace | undefined
  list(): Workspace[]
  resolveByPath(path: string): Promise<Workspace | undefined> // نفس realpath فتحة مسار، لذا async
  delete(id: WorkspaceId): Promise<boolean>      // فقط حذف تسجيل سجل؛ دليل و session سجل إبقاء
}
```

- **path مواصفة**: سقوط قرص قيمة = `fs.realpath(إدخال)`(ذيل مائل عمود،`..`، رمز رقم رابط كل تحليل) ؛ وحيد صفة = مواصفة تحويل بعد نص متبادل انتظار (رمز رقم رابط إشارة نحو نفس دليل حساب اصطدام). دليل لا وجود وقت create مباشر reject(realpath فشل——workspace يجب إشارة نحو وجود دليل؛"Create new = بناء دليل"هو فوق طبقة تفاعل، أولا mkdir مجددا create).attach تحقق session cwd نفس فتحة مسار.cwd مفرد قيمة + path وحيد ⇒ واحد session بنية فوق الأكثر كثير ملكية واحد workspace، مزدوج إعادة تسجيل حساب كتابة جانب غير ممكن قدرة.
- **title**: عرض اسم، افتراضي `basename(path)`، يمكن تعديل، سماح تكرار. ملكية لا استخدام cwd إرسال توليد التقاط قاع——cwd جدول بلوغ لا ترتيب، ملكية هو workspace جانب واقع؛headless مباشر فتح session لا يخص أي workspace.
- مستهلك فقط رؤية `Workspace` واجهة،`WorkspaceEntity` لا خروج حزمة (مفرد تنفيذ لا مسبق تفكيك seam) ؛ فعلي جسم حسب id وحيد (سجل التسجيل ذاكرة مؤقتة) ، سجل لقطة كتابة بعد أصل أرض تبديل جديد، خارجي فقط رؤية getter؛ كل كتابة استلام جمع إلى فعلي جسم داخل `mutate(fn)` → `table.update`،`updatedAt` في mutate داخل موحد واحد تحديث. مجال كائن لا مرور RPC، تحت مدة wire طبقة يأخذ سجل إسقاط صار zod wire schema.
- **Session حذف ما زال تابع لم قدوم عمل.** لاحق [Workspace تسجيل سجل حذف قرار](../../implemented/feature/2026-07-27-workspace-registration-deletion.ar.md) قد سوف `ctx.workspaceRegistry.delete(id)` بصفة فقط حذف بيانات وصفية، إبقاء Session و سجل عملية تسليم. تمرير عودة حذف Session، تشغيل في فحص و انهيار انهيار إعادة ركض استلام جمع يخص مستقل `session.delete` قدرة.

متسق صفة فتحة مسار (حساب = ملكية وحيد اعتماد حسب؛ تنفيذ و اختبار أساس دقيق):

| حال شكل | سلوك |
| --- | --- |
| حساب في id قرص فوق بلا session | `list()`/فعلي جسم إسقاط وقت مرور ترشيح؛ تحت مرة أي mutate ترتيب يد اقتباس حذف؛ لا تقرير خطأ (حذف انهيار انهيار متسق صفة صحيح معتاد ناتج) |
| session cwd مطابقة بعض workspace لكن لم فوق حساب | لا يخص: لا دمج لا استلام تحرير.GUI سوف قدوم يمكن فعل"تنقل مغادرة session"مخصص منطقة (تنقل مغادرة = الكل حساب تكملة تجميع) |
| نفس session فوق اثنان هذا حساب | كتابة جانب بنية صفة سد ميت (attach تحقق) ؛load فحص خروج → throw(خارجي يد تعديل بيانات، لا إخفاء غطاء) |
| workspace دليل لا وجود | سجل و حساب إبقاء،`status()` = `'missing-dir'`؛ تخزين طبقة لا تلقائي حذف (دليل ممكن فقط هو مؤقت وقت نقل مشي) |

### إعادة استخدام و session خلفية ترحيل عرض نظر

**طويل مدة جهة نحو**:Session-persistence JSONL provider صاف وسيط جودة عملية يمكن تحت غرق إلى `dsh-storage` log facet(Session package إبقاء،`SessionPersistence` seam و coordinator دلالة لا حركة؛ فقط نقل حركة تحت طبقة ملف عملية). إعادة استخدام حركة آلة هو يجعل وسيط جودة طبقة يملك Windows أصل فرعي إصدار،fsync دلالة و وحيد احتلال بناء ملف انتظار نظام الملفات و عبر منصة عمل، عمل خدمة دلالة (Session مثل أي append، أي وقت append،append ماذا) إبقاء في فوق طبقة.Session سجل هو فقط إلحاق تدفق، و KV شكل صيغة مختلف، لذلك واجهة إبقاء**وسيط جودة owner + بيانات شكل صيغة facet**، بينما لا قوي إجبار اثنان من مشترك استخدام واحد طقم أصل لغة.

الآن حالة إعادة استخدام مراجعة حساب (ترحيل قبل حينئذ قدرة نظر صاف حساب):

| session-persistence قائم منطق | ملكية | موضع وضع |
| --- | --- | --- |
| JSONL:temp كتابة + fsync + link/unlink أصل فرعي إصدار،0o700/0o600 إذن،Windows تغيير جسم (win32.ts) | صاف وسيط جودة | هذا مدة `dsh-storage-json` مباشر نسخ استخدام (كامل ملف أصل فرعي تغطية كتابة صحيح هو نفس طقم) ؛ ترحيل مدة يصبح مشترك تنفيذ |
| JSONL: تدريجي سطر append، أول سطر header سريع قراءة،zstd تدريجي لقطة ضغط | log شكل حالة | إبقاء في أصل أرض؛ ترحيل مدة دخول `log` facet |
| coordinator(per-id كتابة سلسلة، كسول شيء تحويل، انهيار انهيار إصلاح،flush شاشة عائق) | session دلالة | دائم لا تحت غرق——حدث سجل مجال منطق، في domain طبقة مقابل هو كتابة سلسلة سطر سلسلة، كل عودة كل |
| encodeSegment(id دخول مسار تحويل معنى) | وسيط جودة أداة | domain جانب key لا دخول مسار استخدام لا إلى؛`log` facet(واحد session واحد ملف) ترحيل وقت مع لـ تحت غرق |

**هذا مدة لا تعديل Session-persistence وسيط جودة شفرة**(فقط إضافة delete أصل لغة). لم قدوم log-facet تغيير حاجة ذاتي ذات consumer و دليل؛ فوق جدول سجل باق بقية JSONL إعادة استخدام حد، لكن لا تحمل وعد واحد تحديد رفع أخذ.

### اختبار مستطيل دفعة

| طقم عنصر | تغطية | خلفية |
| --- | --- | --- |
| خلفية اتفاق (مشترك طقم عنصر، مرة تحرير كتابة اثنان طرف ركض) | سبعة بند اتفاق + إصدار رفض + close قوة انتظار | json،sqlite(`:memory:` + مؤقت دليل) |
| سجل التسجيل/mount | تكرار تسجيل، لم تركيب وصول،disposer اقتباس حذف | — |
| domain طبقة | open ستة خطوة دلالة،schema رفض،update سلسلة سطر (تزامن تسليم خطأ ضغط قياس) ،`domain/changed` تدريجي بند،global أول قيمة كسول شيء تحويل، توجيه و `facet-unsupported` | مهمة واحد (json) |
| workspace | create/وحيد صفة/realpath،attach تحقق (يحتوي sessionPersistence نقص مقعد رفض) ، متسق صفة فتحة مسار أربعة حال شكل | mock domain أو json |
| session delete اتفاق (future work، مع فعلي تطبيق و دخول runPersistenceContract) | لم معرفة id، قد حذف id إعادة استخدام، لم شيء تحويل intent، و في طريق append سلسلة سطر،deleted حدث | jsonl |

لقطة: هذا مدة بلا نموذج مرئي وجه و تجميع وجه، لا إضافة جديدة؛ تحت مدة RPC وصل خط وقت مع `workspace.*` مجال تكملة.

### لا فعل بيان

| لا فعل | إطلاق شرط | إرجاع عمل نقطة | مسبق دفن |
| --- | --- | --- | --- |
| Session حذف (`SessionPersistence.delete`،deleted حدث، تمرير عودة حذف، تشغيل في فحص) | كسر تالف صفة Session حذف منتج تدفق بدء | تنفيذ Session أصل لغة و `session.delete`؛ و Workspace تسجيل سجل حذف إبقاء مستقل | فوق نص تحرير ترتيب قاعدة و رفض بيان ما زال هو أساس أساس؛Workspace حذف سوف إبقاء Session و سجل |
| `log` facet و Session provider ترحيل | هذا مدة بعد مهمة معنى مدة بدء | لديه حقيقي consumer إثبات حاجة وقت تحت غرق JSONL وسيط جودة عملية | facet مجموعة نسج إبقاء خيار، لكن لا تحمل وعد رفع أخذ |
| كثير عملية تزامن كتابة حفظ حماية | اثنان host عملية نفس كتابة واحد وسيط جودة | JSON خلفية ملف قفل؛SQLite WAL يوم لكن كثير عملية | كتابة كل مرور domain مفرد نقطة سلسلة سطر، إضافة قفل فقط حركة خلفية |
| عبر عملية تغيير مراقبة قياس | GUI قطع خط إعادة وصل شعور معرفة | revision نمط (نسخ session-persistence) | عملية داخل قد لديه `domain/changed` |
| بيانات ترحيل | أول عدد tagged release بعد نموذج مجددا تغيير | رقم الإصدار قيادة تدريجي مجال ترحيل | رقم الإصدار ذاتي رقم واحد يوم دخول وسيط جودة |
| كبير جدول صفة قدرة | ألف درجة سجل مجال تعليق json | `routes` تعديل إشارة sqlite، بيانات يد عمل توجيه مرة | توجيه أي إعداد، مستهلك صفر تعديل |
| كثير مقطع key | اثنان مقطع key مستهلك ظهور (كل workspace كل session صيانة درجة بيانات) | key عام نوع تبديل tuple،SQLite تكرار دمج رئيسي مفتاح،JSON تضمين طقم طبقة | واحد درجة جدول = مقطع عدد 1 خاص مثال؛ لا فعل مهمة معنى عميق درجة تضمين طقم؛ لا تجميع نص key |
| scope صيانة درجة | "كل workspace واحد نسخة"مجال ظهور كما تكرار دمج key جدول بلوغ لا حركة | DomainSpec إضافة scope + ملف اسم scope مقطع (encodeSegment) | اسم حرف محرف تجميع قد استلام ضيق، ملف اسم لا اندفاع مفاجئ |
| عبر جدول أصل فرعي أمر خدمة | نفس مجال اثنان جدول مرة أصل فرعي عملية يحتاج طلب | `domain.transact(fn)`؛JSON يوم لكن أصل فرعي،SQLite حزمة أمر خدمة | — |
| اثنان درجة بحث جذب/شرط استعلام | داخل تخزين مرور ترشيح لا حركة (ألف درجة سجل) | SQLite JSON1 فحص value صف، إضافة فقط قراءة query وجه | JSON خلفية لا مرافقة ركض |
| session عبر workspace نقل حركة | منتج يحتاج طلب ظهور | attach تحقق وضع عرض لـ"أولا detach بعد attach"تحرير ترتيب | — |
| Session حذف RPC/GUI | كسر تالف صفة Session حذف منتج تدفق بدء | `session.delete` طرف نقطة،wire schema و واضح تأكيد UI | Workspace RPC/GUI قد مستقل تسليم، لم يعد وجود درجة ربط اقتران دمج |

## تجهيز اختيار خطة

- **إعادة استخدام session-persistence coordinator/خلفية**: حدث سجل دلالة (فقط إلحاق،turn انهيار انهيار إصلاح، كسول شيء تحويل) و KV تغطية كتابة دلالة لا مطابقة؛ فقط استعارة ذلك قسم طبقة تفكير تفكير (تنسيق ضبط طبقة حمل كتابة ترتيب، خلفية فقط تنفيذ الأكثر صغير أصل لغة).
- **workspace مخصص استخدام تخزين حزمة، لاحق مجددا سحب seam**: ثاني عدد مستهلك (session sidecar) قد يمكن مسبق رؤية، دورة وقت عام تحويل يلزم مجددا حركة مرة واجهة.
- **domain و storage دمج لـ واحد طبقة**: خلفية سوف يتم إجبار وصل لمس schema تحقق، تغيير حدث، كتابة سلسلة سطر انتظار مجال صلة قطع؛ تفكيك فتح بعد storage خلفية فقط فعل لا نفاذ واضح أصل لغة (يمكن استبدال وجه الأكثر صغير) ،domain مفرد تنفيذ استلام جمع الكل مجال منطق (zod/حدث/سلسلة سطر تحويل فقط كتابة واحد مرة، لا مع خلفية قلب ضعف).
- **كامل مكتبة مفرد خلفية اثنان اختيار واحد (تعلم session-persistence مفرد slot نمط)**: مرفوض——تخزين محور عقدة يلزم تحمل تحميل كثير نوع بيانات شكل صيغة، مختلف شكل صيغة/مجال مقابل خلفية انحراف جيد (لحم عين يمكن قراءة vs عال تردد نقطة تحديث) ملاحظة تحديد قسم تحويل، مفرد slot سوف إجبار خروج"كامل جسم تبديل تعليق + يد عمل توجيه بيانات"خشن حبة درجة حركة عمل. بديل قيمة هو حسب اسم فحص بحث كثير واحد خطوة،fail-loud التقاط قاع.
- **JSON خلفية jsonl إلحاق + قبر نصب + ضغط فعلي (compaction)**:temp+fsync+rename انهيار انهيار أمان و append انتظار قيمة؛ تغطية كتابة يجعل ملف دائم بعيد هو صاف قيمة، لحم عين يمكن قراءة، تجنب إسقاط طي/ضغط فعلي/قطع سطر سعة خطأ. مجال قاعدة نموذج تحت كامل كتابة و إلحاق واحد سطر نفس كمية درجة.
- **JSON واحد جدول واحد ملف**: تغطية كتابة تحت ملف حبة درجة لا أثر كتابة صار هذا، حسب مجال دمج ملف أكثر قليل،global مفرد مثال لديه سقوط نقطة.
- **SQLite كامل مجال تخزين مفرد سطر blob**: أي واحد بند سجل تغيير كل إعادة كتابة كامل مجال، فقد ذهاب حسب key دقيق تحديث——SQLite متبادل مقابل JSON وحيد أفضل اتجاه عودة صفر.
- **SQLite حسب schema توليد typed columns**:DDL توليد جهاز مرور درجة بناء ضبط؛document-per-row كاف كاف، استعلام يحتاج طلب ظهور مجددا اقتراح.
- **كل مجال مستقل sqlite db ملف**: و مستودع واحد مكتبة كثير جدول معتاد مثال متبادل عكس.
- **path بصفة workspace key**: مواصفة تحويل/رمز رقم رابط تحليل سوف تعديل كتابة path؛ مرجع مرساة نقطة يجب مستقر.
- **ملكية استخدام cwd إرسال توليد (أو و حساب دمج)**: مزدوج حق متبادل مصدر؛cwd جدول بلوغ لا ترتيب؛ ملكية هذا حينئذ هو workspace جانب واقع.
- **تغيير حدث حمل قديم قيمة**: مستودع تغيير حدث معتاد مثال هو"جديد لقطة + عملية حكم آخر"(وحيد مثال خارج fs before/after هو طريقة قيمة راجعة بينما غير حدث، بسبب قديم قيمة أمر بعد غير ممكن إعادة بناء كما لديه diff مستهلك) ؛ حاجة diff مستهلك ذاتي ذات يحتفظ فوق مرة لقطة.
- **حذف تلقائي cancel تشغيل في session**: حمل دائم طبقة/تحرير ترتيب طبقة عكس نحو جر حركة وقت التشغيل، طبقة مرة تغيير قذر؛cancel آلية قد وجود، استدعاء جهة تركيب يكفي.

## تحقق استلام معيار

- اختبار مستطيل دفعة هذا مدة أربعة طقم عنصر كل أخضر: خلفية اتفاق مشترك طقم عنصر في json/sqlite مزدوج طرف، سجل التسجيل/mount disposer دلالة،domain طبقة (يحتوي open ستة خطوة و توجيه fail-loud) ،workspace كل دلالة (create/attach تحقق/متسق صفة فتحة مسار).
- `ctx.workspaceRegistry` يمكن في اختبار تجميع تحت إتمام create → attach → list → فقط حذف بيانات وصفية delete دورة الحياة.
- session-persistence حزمة صفر diff(هذا مدة لا حركة session جانب تحقق استلام خط).
- هذا مدة بلا جديد لقطة (بلا نموذج مرئي وجه و تجميع وجه) ؛ تحت مدة RPC وصل خط وقت تكملة.

## ريح خطر

- **مستودع حفظ دائم وجه رقم واحد دفع صيغة تغيير حدث**(session-persistence اعتماد revision جولة استفسار): شكل رغم لديه `goal/changed` نطاق هذا، لكن"تخزين طبقة إرسال حدث"هو جديد أولا مثال، تحت مدة RPC إزالة استهلاك وقت عندئذ قدرة تحقق شكل هل دمج ملائم.
- **JSON خلفية كامل مجال تغطية كتابة قاعدة نموذج قبل رفع**: إذا ثاني عدد مستهلك (session sidecar) في توجيه إلى SQLite قبل حينئذ بـ ألف درجة سجل سقوط في JSON خلفية، كامل كتابة صار هذا سوف أولا في مسبق مدة إظهار الآن؛ مؤقت حل أي `routes` تعديل إشارة sqlite.
- **حذف تحرير ترتيب مقابل `ctx.sessions` ضعيف اعتماد**:headless تجميع أخذ لا إلى وقت التشغيل سجل التسجيل وقت حسب"بلا حار session"معالجة، وجود نافذة (خارجي عملية جارٍ ركض هذا session) ؛ كثير عملية هذا حينئذ في لا فعل بيان داخل، قبول.
- **facet عام تحويل بـ لم قدوم `log` facet لـ تصميم اعتماد حسب لكن هذا مدة لا تنفيذ هو**: وجود"مسبق إبقاء شكل حالة لا دمج ذات"ريح خطر؛ مؤقت حل هو هذا مدة خلفية وسيط جودة شفرة حسب إعادة استخدام مراجعة حساب جدول تحت غرق شكل حالة مجموعة نسج،`log` facet حق صحيح سقوط أرض وقت فقط حركة facet طبقة.
