---
description: "أنواع حفظ الجلسة الدائم الاسترجاعية وتغييرات الإصدارات المتجاورة للوسم dsh-v0.1.1-rc.1."
kind: persistence-release
---

# إصدار الحفظ الدائم: dsh-v0.1.1-rc.1

[English](dsh-v0.1.1-rc.1.md) | العربية

## الملخص

يكتسب `permission/preset` الحقلَ الاختياري origin بالقيم default وselection وinferred. ويبقى إصدار الكاتب 0.

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
| وسم المصدر | `dsh-v0.1.1-rc.1` |
| تاريخ المصدر | 2026-08-21T06:21:44.000Z |
| سجل الإصدار | كائن الإصدار موجود. |
| الإصدار السابق | [dsh-v0.1.0-rc.8](dsh-v0.1.0-rc.8.ar.md) |
| إصدار كاتب Session | 0 |
| الجرد المعاد بناؤه | <!-- persistence-release-inventory:start -->51 جذرًا / 407 نوعًا<!-- persistence-release-inventory:end --> |
| هذه اللقطة | [dsh-v0.1.1-rc.1.schema.json](dsh-v0.1.1-rc.1.schema.json) |

دليلُ المصدر لثابت إصدار الكاتب عند هذا الوسم:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 0`

<a id="declaration"></a>
## التصريح

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.1-rc.1
previous: dsh-v0.1.0-rc.8
sessionFormatVersion: 0
changes:
  - root: event:permission/preset
    before: 5c45bf4c544a7211dcd8ba6ba7e5f1bc39b49e7a9df9d5cbdc8e87c22771b37b
    after: 7271e4b771406aaf06014c2269edd6cb68055bb8b8686571730813ce0ababc22
```

<a id="changes"></a>
## التغييرات البنيوية

<!-- persistence-release-changes:start -->

اكتُشف 1 جذرًا متغيّرًا و1 فرقًا بنيويًا. والحدُّ الأدنى أدناه محسوبٌ بالقواعد الحالية للمقارنة وحدها؛ وهو لا يؤكّد امتثالًا تاريخيًا ولا صحةَ ترحيل ولا توافقًا في وقت التشغيل.

| المسار | التغيير | الحد الأدنى الحالي |
|---|---|---|
| `event:permission/preset.data.origin` | `optional-property-added` | `same-version` |

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
