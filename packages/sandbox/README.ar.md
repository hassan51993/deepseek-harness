---
description: "عملية صندوق رملي حزمة مجموعة: عزل seam، كل منصة خلفية، مشترك سياسة محلل و Windows كتابة حد ملف."
kind: "package-group"
---

# packages/sandbox

[English](README.md) | العربية

## عام وصف

`sandbox/` مجموعة سوف عملية فرعية تنفيذ حد في ملف فاعلية نتيجة سياسة لـ تحت: أمر بـ `read-only` تشغيل، فقط قدرة كتابة جلسة مساحة العمل (`workspace-write`) أو لا تلقي حد أرض تشغيل (`danger-full-access`). أربعة عدد حزمة تسليم هذا قدرة: عزل خدمة (`sandbox/`) ، موجه إلى Linux،macOS و Windows كل منصة خلفية (`sandbox-local/`) ، مشترك سياسة محلل (`sandbox-policy/`) و Windows كتابة حد خلفية (`sandbox-windows-acl/`). يتم سياسة رفض تلقي حد استدعاء يمكن عبر مستخدم دفعة دقيق مرة صفة رفع حق إعادة محاولة. عزل فقط ملائم لأجل و مضيف مشترك نظام الملفات و داخل نواة عملية فرعية؛ حاوية،microVM و بعيد مسار منفذ سوف استبدال كامل قدرة، بينما لا هو في هذا تسجيل.

## دليل

- [حزمة](#packages)
- [متبادل صلة وثيقة](#related-documentation)
- [ملاحظة تطوير](#dev-note)

-----

<a id="packages"></a>
## حزمة

أربعة عدد حزمة تحمل تحمل عزل زاوية لون؛ كامل اتفاق و تدريجي استدعاء سياسة دلالة بـ فرعي نظام مشاركة اعتبار وثيقة لـ دقيق.

| حزمة | مسؤولية | ctx key |
|---|---|---|
| [`sandbox/`](sandbox/README.ar.md) | عزل خدمة اتفاق: نمط، قوي صنع تنفيذ، تدريجي استدعاء سياسة و رفع حق مفردات | `ctx.sandbox` |
| [`sandbox-local/`](sandbox-local/README.ar.md) | كل منصة عزل خلفية:Linux أولا استخدام bwrap، مجددا استخدام Landlock؛macOS استخدام Seatbelt؛Windows استخدام تلقي حد أمر لوحة | تسجيل إلى `ctx.sandbox` |
| [`sandbox-policy/`](sandbox-policy/README.ar.md) | مشترك سياسة ملكية: توفير كل فعلي تطبيق عزل بيت عائلة استخدام نشر قيمة افتراضية و تدريجي جلسة نمط تغطية | `ctx.sandboxPolicy` |
| [`sandbox-windows-acl/`](sandbox-windows-acl/README.ar.md) | Windows كتابة حد: تلقي حد عملية فرعية فقط قدرة كتابة مساحة العمل و خاص مؤقت دليل | —(من `sandbox-local` تركيب لـ win32 خلفية) |

-----

<a id="related-documentation"></a>
## متبادل صلة وثيقة

أولا من فرعي نظام مشاركة اعتبار وثيقة حل مشترك مفردات، مجددا نظر عزل قرار و ذلك عبر بيت عائلة توسيع.

- [عملية صندوق رملي فرعي نظام](../../docs/subsystems/sandbox.ar.md)——نمط، تدريجي استدعاء سياسة، حزمة تركيب argv جهة قول و لذا عائق إغلاق خطأ.
- [عملية فرعية صندوق رملي قرار](../../.agents/notes/implemented/feature/2026-07-06-sandbox.ar.md)——قدرة حد، رفع حق تحرير ترتيب و تأجيل مرحلة مقطع.
- [عبر بيت عائلة ملف صندوق رملي قرار](../../.agents/notes/implemented/feature/2026-07-14-cross-family-fs-sandbox.ar.md)——موحد واحد مشترك سياسة ملكية و صندوق رملي تحويل نظام الملفات مزود.
- [Windows ACL تلقي حد أمر لوحة صندوق رملي قرار](../../.agents/notes/implemented/feature/2026-08-08-windows-acl-restricted-token-sandbox.ar.md)——لـ أي اختيار أصلي ACL تلقي حد أمر لوحة بينما غير mxc و AppContainer.

<a id="dev-note"></a>
## ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
