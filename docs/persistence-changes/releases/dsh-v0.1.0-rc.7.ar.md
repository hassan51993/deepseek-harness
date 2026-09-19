---
description: "عودة تتبع dsh-v0.1.0-rc.7 قد إعلان Session حفظ دائم نوع و متبادل مجاور إصدار تغير."
kind: persistence-release
---

# حفظ دائم إصدار عودة تتبع: dsh-v0.1.0-rc.7

[English](dsh-v0.1.0-rc.7.md) | العربية

## عام وصف

assistant/chunk replayState من unknown تعديل لـ يتضمن مطلوب حقل response و اختياري حقل blocks كائن. كتابة صيغة ما زال لـ 0.

## دليل

- [إرسال سطر مصدر](#evidence)
- [إعلان](#declaration)
- [بنية تغير](#changes)
- [تحقق](#verification)
- [ملاحظة تطوير](#dev-note)

-----

<a id="evidence"></a>
## إرسال سطر مصدر

هذا هو توفير قراءة قراءة و صيغة تحقق قريب يشبه عودة ملء، لا هو عند وقت توافق صفة تأكيد. رفع أخذ طريقة و تغطية حد رؤية[عودة ملف شرح](README.ar.md).

| مشروع | سجل قيمة |
|---|---|
| شفرة المصدر tag | `dsh-v0.1.0-rc.7` |
| شفرة المصدر يوم مدة | 2026-08-17T11:03:17.000Z |
| إرسال سطر سجل | لديه release كائن. |
| قبل واحد إصدار | [dsh-v0.1.0-rc.6](dsh-v0.1.0-rc.6.ar.md) |
| Session كتابة إصدار | 0 |
| كامل إعادة بناء بيان | <!-- persistence-release-inventory:start -->47 عدد أصل نوع / 376 نوع نوع<!-- persistence-release-inventory:end --> |
| هذا بند لقطة | [dsh-v0.1.0-rc.7.schema.json](dsh-v0.1.0-rc.7.schema.json) |

كتابة إصدار معتاد كمية في هذا tag في شفرة المصدر دليل:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 0`

<a id="declaration"></a>
## إعلان

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.0-rc.7
previous: dsh-v0.1.0-rc.6
sessionFormatVersion: 0
changes:
  - root: event:assistant/chunk
    before: 7fd942b2189b8dbf6e1a2c7b026e9ddd1e7dba3fbe5645708a76f4cddabb281d
    after: de04e4ae000cc4422a15fb86dce7c398c8a9970ac963b6f7f785e2276a939e62
```

<a id="changes"></a>
## بنية تغير

<!-- persistence-release-changes:start -->

فحص قياس إلى 1 عدد أصل نوع تغير،1 بند بنية فرق مختلف. تحت جدول الأكثر منخفض اشتراط حسب حالي قاعدة حساب حساب، فقط لأجل مقارنة مقارنة؛ لا يمثل قديم إصدار سبق التزام حراسة هذه قاعدة، أيضا لا إثبات ترحيل أو وقت التشغيل توافق صفة.

| مسار | تغير | حالي الأكثر منخفض اشتراط |
|---|---|---|
| `event:assistant/chunk.data.chunk.replayState` | `type-changed` | `version-bump` |

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
