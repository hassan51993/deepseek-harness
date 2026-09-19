---
description: "عودة تتبع dsh-v0.1.0-rc.8 قد إعلان Session حفظ دائم نوع و متبادل مجاور إصدار تغير."
kind: persistence-release
---

# حفظ دائم إصدار عودة تتبع: dsh-v0.1.0-rc.8

[English](dsh-v0.1.0-rc.8.md) | العربية

## عام وصف

إضافة جديدة أربعة نوع team/* حدث و مستخدم رسالة مصدر تغيير جسم team-message؛assistant/message إضافة جديدة اختياري حقل interrupted. كتابة صيغة ما زال لـ 0.

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
| شفرة المصدر tag | `dsh-v0.1.0-rc.8` |
| شفرة المصدر يوم مدة | 2026-08-19T15:11:50.000Z |
| إرسال سطر سجل | لديه release كائن. |
| قبل واحد إصدار | [dsh-v0.1.0-rc.7](dsh-v0.1.0-rc.7.zh.md) |
| Session كتابة إصدار | 0 |
| كامل إعادة بناء بيان | <!-- persistence-release-inventory:start -->51 عدد أصل نوع / 403 نوع نوع<!-- persistence-release-inventory:end --> |
| هذا بند لقطة | [dsh-v0.1.0-rc.8.schema.json](dsh-v0.1.0-rc.8.schema.json) |

كتابة إصدار معتاد كمية في هذا tag في شفرة المصدر دليل:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 0`

<a id="declaration"></a>
## إعلان

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.0-rc.8
previous: dsh-v0.1.0-rc.7
sessionFormatVersion: 0
changes:
  - root: event:agent/inbox/spliced
    before: dea3a1d5640e0306a486f92b725a01b57e69439277978ca09dc246fb40016b90
    after: 7a0b347ba6a465a7813490036bde98bdc658609c6de9545ba58be26c372c5030
  - root: event:assistant/message
    before: 390aeb83383643633a1935f09f84fe19d2aee8d4f500a8de70f88d388562cc50
    after: fb7d974e1945b4c8e72ee540daf64eb9e81984030ff52e1a97a4e1f71b9dd2f9
  - root: event:session/title-llm-request
    before: 796a77af2c1452392f0cc62b99fba2d404d1c9eb10a8a2510a808fba6053cf24
    after: ee6c879669bb83325e4cd3011227f238bf51765744990fc4bb12089d6dd6563a
  - root: event:team/member
    before: null
    after: 31d13edbb5fe2f8b7a38056320a8a06275ee4426e0abf12d4741818beda5a9c9
  - root: event:team/message/delivered
    before: null
    after: c53bff743470c8bf11be698ced047072744ef088cce663a774b456d7a8982516
  - root: event:team/message/queued
    before: null
    after: 577054184d5f038bd96d6db70b76983a2bb62a8eea8eeed8ca3b0d47af0f462a
  - root: event:team/task
    before: null
    after: 1688a2451eef9da19eaf45f12c8a27df07b1a6e56fa57ba603118f5201bb435b
  - root: event:user/message
    before: 18c8d77777545808f232cd8d7730ce270cb1b737edd3eaa45e0da9436fd37a13
    after: e7eec68e39f9f44b2e53d799e5d5dd08f559558a27e93eb2a272782f040be50a
```

<a id="changes"></a>
## بنية تغير

<!-- persistence-release-changes:start -->

فحص قياس إلى 8 عدد أصل نوع تغير،8 بند بنية فرق مختلف. تحت جدول الأكثر منخفض اشتراط حسب حالي قاعدة حساب حساب، فقط لأجل مقارنة مقارنة؛ لا يمثل قديم إصدار سبق التزام حراسة هذه قاعدة، أيضا لا إثبات ترحيل أو وقت التشغيل توافق صفة.

| مسار | تغير | حالي الأكثر منخفض اشتراط |
|---|---|---|
| `event:agent/inbox/spliced.data.inserted[].source` | `union-variants-changed` | `version-bump` |
| `event:assistant/message.data.interrupted` | `optional-property-added` | `same-version` |
| `event:session/title-llm-request.data.messages[].source` | `union-variants-changed` | `version-bump` |
| `event:team/member` | `root-added` | `same-version` |
| `event:team/message/delivered` | `root-added` | `same-version` |
| `event:team/message/queued` | `root-added` | `same-version` |
| `event:team/task` | `root-added` | `same-version` |
| `event:user/message.data.source` | `union-variants-changed` | `version-bump` |

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
