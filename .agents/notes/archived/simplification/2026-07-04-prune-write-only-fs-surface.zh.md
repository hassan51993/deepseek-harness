# Agent Note: من fs seam في إزالة فقط كتابة حقل و واحد بلا فاعلية توجيه دوران زر

Status: implemented
Archived: 2026-07-26

[English](2026-07-04-prune-write-only-fs-surface.md) | العربية

## مشكلة

[fs seam تفكيك قسم](2026-06-26-fsspec-style-fs-seam.md) سوف قراءة توجيه و سياسة من خلفية نقل حتى `dsh-tool-fs` و `dsh-fs-policy`. لديه أربعة موضع واجهة إبقاء تفكيك قسم قبل شكل——كل مرة استدعاء كل ملء ملء، لكن بلا شخص قراءة:

1. **`dsh-fs-local` في `STREAM_MIN_SIZE` + `FsIoInternals.streamMinSize`**——*في هذا مرة تغيير قبل قد يتم «منع توقف صلب تحرير رمز يمكن ضبط معامل» مراجعة حساب إزالة، هذا مراجعة حساب سوف توجيه عتبة قيمة تعديل لـ `dsh-tool-fs` `readStreamMinSize` إعداد؛ هذا موضع سجل هو لـ كامل عرض كامل مرة تنظيف.* أصلي موضع (`packages/fs/fs-local/src/fsio.ts`، من `packages/fs/fs-local/src/index.ts` إعادة توجيه خروج): يشمل fs-local ذاته شفرة المصدر و اختبار في داخل، كل مستودع صفر قراءة من. خلفية لا يوجد قراءة توجيه——`readWholeText`/`streamWholeText` هو استدعاء جهة ذاتي سطر اختيار اثنان عدد مستقل أصل لغة——حق صحيح توجيه معتاد كمية يقع في مستهلك (`packages/fs/tool-fs/src/read.ts`، و `info.size` مقارنة مقارنة). نفس عدد 10 MiB واقع اثنان نسخة مرآة مثل؛ خلفية ذلك نسخة هو ميت شفرة، كما هذا دوران زر JSDoc صوت تسمية توفير واحد فعلي لا وجود «read routing» تغطية.
2. **`FsTarget.inputPath`**(`packages/fs/fs/src/types.ts`): كل خلفية و كل اختبار mock كل يجب لـ هذا عدد «فقط توفير تشخيص» حقل تحرير صنع واحد قيمة، بينما إنتاج بيئة صفر قراءة من——سياسة إضافة و كل خطأ رسالة استخدام هو `targetKey`/`displayPath`.`listDir` إنتاج من كشف دلالة فوق هز وضع: دليل فرعي بند نيل إلى هو عار بند اسم، هذا لا هو أي شخص «input».
3. **`FsEditOutcome.replacements` + `.replaceAll`**(`packages/fs/fs/src/types.ts`):`replacements` إنتاج بيئة صفر قراءة من (مفرد مطابقة سياسة ذاته إبقاء——هو من خلفية داخلي `FS_AMBIGUOUS_EDIT`/`FS_EDIT_NOT_FOUND` رمي خروج قدوم قوي صنع تنفيذ، خطأ رسالة إبقاء داخلي حساب عدد) ؛`replaceAll` فقط يتم `packages/fs/tool-fs/src/edit.ts` في `formatEditOutput` قراءة——بصفة أداة ذاته قد يحتفظ `replace_all` معامل عودة صوت. دقيق بسيط بعد،`FsEditOutcome` تغيير لـ `{ version, before, after }`، و `FsWriteOutcome` في حق صحيح من خلفية اكتشاف حقل مقابل متساو.
4. **`FileReadOutcome.limit` + `.version`**(`packages/fs/tool-fs/src/read-render.ts`): من قراءة أداة ملء ملء، لكن `formatReadOutput` فقط تصيير `offset`/`lines`/`totalLines`/`truncatedByBytes`، كما `fs/observed` حدث إرسال إطلاق مباشر استخدام `info.version` بينما غير outcome فرعي هذا.

## قرار

حذف fs-local معتاد كمية، ذلك مجددا توجيه خروج و `streamMinSize` بند إعداد (ذلك بقية `FsIoInternals` بند إعداد تأكيد فعلي من أصل فرعي كتابة اختبار استخدام) ؛ من `FsTarget` حذف `inputPath`؛ سوف `FsEditOutcome` استلام ضيق لـ `{ version, before, after }`، و يأخذ تحليل معامل في `replaceAll` نقل إعطاء `formatEditOutput`؛ من `FileReadOutcome` حذف `limit`/`version`.[filesystem.md](../../../../docs/core-data-structures/filesystem.md) في لصق لصق،`packages/fs/fs/README.md`، و لا نيل لا وهمي بنية قد حذف حقل اختبار fake كل مع نوع واحد نفس استلام ضيق.

## سبق اعتبار بديل خطة

### لـ ماذا لا إبقاء؟

لم قدوم إذن/عزل طبقة ممكن حاجة تحليل قبل مسار قدوم توليد خطأ نص——لكن هو حاجة هو*طلب*، كل استدعاء نقطة ما زال يحتفظ طلب.«استبدال N موضع» ممكن يصبح موجه إلى نموذج نص——هذا هو واحد حاجة وقت مجددا تصميم سلوك تغيير، كما خلفية داخلي حساب عدد لـ ذلك خطأ رسالة بينما إبقاء. قراءة صفحة قدم ممكن عرض `limit`——لكن صفحة قدم عرض واحد قطع قد يمكن من `lines`/`totalLines` دفع توجيه. و هذا معا، كل قائم و لم قدوم خلفية (بعيد مسار، أصلي) كل يجب تحرير صنع بلا شخص إزالة استهلاك بروتوكول حقل، كل اختبار mock كل يجب ممتلئ كاف هو جمع.

## تحقق

قد حذف جدول وجه لا تكرار وجود——`dsh-fs-local` في `STREAM_MIN_SIZE`/`streamMinSize`،`FsTarget.inputPath`،`FsEditOutcome.replacements`/`.replaceAll`، و `FileReadOutcome.limit`/`.version`——بينما طلب جانب `replaceAll`(`FsEditRequest`) و أخرى outcome نوع فوق إصدار حقل إبقاء ثابت؛ اختبار fake مع نوع واحد نفس استلام ضيق.`formatEditOutput` في اثنان عدد `replace_all` فرع في توليد نص كل لا يوجد تغير، لذلك لا يوجد لقطة مسبق مدة إخراج حدوث تعديل.

## عاقبة

خلفية لا زيادة جديد معنى خدمة، عكس بينما إزالة تحت أربعة عدد بلا شخص إزالة استهلاك حقل.fs اكتشاف وظيفة (glob/grep أداة) تعلق و نفسه `dsh-fs` نوع ملف——هذا هو نص طبقة وجه بينما غير تصميم طبقة وجه إعادة تراكم، يمكن آلة آلة أرض دمج حل قرار.
