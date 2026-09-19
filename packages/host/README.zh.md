---
description: "Web GUI Host جانب حزمة خريطة:HTTP و SPA خادم، مساحة العمل دليل اختيار تنفيذ،open-in-app بدء توجيه و إضافة بيان إسقاط."
kind: "package-group"
---

# host/ — Web GUI مضيف جانب

[English](README.md) | العربية

## عام وصف

`host/` مجموعة توفير Web GUI عادي HTTP خادم، خدمة قد بناء Web قشرة SPA dist خادم، حمل أصلي/تصفح تصفح/ذاتي ملائم ينبغي تركيب حزمة مساحة العمل دليل اختيار seam،open-in-app تطبيق استكشاف قياس و بدء توجيه، و فقط قراءة إضافة بيان إسقاط. هذا ثمانية عدد حزمة كل هو منتج حزمة؛ متصفح نقل يقع في [`client/`](../client/README.zh.md) ، تركيب تطبيق هو [`apps/cli`](../../apps/cli/README.zh.md) ، هو بدء [`dsh-base` تركيب حزمة](../bundle/base/cordis.patch.yml) قدوم توفير `apps/web/` تحت Web تطبيق. اختيار جهاز خلفية يمكن في مشترك seam بعد متبادل متبادل استبدال.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

ثمانية عدد حزمة قسم آخر تحمل تحمل Host زاوية لون؛ كل حزمة README يملك ذاتي ذات اتفاق و إعداد.

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`webserver/`](webserver/README.zh.md) | متصفح HTTP خادم: أداة اسم توجيه،upgrade،index تحويل و رجوع مقعد موضع | `ctx.webServer` |
| [`frontend-static/`](frontend-static/README.zh.md) | احتلال حسب webserver رجوع مقعد موضع SPA dist خادم | إزالة استهلاك `ctx.webServer` |
| [`directory-picker/`](directory-picker/README.zh.md) | مساحة العمل دليل اختيار seam: قدرة اتفاق و خطأ مفردات | `ctx.directoryPicker` |
| [`directory-picker-native/`](directory-picker-native/README.zh.md) | موجه إلى مضيف شاشة ستار قبل عملية من أصلي OS اختيار جهاز خلفية | تسجيل `ctx.directoryPicker` |
| [`directory-picker-browse/`](directory-picker-browse/README.zh.md) | تطبيق داخل دليل متصفح خلفية، أيضا خدمة في بعيد مسار عميل | تسجيل `ctx.directoryPicker` |
| [`directory-picker-auto/`](directory-picker-auto/README.zh.md) | في بدء وقت تركيب مطابقة خلفية مضيف ذاتي ملائم ينبغي اختيار جهاز | تركيب واحد خلفية |
| [`open-in-app/`](open-in-app/README.zh.md) | في قد تثبيت تطبيق في فتح workspace دليل تطبيق استكشاف قياس، رسم علامة و بدء توجيه | إزالة استهلاك `ctx.webServer` |
| [`plugin-inventory/`](plugin-inventory/README.zh.md) | حالي Loader بند فقط قراءة إسقاط | Remote `pluginInventory/list` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من نقل و مساحة العمل سجل فرعي نظام مشاركة اعتبار قراءة بدء، مجددا نظر Web Client خلف بعد قسم طبقة قرار.

- [HTTP خادم فرعي نظام](../../docs/subsystems/web-server.zh.md)——webserver توجيه، مطابقة ترتيب و إعداد.
- [مساحة العمل فرعي نظام](../../docs/subsystems/workspace.zh.md)——دليل اختيار جهاز الذي تغذية إعطاء مساحة العمل سجل.
- [Web إعداد شجرة بدء و نقل قسم طبقة](../../.agents/notes/implemented/architecture/2026-07-24-web-config-tree-boot-and-transport-layering.zh.md)——Web نقل كل طبقة كل حق.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
