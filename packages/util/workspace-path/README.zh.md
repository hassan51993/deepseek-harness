---
description: "متصفح أمان Workspace مسار مساعد مساعدة دالة: تجميع وصل متبادل مقابل مسار، تقليص كتابة POSIX رئيسي دليل و توليد عرض عنوان."
kind: "package-library"
---

# dsh-util-workspace-path

[English](README.md) | العربية

## عام وصف

توفير Workspace متبادل صلة عميل و تحكم جهاز حزمة مشترك، يمكن في متصفح استخدام مسار مساعد مساعدة دالة. هذا حزمة مسؤول تجميع وصل Workspace متبادل مقابل مسار، تقليص كتابة لأجل عرض POSIX رئيسي دليل، من POSIX أو Windows مسار رفع أخذ Workspace عنوان، يأخذ مسار تفكيك صار دليل جزء و نهاية مقطع توفير عرض، و يملك في Sidebar و مورد نموذج بين تسمية مساحة العمل ملف `dsh-resource://file/…` عنوان لغة قاعدة.`relativizeToCwd` في عرض وقت حذف مساحة العمل بادئة، و إبقاء هذا دليل بـ خارج مسار. هو لا توفير Cordis service، أيضا لا يحتفظ وقت التشغيل حالة.

## دليل

- [ملف عنوان](#file-addresses)
- [معروف حد و مؤقت مؤقت أمر بند](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="file-addresses"></a>
## ملف عنوان

مورد عنوان = `dsh-resource://<type>/…`،type(URI host) أي مورد بروتوكول مفتاح (`file`، أو إضافة في `ResourceProtocolMap` في إعلان مفتاح) ؛ أخرى scheme تابع تنقل بروتوكول، آخر سطر تعريف.`dsh-resource://file/session/<sessionId>/<path>` إشارة تحديد تخويل Host قراءة Session، و مساحة العمل متبادل مقابل أو قطعا مقابل مسار. قبل توجيه مائل عمود إبقاء في مسار في:`/etc/hosts` مقابل `dsh-resource://file/session/s//etc/hosts`،Windows قرص رمز مقابل `dsh-resource://file/session/s/C:/x/y.txt`،UNC مقابل `dsh-resource://file/session/s///server/share/y.txt`.Host تحليل مسار و تنفيذ وصول فحص.`absolute/<path>` شكل صيغة ما زال يمكن تحليل، لكن لا يحمل تخويل Session، لذلك file مزود لا يستطيع قراءة،Preview أيضا لا إقرار قيادة؛ اثنان من متساو لا استعارة استخدام حالي أو Tab Session. لغة قاعدة إقامة في [`src/file-address.ts`](src/file-address.ts) ؛ مسار مساعد مساعدة دالة إبقاء في [`src/index.ts`](src/index.ts) و مجددا توجيه خروج هو.

`sessionFileAddress(sessionId, path)` سوف `\` عودة واحد لـ `/`، ذهاب إسقاط قبل توجيه `./`، لكن إبقاء قبل توجيه `/` محرف.id و كل مسار مقطع كل فعل مكون تحرير رمز،`:` إبقاء حرف وجه.`fileAddressFor(sessionId, cwd, path)` بداية نهاية بنية صنع Session عنوان:`cwd` داخل مسار تحويل لـ متبادل مقابل مسار؛ أخرى قطعا مقابل مسار (يشمل `cwd` لم معرفة وقت) ما زال بصفة هذا Session عنوان داخل قطعا مقابل مسار.`absoluteFileAddress(absolutePath)` فقط بنية صنع لا حمل Session شكل صيغة.`parseFileAddress(address)` فحص دقيق ملف عنوان بادئة، تجاهل اختصار استعلام و قطعة مقطع بعد لاحقة، تدريجي مقطع حل رمز، و لـ Session عنوان إرجاع `{ scope, sessionId, path }`، لـ لا حمل Session شكل صيغة إرجاع `{ scope, path }`. أخرى type أو scheme، لم معرفة أثر مجال، نقص id أو مسار، أو خطأ تحويل معنى كل إرجاع `undefined`.

-----

## معروف حد و مؤقت مؤقت أمر بند

<a id="known-limitations-and-deferred-work"></a>

- **مسار تحليل فقط معالجة حرف وجه قيمة**——هو تعرف آخر POSIX قطعا مقابل مسار،Windows قرص رمز مسار و UNC مسار، تجميع وصل متبادل مقابل مسار وقت إبقاء Workspace مسار قسم فصل رمز، لكن لا وصول نظام الملفات، أيضا لا مواصفة تحويل `.` و `..` مسار مقطع.
- **رئيسي دليل تقليص كتابة فقط دعم حمل POSIX**——Windows مسار إبقاء ثابت، لأن يمكن نقل غرس متصفح لا يمكن أمان دفع قطع Windows رئيسي دليل مسار انتظار قيمة علاقة.


<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>

**وقت التشغيل ثابت صيغة:** لا إصدار مرافق توليد مدخل. هذا عدد أداة لا يحتفظ متغير وقت التشغيل علاقة.
