# Agent Note: سوف `dsh-fs-observation-policy` تعديل لـ حدث بوابة إضافة، بينما غير طريقة واجهة

Status: implemented

[English](2026-06-26-file-context-as-event-gate.md) | العربية

## مشكلة

[تفكيك قسم نظام الملفات seam Agent Note](../simplification/2026-06-26-fsspec-style-fs-seam.zh.md) في موجه إلى نموذج أداة و `ctx.fs` مزود بين وضع وضع `ctx.fileContext`:`dsh-tool-fs` حقن `fileContext`، و سوف كل مرة `read`/`write`/`edit` توجيه إلى هو طريقة. هذا جعل نيل `fileContext` **يقع في صلة مفتاح مسار فوق كما غير ممكن حذف**. أداة لا مرور مرور هو حينئذ لا يمكن وصول `ctx.fs`، سياسة طبقة كف تحكم حال fs I/O و قراءة نافذة، بينما واحد لا حاجة مراقبة قياس حالة سياسة نشر أيضا لا يمكن بسيط مفرد أرض إزالة هذا حزمة——`dsh-tool-fs` سوف بسبب لا يمكن تحليل `ctx.fileContext` بينما فشل.

هذا يأخذ ثلاثة عنصر هذا ينبغي يمكن قسم مغادرة أمر حال اقتران دمج في واحد بدء:

1. **أداة فعل ماذا**——تحليل مسار، قراءة نافذة، كتابة/تحرير ملف. هذا هو أداة مسؤولية، فقط حاجة `ctx.fs`.
2. **جديد طازج درجة/مراقبة قياس سياسة**——«تحرير قبل يجب أولا قراءة» ، «كتابة/تحرير يجب أساس في أنت قراءة إلى إصدار». هذا هو `dsh-fs-observation-policy` إضافة مسؤولية.
3. **مراقبة قياس حالة سجل**——واحد فرعي أثر، دائم بعيد لا ينبغي منع توقف أداة صحيح معتاد تشغيل.

من في أداة استدعاء هو `fileContext` طريقة، إزالة سياسة طبقة حينئذ هو واحد كسر تالف صفة تغيير، بينما غير أفضل أنيق أرض فقد ذهاب واحد*مرفق إضافة*قدرة. سياسة طبقة مقابل أداة تشغيل هو تحمل إعادة صفة، بينما غير اختياري استلام ضيق.

## قرار

عكس تحويل تحكم تدفق.**`dsh-tool-fs` يصبح منفذ، مباشر استدعاء `ctx.fs`**؛**`dsh-fs-observation-policy` يصبح باب تحكم + سجل إضافة**، عبر حدث مشاركة و، من لا عبر أداة استدعاء طريقة، أيضا لا تسجيل `ctx.fileContext` خدمة.

```text
tool          dsh-tool-fs       executor: resolves, reads windows, writes/edits via ctx.fs;
                                emits fs policy events; renders results
policy        dsh-fs-observation-policy  plugin: listens to fs/write-intent +
                                fs/edit-intent (single-slot waterfall) and fs/observed
                                (emit) events; adds observed-state + freshness.
provider contract dsh-fs            ctx.fs: text IO + ATOMIC mutation primitives whose version
                                guard is OPTIONAL; owns the fs policy event vocabulary
provider      dsh-fs-local      local implementation of ctx.fs
```

هذا نموذج هو تراكم إضافة صيغة: عار `ctx.fs` تنفيذ أصل فرعي تحويل، بلا قيد نص I/O، بينما `dsh-fs-observation-policy` تراكم إضافة مراقبة قياس حالة، أولا قراءة بعد تحرير و إصدار حراسة حماية. لذلك إزالة سياسة طبقة بعد أداة ما زال متاح، فقط هو لا تلقي قيد. صحيح صيغة إصدار agent(ذكي جسم) إعداد سوف تحميل سياسة؛ عار نمط وجود هو لـ يجعل سياسة في خدمة حد إبقاء اختياري، بينما غير بصفة صحيح معتاد نشر وضع حالة.

[نظام الملفات ناقص مراقبة قياس لاحق قرار](../../archived/bug-fix/2026-08-09-filesystem-absence-observation.md) يأخذ سجل تحميل حمل من فقط يمثل نجاح إصدار دقيق تحويل لـ صريح وجود/ناقص حالة، و اشتراط حمل منع حماية إنشاء بـ لا استبدال طريقة إصدار. حدث باب تحكم ملكية و بلا I/O سياسة حد إبقاء ثابت.

`dsh-tool-fs` لم يعد حقن `fileContext`. هو حقن `fs` و `tools`/`systemPrompt`.

## سياسة من مزود CAS قوي صنع تنفيذ، بينما غير `dsh-fs-observation-policy` stat

`dsh-fs-observation-policy` قوي صنع تنفيذ «أنت يجب أساس في أنت قراءة إلى إصدار قدوم كتابة/تحرير» ،**ذاته من لا استدعاء `stat` أو مقارنة مقارنة إصدار**. هو سوف مراقبة قياس إلى إصدار بصفة CAS أساس دقيق توفير، يجعل مزود mutation قرب حد منطقة فحص قياس قديم قديم صفة:

- «هذا كل من الأكثر قريب مراقبة قياس إلى ماذا؟» هو `dsh-fs-observation-policy` في محلي قرار وحيد أمر بند——مرة `WeakMap` فحص بحث، بلا I/O. بلا سجل يمثل لم رؤية؛ ناقص سجل فقط سماح حمل منع حماية إنشاء؛ وجود سجل يحمل استبدال/تحرير أساس دقيق.
- «إصدار هل ما زال صالح، أو من إنشاء هدف هل ما زال ناقص؟» من**مزود أصل فرعي تغيير حد داخلي**قرار.`dsh-fs-observation-policy` توفير `replaceIfVersion` أو `createIfAbsent`؛ مقابل في قد تغير إصدار، مزود رمي خروج `FS_STALE_VERSION`؛ حمل منع حماية إنشاء إذا فشل إعطاء آخر عدد إنشاء من، فإن رمي خروج `FS_NOT_OBSERVED`.

هذا هو متعمد لـ لـ. إذا `dsh-fs-observation-policy` في ذلك waterfall(شلال نشر صيغة حدث) معالج في stat و مقارنة مقارنة إصدار، هذا فحص و أداة فعلي كتابة بين سوف وجود TOCTOU بين فجوة——ملف ممكن في هذا خلال تغير، لذلك هذا فحص فقط هو واحد وهمي زائف حفظ إثبات، مزود قفل بلا نقاش مثل أي كل يلزم التقاط قاع. سوف إصدار فحص وضع في مزود قرب حد منطقة في حيث بلا تنافس حالة أيضا بلا مقدار خارج `stat`. الذي بـ `dsh-fs-observation-policy` **لا فعل**أي نظام الملفات I/O؛ «يجب أساس في الأكثر قريب مرة قراءة» حفظ إثبات من CAS *تنفيذ*،`dsh-fs-observation-policy` فقط مسؤول اختيار أساس دقيق (`vObserved`) و مقابل أولا قبل مراقبة قياس إجراء باب تحكم.

## مزود اتفاق تغيير: إصدار حراسة حماية تغيير لـ اختياري

لـ جعل عار مزود لا تلقي قيد، ذلك اثنان عدد mutation فوق إصدار حراسة حماية تغيير لـ**اختياري**——نقل دخول فإن حراسة حماية، حذف فإن بلا شرط تنفيذ:

```ts ignore-check
// writeText: expected is now optional. The FsWriteIntent union is UNCHANGED.
writeText(target: FsTarget, content: string, expected?: FsWriteIntent, signal?: AbortSignal): Promise<FsWriteOutcome>
//   undefined          → unconditionally create-or-overwrite (bare default)
//   createIfAbsent     → create only, reject an existing file (dsh-fs-observation-policy, unobserved)   [unchanged]
//   replaceIfVersion   → overwrite only at the observed version, else FS_STALE_VERSION    [unchanged]

// editText: expected becomes optional (was the required { version: FsVersion }).
editText(target: FsTarget, edit: FsEditRequest, expected?: { version: FsVersion }, signal?: AbortSignal): Promise<FsEditOutcome>
//   undefined    → unconditionally replace literal text in the current content (bare default);
//                  a missing target still reports FS_STALE_VERSION
//   { version }  → edit only at that version, else FS_STALE_VERSION (the current behavior)
```

`FsWriteIntent` ربط دمج نوع ذاته ثابت——رقم ثلاثة نوع «بلا شرط» حالة عبر*حذف* `expected` قدوم جدول بلوغ، لذلك اثنان عدد mutation مشترك نفس نوع مقابل تسمية شكل حالة (`expected?`: حذف = بلا حراسة حماية، نقل دخول = لديه حراسة حماية). هذا مقابل `dsh-fs-observation-policy` استخدام لديه حراسة حماية مسار إبقاء تماما نحو بعد توافق؛ فقط لديه قبل غير ممكن قدرة ظهور «بلا حراسة حماية» حال حال هو إضافة جديدة، كما هو هو عار مزود افتراضي سلوك. بلا نقاش أي نوع حال حال،mutation ما زال في خلفية per-target قفل داخل تشغيل، لذلك بلا شرط كتابة/تحرير ما زال هو أصل فرعي (لن إنتاج تمزيق شق ملف) ؛ «بلا شرط» ذهاب إسقاط هو*إصدار*قبل وضع شرط، بينما غير أصل فرعي صفة.`editText` في لديه حراسة حماية و بلا حراسة حماية مسار فوق كل سوف ناقص هدف تقرير إبلاغ لـ `FS_STALE_VERSION`، إبقاء واحد موحد واحد تحرير فشل رمز يمثل «هذا لحظة لا يمكن تحرير هذا هدف».

## حدث مفردات (من `dsh-fs` يملك)

حدث تعريف في `@deepseek-ai/dsh-fs` في، بينما غير `dsh-fs-observation-policy` في. هذا هو حل اقتران اتفاق الذي إجبار:`dsh-tool-fs` هو إرسال إطلاق جهة، لذلك هو يجب مرجع حدث نوع، كما أي جعل `dsh-fs-observation-policy` لم يعد مزود قاعدة خدمة، هو أيضا يجب قدرة تحرير ترجمة عبر.`dsh-fs` هو `dsh-tool-fs` و `dsh-fs-observation-policy` كل قد اعتماد حزمة، لذلك هو هو وحيد قدرة يجعل إرسال إطلاق جهة و سياسة استماع جهة مشترك مفردات بينما لا يجعل إرسال إطلاق جهة اعتماد سياسة إضافة ملكية أرض.

هذه حدث يحمل قائم `dsh-fs` مفردات (`FsTarget`،`FsVersion`،`FsObservation`،`FsWriteIntent`) إضافة واحد لا نفاذ واضح actor——لا يحمل موجه إلى نموذج عام فكرة (سطر نافذة، سطر رقم أو تصيير بعد صفحة قدم لن تسرب تسرب إلى هذا طبقة).

**اثنان عدد `fs/*` قرار حدث هو مفرد مجرى، أولا إلى أولا نيل waterfall.** `dsh-fs-observation-policy` لا استدعاء `next()` مباشر إرجاع، لذلك في افتراضي نشر في هو احتلال حسب هذا مجرى موضع؛ أكثر مبكر تسجيل أو استخدام `prepend` مستمع سوف بديل هذا سياسة. إذن، مراجعة حساب و صندوق رملي صلة ملاحظة نقطة ما زال إبقاء في يمكن تركيب `tools/execute` waterfall فوق.

actor في `dsh-fs` في نوع لـ `object`——واحد صاف خالص لا نفاذ واضح تحميل جسم، مزود اتفاق من لا قراءة أو استلام ضيق هو.owner دفع توجيه (`actor.agent?.session`) و `{ agent?: { session? } }` بنية شكل حالة تماما إبقاء في `dsh-fs-observation-policy` داخلي، من ذلك في مستمع في سوف `object` actor استلام ضيق لـ هذا شكل حالة.`dsh-fs` يملك حدث اسم و fs مفردات؛ هو لا يملك سياسة طبقة وقت التشغيل owner بنية.

```ts
import type { FsObservation, FsTarget, FsVersion, FsWriteIntent } from '@deepseek-ai/dsh-fs'

interface Events {
  /**
   * Single-slot decision: produce the write expectation for the next
   * ctx.fs.writeText. The default returns undefined (unconditional create-or-
   * overwrite — the bare provider). The policy listener returns createIfAbsent
   * (unobserved) or { kind: 'replaceIfVersion', version: vObserved } (observed).
   * The listener does NOT call next(): one decision, not a composable chain. @mode waterfall
   */
  'fs/write-intent'(target: FsTarget, actor: object | undefined, next: () => FsWriteIntent | undefined | Promise<FsWriteIntent | undefined>): Promise<FsWriteIntent | undefined>
  /**
   * Single-slot decision: produce the optional version guard for the next
   * ctx.fs.editText. The default returns undefined (unconditional edit of the
   * current content — the bare provider; no stat). The policy listener returns
   * { version: vObserved }, or throws FS_NOT_OBSERVED if the actor is unset or
   * has not observed the target. Does NOT call next(): one decision. @mode waterfall
   */
  'fs/edit-intent'(target: FsTarget, actor: object | undefined, next: () => { version: FsVersion } | undefined | Promise<{ version: FsVersion } | undefined>): Promise<{ version: FsVersion } | undefined>
  /**
   * Record that an actor observed a target as present at a version or absent.
   * Fire-and-forget (plain emit). Listeners MUST be
   * synchronous, side-effect-only recorders (`dsh-fs-observation-policy`'s is a WeakMap
   * write); the tool does not guard the emit, so a throwing listener surfaces as
   * the tool's isError result. No listener ⇒ nothing recorded.
   * @mode emit
   */
  'fs/observed'(target: FsTarget, observation: FsObservation, actor: object | undefined): void
}
```

`fs/*` قرار حدث هو**من أداة توزيع بلا ربط waterfall**(صنف يشبه `agent/request`، من حلقة توزيع كما بلا `this`) ، بينما غير خدمة ربط waterfall(مثل `llm/stream`). توزيع من هو `dsh-tool-fs` إضافة، هو لا هو واحد خدمة.

## أداة اتفاق (`dsh-tool-fs`)

أداة إبقاء ذلك موجه إلى نموذج schema(`read`/`write`/`edit`، تدريجي بايت ثابت) و نص التوجيه مقطع سقوط. نص التوجيه جذب توجيه ما زال بـ سياسة أولوية، لأن تحميل fs أداة نشر مسبق مدة أيضا سوف تحميل `dsh-fs-observation-policy`: نموذج ما زال يتم إبلاغ معرفة في تغطية كتابة أو تحرير قبل أولا قراءة، بينما هذا اشتراط قدوم ذاتي fs-observation-policy إضافة، و غير خلفية. عار مزود رجوع لا تغيير نص التوجيه قيام ساحة.

`dsh-tool-fs` نيل نيل من قديم `fileContext` طريقة خدمة ترحيل قدوم منفذ مسؤولية، يشمل**قراءة تصيير**(`read-render.ts`:`buildWindow` + `formatReadOutput`،`READ_MAX_BYTES`،`READ_MAX_LINE_LENGTH`،`FileReadOutcome`/`FileTextLine`، و `read.ts` في `STREAM_MIN_SIZE`) ، هذه الآن هو أداة تصيير دقيق عقدة، لأن قراءة قد من أداة يملك. هذه قراءة تصيير نوع و مساعد مساعدة دالة نقل دخول `dsh-tool-fs`؛ سياسة إضافة لا نيل متابعة بصفة أداة نوع اعتماد.

`dsh-tool-fs` هو واحد تسجيل الكل ثلاثة عدد أداة (`read`/`write`/`edit`) مفرد واحد أصل إضافة، و `dsh-tool-bash` نفسه. هو حقن `fs`(إضافة `tools`/`systemPrompt`) ، من لا حقن `fileContext`.(الأكثر أول رفع سجل أيضا سوف كل أداة بصفة `/read`/`/write`/`/edit` فرعي مسار إضافة كشف، توفير تجمع تركيز نشر استخدام؛ تنفيذ وقت يتم وضع ترك——لا يوجد مستهلك حاجة مفرد أداة نشر، كما فرعي مسار إصدار إجبار جعل جذب دخول أخ أخ أداة حزمة كل لا حاجة تحديد صنع `tsdown`/`tsconfig`/`files`/workspace-constraint معالجة. كل أداة تسجيل مساعد مساعدة دالة (`applyReadTool`/`applyWriteTool`/`applyEditTool`) ما زال بصفة أصل إضافة تركيب داخلي وحدة إبقاء.)

عبر يجعل waterfall كسول صفة إنتاج خروج مدة نظر قيمة قدوم الأكثر صغير تحويل `stat` ميزانية——عار افتراضي إرجاع `undefined`(بلا حراسة حماية) ، من لا stat:

- **read**——مرة `stat`؛ بيانات وصفية لم أمر في وقت، في إرجاع `FS_NOT_FOUND` قبل emit `{ kind: 'absent' }`؛ هدف لـ ملف وقت، فإن اعتماد مرة تنفيذ `readText`/`streamText`،`buildWindow`، مجددا emit `{ kind: 'present', version: info.version }`. قديم `fileContext.read` في قراءة بعد تأكيد `stat` ما زال إبقاء إزالة؛ في توجيه stat و قراءة بين تنافس تنازع كتابة من الأكثر كثير فقط قدرة جعل لاحق حمل منع حماية تحرير خطأ تقرير قديم قديم.
- **write**——`expectation = await ctx.waterfall('fs/write-intent', target, exec, () => undefined)`، لكن بعد `ctx.fs.writeText(target, content, expectation)`، مجددا emit يمثل وجود نتيجة إصدار. بلا نقاش هل لديه `dsh-fs-observation-policy`،**أداة داخل صفر stat**.
- **edit**——`expectation = await ctx.waterfall('fs/edit-intent', target, exec, () => undefined)`، لكن بعد `ctx.fs.editText(target, edit, expectation)`، مجددا emit يمثل وجود نتيجة إصدار. اثنان نوع حال حال تحت**أداة داخل صفر stat**: عار افتراضي لـ `undefined`(بلا شرط تحرير) ، لذلك أداة من لا stat قدوم صنع صنع أساس دقيق. إذا عار مسار فوق هدف لا وجود، مزود تقرير إبلاغ `FS_STALE_VERSION`؛ سياسة قد يحتفظ ناقص مراقبة قياس وقت، فإن مباشر إرجاع `FS_NOT_FOUND`.

أداة في كل مرة توزيع وقت سوف `exec`(أداة تنفيذ سياق) بصفة `actor` معامل نقل دخول، بـ سهل `dsh-fs-observation-policy` دفع توجيه ذلك مراقبة قياس حالة owner. أداة لا معرفة طريق سياسة إضافة هل وجود: هو بداية نهاية في `next` thunk في توفير عار افتراضي سلوك، بينما `dsh-fs-observation-policy` في افتراضي نشر في سوف في thunk تشغيل قبل قصير مسار هو.

**`fs/observed` في عملية نجاح بعد، و بيانات وصفية استكشاف قياس تأكيد ناقص بعد إطلاق.** ذلك مستمع يجب هو تزامن، لا رمي استثناء سجل جهاز؛ أداة لا مقابل plain emit فعل حفظ حماية، لذلك رمي استثناء مستمع ممكن يحل محل انتظار إرجاع قراءة خطأ، أو في mutation قد نجاح بعد تقرير إبلاغ فشل. مختلف خطوة أو يمكن فشل مراقبة قياس حاجة آخر نسخة حدث اتفاق.

## سياسة إضافة اتفاق (`dsh-fs-observation-policy`)

`dsh-fs-observation-policy` هو إضافة، لا هو خدمة. هو لا تسجيل `ctx.fileContext`، لا يوجد عام طريقة وجه، لا كشف `read`/`write`/`edit`/`resolve` طريقة. هو عبر `ctx.on()` تسجيل ثلاثة عدد مستمع (كل إرجاع واحد disposer لأجل HMR(حار وحدة استبدال)). هو صيانة مراقبة قياس حالة `WeakMap<owner, Map<targetKey, FsObservation>>`، و بنية تحويل owner دفع توجيه (سوف حدث في لا نفاذ واضح `object` actor استلام ضيق لـ ذاتي ذات `{ agent?: { session? } }` شكل حالة) ، لكن لا حقن `fs`——كل معالج فقط عملية ذاتي ذات `WeakMap`، من لا عملية `ctx.fs`.

- `fs/write-intent` مستمع: لم رؤية/ناقص ⇒ `createIfAbsent`؛ وجود ⇒ `replaceIfVersion`. هو لا استدعاء `next()`: تماما احتلال حسب مفرد واحد قرار مجرى موضع.
- `fs/edit-intent` مستمع: لم رؤية ⇒ `FS_NOT_OBSERVED`؛ ناقص ⇒ `FS_NOT_FOUND`؛ وجود ⇒ إرجاع ذلك إصدار حراسة حماية. نفس مثال لا استدعاء `next()`.
- `fs/observed` مستمع: سجل وجود/ناقص يمكن تمييز تعرف قيمة.

واحد بند مراقبة قياس حالة بند هو**أولا قبل مراقبة قياس سجل**، لكن ذلك يمكن تمييز تعرف حقل سوف أثر قرار. نجاح read/write/edit سوف سجل وجود حالة و إصدار، جعل create-then-edit أو edit-then-edit تسلسل بلا حاجة في بين إعادة قراءة يكفي عمل. تأكيد ناقص read/view سوف استخدام ناقص حالة يحل محل قديم صحيح نحو إصدار، لذلك فقط سماح حمل منع حماية إنشاء؛ مع بعد نجاح إنشاء سوف مجددا استخدام جديد وجود إصدار يحل محل ناقص حالة. فقط لديه بند لا وجود عندئذ يمثل لم رؤية، و جعل edit إرجاع `FS_NOT_OBSERVED`.owner من `{ agent?: { session? } }` بنية تحويل دفع توجيه؛dispose وقت إسقاط كل حالة (HMR أمان).

`dsh-fs-observation-policy` الآن هو واحد صاف سياسة/سجل إضافة، لا يوجد خدمة API——هو فقط عبر حدث بوابة أثر خارج حد. هذا صحيح هو إزالة `dsh-tool-fs` طريقة اقتران دمج صلة مفتاح.

## عار مزود سلوك (بلا `dsh-fs-observation-policy`)

هذا لا هو مسبق مدة نشر وضع حالة——تحميل fs أداة إعداد مسبق مدة أيضا سوف تحميل `dsh-fs-observation-policy`. هو هو أداة لم يعد اقتران دمج في سياسة طريقة خدمة بعد الذي وجود بلا قيد مزود تحت حد. عند `dsh-fs-observation-policy` لا وجود وقت، كل `fs/*` waterfall سقوط دخول ذلك `undefined` قيمة افتراضية،`fs/observed` بلا مستمع:

- **read** سلوك ثابت (هو من لا حاجة سياسة؛ فقط هو emit واحد الآن بلا شخص استماع `fs/observed`).
- **write** بلا شرط create-or-overwrite:`expected` لـ `undefined`، لذلك `writeText` بلا نقاش ملف هل وجود، بلا نقاش حالي إصدار مثل أي كل مباشر كتابة. بلا أولا قراءة اشتراط، بلا إصدار فحص.
- **edit** بلا شرط استبدال ملف حالي محتوى في حرف وجه نص:`expected` لـ `undefined`، لذلك `editText` بلا إصدار حراسة حماية، بلا أولا قراءة اشتراط أرض مطابقة و إعادة كتابة (`FS_EDIT_NOT_FOUND`/`FS_AMBIGUOUS_EDIT` ما زال ملائم استخدام——هو جمع صلة نحو حرف وجه مطابقة، بينما غير جديد طازج درجة). ناقص هدف ما زال تقرير إبلاغ `FS_STALE_VERSION`، و لديه حراسة حماية تحرير مسار «هذا لحظة لا يمكن تحرير هذا هدف» رمز خطأ متسق.

اثنان عدد mutation ما زال هو أصل فرعي (خلفية per-target قفل هو بلا شرط). فقط فقط هو*لا وجود*(بينما غير فقد فقد) هو `dsh-fs-observation-policy` هذا سوف تراكم إضافة سياسة: مراقبة قياس حالة، أولا قراءة بعد تحرير و إصدار حراسة حماية كتابة/تحرير. تحميل `dsh-fs-observation-policy` بعد، ذلك مستمع إرجاع لديه حراسة حماية `expected` قيمة بينما غير `undefined`، من بينما تراكم إضافة هذه قيد؛ عار مزود ذاته بلا حاجة أي تغيير.

## يحل محل علاقة

هذا Agent Note إصلاح صحيح——بينما غير دفع قلب——[تفكيك قسم نظام الملفات seam Agent Note](../simplification/2026-06-26-fsspec-style-fs-seam.zh.md). أربعة طبقة تفكيك قسم، مزود اتفاق و جديد طازج درجة*سياسة*متساو إبقاء. تغيير هو**أداة و سياسة طبقة بين اقتران دمج طريقة**: قوي صنع صفة طريقة خدمة تغيير لـ إضافة يملك حدث باب تحكم،fs I/O + قراءة نافذة من `fileContext` فوق نقل حتى `dsh-tool-fs`. تفكيك قسم نظام الملفات seam Agent Note في صلة في `dsh-tool-fs` حقن `fileContext` و `fileContext` يملك `read`/`write`/`edit` وصف قد في نفس تغيير في تحديث.

## تحقق

اختبار ثابت اثنان بند مسار: بلا `dsh-fs-observation-policy` وقت، أصل أداة إضافة مقابل `dsh-fs-local` بدء،read،create،overwrite و لم قراءة edit متساو نجاح؛ لديه سياسة وقت، لم قراءة edit إرجاع `FS_NOT_OBSERVED`، لم قراءة overwrite يتم `createIfAbsent` باب تحكم. سياسة قرار بعد، بعد تسجيل intent مستمع لن يتم لمس بلوغ. قديم قديم تحرير عبر مزود CAS فشل، بينما سياسة لا تنفيذ `stat`؛ أداة ميزانية في اثنان بند مسار فوق إبقاء read مرة `stat`،write أو edit متساو لـ صفر مرة. اختبار أيضا تجميع حذف استعادة مسار: قديم قديم تغيير، إعادة قراءة وقت تأكيد ناقص، حمل منع حماية إعادة إنشاء. موجه إلى نموذج schema تدريجي بايت ثابت، لكن استعادة بعد نتيجة transcript(نص سجل) حدوث تغير.

## سبق اعتبار بديل خطة

- **إبقاء `ctx.fileContext` بصفة صلة مفتاح مسار فوق طريقة خدمة**——[تفكيك قسم نظام الملفات seam Agent Note](../simplification/2026-06-26-fsspec-style-fs-seam.zh.md) الأكثر أول سقوط أرض شكل؛ مرفوض، لأن أداة لا يمكن في لا يوجد سياسة طبقة حال حال تحت تشغيل، جعل سياسة مقابل أساس هذا عملية هو تحمل إعادة صفة، بينما غير اختياري استلام ضيق.
- **سياسة جانب إصدار فحص**(`dsh-fs-observation-policy` في ذلك waterfall معالج في stat و مقارنة مقارنة إصدار)——مرفوض، لأن هذا فحص و أداة فعلي كتابة بين وجود TOCTOU بين فجوة؛ مزود mutation قرب حد منطقة هو وحيد بلا تنافس حالة موضع، لذلك سياسة فقط اختيار CAS أساس دقيق و مقابل أولا قبل مراقبة قياس إجراء باب تحكم.
- **كل أداة `/read`/`/write`/`/edit` فرعي مسار إضافة**——تنفيذ وقت وضع ترك: لا يوجد مستهلك حاجة مفرد أداة نشر، كما فرعي مسار إصدار إجبار جعل جذب دخول أخ أخ أداة حزمة كل لا حاجة تحديد صنع `tsdown`/`tsconfig`/`files`/workspace-constraint معالجة؛ كل أداة تسجيل مساعد مساعدة دالة ما زال بصفة أصل إضافة تركيب داخلي وحدة إبقاء.

## عاقبة

- **حدث بين وصل طبقة يحل محل طريقة استدعاء.** مرة waterfall + emit لا مثل `await ctx.fileContext.edit(...)` مباشر. استلام فائدة هو إزالة أداة إلى سياسة طريقة اعتماد، معا إبقاء افتراضي سياسة إضافة؛ بديل قيمة هو كثير واحد طقم حدث مفردات حاجة تعلم تعود. عبر إبقاء ثلاثة عدد حدث ضيق صغير نطاق و في كل حدث فوق سجل default-thunk دلالة قدوم مؤقت حل.
- **سياسة حدث يقع في تخزين seam في.** `dsh-fs` زيادة اثنان عدد إصدار قرار حدث و واحد سجل حدث، كل إدارة هو «فقط هو تخزين». هذا هو حل اقتران بديل قيمة (إرسال إطلاق جهة لا يستطيع اعتماد سياسة إضافة). هذه حدث فقط يحمل `dsh-fs` مفردات إضافة واحد لا نفاذ واضح `object` actor، لا يحمل موجه إلى نموذج عام فكرة، لذلك seam لا التصاق صبغ سطر نافذة/مراقبة قياس سياسة نوع، أيضا لا التصاق صبغ agent/جلسة كل من بنية.
- **مفرد واحد سياسة احتلال موضع من، حسب معتاد مثال أولا إلى أولا نيل.** `fs/write-intent`/`fs/edit-intent` مجرى موضع تماما جيد سعة قبول واحد قرار من؛ أولا تسجيل (أو `prepend`) مستمع نيل فوز، ذلك بقية يتم قصير مسار.`dsh-fs-observation-policy` احتلال حسب هذا مجرى موضع هو نشر معتاد مثال، بينما غير حدث نظام قوي صنع ثابت صيغة——واحد أولا تسجيل ثاني قرار من سوف التفاف مرور هو. هذا هو يمكن قبول، لأن ثاني عدد fs إصدار سياسة قرار من هو إعداد خطأ، بينما غير وظيفة. إذا لم قدوم ظهور*قسم طبقة* fs إصدار سياسة يحتاج طلب، ذلك هو واحد جديد Agent Note(يمكن تركيب قيمة نقل تمرير waterfall) ، بينما غير في هذه حدث فوق ساكن صامت إضافة ثاني عدد مستمع. قسم طبقة إذن/مراجعة حساب/صندوق رملي اعتراض قطع قد لديه ذلك ملكية:`tools/execute`.
- **إزالة قراءة بعد تأكيد stat** جعل لاحق*لديه حراسة حماية*تحرير في read/write تنافس تنازع تحت أحيانا ذلك لـ أمان بدء رؤية رفض كتابة (`FS_STALE_VERSION` → إعادة قراءة). هذا هو فقد فقد UX سهل فائدة، قطعا غير صحيح تأكيد صفة تسرب ثقب؛ مزود قفل ما زال منع توقف أساس في خطأ إصدار كتابة.
- **عار مزود لا فعل أولا قراءة بعد كتابة/تحرير، أيضا لا فعل إصدار فحص.** لا يوجد `dsh-fs-observation-policy` نشر سماح نموذج بلا شرط تغطية كتابة أو تحرير أي قد لديه ملف. هذا صحيح هو إبقاء أداة مستقل في سياسة خدمة متعمد يحتوي معنى: أمان سجل قاعدة وجود في `dsh-fs-observation-policy` إضافة في. حذف هو نشر هو متعمد اختيار بلا قيد نظام الملفات؛ مقابل في إصدار fs أداة إعداد بينما قول، هذا لا هو مسبق مدة وضع حالة.
