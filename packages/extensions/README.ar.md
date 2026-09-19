---
description: "وقت التشغيل API فحص، عملية داخل runner و تاريخ Cordis بطاقة."
kind: "package-group"
---

# packages/extensions

[English](README.md) | العربية

## عام وصف

extensions مجموعة لـ agent توفير فقط قراءة وقت التشغيل API اكتشاف، توفير برنامج و متصفح إزالة استهلاك من استخدام عملية داخل runner، و تاريخ توليد إضافة بطاقة.Creator نمط عبر [Plugin Manager](../boot/plugin-manager/README.ar.md) تثبيت حفظ دائم إضافة. حسب يحتاج اختيار فحص،Host تنفيذ،Client تنفيذ أو متصفح تحكم عنصر فرعي حزمة.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

| حزمة | مسؤولية | ctx مفتاح |
|---|---|---|
| [`tool-cordis`](tool-cordis/README.ar.md) | اثنان عدد فقط قراءة وقت التشغيل API اكتشاف أداة | تسجيل إلى `ctx.tools` |
| [`cordis-host-runner`](cordis-host-runner/README.ar.md) | host نصف: تعريف سجل التسجيل، صندوق رملي تحويل host نصف دورة الحياة، و لأجل ينبغي جواب متصفح استعلام inspect سجل التسجيل | توفير `ctx.dynamicCordisRunner` و `ctx.cordisInspect` |
| [`cordis-client-runner`](cordis-client-runner/README.ar.md) | متصفح نصف: سوف متصفح نصف شفرة المصدر طلب قيمة لـ تشغيل في إضافة، و ينبغي جواب تشغيل طلب | client وجه؛ توفير متصفح جانب `ctx.dynamicCordisRunner` |
| [`ui-cordis`](ui-cordis/README.ar.md) | متصفح وجه لوح و تاريخ دورة الحياة أداة بطاقة | client جانب؛ تسجيل slot |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

- [extensions فرعي نظام](../../docs/subsystems/extensions.ar.md)——توليد `ctx.cordisInspect` و `ctx.dynamicCordisRunner` خدمة API.
- [توليد أداة دليل](../../docs/tool-catalog.ar.md#deepseek-aidsh-tool-cordis)——اثنان عدد فقط قراءة أداة schema.
- [توليد إعداد دليل](../../docs/config-catalog.ar.md#deepseek-aidsh-cordis-host-runner)——runner تلقي دعم حمل إعداد حقل.
- [ذاتي مرجع Cordis أداة تجميع Agent Note](../../.agents/notes/implemented/feature/2026-07-08-self-referential-cordis-toolset.ar.md)——صندوق رملي دلالة، دورة الحياة و تركيب تصميم إقامة الذي.
- [عميل خارج قشرة و حركة حالة حزمة Agent Note](../../.agents/notes/implemented/architecture/2026-08-15-client-shells-and-dynamic-packages.ar.md)——متصفح نصف حزمة ملكية و بناء وجه.

-----

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

اثنان عدد متصفح نصف حزمة يقع في هذا مجموعة، بينما لا هو `packages/client/` تحت، لأن هو جمع قسم آخر هو هذا فرعي نظام مزدوج نصف حزمة متصفح نصف؛client وجه مرور من client program تحرير ترجمة هو جمع،host program فقط مرجع host runner.

</details>
