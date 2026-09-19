---
description: "مستخدم ضبط قدرة عائلة حزمة خريطة: تحليل كل namespace إعداد ctx.settings خدمة، و تخزين هو YAML/JSON ملف مزود."
kind: "package-group"
---

# settings/: مستخدم يمكن تحرير إعداد

[English](README.md) | العربية

## عام وصف

`settings/` مجموعة يجعل إضافة إعداد تغيير لـ مستخدم يمكن تحرير: إضافة استخدام واحد schema تسجيل أداة اسم namespace، مستخدم في واحد نسخة وثيقة داخل تغطية قيمة، بلا حاجة تعديل `cordis.yml`. مستخدم تغطية أولوية في نشر ذاته إعداد و schema قيمة افتراضية، تغيير فوري توليد فاعلية. اثنان عدد حزمة تغطية هذا قدرة:`settings/` توفير ضبط خدمة،`settings-file/` يأخذ كل namespace تخزين دخول واحد مستخدم يمكن تحرير YAML أو JSON وثيقة. ضبط هو اختياري: لا يوجد تركيب مزود وقت، إعداد إبقاء تركيب أصل مثال.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

اثنان عدد حزمة تغطية هذا قدرة؛ كامل اتفاق من كل فرعي درجة README مسؤول، نفاد كل صيغة خدمة واجهة وجه من فرعي نظام مشاركة اعتبار مسؤول.

| حزمة | زاوية لون | ctx مفتاح |
|---|---|---|
| [`settings/`](settings/README.zh.md) | ضبط خدمة: تسجيل namespace و قراءة أو تعديل ذلك قيمة | `ctx.settings` |
| [`settings-file/`](settings-file/README.zh.md) | يأخذ ضبط تخزين دخول واحد محلي YAML/JSON ملف و فوري إصدار خارجي تعديل | تسجيل `ctx.settings` |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من فرعي نظام مشاركة اعتبار حل مشترك مفردات، مجددا نظر هذا بيت عائلة التزام دوران قدرة seam تفكيك قسم.

- [ضبط فرعي نظام مشاركة اعتبار](../../docs/subsystems/settings.zh.md)——namespace، قسم طبقة تحليل،descriptor، تغيير إيداع و توليد Cordis واجهة.
- [قدرة seam](../../docs/capability-seams.zh.md)——هذا بيت عائلة التزام دوران Service Definition / Service Provider / Consumer تفكيك قسم.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
