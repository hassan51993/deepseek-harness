---
description: "لـ تطوير و إعداد قد تثبيت Harness إضافة agent توفير فقط قراءة وقت التشغيل API استعلام."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-cordis

[English](README.md) | العربية

## عام وصف

تحرير كتابة إضافة شفرة قبل استعلام Host و Client وقت التشغيل API. إنشاء صنع نمط معا توفير هذه فقط قراءة أداة و Plugin Manager، بعد من مسؤول حفظ دائم profile تغيير. فحص سجل التسجيل من Cordis host runner توفير؛ متصفح استعلام حاجة قد اتصال صفحة.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [معروف حد و انتظار إنجاز](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

إنشاء صنع نمط يتضمن هذا مجموعة أداة. أخرى تركيب حاجة معا تركيب `@deepseek-ai/dsh-tool-cordis` و توفير `cordisInspect` host runner. استدعاء `cordis_inspect_list` اكتشاف provider، مجددا استخدام `cordis_inspect_query` استعلام ذلك أداة جسم طريقة و نوع. عبر [Plugin Manager](../../boot/plugin-manager/README.zh.md) تثبيت يتضمن إضافة شفرة أو MCP إعداد تركيب حزمة.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة — انقر للتوسيع</summary>

Host provider ربط دمج توليد Service/Event دليل و طلب agent أداة سجل التسجيل.Client provider عبر قائم فحص سجل التسجيل تزامن بيان، و من قد اتصال صفحة عودة جواب استعلام. أداة إضافة عبر Cordis effect يحتفظ تسجيل؛ تحرير وقت إزالة أداة و نص التوجيه مساهمة. فحص مباشر قراءة provider، لا صيانة مستقل وقت التشغيل إسقاط، لذلك لا إصدار ثابت صيغة إعداد طقم إضافة.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [Plugin Manager](../../boot/plugin-manager/README.zh.md) — حفظ دائم تركيب حزمة تثبيت و بدء توقف.
- [Cordis host runner](../cordis-host-runner/README.zh.md) — فحص سجل التسجيل و قائم وقت التشغيل إزالة استهلاك من.

<a id="model-experience"></a>
## تجربة النموذج

### وقت التشغيل فحص

#### نموذج الذي رؤية

[أداة دليل](../../../docs/tool-catalog.zh.md#deepseek-aidsh-tool-cordis) وصف اثنان عدد فقط قراءة فحص أداة.[نص التوجيه](src/prompt.ts) إشارة جذب نموذج عبر Plugin Manager إجراء حفظ دائم تغيير و شرح MCP ضبط طريقة. إنشاء صنع نمط نظر شعور طلب افتراضي عبر قد تثبيت UI إضافة عرض في حالي Web صفحة؛ تطوير تقنية قدرة شرح Client تحزيم و slot تسجيل طريقة. استعلام نتيجة يتضمن الذي طلب API إعلان أو حالي أداة schema.

#### Token أثر

إضافة مرئي وقت، اثنان عدد أداة schema و إشارة توجيه مقطع سقوط دخول نموذج طلب. استعلام نتيجة إلحاق إلى تحويل تسجيل في؛ دقيق استعلام تجنب تجنب تحميل غير متصل إعلان.

#### KV Cache أثر

لم تغيير schema و إشارة توجيه إبقاء بادئة مستقر. استعلام نتيجة إلحاق إلى تاريخ في؛ تفعيل أخرى إضافة ممكن تغيير لاحق أداة schema.

## معروف حد و انتظار إنجاز

<a id="known-limitations-and-deferred-work"></a>

- Client استعلام انتظار صفحة استجابة أو إلغاء. فحص لا يستطيع استدعاء خدمة طريقة، إعداد إضافة أو تنفيذ توليد شفرة.

<a id="dev-note"></a>
### ملاحظة تطوير

بلا.
