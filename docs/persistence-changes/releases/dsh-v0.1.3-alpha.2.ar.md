---
description: "أنواع حفظ الجلسة الدائم الاسترجاعية وتغييرات الإصدارات المتجاورة للوسم dsh-v0.1.3-alpha.2."
kind: persistence-release
---

# إصدار الحفظ الدائم: dsh-v0.1.3-alpha.2

[English](dsh-v0.1.3-alpha.2.md) | العربية

## الملخص

يُضاف `feedback/message-put` و`feedback/message-delete` بلا تغيير بصمات جذور الحفظ الدائم القائمة. ويبقى إصدار الكاتب 2.

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
| وسم المصدر | `dsh-v0.1.3-alpha.2` |
| تاريخ المصدر | 2026-09-07T11:45:35.000Z |
| سجل الإصدار | كائن الإصدار موجود. |
| الإصدار السابق | [dsh-v0.1.3-alpha.1](dsh-v0.1.3-alpha.1.ar.md) |
| إصدار كاتب Session | 2 |
| الجرد المعاد بناؤه | <!-- persistence-release-inventory:start -->56 جذرًا / 435 نوعًا<!-- persistence-release-inventory:end --> |
| هذه اللقطة | [dsh-v0.1.3-alpha.2.schema.json](dsh-v0.1.3-alpha.2.schema.json) |

دليلُ المصدر لثابت إصدار الكاتب عند هذا الوسم:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 2`

<a id="declaration"></a>
## التصريح

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
## التغييرات البنيوية

<!-- persistence-release-changes:start -->

اكتُشف 2 جذرًا متغيّرًا و2 فرقًا بنيويًا. والحدُّ الأدنى أدناه محسوبٌ بالقواعد الحالية للمقارنة وحدها؛ وهو لا يؤكّد امتثالًا تاريخيًا ولا صحةَ ترحيل ولا توافقًا في وقت التشغيل.

| المسار | التغيير | الحد الأدنى الحالي |
|---|---|---|
| `event:feedback/message-delete` | `root-added` | `same-version` |
| `event:feedback/message-put` | `root-added` | `same-version` |

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
