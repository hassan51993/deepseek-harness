---
description: "موجه إلى تنفيذ أو ترتيب فحص Windows ACL صندوق رملي و عادي عملية فرعية Job runner صيانة من، شرح قاع طبقة Win32 عملية أصل لغة."
kind: "package-library"
---

# @deepseek-ai/dsh-win32-process

[English](README.md) | العربية

## عام وصف

توفير Windows ACL صندوق رملي و عادي عملية فرعية Job runner إزالة استهلاك قاع طبقة Win32 عملية مكتبة. هو وحيد يملك مستودع في يمكن إعادة استخدام process،stdio و Job Object عملية Koffi ربط جدول؛ هو لا هو Cordis خدمة، أيضا لا قرار صندوق رملي سياسة أو عام مشترك child سلوك. صيانة مهمة واحد أصلي عملية مسار أو فحص جملة مقبض دورة الحياة حد وقت، طلب قراءة قراءة هذا صفحة.

## دليل

- [سلوك](#behavior)
- [رأس ملف تحقق](#header-verification)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="behavior"></a>
## سلوك

- **وحيد يمكن إعادة استخدام ABI owner** — `abi.ts` يملك اثنان بند process مسار إزالة استهلاك Win32 معتاد كمية و x64 تخطيط قيمة.`ffi.ts` كسول تحميل `kernel32.dll` و `advapi32.dll`، نواة تحقق `STARTUPINFOW` و `PROCESS_INFORMATION`، توفير حمل نوع عملية و خطأ صيغة تحويل، و يجعل صندوق رملي سياسة عبر نفس مجموعة قد تحميل مكتبة ربط باق بقية API.
- **restricted-token إنشاء** — `RestrictedProcessSpawnOptions` اشتراط صندوق رملي primary token، و استخدام `CreateProcessAsUserW`.pipe و inherited-stdio مسار مشترك استخدام أمر سطر جذب رقم معالجة،cwd،restricted-token null بيئة سياسة، قيمة راجعة فحص و جملة مقبض تنظيف.
- **إدارة طريق عملية أصل لغة** — `spawnPipedProcess()` إنشاء مجهول اسم stdin/stdout/stderr إدارة طريق، قيام أي إغلاق stdin، و إرجاع اثنان عدد قراءة طرف؛ استدعاء جهة مسؤول انتظار عملية و ترتيب فارغ إدارة طريق. مهمة واحد نطاق جزء فشل كل سوف إغلاق هذا عملية قد يملك جملة مقبض، و في كل منها Win32 دورة الحياة انتهاء بعد تحرير كل Koffi إخراج مجرى و بنية جسم قسم إعداد.
- **وراثة stdio Job أصل لغة** — `spawnInheritedJobProcess()` إنشاء واحد kill-on-close Job، مؤقت يأخذ حالي stdio جملة مقبض ضبط لـ يمكن وراثة، بـ suspended حالة إنشاء restricted child، يأخذ هو قسم إعداد إعطاء Job، مجددا استعادة ابتدائي خط مسار. هدف شفرة لن في Job قسم إعداد قبل تشغيل؛ تلقي تحكم قسم إعداد أو استعادة فشل سوف إنهاء suspended child، أو في تحرير الكل قد يملك جملة مقبض قبل إغلاق قد قسم إعداد Job.
- **ordinary Job runner أصل لغة** — `CurrentTokenProcessSpawnOptions` اشتراط قد تحليل `applicationName`، كامل target بيئة، و ثلاثة عدد مخصص لأجل target stdin،stdout و stderr runner CRT وصف رمز.`spawnCurrentTokenJobProcess()` عبر Node تصدير `uv_get_osfhandle()` يأخذ هذه وصف رمز خريطة لـ OS جملة مقبض، رفض بلا فاعلية نتيجة، مؤقت يأخذ جملة مقبض ضبط لـ يمكن وراثة، و عبر `STARTF_USESTDHANDLES` نقل دخول. هو استخدام `CREATE_UNICODE_ENVIRONMENT` نقل دخول ترتيب بعد UTF-16LE بيئة كتلة، مجددا بـ suspended حالة عبر `CreateProcessW` إنشاء target، يأخذ هو قسم إعداد إعطاء unnamed kill-on-close Job، و فقط في قسم إعداد بعد استعادة. أصلي أمر سطر argv بند إبقاء ثابت،runner أيضا يمكن إغلاق ذاتي ذات carrier وصف رمز، بينما لا لمس اصطدام Node ذاته معيار تدفق.
- **ordinary تسوية عملية** — `pollProcessExit()` مفرد وحيد إصدار direct exit،`isJobEmpty()` فإن قراءة `QueryInformationJobObject(JobObjectBasicAccountingInformation)`، مباشر إلى `ActiveProcesses` عودة صفر. حمل فحص Job إنهاء و جملة مقبض إغلاق جعل runner إبقاء وحيد native owner.
- **صريح تسوية ملكية** — `waitForProcessExit()` انتظار و إغلاق صندوق رملي process جملة مقبض؛ordinary runner process polling،Job accounting و checked Job termination/closure هو مستقل عملية.`drainPipe()` في ترتيب فارغ خلال إعادة استخدام واحد native count slot، تحرير هذا قسم إعداد و إغلاق إدارة طريق قراءة جملة مقبض. كل استدعاء جهة يملك ذاتي ذات result تركيب و إرجاع جملة مقبض.

عملية إنشاء في هدف شفرة تشغيل قبل ضبط `STARTF_USESHOWWINDOW` و `SW_HIDE`. هو إبقاء تحكم منصة وراثة، لا إضافة ممكن توجيه يؤدي تلقي حد أمر لوحة تحت DLL ابتدائي تحويل فشل `CREATE_NO_WINDOW` أو `CREATE_NEW_CONSOLE`. قد لديه أب عملية تحكم منصة نافذة لن يتم إخفاء.

Windows ACL صندوق رملي في هذه أصل لغة فوق زيادة SID،DACL،grant،workspace و عام مشترك child سياسة.

- **وراثة تحكم وصف رمز**——Job إنشاء قبول اختياري fd-7 إدارة طريق.`STARTUPINFO.cbReserved2/lpReserved2` يحمل ثمانية مجرى CRT وصف رمز جدول، منها يتضمن معيار جملة مقبض، إغلاق مجرى 3–6، و مجرى 7 تحكم إدارة طريق. هذا جدول إبقاء إلى CreateProcess إرجاع؛ مؤقت جملة مقبض وراثة في نجاح و فشل وقت متساو استعادة. في Node بدء قبل ابتدائي تحويل هذا مجرى يمكن تجنب تجنب تغطية Node قد قسم إعداد وصف رمز.

<a id="header-verification"></a>
## رأس ملف تحقق

process،stdio و Job معتاد كمية و اختيار تحديد بنية جسم كبير صغير و انحراف نقل من [`verify/abi-probe.cpp`](verify/abi-probe.cpp) مقابل وفق MinGW Windows رأس ملف فحص:

```sh
g++ -std=c++20 -municode -O2 -o abi-probe.exe verify/abi-probe.cpp && ./abi-probe.exe
```

Koffi `STARTUPINFOW` و `PROCESS_INFORMATION` تعريف أيضا سوف في وحدة تحميل وقت تأكيد كل منها 64 موضع كبير صغير. هذا استكشاف إبرة أيضا ثابت إشارة إبرة و جملة مقبض عرض درجة،Unicode بيئة علامة سجل، و لأجل حكم قطع تماما توقف مستقر أساس أساس Job accounting record كبير صغير و `ActiveProcesses` انحراف نقل؛ ذلك بقية قد سجل انحراف نقل و معتاد كمية أيضا من هذا استكشاف إبرة توفير دليل.

<a id="model-experience"></a>
## تجربة النموذج

### عملية أصل لغة

#### نموذج يرى ماذا

لا يوجد مباشر محتوى. هذه الحزمة نحو صندوق رملي و ordinary runner توفير `Win32ProcessBindings`،`CurrentTokenProcessBindings` و عملية أصل لغة؛ اثنان من يملك الكل نموذج مرئي أداة، إخراج و تشخيص، هذه الحزمة لا مساهمة نص التوجيه أو أداة schema.

#### Token أثر

لا يوجد مباشر أثر. مستهلك قرار عملية إخراج هل دخول أداة نتيجة أو لاحق نموذج طلب.

#### KV Cache أثر

هذه الحزمة لا مساهمة مستقر طلب بادئة، لذلك لن جعل نموذج KV Cache بطلان.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **فقط في Windows أصلي تحميل** — استيراد عام نوع يمكن عبر منصة إجراء، لكن تحليل ربط جدول سوف تحميل Windows DLL، و في أخرى مضيف فشل. عبر منصة اختبار حقن ربط جدول، لا تحميل أصلي API.
- **لا يوجد عام مشترك عملية خدمة** — هذه الحزمة لحظة معنى لا يأخذ أصل لغة حزمة تركيب صار Cordis أو Node تدفق. مستهلك يجب يملك ذاتي ذات سياسة، مختلف خطوة ضبط درجة، إخراج حد أعلى، إلغاء و نهائي جملة مقبض إغلاق.
- **restricted-token null بيئة** — `CreateProcessAsUserW` صندوق رملي أصل لغة نقل دخول null بيئة كتلة، و أولا عبر `SetEnvironmentVariableW` بناء قيام تعديل، لأن مرور Koffi نقل دخول صريح بيئة كتلة سوف بـ `ERROR_INVALID_PARAMETER` فشل.ordinary `CreateProcessW` runner فإن اشتراط كامل target بيئة، و نقل دخول ترتيب، مزدوج NUL ربط ذيل UTF-16LE كتلة، منها يشمل `=X:` مشغل بند، بينما لا تعديل ذاته بيئة.
- **لا يوجد standalone process API** — هذه الحزمة فقط كشف حالي صندوق رملي و ordinary-runner مستهلك الذي يحتاج عملية، لا يملك Node تدفق، عام مشترك جملة مقبض، إخراج سياسة، إلغاء أو durable state.
- **إنشاء إلى قسم إعداد بين في قطع** — هدف بـ suspended حالة بدء، لا يستطيع في Job قسم إعداد قبل تنفيذ، لكن runner إذا في عملية إنشاء إلى قسم إعداد بين أقصى ضيق منطقة بين يتم خارج قوة إنهاء، ممكن إبقاء تحت suspended target. هذه الحزمة لا إعلان أصل فرعي Job مرفق إضافة حفظ إثبات.
- **header دليل حد تحديد هيكل بنية** — قد إيداع ABI probe و تخطيط معتاد كمية تغطية مستودع حالي 64 موضع Windows هدف. دعم حمل جديد إشارة إبرة عرض درجة أو لا توافق Windows ABI قبل، يجب أولا تحديث probe.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. عملية فقط يحتفظ استدعاء داخل أصلي جملة مقبض.
