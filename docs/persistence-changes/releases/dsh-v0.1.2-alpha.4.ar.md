---
description: "أنواع حفظ الجلسة الدائم الاسترجاعية وتغييرات الإصدارات المتجاورة للوسم dsh-v0.1.2-alpha.4."
kind: persistence-release
---

# إصدار الحفظ الدائم: dsh-v0.1.2-alpha.4

[English](dsh-v0.1.2-alpha.4.md) | العربية

## الملخص

تستبدل `SessionHeader` المنطقية الحقلَ المطلوب isSeeded بالحقل الاختياري seedLength، بينما تظل ترويسةُ JSONL الفيزيائية تعلن seedLength. ويصير بديلا مصدر رسالة المستخدم subagent-report وcoordinator هما agent-message. ويبقى إصدار الكاتب 0.

## المحتويات

- [دليل الإصدار](#evidence)
- [التصريح](#declaration)
- [التغييرات البنيوية](#changes)
- [التحقق](#verification)
- [ملاحظة التطوير](#dev-note)

-----

<a id="evidence"></a>
## دليل الإصدار

هذا ملءٌ استرجاعي تقريبي يدعم القراءة والتحقق من الصيغ؛ وهو ليس تأكيدَ توافق معاصرًا. وانظر [مرجع الأرشيف](README.ar.md) لحدود الاستخراج والتغطية.

| البند | القيمة المسجَّلة |
|---|---|
| وسم المصدر | `dsh-v0.1.2-alpha.4` |
| تاريخ المصدر | 2026-09-01T15:37:26.000Z |
| سجل الإصدار | كائن الإصدار موجود. |
| الإصدار السابق | [dsh-v0.1.2-alpha.3](dsh-v0.1.2-alpha.3.ar.md) |
| إصدار كاتب Session | 0 |
| الجرد المعاد بناؤه | <!-- persistence-release-inventory:start -->54 جذرًا / 415 نوعًا<!-- persistence-release-inventory:end --> |
| هذه اللقطة | [dsh-v0.1.2-alpha.4.schema.json](dsh-v0.1.2-alpha.4.schema.json) |

دليلُ المصدر لثابت إصدار الكاتب عند هذا الوسم:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 0`

<a id="declaration"></a>
## التصريح

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.2-alpha.4
previous: dsh-v0.1.2-alpha.3
sessionFormatVersion: 0
changes:
  - root: SessionHeader
    before: a50373168c4935222b1681223d919a56d095ce37ad45c5ba2c20d75235adf937
    after: 001ed6f66d67fac9cb9594b55f13557db94174fe5d5954789bb5a2d6d5927226
  - root: event:agent/inbox/spliced
    before: ee796690277eafbcda4437478de7a8f01d983424d6238fe472df9b3b0d97a89f
    after: 15cdff6391d58ea00d7e2fe113b663d5479cbb3fd1af26717ad933c770bca081
  - root: event:session/title-llm-request
    before: 61651f4ca07ab9ebef773d82fafbcb74d39190a255c69ecc36084046123a9cb4
    after: 2cfb71f7819bc88a6bccbffa8b7ae5664233af6f6e1dfb068db25e2e17ddd8c7
  - root: event:user/message
    before: e23368db1646a9ac10d2bd4629084fdff583a1db2c83ffaa3f2f201d0c45f3e4
    after: e950c87ba49bd8175b8a670b319a599d5ed14cde996540d5ba91a141fad68781
```

<a id="changes"></a>
## التغييرات البنيوية

<!-- persistence-release-changes:start -->

اكتُشف 4 جذرًا متغيّرًا و5 فرقًا بنيويًا. والحدُّ الأدنى أدناه محسوبٌ بالقواعد الحالية للمقارنة وحدها؛ وهو لا يؤكّد امتثالًا تاريخيًا ولا صحةَ ترحيل ولا توافقًا في وقت التشغيل.

| المسار | التغيير | الحد الأدنى الحالي |
|---|---|---|
| `SessionHeader.seedLength` | `property-removed` | `version-bump` |
| `SessionHeader.isSeeded` | `required-property-added` | `version-bump` |
| `event:agent/inbox/spliced.data.inserted[].source` | `union-variants-changed` | `version-bump` |
| `event:session/title-llm-request.data.messages[].source` | `union-variants-changed` | `version-bump` |
| `event:user/message.data.source` | `union-variants-changed` | `version-bump` |

<!-- persistence-release-changes:end -->

<a id="verification"></a>
## التحقق

اجتاز الاستخراجُ تحقّقَ الرسم المعياري وبصمة الجذر وبصمة الأنواع القابلة للوصول، وسمح بالحقل الاختياري الأصلي `surfaceOp` في أحداث السطوح التاريخية وحدها. ويعيد الفحصُ داخل الشجرة بناءَ كل وسم من سلفه ويتحقق من قيم «قبل» و«بعد»، ومن تغطية اللقطات، ومن التصريحات الآلية الثنائية اللغة.

```sh
pnpm run verify-persistence-releases
```

<a id="dev-note"></a>
## ملاحظة التطوير

لا شيء.
