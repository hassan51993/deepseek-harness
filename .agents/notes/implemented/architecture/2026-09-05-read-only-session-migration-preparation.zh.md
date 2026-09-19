# Agent Note: تاريخ Session في كتابة إصدار قبل توفير فقط قراءة ترحيل نتيجة

Status: implemented

[English](2026-09-05-read-only-session-migration-preparation.md) | العربية

## مشكلة

لديه حالة Stage pipeline قد يأخذ تاريخ Decode و migration استعادة إلى محدود، عال صفة قدرة بيانات تدفق، لكن سلسلة سطر persistence open ما زال سوف في إرجاع مهمة واحد نوع handle قبل تنفيذ encode،sync،Worker verification،publication و committed reopen. فقط قراءة consumer لذلك حاجة مقدار خارج انتظار نحو 2.2 ثانية لا حاجة عمل، بينما كما فقط لـ عرض تاريخ حينئذ سوف تعديل تخزين.

### سلسلة سطر readable مقدار خارج بديل قيمة

- تاريخ قسم صفحة،projection preparation،export و `session.follow` opening snapshot فقط حاجة قد تحقق current logical artifact.
- Historical read open ما زال سوف إنشاء و sync مؤقت v2 generation، بدء كامل verification Worker، تكرار فحص source، إصدار v2 و إعادة فتح target.
- Migration في encode قبل قد نيل إلى كامل current artifact، لكن سلسلة سطر API فقط إرجاع committed physical snapshot.Persistence يجب مجددا مرة Decode current bytes عندئذ قدرة إعادة بناء نفسه منطق حدث.
- `session.follow` يجب انتظار publication إتمام بعد عندئذ قدرة إرسال خروج opening snapshot، بينما Agent resume عندئذ هو رقم واحد حق صحيح اشتراط append إذن عملية.
- Read-only storage لا يمكن توفير منطق فوق صالح تاريخ Session، لأن read open قوي صنع إصدار generation.

### مباشر تفكيك قسم سوف كسر تالف lifecycle حفظ إثبات

- Verify قبل إرجاع write handle سوف يجعل append كتابة unpublished temporary file، و لـ قد وصل قبول حدث جذب دخول ثاني نوع durability state.
- كل مرة read بعد تلقائي بدء publication، حاجة backend مسؤول task failure،shutdown،cleanup، و لاحق writer إضافة دخول واحد ذاتي ذات لا يوجد طلب مهمة.
- Shared preparation لا يستطيع وراثة رقم واحد caller AbortSignal؛ واحد reader إلغاء لا يستطيع إنهاء أخرى waiter ما زال اعتماد عمل.
- Read handle يجب أولا توفير prepared memory، و في أخرى caller إصدار بعد تبديل إلى current file و ذلك append tail.
- Reader قد مراقبة واحد prepared artifact بعد،source drift لا يستطيع صامت صامت إعادة ركض migration و استبدال صار آخر نسخة منطق تاريخ.

## قرار

JSONL backend سوف logical preparation و durable publication قسم فتح.Read open فقط انتظار preparation؛write open إعادة استخدام matching preparation، و في إرجاع writable handle قبل انتظار publication.

### Prepared generation API

```text
interface PreparedJsonlMigration {
  readonly sourceIdentity: JsonlPhysicalIdentity
  readonly artifact: SessionFormatArtifact
  publish(): Promise<JsonlPhysicalIdentity>
}
```

`prepareJsonlMigration()` قراءة واحد مستقر historical revision، فقط تنفيذ مرة كامل Stage chain، و في لا encode، لا كتابة ملف حال حال تحت إرجاع current artifact.`publish()` هو قوة انتظار عملية: تزامن و لاحق استدعاء مشترك نفس عدد نهاية حالة Promise(يشمل رفض نتيجة) ، لن مقابل نفس prepared artifact تكرار encode.

`publish()` يأخذ current records تدفق صيغة كتابة نفس دليل ترتيب هو إنشاء temporary file، تنفيذ sync، انتظار bounded Worker verifier، مقارنة مقارنة preparation التقاط source identity، مجددا عبر no-overwrite عملية إصدار canonical path. نجاح publisher إعادة استخدام prepared logical artifact، لا إعادة Decode ذاتي ذات target. تنافس تنازع فشل من فقط تحقق winner بـ دقيق staged migration prefix فتح رأس؛append tail validation ما زال يخص current reader.

Publication استدعاء بعد سوف تشغيل إلى settlement، لن يتم write caller في طريق إلغاء.Write open سوف في publication قبل بعد فحص caller signal، لذلك إلغاء ممكن في بعد استمرار قد إيداع بعد رفض open، لكن لن تسرب تسرب write lease.Source identity تغير سوف رمي خروج `JsonlGenerationSourceChangedError`، حذف مؤقت ملف، و كما لن تكرار Decode أو migration.

### Preparation ownership و إلغاء

Persistence backend حسب Session id،selected source path و stat-derived revision حفظ واحد in-flight entry:

```text
interface MigrationPreparation {
  sourcePath: string
  sourceRevision: SessionPersistenceRevision
  controller: AbortController
  promise: Promise<PreparedStoredLog>
  settled: boolean
  waiters: number
}
```

جديد read/write open فقط لديه في source path و revision ما زال مطابقة وقت عندئذ إضافة دخول قد لديه entry.`waitWithAbort()` يجعل كل caller AbortSignal و shared Promise تنافس تنازع، لكن لن يأخذ caller signal نقل إعطاء مشترك عمل. فقط لديه الأكثر بعد واحد waiter في preparation ما زال وقت التشغيل مغادرة فتح،backend-owned controller عندئذ سوف abort. إلغاء اختبار مؤقت توقف شيء إدارة قراءة، و في إلغاء واحد caller قبل مراقبة إلى اثنان عدد قد تسجيل waiter؛ فقط يجعل خروج مرة حدث حلقة لا يستطيع إثبات مختلف خطوة مسار و revision فحص بحث بعد إضافة دخول قد إتمام.

إتمام نتيجة دخول قائم bounded `coldLogMemo`.`StoredLog` حكم آخر حقل يأخذ قد إصدار current state و `PreparedStoredLog` قسم فتح، بعد من `publication` حقل يأخذ current logical events و مطابقة publication operation ربط، جعل query بعد ضيق وصل Agent resume إعادة استخدام نفس مرة Decode و migration.In-flight map فقط يملك تشغيل في عمل، لا هو ثاني عدد completed-result cache.

`SessionHandle.read()` سوف تقرير إبلاغ event value هو detached أيضا هو shared-frozen.JSONL backend في memo تحويل قبل فقط مقابل كل قد حل رمز event graph عميق درجة تجميد ربط مرة، و في هذا موضع بنية صنع `shared-frozen` نتيجة؛ لاحق قراءة و slice أي جعل لـ فارغ أيضا سوف إبقاء إنتاج من بناء قيام حالة.`readColdSessionLog()` سوف هذه event و محلي وحيد احتلال interrupted-turn closer تركيب، و عبر `SessionObservationReader` متابعة نقل تمرير `eventState`؛`Session.fromRestore()` فقط تحقق و وصل إدارة seed، لم يعد نسخ أو تجميد ربط. عادي create و fork seed متابعة استخدام defensive snapshot مسار.

Read-only restoration سوف تحقق Session runtime مباشر اعتماد event و settlement حقل، لكن لن توسيع كل واحد مقطع تضمين دخول صيغة Assistant stream.Publication Worker متابعة تنفيذ كامل stream replay، و في إيداع migrated successor قبل تحقق content،usage و replay state متسق صفة. قد لديه حالي صيغة ملف معلومة مهمة ذلك writer؛ حاجة توسيع compact stream consumer سوف في قراءة وقت تحقق record.

### Read handle تبديل

Current generation لا وجود وقت،read open سوف اعتماد في `state.primed` في حفظ prepared events handle. لاحق كل مرة `read()` كل إعادة تحليل current path:

```text
if current generation is absent:
  return slice of primed events
else:
  clear primed events
  read current generation and enforce non-shrinking history
```

لذلك، واحد قد لديه historical Session أيضا ممكن يجعل `resolveCurrentLog()` إرجاع `undefined`: هو عودة جواب هو current canonical file هل وجود، بينما لا هو Session هل يمكن قراءة. عام `stat` و `list` متابعة اكتشاف historical header.

### Write-open publication

Write open أولا أخذ نيل عملية داخل claim و داخل نواة دعم حمل عبر عملية lease، مجددا إعادة تحليل selected generation. إذا هو ما زال هو historical، حينئذ أخذ نيل أو إعادة استخدام prepared `StoredLog` و انتظار `publish()`. بعد عندئذ إرجاع بـ prepared events لـ primed state write handle.

```text
write open
  → claim process-local ownership
  → acquire SessionWriteLease
  → re-resolve generation
  → join or create preparation
  → encode + sync temp
  → Worker verify
  → source identity check
  → no-overwrite publish
  → return writable handle
```

Handle إرجاع قبل، خارجي caller لا يمكن append. لذلك `append`،`flush` و `close` إبقاء عادي current-generation سلوك، لا حاجة “publishing” فرع.Service `flush()` متابعة فقط flush قد adopt writer؛ هو لن يأخذ read-only preparation تحويل صار write.

### Follow و Agent promotion

`session.follow` عبر read path فتح تاريخ، استعادة Session و projections، إرسال خروج opening snapshot، لكن بعد بدء Agent promotion.Agent resume استخدام write open، لذلك سوف في Agent استقبال جديد واحد جولة محادثة قبل انتظار publication. تاريخ مرئي و كتابة حينئذ خيط يصبح اثنان عدد واضح وقت نقطة، معا لا جذب دخول unpublished append state.

## مشكلة و خطة مقابل وفق

| سلسلة سطر مسار مشكلة | تنفيذ آلية | حفظ إثبات |
|---|---|---|
| Read-only caller انتظار encode و verify | Read open إرجاع prepared events | أول شاشة فقط انتظار Decode + migration |
| تزامن historical open تكرار عمل | Session/source-revision keyed single-flight | كل selected revision فقط ترحيل مرة |
| رقم واحد caller يملك مشترك إلغاء | Caller-local `waitWithAbort()` + backend controller | مفرد عدد إلغاء لا إنهاء أخرى waiter |
| Query و resume بين فقد فقد preparation | Bounded memo في `PreparedStoredLog.publication` | Write open إعادة استخدام نفسه artifact |
| Read handle لا يوجد current path | Primed in-memory read | Publication قبل historical data يمكن قراءة |
| Read handle حاجة مراقبة لاحق append | إعادة resolve، و من primed data قطع إلى current file | Publication بعد قد لديه handle استلام جمع |
| Verify قبل append لا أمان | Write open إرجاع قبل إتمام publication | إرجاع writer قيام أي أداة تجهيز عادي durability |
| تلقائي خلفية publication بلا owner | فقط لديه write open استدعاء `publish()` | Read-only access لا إنتاج orphan write task |
| Reader قد يرى artifact بعد source تغيير | Publication فشل كما لا إعادة ركض migration | قد كشف منطق تاريخ لا يتم ساكن صامت استبدال |

## تحقق

Benchmark استخدام Stage قرار في نفس نسخة 116,228,655-byte v0 Zstandard Session. رقم واحد ورقة جدول مقارنة مقارنة migration عمل تعلق و الكل تنفيذ؛ لاحق ضبط درجة واضح دقيق فإن إبقاء #3585 و preparation-first استخدام نفس بند Codec/Stage chain، فقط تغيير persistence ضبط درجة.

### مستخدم أول مرة فتح تاريخ بيانات

| تنفيذ | Session restore | CPU | Peak RSS | Retained heap | نتيجة |
|---|---:|---:|---:|---:|---|
| أصل عال صفة قدرة v0 reader | 4.594s | 6.048s | 2.720GB | 2.016GB | لا ترحيل، قراءة نحو 914 ألف عدد v0 event |
| Master whole-artifact v0-to-v2 migration | >72.8s | — | Decode مرحلة مقطع بلوغ إلى حتى قليل 7.219GB | — | إرجاع handle قبل OOM |
| #3585 streaming migration + سلسلة سطر publication | 6.241s | 8.493s | 2.107GB | 477MB | توليد تزامن نشر يتضمن 72,784 عدد event v2 Session |
| #3586 preparation-first ضبط درجة | 2.954s | — | 1.026GB | 463MB | توليد نفسه v2 Session، و يأخذ publication تأخير متأخر إلى write open |

Preparation-first restore مقارنة #3585 سريع 53%، أيضا مقارنة أصل عال صفة قدرة reader سريع 36%، معا ما زال إتمام artifact إلى v2 migration.

### ضبط درجة مراقبة قياس نقطة

| مستخدم مراقبة قياس نقطة | سلسلة سطر publication | Preparation-first | تغير |
|---|---:|---:|---:|
| Read open + Session restore | 6.241s | 2.954s | -53% |
| `session.follow` opening snapshot | 7.587s | 2.912s | -62% |
| Agent نيل إلى writable Session | 6.246s | 5.161s | -17% |
| قد هو current v2 مجددا مرة فتح | 1.284s | 0.964s | -25% |
| Follow opening-snapshot peak RSS | 2.353GB | 1.059GB | -55% |

Preparation في نحو 2.61 ثانية لأجل Decode و migration. تأخير بعد publication نحو لـ 2.56 ثانية:encode/write/sync 0.83 ثانية، صارم إطار Worker verification 1.72 ثانية،source check و atomic publication نحو 0.005 ثانية.Read-only طلب تماما لا تنفيذ هذا مقطع publication.

Prepared artifact و Session restore peak RSS نحو لـ 1.03 GB.Preparation و Worker verification معا وجود وقت ذروة قيمة نحو 2.19 GB، لأن parent إبقاء logical artifact، بينما Worker مستقل تحقق physical generation.

اختبار تغطية shared-waiter cancellation،all-waiter cancellation،memo handoff،read-handle switching،source drift،winner collision،publication idempotence،write-open ordering،Worker failure و plain-Node bundled Worker entry.

## عاقبة

Read-only body access لا إصدار generation. رقم واحد writer سوف في append قبل دعم دفع مرة publication. قد إعداد JSONL root ما زال يجب يمكن قراءة كما بنية صالح، لكن historical body migration ذاته لا اشتراط كتابة successor.

Bounded memo سوف إبقاء واحد نسخة migrated event array، لأجل اتصال read و write open. هذا هو متعمد أخذ ترك: لا إبقاء هذا artifact حينئذ يجب تكرار Decode و migration، أو من لا يمكن رفع قبل توفير read.

Publication failure سوف رفض Agent resume و أخرى write open، لكن لن جعل قد من unchanged historical source تسليم read result بطلان.Source drift مقابل هذا write attempt هو terminal failure، لن إطلاق hidden state إعادة حساب.

Backend ما زال وجود واحد أكثر واسع عام قائم lifecycle نقص فتحة:dispose لا يملك كل بعد لم إرجاع handle `create()` أو `open()` operation. هذا قرار لن نحو `flush()` زيادة migration-specific tracking، أيضا لا حل قرار عام pending-operation مشكلة.

## اعتبار مرور بديل خطة

- **كل open كل إبقاء سلسلة سطر publication**——physical state الأكثر بسيط مفرد، لكن يجعل read-only أول شاشة كثير انتظار نحو 2.2 ثانية و اشتراط تخزين يمكن كتابة.
- **Read بعد تلقائي خلفية publish**——حاجة backend task ownership،shutdown quiescence،error reporting، و writer إضافة دخول واحد لا يوجد caller طلب مهمة.
- **Verify قبل إرجاع writer**——اشتراط append كتابة unpublished stage، و لـ قد وصل قبول حدث زيادة واحد نوع durability و failure state.
- **كل caller مستقل preparation**——تكرار الأكثر إعادة Decode و migration، و في list/follow/resume تزامن وقت وضع كبير ذروة قيمة داخل تخزين.
- **يجعل رقم واحد caller signal إلغاء مشترك عمل**——جعل لاحق caller اعتماد غير متصل cancellation timing.
- **Source drift بعد إعادة ركض migration**——ممكن استبدال قد عرض إعطاء reader تاريخ، أيضا سوف يجعل مرة منطق operation تكرار معالجة نفس كبير ملف.
- **Read handle دائم بعيد توقف إبقاء في primed memory**——لا يمكن مراقبة لاحق append، و انحراف مغادرة عادي persistence refresh سلوك.
