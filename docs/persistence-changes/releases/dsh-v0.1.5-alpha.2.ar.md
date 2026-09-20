---
description: "أنواع حفظ الجلسة الدائم الاسترجاعية وتغييرات الإصدارات المتجاورة للوسم dsh-v0.1.5-alpha.2."
kind: persistence-release
---

# إصدار الحفظ الدائم: dsh-v0.1.5-alpha.2

[English](dsh-v0.1.5-alpha.2.md) | العربية

## الملخص

يُضاف `deliverables/presented` و`subagent/catalog`. وتكتسب سجلاتُ الملاحظات الحقلَ الاختياري category، ويصير نصُّ `feedback/record` اختياريًا، ويبقى إصدار الكاتب 3.

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
| وسم المصدر | `dsh-v0.1.5-alpha.2` |
| تاريخ المصدر | 2026-09-09T14:13:03.000Z |
| سجل الإصدار | كائن الإصدار موجود. |
| الإصدار السابق | [dsh-v0.1.5-alpha.1](dsh-v0.1.5-alpha.1.ar.md) |
| إصدار كاتب Session | 3 |
| الجرد المعاد بناؤه | <!-- persistence-release-inventory:start -->59 جذرًا / 462 نوعًا<!-- persistence-release-inventory:end --> |
| هذه اللقطة | [dsh-v0.1.5-alpha.2.schema.json](dsh-v0.1.5-alpha.2.schema.json) |

دليلُ المصدر لثابت إصدار الكاتب عند هذا الوسم:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 3`

<a id="declaration"></a>
## التصريح

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.5-alpha.2
previous: dsh-v0.1.5-alpha.1
sessionFormatVersion: 3
changes:
  - root: event:deliverables/presented
    before: null
    after: 13d3d180f977bf78081d487ffa0ecb75857349bcab29a5a3fb48189fca2a6176
  - root: event:feedback/message-put
    before: 3b04fde0dc763cf84fbde7b6611b3194dd56d95d0c0bf0204311640468d586e1
    after: b5086d249e8502e9ead1d39156bb8d559bde7951cac0f14ce150345b4e42a2bf
  - root: event:feedback/record
    before: fb9df8180a202f3c845d5aa6a81697b2f7213f6735abc17535a55656be60a575
    after: b54940ff095c17e874c5be03815f4c2145a256cf3a1d34dae4ab2f7769dfffe8
  - root: event:subagent/catalog
    before: null
    after: ae1f7110feeec697b8cab42b68f7709aa7b3279764099dfb53c25890d2e5c871
```

<a id="changes"></a>
## التغييرات البنيوية

<!-- persistence-release-changes:start -->

اكتُشف 4 جذرًا متغيّرًا و5 فرقًا بنيويًا. والحدُّ الأدنى أدناه محسوبٌ بالقواعد الحالية للمقارنة وحدها؛ وهو لا يؤكّد امتثالًا تاريخيًا ولا صحةَ ترحيل ولا توافقًا في وقت التشغيل.

| المسار | التغيير | الحد الأدنى الحالي |
|---|---|---|
| `event:deliverables/presented` | `root-added` | `same-version` |
| `event:feedback/message-put.data.item.category` | `optional-property-added` | `same-version` |
| `event:feedback/record.data.text` | `property-made-optional` | `same-version` |
| `event:feedback/record.data.category` | `optional-property-added` | `same-version` |
| `event:subagent/catalog` | `root-added` | `same-version` |

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
