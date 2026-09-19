---
description: "عودة تتبع dsh-v0.1.3-alpha.2 قد إعلان Session حفظ دائم نوع و متبادل مجاور إصدار تغير."
kind: persistence-release
---

# حفظ دائم إصدار عودة تتبع: dsh-v0.1.3-alpha.2

[English](dsh-v0.1.3-alpha.2.md) | العربية

## عام وصف

إضافة جديدة feedback/message-put و feedback/message-delete، قد لديه حفظ دائم أصل نوع ملخص إبقاء ثابت. كتابة صيغة ما زال لـ 2.

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
| شفرة المصدر tag | `dsh-v0.1.3-alpha.2` |
| شفرة المصدر يوم مدة | 2026-09-07T11:45:35.000Z |
| إرسال سطر سجل | لديه release كائن. |
| قبل واحد إصدار | [dsh-v0.1.3-alpha.1](dsh-v0.1.3-alpha.1.zh.md) |
| Session كتابة إصدار | 2 |
| كامل إعادة بناء بيان | <!-- persistence-release-inventory:start -->56 عدد أصل نوع / 435 نوع نوع<!-- persistence-release-inventory:end --> |
| هذا بند لقطة | [dsh-v0.1.3-alpha.2.schema.json](dsh-v0.1.3-alpha.2.schema.json) |

كتابة إصدار معتاد كمية في هذا tag في شفرة المصدر دليل:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 2`

<a id="declaration"></a>
## إعلان

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.3-alpha.2
previous: dsh-v0.1.3-alpha.1
sessionFormatVersion: 2
changes:
  - root: event:feedback/message-delete
    before: null
    after: 3ee93b06f3a125850337602bcdf155d2538c43a5c944ec55b1b3c365152d6796
  - root: event:feedback/message-put
    before: null
    after: 3b04fde0dc763cf84fbde7b6611b3194dd56d95d0c0bf0204311640468d586e1
```

<a id="changes"></a>
## بنية تغير

<!-- persistence-release-changes:start -->

فحص قياس إلى 2 عدد أصل نوع تغير،2 بند بنية فرق مختلف. تحت جدول الأكثر منخفض اشتراط حسب حالي قاعدة حساب حساب، فقط لأجل مقارنة مقارنة؛ لا يمثل قديم إصدار سبق التزام حراسة هذه قاعدة، أيضا لا إثبات ترحيل أو وقت التشغيل توافق صفة.

| مسار | تغير | حالي الأكثر منخفض اشتراط |
|---|---|---|
| `event:feedback/message-delete` | `root-added` | `same-version` |
| `event:feedback/message-put` | `root-added` | `same-version` |

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
