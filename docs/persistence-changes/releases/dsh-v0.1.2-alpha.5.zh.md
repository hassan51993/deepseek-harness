---
description: "عودة تتبع dsh-v0.1.2-alpha.5 قد إعلان Session حفظ دائم نوع و متبادل مجاور إصدار تغير."
kind: persistence-release
---

# حفظ دائم إصدار عودة تتبع: dsh-v0.1.2-alpha.5

[English](dsh-v0.1.2-alpha.5.md) | العربية

## عام وصف

إعادة بناء كل حفظ دائم أصل نوع ملخص متساو و فوق واحد alpha/rc وسم متسق. كتابة صيغة ما زال لـ 0.

## دليل

- [إرسال سطر مصدر](#evidence)
- [إعلان](#declaration)
- [بنية تغير](#changes)
- [تحقق](#verification)
- [ملاحظة تطوير](#dev-note)

-----

<a id="evidence"></a>
## إرسال سطر مصدر

هذا هو توفير قراءة قراءة و صيغة تحقق قريب يشبه عودة ملء، لا هو عند وقت توافق صفة تأكيد. رفع أخذ طريقة و تغطية حد رؤية[عودة ملف شرح](README.zh.md).

| مشروع | سجل قيمة |
|---|---|
| شفرة المصدر tag | `dsh-v0.1.2-alpha.5` |
| شفرة المصدر يوم مدة | 2026-09-02T07:57:43.000Z |
| إرسال سطر سجل | لديه release كائن. |
| قبل واحد إصدار | [dsh-v0.1.2-alpha.4](dsh-v0.1.2-alpha.4.zh.md) |
| Session كتابة إصدار | 0 |
| كامل إعادة بناء بيان | <!-- persistence-release-inventory:start -->54 عدد أصل نوع / 415 نوع نوع<!-- persistence-release-inventory:end --> |
| هذا بند لقطة | [dsh-v0.1.2-alpha.5.schema.json](dsh-v0.1.2-alpha.5.schema.json) |

كتابة إصدار معتاد كمية في هذا tag في شفرة المصدر دليل:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 0`

<a id="declaration"></a>
## إعلان

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.2-alpha.5
previous: dsh-v0.1.2-alpha.4
sessionFormatVersion: 0
changes: []
```

<a id="changes"></a>
## بنية تغير

<!-- persistence-release-changes:start -->

مواصفة تحويل بعد أصل نوع و ذلك نقل تمرير مرجع ملخص و قبل واحد tag نفسه.

<!-- persistence-release-changes:end -->

<a id="verification"></a>
## تحقق

رفع أخذ نتيجة قد عبر مواصفة رسم، أصل ملخص و الكل يمكن بلوغ نوع ملخص تحقق؛ فقط مقابل تاريخ surface حدث سماح شفرة المصدر أصل لديه اختياري `surfaceOp`. مستودع داخل فحص من قبل دفع إعادة بناء كل tag، نواة مقابل before/after، لقطة تغطية و مزدوج لغة آلة جهاز إعلان.

```sh
pnpm run verify-persistence-releases
```

<a id="dev-note"></a>
## ملاحظة تطوير

بلا.
