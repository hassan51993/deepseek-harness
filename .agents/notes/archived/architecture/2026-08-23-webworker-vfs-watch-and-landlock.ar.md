# Agent Note: Web Worker VFS استماع و CLI توافق confinement

Status: implemented
Archived: 2026-09-04

[English](2026-08-23-webworker-vfs-watch-and-landlock.md) | العربية

## Problem

Web Worker preview بدء و Node host نفسه Web profile و Agent preset. نقص قليل VFS تغيير مصدر وقت، رفض `node:fs.watchFile` سوف يجعل `skill-filesystem` إرجاع لا كامل مراقبة قياس و في كل مرة استعلام وقت إعادة مسح، بينما بلا حدث نجاح استدعاء سوف يجعل قد لديه أصل دائم بعيد انتظار Chokidar `ready`.Settings و credentials نفس مثال حاجة حقيقي خارجي تحرير حدث، بينما لا هو حزمة مخصص استخدام fake.

نفس تركيب تركيب `sandbox-local`، ذلك Linux اختيار سلسلة اعتماد مرة استكشاف قياس bwrap و `@deepseek-ai/node-addon-landlock-run`.Worker لا يمكن تنفيذ هذا اثنان عدد اثنان دخول صنع ملف. إذا اختيار سلسلة إلى هذا انتهاء،`workspace-write` و `read-only` سوف غير ممكن استخدام، كل إدارة shell كل بند نظام الملفات عملية قد مرور مرور Host جانب VFS استدعاء نقطة.

نظام الملفات توافق حد التزام دوران [Worker Node face قرار](2026-08-20-webworker-node-face.ar.md): صاف JavaScript watcher حزمة في Node توافق وحدة لـ فوق إبقاء أصل مثال تشغيل.Native أو binary حزمة يمكن إبقاء عام JavaScript API و يمكن تنفيذ ملف بروتوكول، معا استبدال تنفيذ خلفية. لا يمكن صيانة حمل استدعاء جهة مرئي Node سلوك API متابعة واضح علامة لـ غير ممكن استخدام؛`node:vm` لا يخص هذا قرار نطاق.

## Decision

### VFS mutation source و ملف watcher

`MemoryVfs` نحو مهمة معنى عدد كمية حجز قراءة جهة إصدار قد إيداع `write`،`mkdir`،`remove` و `chmod` mutation. حالة تغيير بعد عندئذ إصدار، فشل عملية لا إصدار، مرآة مثل seed إبقاء بلا حدث، واحد رمي خطأ حجز قراءة جهة أيضا لا يستطيع يجعل نظام الملفات عملية فشل أو منع توقف أخرى حجز قراءة جهة.Rename يتم جدول بلوغ لـ مصدر مسار حذف و يتضمن كامل حالة هدف mkdir/write سجل؛ هدف write سوف علامة دليل بند قد تغيير، لذلك watcher تقرير إبلاغ `rename`، لم قدوم durable sink معا أخذ إلى شيء تحويل هدف الذي يحتاج بايت. دليل مباشر بند تجميع دمج تغيير وقت، ذلك mtime سوف دفع دخول، لذلك polling قدرة مثل Node واحد مثال اكتشاف فرعي بند إنشاء و حذف.

Mutation record و WebFS حفظ دائم مشترك استخدام، بينما لا بناء قيام ثاني بند إشعار مسار.Write سجل يحمل إيداع بعد كامل بايت و وهمي محاكاة إذن موضع، و في فقط لديه ذيل جزء تغير وقت يحمل append offset.`MemoryVfs` قبول اختياري مختلف خطوة `VfsMutationSink`، يأخذ نفس دفعة سجل تسليم إعطاء sink و فوري watcher حجز قراءة جهة، و عبر ملف جملة مقبض `sync()` و `datasync()` كشف `flush()`. ماء دمج عبر صريح `{ mode, mtimeMs }` نقل دخول بيانات وصفية، لذلك مرآة مثل إذن و حفظ دائم ختم الوقت لن احتلال استخدام نفس عدد موضع معامل. هذا مرة تغيير لا تركيب durable sink؛ تزامن داخل تخزين شجرة متابعة بصفة مرجعي، لذلك OPFS أو مستخدم دليل mirror يمكن أولا ماء دمج، مجددا مختلف خطوة كتابة عودة، بينما بلا حاجة تغيير `node:fs`.

`node:fs` تنفيذ callback `stat` و `lstat`،`watch`،`watchFile`،`unwatchFile`،`FSWatcher` و `StatWatcher`؛`node:fs/promises.watch` توفير يمكن من abort إلغاء مختلف خطوة مكرر. نفس مسار listener مشترك واحد `StatWatcher`، حسب listener إلغاء استماع لن أثر أخرى listener؛ ناقص مسار أولا تقرير إبلاغ صفر قيمة Stats، مع بعد مجددا تقرير إبلاغ إنشاء، حذف و إعادة بناء حالة.Callback توزيع التقاط تسجيل وقت مختلف خطوة سياق، و في كل مرة ترتيب طابور تسليم قبل فحص watcher هل قد إغلاق. مسبق أولا abort callback watcher أولا إرجاع كائن، مجددا مختلف خطوة إغلاق؛ مسبق أولا abort promise watcher في رقم مرة قراءة iterator وقت بـ `AbortError` رفض.

`fs.watch` يأخذ بند إنشاء، حذف و rename هدف خريطة لـ `rename`، يأخذ محتوى أو mode تغير خريطة لـ `change`. غير تمرير عودة دليل watcher تقرير إبلاغ مباشر فرعي بند اسم، تمرير عودة watcher تقرير إبلاغ متبادل مقابل يتم استماع دليل مسار.VFS لا يوجد رمز رقم رابط، لذلك هذا تنفيذ لن صنع صنع رمز رقم رابط حدث.

### Stream و لم تعديل NPM حزمة

`node:stream` استخدام صيانة في `readable-stream` متصفح تنفيذ قدوم توفير `Readable`،`Writable`،`Duplex`،`Transform`،`PassThrough`،pipeline helper، مختلف خطوة تكرار بديل،backpressure،abort و teardown ترتيب. توافق وحدة يأخذ بايت تدفق high-water mark قيمة افتراضية ضبط لـ مستودع Node 22+ جذب محرك استخدام 64 KiB.VFS دعم حمل `ReadStream` و `WriteStream` توفير ملف وصف رمز، إغلاق منطقة بين نطاق،encoding، إلحاق أو استبدال سلوك، بايت حساب عدد،AbortSignal معالجة، و `open`،`ready`،`finish`،`end`،`close` ترتيب.Descriptor في rename،replacement و unlink بعد ما زال إبقاء فتح وقت ملف هوية و وصول نمط؛hard link مشترك هذا هوية و لاحق محتوى و mode تغير،truncate زيادة طويل فإن استخدام صفر بايت ملء ملء.

Chokidar و readdirp بصفة عادي مرآة مثل اعتماد تشغيل، لا يخص وحدة replacement. هو جمع حزمة شفرة إبقاء أصل مثال، و استيراد Worker تنفيذ `node:fs`،`node:fs/promises`،`node:stream`،`node:events`،`node:path` و `node:os`. لذلك، أول مرة مسح،`ready`،polling، أصل فرعي كتابة عودة واحد تحويل، كتابة مستقر انتظار، مشترك watcher و إغلاق سلوك ما زال من Chokidar ذاتي ذات مسؤول.

### أساس في تدريجي عملية VFS تخويل Landlock CLI

`@deepseek-ai/node-addon-landlock-run` هو عادي مرآة مثل اعتماد، لا هو وحدة replacement. ذلك لم مرور تعديل JavaScript مدخل عبر Worker تنفيذ `node:child_process`،`node:module`،`node:path` و `node:url` تشغيل، لذلك هذا حزمة ما زال هو `LAUNCHER_BIN`،`LAUNCHER_FAILURE_EXIT`،`launcherPath()`،`grantArgs()` و `probe()` وحيد كل من. مرآة مثل يمكن يتضمن مطابقة Linux optional package، لكن حزمة تحليل لا قرار Worker منصة هل توفير Landlock؛ نقص قليل هذا optional package وقت، مدخل حزمة إنتاج تحديد صفة fallback مسار ما زال وصول نفس عدد منصة يمكن تنفيذ ملف تنفيذ.

عملية طبقة يحتفظ حسب منطق يمكن تنفيذ ملف اسم تعرف آخر Worker منصة يمكن تنفيذ ملف جدول، بينما لا اعتماد بعض واحد حزمة إدارة جهاز مسار. ذلك `landlock-run` provider قبول عار أمر أو قطعا مقابل launcher مسار، تحليل native حزمة لم مرور تعديل CLI، تحقق كل تخويل أصل، و يأخذ داخلي argv تسليم إعطاء قائم shell عملية runner.`node:child_process` فقط مسؤول عام يمكن تنفيذ ملف فحص بحث، إخراج إلقاء تمرير و انتهاء معالجة. لذلك، أصل حزمة تزامن `probe()` سوف عبر `spawnSync` مراقبة إلى هذا provider و تقرير إبلاغ `full`. استخدام قاعدة خطأ، ناقص تخويل أصل أو لم معرفة داخلي يمكن تنفيذ ملف فقط إخراج واحد سطر `landlock-run: ...`، بـ `125` خروج، و كما أبدا تشغيل داخلي أمر.bwrap ما زال استكشاف قياس لـ غير ممكن استخدام، لذلك لم تعديل `sandbox-local` Linux اختيار سلسلة سوف اختيار في هذا Landlock خلفية.

كل قد بدء عملية قسم آخر نيل نيل واحد `ShellFileSystem` guard.`stat`،`list` و `readText` حاجة فقط قراءة أو قراءة كتابة تخويل؛`writeText`،`mkdir` و `remove` حاجة قراءة كتابة تخويل؛`rename` اشتراط مصدر و هدف كل يمكن كتابة.Grant root في containment فحص قبل ذهاب حذف ذيل جزء فصل رمز. رفض خطأ يتضمن `EACCES` و `permission denied`، من بينما إبقاء `bash-sandbox` رفض تصنيف.`/tmp` خريطة إلى VFS `/dsh/tmp`،`/dev/null` فإن هو فارغ قراءة، إسقاط كتابة كما لا حفظ أي بايت وهمي محاكاة ملف.

Worker `full` ربط نقاش تغطية shell أمر جدول و Host خدمة VFS بروتوكول قدرة كاف جدول بلوغ الكل ملف عملية. هو لا يمثل Linux داخل نواة Landlock، لا دعم حمل مهمة معنى native يمكن تنفيذ ملف، أيضا لا يمكن قيد لم قدوم التفاف مرور `ShellFileSystem` shell برنامج.

### واضح تأخير بعد سلوك

`node:vm`،`node:worker_threads`،`node:net`،`node:sqlite`،native PTY،Sharp و ripgrep لا يخص هذا مرة تغيير.VFS ما زال فقط دعم حمل POSIX، داخل تخزين تخزين كما لا يوجد رمز رقم رابط.Browser Worker لا يوجد libuv ريح إطار مرجع حساب عدد حدث حلقة، لذلك watcher `persistent`،`ref()` و `unref()` إبقاء API و يمكن مراقبة حالة، لكن لا يستطيع قرار Worker توليد تخزين مدة.

## Alternatives considered

**في Worker profile في منع استخدام watcher و sandbox بند إعداد.** تقليص نقص تركيب بعد سوف لم يعد اختبار نفسه Host tree، أيضا سوف إخفاء preview نشر خاص لديه حزمة تجميع صار لذا عائق.

**يجعل `watchFile` يصبح بلا حدث نجاح استدعاء.** ناقص أصل دائم بعيد لا يمكن دفع دخول، قد لديه أصل فإن سوف دائم دائم انتظار Chokidar `ready`.

**فقط من `node:fs` إشعار watcher.** Shell عملية طلب و مباشر كتابة VFS تنفيذ يمكن التفاف مرور إشعار نقطة. فقط لديه إيداع حالة `MemoryVfs` عندئذ هو كامل حق مصدر.

**إبقاء VFS مخصص استخدام Chokidar replacement.** هذا سوف تكرار تنفيذ فوق تنقل قد صيانة دليل مسح،ready حساب عدد، كتابة مستقر انتظار، أصل فرعي استبدال، مشترك watcher كل حق و teardown.

**استخدام Worker وحدة استبدال Landlock مدخل حزمة.** إعادة تنفيذ ذلك توجيه خروج معتاد كمية، تخويل معامل بنية صنع،launcher تحليل و probe، سوف لـ واحد قد قدرة في Worker Node توافق طبقة فوق تشغيل حزمة اتفاق بناء قيام ثاني نسخة فرعي هذا. فقط لديه منصة يمكن تنفيذ ملف تنفيذ حاجة مختلف.

**فقط تعرف آخر واحد دقيق launcher مسار.** Optional dependency تثبيت حالة و مدخل حزمة قد لديه fallback سوف لـ نفس عدد يمكن تنفيذ ملف إنتاج مختلف قطعا مقابل مسار. حزمة إدارة جهاز تخطيط لا هو منصة قدرة هوية، لذلك يمكن تنفيذ ملف توزيع استخدام منطق اسم `landlock-run`.

**في `sandbox-local` في زيادة Worker فرع.** هذا سوف يأخذ سياسة إلى تخويل خريطة نسخ إلى عمل خدمة حزمة في. حل تفسير قائم launcher بروتوكول يمكن إبقاء provider،consumer، إعداد، تشخيص و native حزمة API ثابت.

**في عام VFS فوق حفظ واحد حالي سياسة.** تزامن قبل منصة، خلفية و رفع حق أمر سوف تغطية ذاك هذا إذن. تخويل يجب ملكية في مفرد عدد عملية جملة مقبض و ذلك نظام الملفات مهايئ.

## Verification

- `fs-watch-stream.spec.ts` مقابل وفق حالي Node إصدار تحقق ناقص، إنشاء، تعديل، حذف `watchFile` حالة تحويل، و ملف تدفق دورة الحياة، قسم قطعة، نطاق،backpressure، بايت حساب عدد، قيمة افتراضية و abort هوية.
- `chokidar.spec.ts` عبر Worker transformer و وحدة loader تحميل lockfile اختيار تحديد اثنان مجموعة Chokidar و readdirp اعتماد، و في `MemoryVfs` فوق تحقق `ready`،callback watcher،polling، ناقص ملف إنشاء، حذف و تماما توقف مستقر إغلاق.
- `image-loadable.spec.ts` تحزيم و تحميل حقيقي `@deepseek-ai/node-addon-landlock-run` JavaScript، تحقق هو لا في replacement جدول في، و يجعل ذلك fallback `launcherPath()` و `probe()` مرور مرور Worker منصة يمكن تنفيذ ملف.`child-process.spec.ts` و `sandbox-stack.spec.ts` مع بعد عبر إنتاج sandbox و subprocess حزمة تحقق launcher فشل رمز، خطأ argv و تخويل فشل،`/tmp` و `/dev/null`،rename رفض، ثلاثة نوع إذن نمط و تدريجي عملية تزامن تخويل.
- `preview-boot.e2e.ts` بناء و بدء تحزيم بعد متصفح نشر، إنشاء Workspace و Session، يأخذ ناقص skill أصل تدريجي درجة دفع دخول إلى متاح Chokidar watch، قراءة catalog، و في لا يوجد watcher تحذير إبلاغ حال حال تحت إتمام settings و credential كتابة.

## Consequences

Preview الآن يمكن في لا fork شفرة المصدر حال حال تحت تشغيل NPM watcher مستهلك؛Host شفرة و shell عملية Worker إنتاج نظام الملفات mutation مشترك نفس عدد لديه ترتيب إيداع مصدر.WebFS/OPFS تجميع صار ما زال هو محيط التفاف هذا تزامن مرجعي مختلف خطوة mirror، و إزالة استهلاك نفس عدد تغيير مصدر؛ هو لن زيادة آخر نسخة Chokidar تنفيذ أو متبادل متبادل تنافس تنازع mutation بروتوكول.

Worker `read-only` و `workspace-write` في لا fork Landlock NPM حزمة حال حال تحت إبقاء منتج إذن مفردات و رفض تقرير إبلاغ. ذلك أمان ربط نقاش مقارنة native Landlock أكثر ضيق، لكن كامل تغطية Worker تنفيذ عالم حد؛ أي جديد نظام الملفات رسالة أو shell برنامج كل يجب متابعة مرور مرور تلقي guard حفظ حماية `ShellFileSystem`.Native-backed حزمة التزام دوران نفس كل حق قاعدة: ذلك JavaScript إبقاء فوق تنقل تنفيذ،Worker منصة فقط استبدال خلف بعد native artifact.

Worker bundle زيادة `readable-stream` و ذلك قليل كمية متصفح اعتماد. متبادل ينبغي أرض،stream حالة و backpressure متابعة من فوق تنقل صيانة، لا يصبح محلي توافق شفرة.

Watcher حدث وقت ترتيب من VFS إيداع تحديد، بينما لا هو وراثة عملية نظام خلفية.Node watcher اتفاق ذاته لا حفظ إثبات native حدث دمج طريقة، لذلك هذا تنفيذ ما زال رمز دمج اتفاق؛ اختبار ثابت حالي مستهلك اعتماد كل واحد نوع حدث منطقة آخر.
