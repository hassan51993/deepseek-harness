---
description: "متصفح عملية مزود تسجيل خدمة، توفير مرة تفعيل واحد متصفح خلفية نشر استخدام."
kind: "package-reference"
---

# @deepseek-ai/dsh-browser-use

[English](README.md) | العربية

## عام وصف

نشر يمكن مرة تفعيل واحد متصفح عملية مزود. تحميل آخر عدد مزود وقت سوف تقرير خطأ و إشارة خروج قد تسجيل مزود اسم. كل مزود توفير ذاتي ذات أداة و يملك متصفح جلسة. هذه الحزمة لا إضافة نموذج مرئي أداة أو متصفح عملية.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [تأخير امتداد قراءة قراءة](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

في Cordis تركيب في، سوف خدمة و الذي اختيار مزود واحد بدء تركيب مرة:

```yaml
- name: '@deepseek-ai/dsh-browser-use'
```

خدمة لا يوجد إعداد. مزود إضافة حقن `browserUse` و استدعاء `ctx.browserUse.register(BrowserUseProviderName(name))`؛ صنف لوحة نوع من `@deepseek-ai/dsh-browser-use/brand` تصدير. إرجاع effect تنظيف جهاز تحرير هذا تسجيل.

مزود في تحرير تسجيل قبل إيقاف استقبال استدعاء الأداة، إغلاق مورد و انتظار ذاتي ذات يملك عمل انتهاء.`ctx.browserUse.providerName` في تحرير قبل حمل متابعة تقرير إبلاغ قد تسجيل اسم.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ داخلي آلية — انقر للتوسيع</summary>

واحد خاص اسم يملك هذا تسجيل موضع.Cordis effect في إضافة إزالة وقت إزالة مساهمة؛ تكرار استدعاء تنظيف جهاز لا يستطيع إزالة لاحق تسجيل.[شفرة المصدر](src/index.ts) لا يتضمن متصفح كائن، عملية واجهة، مورد دورة الحياة أو مزود اختيار جهاز.

لا إصدار وقت التشغيل ثابت كمية مرافق مع مدخل: سجل التسجيل فقط لديه واحد مرجعي حقل، لا كشف ممكن و لـ انحراف مغادرة مستقل صيانة مراقبة قياس قيمة. الذي تابع اختبار تغطية تكرار تسجيل رفض و إضافة تنظيف.

</details>

-----

<a id="further-exploration"></a>
## تأخير امتداد قراءة قراءة

- [متصفح عملية](../../../docs/subsystems/browser-use.ar.md) — مزود اختيار و Session كل حق.
- [Playwright MCP مزود](../../experimental/browser-use-playwright-mcp/README.ar.md) — Playwright متصفح أداة.
- [Chrome DevTools MCP مزود](../../experimental/browser-use-chrome-devtools-mcp/README.ar.md) — Chromium فحص و تحكم.
- [Stagehand مزود](../../experimental/browser-use-stagehand-native/README.ar.md) — دعم حمل AI(شخص عمل ذكي) مساعد مساعدة أصلي متصفح عملية.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن هذا سجل التسجيل فقط سجل مزود اسم.

#### KV Cache أثر

تسجيل لا تغيير نموذج طلب. مزود يملك أداة و إشارة توجيه قرار كل منها مقابل طلب بادئة أثر.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

خدمة في ذلك Cordis خدمة نسخة داخل حد تسجيل.

- **متصفح كل حق** — مزود يملك متصفح مورد و فعلي تطبيق Session عزل؛ هذا خدمة لا حفظ متصفح حالة.
- **مزود اختيار** — إعداد اختيار مزود؛ نموذج لا يستطيع في وقت التشغيل تبديل قد تسجيل خلفية.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق — انقر للتوسيع</summary>

بلا.

</details>
