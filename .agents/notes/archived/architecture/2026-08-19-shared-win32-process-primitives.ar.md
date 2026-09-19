# Agent Note: Windows sandbox process primitives فقط لديه واحد منخفض طبقة owner

Status: implemented
Archived: 2026-09-04

[English](2026-08-19-shared-win32-process-primitives.md) | العربية

## Problem

Windows ACL sandbox يملك restricted token،SID،DACL،grant و workspace policy، لكن ذلك عملية بدء مسار أيضا معا تحمل تحميل عام Koffi ABI، أمر سطر مرجع، مجهول اسم إدارة طريق، وراثة stdio،Job ضبط،wait و HANDLE تنظيف. ثاني عدد Windows process consumer لا فإن فقط قدرة اعتماد sandbox policy أو نسخ native resource منطق، بينما allocation و فشل تنظيف إصلاح أيضا يجب في كثير نسخة تنفيذ بين إبقاء تزامن.

## Decision

`@deepseek-ai/dsh-win32-process` يملك `sandbox-windows-acl` حالي إزالة استهلاك يمكن إعادة استخدام Win32 process ABI و native resource عملية. هذا حزمة كسول صفة تحميل `kernel32.dll` و `advapi32.dll`، نواة تحقق x64 `STARTUPINFOW` و `PROCESS_INFORMATION` تخطيط، لـ `CreateProcessAsUserW` مرجع argv، و توفير حمل فحص restricted-token pipe و inherited-stdio Job عملية.

Windows ACL sandbox متابعة وحيد يملك restricted-token إنشاء،SID و DACL policy،grants، يمكن كتابة مسار قطع تحديد، مؤقت دليل policy و عام مشترك sandbox child result. هو عبر مشترك binding context توسيع policy-specific API، توفير primary token، تركيب pipe drain و wait، و في ذاتي ذات دورة الحياة حد إغلاق استدعاء جهة يملك Job.

كل بند native allocation و HANDLE في كل عدد shared operation داخل فقط لديه واحد owner.process operation سوف تحرير Koffi out-parameter، و في تلقي تحكم فشل قبل إغلاق هو قد أخذ نيل كل pipe،thread،process أو Job handle.pipe إنشاء نجاح وقت، يأخذ process و stdout/stderr read handles إرجاع إعطاء sandbox.inherited-stdio إنشاء بـ suspended حالة بدء هدف، يأخذ هو قسم إعداد إعطاء kill-on-close Job، و فقط في قسم إعداد بعد استعادة، لذلك هدف شفرة لن في Job خارج تشغيل. قسم إعداد فشل سوف أولا إنهاء suspended target مجددا تحرير جملة مقبض؛ استعادة فشل سوف إغلاق قد قسم إعداد Job.sandbox إبقاء قائم pipe-drain،direct-wait،result و إرجاع Job دورة الحياة.

هذا حزمة فقط توجيه خروج sandbox إنتاج مسار قد استخدام عملية.ordinary `CreateProcessW`، دقيق `applicationName`،parent-stdio release و whole-Job settlement في ordinary process consumer ظهور قبل إبقاء نقص مقعد. هذا حزمة هو library، لا هو Cordis service أو عام مشترك Windows SDK.

## Verification

shared suite تغطية x64 ABI قيمة، أمر سطر مرجع،binding extension،pipe EOF و drain allocation إعادة استخدام،restricted-token process إنشاء،suspended إنشاء بعد Job قسم إعداد و استعادة،wait و exit-code قراءة،native allocation تحرير، و قد أخذ نيل مورد فشل مسار.sandbox اختبار إبقاء restricted-token،fail-closed،pipe/inherit،result و disposal تركيب سلوك، لا تكرار منخفض طبقة مستطيل دفعة. قد إيداع header probe و Windows package اختبار تغطية ترحيل بعد ABI و native مسار؛Wine توفير نموذج محاكاة Windows package و تركيب إشارة.

## Alternatives considered

**يأخذ process primitives إبقاء في sandbox package.** رفض، لأن process consumer سوف يتم إجبار وراثة ACL/token policy، أو نسخ native ABI و تنظيف مسار.

**لـ كل consumer نسخ Koffi تنفيذ.** رفض، لأن struct layout، خطأ التقاط و نطاق جزء فشل تنظيف سوف ظهور كثير عدد owner.

**في حالي consumer ظهور قبل إصدار ordinary-runner operations.** رفض، لأن لم استخدام `CreateProcessW`،application-name،parent-stdio و Job-settlement API سوف تجميد ربط دفع قياس صفة معنى خدمة، و توسيع كبير فشل مستطيل دفعة.

## Consequences

sandbox إبقاء عام مشترك سلوك، بينما عام Win32 resource ownership فقط لديه واحد package و واحد اختبار ملكية. هذا package boundary زيادة واحد workspace dependency و إصدار library؛ استدعاء جهة يجب صريح يملك policy، ضبط درجة،result تركيب و إرجاع HANDLE إغلاق مسؤولية مهمة.suspended إنشاء حفظ إثبات هدف شفرة فقط في Job قسم إعداد بعد بدء، لكن لن يجعل runner create-to-assignment منطقة بين مقابل خارجي إنهاء أداة تجهيز أصل فرعي صفة. لاحق process consumer فقط في ذلك إنتاج مسار وجود وقت توسيع منخفض طبقة package.
