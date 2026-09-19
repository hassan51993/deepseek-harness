# Agent Note: قد إصدار Session صيغة عبر لديه حالة تدفق صيغة Stage ترحيل

Status: implemented

[English](2026-08-31-released-session-format-migrations.md) | العربية

## مشكلة

Session صيغة v0 قد مع alpha إصدار إصدار، لذلك بنية تحويل writer تغيير لا يستطيع مجددا يأخذ قد لديه JSONL عند عمل يمكن إسقاط مسبق إصدار حالة. رقم واحد إصدار whole-artifact migration يجعل هذه سجل في دلالة فوق يمكن ترحيل، لكن هو بيانات نموذج سوف يجعل واحد نسخة 116 MB حقيقي Session في إرجاع handle قبل استهلاك كل 16 GB Node عملية.

### Whole-artifact صفة قدرة مشكلة

- Zstandard إدخال يتضمن 317,540 عدد frame، كل frame كل مفرد وحيد تنفيذ مرة مختلف خطوة حل ضغط. تنفيذ أولا إبقاء الكل plaintext frame، مجددا في JSON تحليل قبل موحد واحد تجميع وصل، لذلك إنشاء نفس انتظار عدد كمية Promise، خط مسار حوض و native Decode ضبط درجة.
- Physical Decode سوف في نفس طلب إعادة تراكم مرحلة مقطع شيء تحويل كامل plaintext Buffer، كامل نص، الكل JSONL row، توسيع بعد source events، ترحيل بعد target events، تحرير رمز بعد target rows، تجميع وصل بعد هدف نص و هدف physical Buffer.
- كل codec و migration edge كل سوف استدعاء `snapshotSessionFormatJson()` أو `snapshotSessionFormatArtifact()`، في متبادل مجاور ترحيل قبل بعد تمرير عودة نسخ و deep freeze كامل header،row،payload و event array.
- قد إصدار packed Assistant chunk سوف أولا توسيع صار نحو 914 ألف عدد v0/v1 منطق حدث، مجددا من v1-to-v2 طي صار 72,784 عدد current events.Whole-artifact API اشتراط اثنان نوع يمثل و old-to-new seq map معا تخزين نشط.
- Encode سوف في داخل تخزين في بنية صنع كامل JSONL و ضغط إخراج. نجاح مسار مع بعد Decode staged target،Decode committed target، و من persistence مجددا Decode مرة بـ إنشاء عمل خدمة كائن؛ هو أيضا سوف كامل إعادة قراءة source بـ مقارنة مقارنة fingerprint.
- تدريجي frame `await` لا يوجد شكل صار متعمد معنى محدود ضبط درجة. ترحيل قبل عال صفة قدرة reader سوف إعادة استخدام واحد تزامن decoder، فقط من خارج طبقة حلقة نحو كل 500 ms yield مرة، من بينما تجنب تجنب عدد عشرة ألف مرة مختلف خطوة تبديل.

### قائم واجهة جعل مفرد نقطة أفضل تحويل لا يمكن تركيب

`SessionFormatCodec` بـ كامل عدد مجموعة Decode و Encode؛ كل بند متبادل مجاور `SessionFormatMigration` استقبال و إرجاع كامل `SessionFormatArtifact`؛compiled chain فقط قدرة يأخذ قد شيء تحويل artifact تسليم إعطاء تحت واحد بند edge. لذلك أي جعل physical decoder مفرد نقطة تغيير سريع، تحت تنقل ما زال سوف إعادة إنشاء source-row array،expanded-event array، تدريجي edge snapshot و target-row array.

Migration فعلي لديه حالة، لكن API يأخذ هو جمع جدول الآن لـ مرة صفة دالة.v0-to-v1 حاجة تتبع أثر message و retry identity؛v1-to-v2 حاجة مؤقت تخزين واحد بعد لم تسوية Assistant attempt، يتم هو منع سد لاحق حدث، و صيانة old-to-new seq مرجع. يأخذ هذه حالة إخفاء في closure أو push/finish helper object في، سوف يجعل تشغيل بنية و ساكن حالة إعلان قسم مغادرة، أيضا يجعل production،Worker verify،fixture و replay استخدام مختلف مدخل.

## قرار

Session format حزمة اعتماد لديه حالة تزامن Stage API. ساكن حالة migration declaration وصف واحد بند متبادل مجاور إصدار حافة، و لـ كل مرة artifact restore إنشاء جديد stage.Stage يملك هذا artifact متغير حالة؛ مختلف Session بين أبدا مشترك stage instance.

### Stage و Context بروتوكول

```text
interface SessionFormatMigrationContext {
  emitEvent(event: SessionFormatEvent): void
  emitRun(run: SessionFormatEventRun): void
}

interface SessionFormatMigrationStage {
  readonly headerInheritedEventCount?: number
  transformEvent(
    event: SessionFormatEvent,
    context: SessionFormatMigrationContext,
  ): void
  transformRun(
    run: SessionFormatEventRun,
    context: SessionFormatMigrationContext,
  ): void
  finish(context: SessionFormatMigrationContext): number
}
```

`SessionFormatMigrationContext.emitEvent()` و `emitRun()` كل هو تزامن عملية.Producer سوف إعلان ذلك إرسال خروج مفرد عدد حدث أيضا هو ضيق تجميع run، لذلك حار مسار لن أصل حسب قد تحليل ملف كائن خاصية دفع قطع صنف آخر. ضبط درجة عودة caller كل،context في كل مرة استدعاء وقت نقل دخول، بينما لا هو يأخذ callback حقن stage constructor. واحد إدخال يمكن إخراج صفر عدد، واحد أو كثير عدد قيمة، لا حاجة قسم إعداد مؤقت إرجاع عدد مجموعة، أيضا لا حاجة stage داخلي إبقاء إخراج طابور صف.

`SessionFormatMigration` متابعة بصفة immutable declaration، إعلان رقم الإصدار،header migration،target-header validation و `createStage()`.`CompiledSessionFormatChain` فقط تحقق مرة وحيد، بلا نقص فتحة edge تسلسل، حسب source-to-target ترتيب إنشاء كل مرة artifact وحيد احتلال stage، مجددا حسب عكس جهة نحو استخدام context اتصال هو جمع.`finish()` حسب source-to-target ترتيب إغلاق stage، جعل كل واحد درجة كل قدرة في تحت تنقل إغلاق قبل إرسال خروج ذيل جزء بيانات.

```text
JSONL record
  → released physical row decoder
  → v0-to-v1 stage
  → v1-to-v2 stage
  → v2-to-v3 stage
  → current event collector
```

Chain في لا وجود `flatMap`،spread expansion، في بين event array أو scheduler. فقط لديه في كل migration stage كل قد نيل نيل مباشر إزالة استهلاك compact run آلة سوف بعد، نهائي event collector عندئذ سوف توسيع هو.

### متبادل مجاور إصدار كل حق

[V2 إلى V3 إلقاء تمرير حفظ حماية](../../../../packages/session/session-format-v2-to-v3/README.zh.md#delivery-guards) منع توقف مصدر بديل في يتم تجاهل اختصار علامة فقط بسبب رأس جزء تغير حينئذ يصبح صالح فوق نقل ماء موضع.Python إصدار خطر دخان اختبار مستقل في عبر بديل golden مقارنة مقارنة، حسب مصدر شفرة في `SESSION_FORMAT_VERSION` فحص توليد سجل، لذلك ملف اسم و header ذاتي توافق لا يستطيع إخفاء غطاء مرور مدة writer.

[V2 إلى V3 README](../../../../packages/session/session-format-v2-to-v3/README.zh.md#v2-to-v3-specification) هو هذا ترحيل حافة تحويل، إبقاء و رفض قاعدة مفرد واحد مواصفة حق مصدر؛ مفرد صف[أصلي دقيق دخول فصل عقدة](../../../../packages/session/session-format-v2-to-v3/README.zh.md#native-v3-admission) تجنب تجنب سوف فقط حالي إصدار دعم حمل قدرة خطأ إقرار لـ تاريخ تحويل. قد إصدار V2 codec ما زال عودة V1→V2 كل، و يتم إعادة استخدام بينما غير نسخ.[توجيه النظام](2026-09-02-system-prompt-as-surface-node.zh.md) ،[PTC](../feature/2026-06-15-ptc.zh.md) و[مواصفة معلومة غلاف](2026-09-06-v3-canonical-session-envelopes.zh.md) سجل إبقاء كل منها مستقل اعتماد حسب، بينما غير تكرار تحويل مواصفة.[صيغة إصدار فعلي تشغيل يد سجل](../../../../docs/cookbook/adding-a-session-format-version.zh.md) مسؤول حزمة وصل خط، حالي مستهلك، لقطة بعد استمرار بديل حد و تحقق أمر.

تاريخ محتوى دقيق دخول عودة دخول حافة كل، بينما غير أصلي V3 توسيع تحقق. في لا حل حقل حال حال تحت إبقاء لم معرفة كتلة، لا يستطيع إثبات ترحيل إبقاء ذلك يحتوي معنى. لذلك،[مصدر مراجعة حساب](../../../../packages/session/session-format-v2-to-v3/README.zh.md#source-audit) في واضح عودة ذلك كل محتوى موضع (يشمل لم إتمام تدفق) استخدام نفس تاريخ نوع صنف تجميع دمج. هو فحص قد وصل قبول محتوى بينما لا تعديل كتابة، و كما لا حل تفسير عودة أخرى كل من كل لا نفاذ واضح JSON. استلام ضيق أصلي دقيق دخول أو تعديل تجميد ربط قبل بديل تحقق جهاز، سوف تغيير مستقل تحمل وعد، بينما غير إثبات تحويل أمان.

مسبق ضبط أكثر اسم تغطية إنشاء رأس جزء و كل بند اختيار حدث، لأن الأكثر جديد اختيار قرار استعادة وقت مسبق ضبط، بينما أكثر مبكر اختيار قرار تاريخ fork مسبق ضبط. فقط تعديل كتابة الأكثر بعد واحد بند اختيار سوف فقد فقد هذا نوع منطقة آخر. قد إصدار `code` معرف يمثل قديم داخل وضع مسبق ضبط؛ ترحيل لا اعتماد قد تثبيت مسبق ضبط قائمة، لذلك نفسه بايت في كل منصة رئيسي آلة فوق إنتاج نفسه نتيجة. أصلي V3 ذاتي تعريف معرف ما زال يمكن استخدام، بلا حاجة عام وقت التشغيل آخر اسم.

مصدر وراثة عدد كمية في EOF قبل ممكن لم معرفة:V2 من نوع فرعي علامة دفع توجيه هو، بينما V1→V2 يمكن تغيير حدث عدد كمية. ترحيل سلسلة سوف هذا نوع ناقص نقل تمرير إعطاء تحت واحد Stage، بينما لا زائف صنع عدد كمية.[V2 إلى V3 وراثة قاعدة](../../../../packages/session/session-format-v2-to-v3/README.zh.md#sequence-references) دعم حمل هذا حال حال؛ حاجة header توفير عدد كمية قديم Stage ما زال في عدد كمية ناقص وقت رفض. هذا جعل لديه نوع فرعي كثير قفز استعادة بلا حاجة إبقاء في بين ناتج عدد مجموعة.

[إصدار و إصدار حالة مشاركة اعتبار](../../../../docs/session-format-status.zh.md) يملك قد إصدار صيغة سجل، و إشارة واضح شفرة في كتابة جهاز حق مصدر. قد إصدار صيغة إبقاء ذلك دلالة؛ ترحيل خلال قد إيداع بديل حد بايت إبقاء ثابت. لاحق بنية صفة تغيير يجب حسب[إصدار قاعدة](2026-08-10-session-log-version-mechanism.zh.md) إضافة تحت واحد بند متبادل مجاور ترحيل حافة، بينما غير تعديل قد إصدار تحويل. عادي حدث إضافة جديدة التزام دوران هذا قاعدة مطلوب حدث رفض آلية، بينما غير تلقائي قسم إعداد إصدار. حالي صيغة ملف لن إعادة تنفيذ دخول حافة ترحيل؛ اختبار تكامل استخدام عزل، يمكن إسقاط home و لم تغيير تاريخ إدخال.

[قد إيداع لغة مادة بيان](../../../../packages/test-support/llm-replay/tests/session-format-corpus-inventory.ts) حسب مصدر مسار، بديل حد و دقيق رفض سبب معرف متعمد لا دعم حمل تاريخ تحويل. إبقاء هذه ناتج لا يستطيع إجبار جعل ترحيل تغيير وقت ترتيب، أيضا لا يستطيع سماح موحد واحد قفز مرور: كل بيان في ناتج ما زال يجب رمي خروج نوع تحويل ترحيل رفض، لم صف دخول ناتج يجب أيضا أصل. أصلي حالي بديل حد fixture لا مرور مرور دخول حافة، لذلك لا يستطيع يتم عودة لـ لا دعم حمل. لا يوجد إصدار header اختبار إطار هيكل بروتوكول عرض مثال إبقاء لـ مستقل صريح صنف آخر. لغة مادة اختبار في أيضا أصل نجاح و رفض بعد كل فحص مصدر بايت؛ هو لا عبر تعديل كتابة تاريخ دليل قدوم ممتلئ كاف حالي reader.

### Physical codec و packed run

كل released codec سوف استخدام صريح `strict` أو `recoverable` سياسة إنشاء row decoder.Decoder كل مرة عبر مختلف context طريقة تحقق و emit واحد event أو codec-owned `SessionFormatEventRun`.v0-to-v1 و v1-to-v2 كل تنفيذ `transformEvent()` و `transformRun()`، لذلك packed Assistant chunk يمكن مباشر وصول folding edge، بلا حاجة أولا تغيير صار عدد مئة ألف عدد عادي حدث.

v0-to-v1 حذف لديه حد released-v0 عودة واحد تحويل خارج، سوف إبقاء منطق header،seq، مرجع، ختم الوقت و payload. هو تحويل قد إزالة `steering/message` و `compact/*` حدث اسم، قبول ظهور في مقابل `step/end` بعد قد إصدار `llm/retry`، حسب turn/step/provider/policy chain لـ ناقص `llm/retry.retryId` تحديد صفة تكملة قيمة، و لـ حذف id قديم compaction group تحديد صفة تكملة ملء نفس عدد `compactionId`.v1-to-v2 مسؤول attempt folding و مرجع إعادة كتابة، و كما فقط emit قد تسوية v2 event. هو سوف يأخذ قديم goal مصدر user message تفكيك صار `goal/change` و أصل هذا نموذج مرئي message. هو أيضا سوف لـ واحد نوع لديه حد قد إصدار restart إدراج دخول interrupted `turn/end`: واحد لا يوجد open step open turn بعد ظهور غير فارغ `next-turn` inbox splice، مع بعد مباشر بدء تحرير رقم وصل متابعة تحت واحد جولة.

Catalog لـ production،Worker،fixture و replay كشف نفس عدد `createRestore()`.Recovery policy و نهائي validation policy في restore إنشاء وقت مرة تحديد.Historical production استخدام recoverable source parsing و transformed-current validation؛ هذا نوع سياسة سوف في ترحيل بعد تحقق قد إصدار current نتيجة، بينما قد هو current إدخال فقط قبول codec تحقق.Worker و fixture verification استخدام strict parsing و قد تثبيت current صيغة كامل restoration.Migration stage أو transformed-current validation رفض سوف إبقاء لـ `SessionFormatUnsupportedMigrationError`؛ شيء إدارة حل رمز فشل ما زال هو corruption.Test support فقط إبقاء fixture ذاته حاجة token و envelope materialization.

### JSONL سلسلة ربط

JSONL provider فقط مسح مرة frame boundary، إعادة استخدام واحد Zstandard decoder، زيادة كمية تحليل كامل JSONL record، و يأخذ row مباشر إرسال دخول catalog restore. خارج طبقة حلقة حسب محدود cadence yield؛ لا وجود تدريجي frame `await`، كامل plaintext أو source-row array.

Current encode بـ مفرد بند record لـ مفرد موضع.Provider في رئيسي خط مسار كل slice تسلسل تحويل نحو 1 MiB plaintext، عبر واحد سوف نقل بث source error Zstandard context تدفق صيغة ضغط، بـ 4 MiB batch كتابة نفس دليل ترتيب هو إنشاء مؤقت ملف، و في publication قبل sync. عملية درجة scheduler الأكثر كثير سماح اثنان عدد كامل verification Worker و سطر، و يأخذ تحرير permit مباشر تسليم إعطاء الأكثر مبكر waiter.

إصدار `lib/worker.cjs` سوف JavaScript workspace اعتماد واحد بدء تحزيم، جعل كل جديد verifier بلا حاجة تحليل و تحرير ترجمة هو جمع وقت التشغيل وحدة رسم.Worker فقط عبر عادي request/result رسالة عبر معلومة، و host لا مشترك service أو class identity، لذلك يمكن هذا مثال معالجة.Host build تطبيق قائم TypeScript و Typert تحويل؛Client pass قفز مرور هذا عدد Node-only package، لن استخدام لم مرور تحويل مصدر شفرة تغطية worker.Native add-on إبقاء external.Verification،scheduler admission،termination و durable publication ما زال في writable open إرجاع قبل إتمام.Built-worker خطر دخان اختبار يأخذ package manifest و worker نسخ إلى عزل مؤقت package، إزالة بيئة في وحدة بحث مسار، قبول صالح generation، و رفض خطأ event count.

Preparation سوف يأخذ cancellation نقل إعطاء source read، و في قائم نحو 500 ms Decode yield حد مراقبة هو.`publish()` واحد حالما بدء،encode،Worker verification و publication لا استقبال caller cancellation، و تشغيل إلى نهاية حالة؛write open سوف في بعد مجددا مرة فحص caller signal. قد إصدار generation أبدا سوف تراجع.

Stage pipeline إنهاء في واحد نسخة prepared current artifact.[تاريخ Session فقط قراءة ترحيل دقيق تجهيز](2026-09-05-read-only-session-migration-preparation.zh.md) تعريف read open مثل أي قيام أي إزالة استهلاك هذا artifact، و write open مثل أي في إرجاع append إذن قبل إتمام encode،verification و publication.

### Durable format و publication قاعدة

مواصفة ملف اسم تحرير رمز physical format generation:v0 استخدام `session.jsonl[.zstd]`، صحيح generation استخدام `session.vN.jsonl[.zstd]`.Migration لن نقل حركة، تغطية أو حذف أي committed generation، و كما فقط كتابة نهائي current target؛ في بين إصدار فقط وجود في stage state.

POSIX publication استخدام hard-link creation إضافة دليل sync؛Windows استخدام no-overwrite،write-through `MoveFileExW`. قد لديه target فقط لديه في ذلك قد تحقق migration prefix انتظار في staged bytes وقت عندئذ سوف يتم قبول؛ أي append tail كل يخص current-generation reader، بينما لا هو migration winner verification.

قائم write handle متابعة استخدام عملية داخل claim و داخل نواة دعم حمل عبر عملية `SessionWriteLease`. فقط header `stat` و `list` يمكن تحويل تلقي دعم حمل تاريخ header، لكن لا فتح body، أيضا لا إصدار generation.Projection-cache record سوف يأخذ fold ربط إلى Session header format version، جعل cache row لا يستطيع التفاف مرور تغيير event أساس عدد migration.

## مشكلة و خطة مقابل وفق

| Whole-artifact مشكلة | تنفيذ آلية | نتيجة |
|---|---|---|
| كل Zstandard frame مفرد وحيد مختلف خطوة Decode | واحد يمكن إعادة استخدام decoder؛ خارج طبقة 500 ms ضبط درجة cadence | حذف 317,540 مرة مختلف خطوة تبديل |
| كامل plaintext،string و row array | زيادة كمية JSONL parser و row decoder | فقط إبقاء واحد بند عبر chunk ناقص سطر |
| كل بند edge بين كل شكل صار كامل event array | Context مباشر وصل لديه حالة stage | لا إبقاء في بين إصدار event array |
| Packed chunk في folding قبل كامل توسيع | `SessionFormatEventRun` و `transformRun()` | بلا حاجة شيء تحويل 914 ألف source events |
| كل بند edge كل whole-artifact snapshot/deep freeze | Stage-owned وحيد احتلال قيمة و نهائي validation | حذف تكرار تمرير عودة نسخ و تجميد ربط |
| One-shot migration function إخفاء حالة | Immutable declaration إنشاء كل مرة artifact وحيد احتلال stage class | حالة ownership و تزامن علاقة صريح تحويل |
| Bulk current encode بنية صنع كامل string/Buffer | مفرد بند record encoder،1 MiB input slice،4 MiB write batch | حد قسم إعداد و رئيسي خط مسار slice |
| رئيسي خط مسار تكرار تنفيذ كامل verification | الأكثر كثير اثنان عدد complete-generation Worker | Verification CPU لا احتلال استخدام رئيسي خط مسار |
| Production و fixture استخدام مختلف migration API | Catalog `createRestore()` إضافة صريح policy | فقط إبقاء واحد طقم decoder/chain تنفيذ |

## تحقق

ترحيل مواصفة اشتراط قسم آخر توفير تحويل، إبقاء و رفض دليل. مباشر ترحيل حافة و أصلي V3 اختبار لا يستطيع إثبات لديه نوع فرعي كثير قفز إصدار: قبل بديل assistant تدفق طي سوف في V3 إدراج دخول نظام حدث قبل تغيير مصدر جلوس علامة. لذلك، مرور مرور حقيقي دليل و JSONL مزود اختبار حاجة أصلي و ضغط V0/V1 إدخال، خريطة بعد مرجع و وراثة قطع نقطة، إصدار/إعادة فتح انتظار قيمة صفة، قبل بديل بايت ثابت، و لا إنتاج في بين بديل. نسبة التغطية مئة قسم مقارنة ذاته لا يستطيع إثبات هذه عبر مرحلة مقطع علاقة؛ تركيب تأكيد يجب مقارنة مقارنة نتيجة تاريخ و رفض فاعلية نتيجة.

محتوى دقيق دخول دليل يجب تغطية مواصفة صف خروج كل موضع، تضمين طقم نتيجة، لم إتمام بدء بداية سجل و معروف نوع صنف شاذ شكل كتلة، و تحقق تشخيص استخدام مصدر جلوس علامة. نجاح ترحيل يجب إبقاء قد وصل قبول محتوى و لا نفاذ واضح قيمة. مرور حقيقي حفظ دائم مسار رفض وقت، يجب إبقاء مصدر ثابت كما لا إصدار بعد استمرار بديل. أصلي V3 اختبار يجب مستقل إثبات اثنان نوع دليل تحقق سياسة متساو إبقاء توسيع دقيق دخول؛ تاريخ رفض لا يستطيع إثبات أصلي إدخال أيضا يتم رفض.

### Benchmark إدخال و فتحة مسار

Benchmark استخدام Node v24.18.0 و واحد نسخة 116,228,655-byte v0 Zstandard سجل، منها يتضمن 317,540 عدد frame و 454,151 عدد physical row. قديم reader سوف استعادة 9,143,111 عدد توسيع بعد v0 event؛migration سوف توليد 72,784 عدد current v2 event،artifact SHA-256 لـ `fa16ff9472ca350595a3112c20a3db79655bc2673973469987ecaf2a57ebd17c`.

كل مثال هذا متساو عبر plain Node تشغيل build artifact، كل مثال هذا استخدام مستقل عملية،V8 heap limit لـ 16 GB.“Retained heap” يمثل restored Session ما زال تخزين نشط وقت قوي صنع GC بعد heap. حذف لا يمكن نيل إلى handle whole-artifact فشل خارج، تحت جدول استخدام ثلاثة مرة تشغيل في موضع عدد.

### Physical Decode

| بيانات مسار | Decode استهلاك وقت | ذروة قيمة RSS | ضبط درجة |
|---|---:|---:|---|
| Migration قبل عال صفة قدرة reader | 1.553s | 916MB | واحد decoder؛ خارج طبقة yield 2–3 مرة |
| Whole-artifact migration | 7.527s | 7,219MB | 317,540 مرة async decoder استدعاء |
| Streaming Stage مسار | 1.467s | 908MB | واحد decoder؛ خارج طبقة yield 2 مرة |

### تاريخ ملف أول مرة بارد فتح

| إصدار | Session restore إتمام | CPU وقت | ذروة قيمة RSS | Retained heap | Restore event عدد | نتيجة |
|---|---:|---:|---:|---:|---:|---|
| Migration قبل عال صفة قدرة v0 reader | 4.594s | 6.048s | 2.720GB | 2.016GB | 9,143,111 | قراءة v0، لا ترحيل |
| Whole-artifact migration | >72.8s | — | Decode مرحلة مقطع قد ≥7.219GB | — | — | إرجاع handle قبل OOM |
| Streaming Stage migration + سلسلة سطر publication | 6.241s | 8.493s | 2.107GB | 477MB | 72,784 | إصدار و فتح v2 |

قديم reader مرة صفة wall time أكثر منخفض، لأن هو لا فعل صيغة تحويل و durable publication؛ معا هو سوف معتاد إقامة 914 ألف event يمثل.Stage مسار فقط كثير دعم دفع مرة encode و verification، مع بعد إبقاء طي بعد v2 state.

### Current-format بارد فتح

| إصدار قراءة ذاتي ذات current format | Session restore إتمام | ذروة قيمة RSS | Retained heap |
|---|---:|---:|---:|
| قديم reader قراءة v0 | 4.594s | 2.720GB | 2.016GB |
| Whole-artifact وقت بديل reader قراءة v2 | 1.273s | 1.107GB | 476MB |
| Streaming Stage reader قراءة v2 | 1.284s | 1.109GB | 476MB |

Current-v2 سريع مسار إبقاء صفة قدرة انتظار قيمة. هيكل بنية تعديل صنع لن يجعل current data دخول historical stage.

### Streaming سلسلة سطر migration قسم مقطع

تحت جدول سجل هذا Stage قرار قياس كمية سلسلة سطر open مسار. حالي preparation-first ضبط درجة و ذلك قياس كمية من[تاريخ Session فقط قراءة ترحيل دقيق تجهيز](2026-09-05-read-only-session-migration-preparation.zh.md) سجل.

| مرحلة مقطع | في موضع استهلاك وقت |
|---|---:|
| Source Decode + migration | 2.784s |
| Encode + write + sync | 0.956s |
| staged ملف كامل Worker verify | 1.415s |
| Source recheck + no-overwrite publication | 0.106s |
| committed-prefix verify + header reopen | 0.046s |
| Generation ensure-current مجموع حساب | 5.318s |
| Persistence مراقبة إلى نهائي current Decode | 0.620s |
| Session restore | 0.594s |
| طرف إلى طرف Session restore إتمام | 6.241s |

Generation قسم مقطع و طرف إلى طرف بيانات قدوم ذاتي مختلف instrumented run، لذلك أربعة ترك خمسة دخول بعد كل سطر لا اشتراط دقيق متبادل إضافة.

Format،catalog،edge،JSONL،fixture،replay و built-Worker اختبار تغطية اثنان نوع تحرير رمز،packed run، فقط header تصنيف،torn tail،migration refusal، تحديد صفة legacy normalization،source change،target collision،write lease و Worker failure.

## عاقبة

نهائي current-event array ما زال غير ممكن إزالة حذف، لأن Session restore و Agent تنفيذ حاجة كامل تاريخ.Stage هيكل بنية حذف كامل source و في بين target array، لكن لا تحمل وعد داخل تخزين و قسم صفحة نافذة كبير صغير صار صحيح مقارنة.

حل رمز بعد مفرد بند `assistant/chunk` سوف قبول envelope تحقق و نهائي target تحقق، لكن ذلك كامل تجميد ربط v1 source payload عضو تحقق ما زال موضع في تأجيل حالة، لأن هذا بند تدريجي حدث فحص سوف إظهار بارز أثر قد إصدار سجل Decode و migration استهلاك وقت.Packed Assistant run ما زال قبول صارم إطار حل رمز. فقط لديه صفة قدرة دليل جدول واضح لن كسر تالف هذا ترحيل مسار قد قياس جدول الآن وقت، عندئذ قدرة استعادة مفرد بند chunk تحقق.

Read-only access سوف في durable publication قبل إزالة استهلاك Stage نتيجة؛write open فإن إعادة استخدام نفس نتيجة، و في append قبل انتظار publication.Persistence ضبط درجة ما زال و format pipeline متبادل متبادل مستقل.

منخفض generation لـ operator فحص بينما إبقاء.Retention لا تحمل وعد downgrade compatibility،automatic fallback، أيضا لا حفظ إثبات قديم runtime قدرة أمان إدارة حل جديد generation.

## اعتبار مرور بديل خطة

- **فقط أفضل تحويل Zstandard Decode**——يمكن استعادة physical Decode سرعة درجة، لكن source rows،expanded events،snapshot،intermediate artifact و bulk encode ما زال سوف إبقاء في داخل تخزين في.
- **تزامن Generator stage**——كل yield كل سوف إبقاء تنفيذ لقطة و batch. حقيقي سجل قياس كمية جعل migration أكثر بطيء، و يجعل migrate-complete RSS من نحو 1.0 GB زيادة طويل إلى نحو 1.2 GB.
- **كل stage إرجاع عدد مجموعة**——فقط هو إعطاء قديم allocation، مرة تاريخ و flattening cost تبديل اسم حرف.
- **Stage داخلي إخراج طابور صف**——زيادة drain،EOF و error ownership، معا ما زال سوف إبقاء في بين قيمة.
- **عبر constructor حقن emit callback**——إجبار جعل chain عكس نحو بناء أو جذب دخول partially connected lifecycle. عملية وقت نقل context يمكن يجعل stage construction لا اعتماد تحت تنقل wiring.
- **عام إعادة استخدام لديه حالة codec instance**——سوف يجعل مختلف Session pending attempt،mapping و counter متبادل متبادل تلوث صبغ.
- **حفظ دائم كل في بين صيغة إصدار**——إنتاج لا يوجد runtime consumer durable state؛ فقط حاجة دقيق source و نهائي current generation.
- **يجعل mounted plugin تسجيل migration**——جعل تاريخ يمكن قراءة صفة اعتماد نشر.Static catalog يجب في feature plugin تركيب قبل استعادة قد إصدار صيغة.
