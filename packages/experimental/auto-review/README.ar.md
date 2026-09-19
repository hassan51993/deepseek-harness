---
description: "لـ Web profile إضافة فعلي تحقق صفة تدريجي استدعاء Auto review، في أداة بـ Full access تنفيذ قبل استخدام حالي agent نموذج مراجعة فحص."
kind: "package-bundle"
---

# @deepseek-ai/dsh-experimental-auto-review

[English](README.md) | العربية

## عام وصف

لـ Web profile حالي جلسة إذن اختيار جهاز إضافة Auto review. كل مرة أصلي أو PTC inner أداة استدعاء قبل، حالي agent provider و نموذج سوف تقييم تقدير انتظار تنفيذ حركة عمل؛ نيل دقيق استدعاء بـ Full access تنفيذ.dsh تثبيت مع مرفق هذا طبقة لكن افتراضي إغلاق؛ في Web جانب شريط إضافة صفحة فتح بدء أو صريح تثبيت قبل، افتراضي Web إبقاء ثلاثة نوع إذن نمط.Auto review هو فعلي تحقق وظيفة: هو ممكن خطأ وضع سطر لا أمان حركة عمل، خطأ رفض لديه استخدام عملية، و إزالة استهلاك مقدار خارج token.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

### تثبيت إلى profile

من شفرة المصدر checkout عبر قائم CLI سوف حزمة تثبيت إلى Web profile:

```sh
pnpm dsh plugin --profile web add ./packages/experimental/auto-review
```

CLI سوف في حاجة وقت ابتدائي تحويل profile، و سوف هذه الحزمة إعلان patch إلحاق إلى base و Web طبقة بعد.Reconciliation سوف patch تنشيط لـ profile طبقة؛ لا يوجد `dsh.bundle.patch` حزمة فقط هو قد تثبيت اعتماد. في composer أو `/permission` اختيار جهاز في اختيار حمل يمين فوق علامة `EXP` `Auto review`، و تأكيد حالي جلسة ريح خطر محادثة إطار. صريح `/permission auto` أمر مباشر تبديل. عام ضبط و لم قدوم جلسة قيمة افتراضية لا توفير Auto.

عبر نفس CLI إزالة هذا طبقة:

```sh
pnpm dsh plugin --profile web remove @deepseek-ai/dsh-experimental-auto-review
```

### نيل نيل قدرة

Auto في كل تلقي دعم حمل استدعاء body تنفيذ قبل مراجعة فحص مرة، يشمل كل قد بدء PTC `tools.*` inner call. هو حسب فعلي فاعلية نتيجة تصنيف: عادي مشروع داخل عملية و دقيق تنظيف هذا Session إنشاء كائن يخص low، مباشر سماح؛ غير ممكن عكس حذف قائم كائن، إنتاج عملية، خارجي كتابة و أمان تحكم تغيير يخص medium، حاجة حالي human أو مباشر أب درجة واضح تخويل حركة عمل، هدف و نطاق. عبر معلومة مهمة حد تسرب كشف حساس شعور معلومة يخص high، بداية نهاية رفض. فاعلية نتيجة لا واضح، تخويل اندفاع مفاجئ لم حل قرار، استجابة لا دمج قاعدة و تقنية فن فشل كل حسب رفض معالجة.

يتم رفض استدعاء استخدام عادي أداة بطاقة. طي سطر معرف Auto review؛ توسيع إخراج شرح body لم تنفيذ، و عرض اختياري إدارة من.[Web إذن حزمة](../../client/ui-permission-presets/README.ar.md) يملك اختيار جهاز تفاعل،[أداة UI](../../client/ui-tool/README.ar.md) يملك إدارة من عرض.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ داخلي آلية——انقر للتوسيع</summary>

[`cordis.patch.yml`](cordis.patch.yml) يأخذ هذه الحزمة ذاته إدراج دخول لـ `auto-review` سطر.[`src/index.ts`](src/index.ts) اشتراط LLM،permission،Session و tools خدمة، لكن بعد في نفس عدد effect في تثبيت preset contribution و وضع قبل pre-execute listener.[إذن owner](../../interaction/permission-presets/README.ar.md) توفير حالي هوية و عملية دليل؛Auto مشترك استخدام Full access قائم صندوق رملي و مراجعة دفعة قيمة، لا تغيير أداة تعريف.

Reviewer من حالي Session surface و انتظار تنفيذ استدعاء إعادة بناء خمسة عدد قسم منطقة: ثابت سياسة، فقط cwd بيئة، حمل مصدر مشروع قيد، مرور ترشيح بعد حمل مصدر تاريخ، و كامل انتظار مراجعة حركة عمل. أصلي schema قدوم ذاتي الأكثر جديد request header.PTC binding تجميد ربط ذلك schema، مرور من مجدول نقل دخول مؤقت تنفيذ بيانات وصفية؛ بدء و تسوية حدث كل لا تسلسل تحويل وصف أو معامل schema. رئيسي agent `system/message` عقدة،assistant متن و reasoning،tool results الكل ترتيب حذف.[قرار سجل](../../../.agents/notes/implemented/feature/2026-08-28-auto-review.ar.md) يملك مرجعي، دورة الحياة و child وراثة إدارة من.

إزالة وقت أولا إغلاق اختيار و review admission، مرور من قائم preset writer سوف تخزين نشط Auto Session ترحيل إلى Full access، مجددا في توقف و انتظار في طريق review ربط صاف، الأكثر بعد سحب عودة listener و contribution. دوران زر و حمل دائم طرفية في ترحيل في إبقاء ثابت. حمل دائم Auto Session نقص قليل كامل integration وقت لا يستطيع إصدار؛ تثبيت بعد إعادة فتح حاجة مستخدم صريح عملية. إعادة تركيب فقط استعادة خيار، لا يأخذ تخزين نشط Session قطع عودة Auto.

هذه الحزمة لا إصدار runtime invariant companion: نفس عدد effect يملك اختيار دقيق دخول،review تسجيل تسجيل، إلغاء و تنظيف، لا وجود قدرة و هذه ذاتي لديه عملية متبادل متبادل انحراف مغادرة مستقل مراقبة.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [فعلي تحقق حزمة](../README.ar.md)——إصدار سياسة و اعتماد عزل.
- [Web bundle](../../bundle/web-app/README.ar.md)——هذا patch توسيع مستقر profile.
- [Auto review قرار](../../../.agents/notes/implemented/feature/2026-08-28-auto-review.ar.md)——ثابت ريح خطر سياسة، مرجعي و دورة الحياة.
- [Tools](../../core/tools/README.ar.md)——تنفيذ، إلغاء و PTC نتيجة نقل بث.

-----

<a id="model-experience"></a>
## تجربة النموذج

### تدريجي استدعاء reviewer

#### نموذج يرى ماذا

Reviewer استخدام الأكثر جديد `request/header.config` provider و نموذج، و امتداد استخدام shipped adapter افتراضي reasoning. ثابت `REVIEW_POLICY` بديل تماما جيد واحد حركة عمل شخص عمل مراجعة دفعة:allow بعد قيام أي بـ Full access تنفيذ. ذلك بقية أربعة عدد قسم منطقة فقط يتضمن فوق نص صف خروج إبقاء واقع. استجابة لـ واحد صارم إطار JSON text كائن، يتضمن `risk` و `decision`؛deny يمكن مرفق نص `reason`.Reasoning blocks يمكن يقع في هذا وحيد text block قبل. فقط لديه `low + allow`،`medium + allow/deny` و `high + deny` دمج قاعدة.

#### Token أثر

كل تلقي دعم حمل استدعاء مقدار خارج إنتاج مرة نموذج طلب، لا ذاكرة مؤقتة، إعادة محاولة، قطع قطع، ضغط، أيضا لا ضبط مفرد وحيد صغير نوع إخراج ميزانية. تجاوز نافذة طلب حسب رفض معالجة.

#### KV Cache أثر

ثابت reviewer policy يمكن مشترك بادئة؛ إبقاء تاريخ و انتظار مراجعة حركة عمل مع استدعاء تغير.Auto لا نحو رئيسي agent زيادة مخصص باب runtime context أو نمط تبديل نص التوجيه.

### أداة رفض

#### نموذج يرى ماذا

رفض رسالة لـ `Auto review rejected tool "<name>"; its body was not executed`. عادي أصلي خطأ تصيير في قبل وجه إضافة `Error: `.PTC استخدام قائم inner-call استثناء و catch سلوك؛ يتم التقاط رفض لا قوي صنع خارج طبقة `run_code` فشل. اختياري أصلي إدارة من هو موجه إلى مستخدم حمل دائم بنية تحويل خطأ تفصيل حال، أبدا دخول رئيسي نموذج محتوى. ريح خطر،reviewer prompt،reasoning و أصلي استجابة كل لا حفظ دائم.

#### Token أثر

يتم رفض استدعاء فقط نحو رئيسي محادثة مساهمة عادي ثابت خطأ نتيجة.

#### KV Cache أثر

رفض إلحاق عادي أداة نتيجة، لا تعديل كتابة أكثر مبكر سياق، أيضا لا إخفاء قائم نموذج مرئي معلومة.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- Auto حاجة فتح بدء هذا Web طبقة؛ افتراضي Web،Headless، عام ضبط و جديد جلسة قيمة افتراضية كل لا يتضمن هو.
- Auto لا توفير ملف صندوق رملي. خارج طبقة `run_code` transport وPTC برنامج داخل مباشر Node فاعلية نتيجة لا مرور مرور inner-tool review.
- نموذج تصنيف ممكن خروج خطأ. لا توفير تحديد صفة أداة إعفاء تجنب، حمل دائم grant، شخص عمل fallback، يمكن إعداد سياسة أو إعادة محاولة طبقة.
- عملية داخل Auto child مستقل مراجعة فحص ذاته استدعاء. عملية خارج child في أب تفويض إرسال استدعاء نيل دقيق بعد إبقاء أصلي إذن نظام.
- reviewer في حمل سطر درجة إعفاء تجنب حال حال تحت، عبر قد ملغى ترك تزامن `snapshotEvents()` قراءة Session حركة عمل تاريخ. هذا قبل استدعاء،PTC start و مباشر أب درجة ابتدائي prompt هدف قبل كل لا يوجد إسقاط أو قسم صفحة قراءة جهة، لذلك ترحيل حسب[تزامن قراءة قرار](../../../.agents/notes/implemented/architecture/2026-09-09-deprecate-synchronous-session-event-reads.ar.md) متابعة تأجيل.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
