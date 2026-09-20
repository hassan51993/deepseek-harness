---
description: "أنواع حفظ الجلسة الدائم الاسترجاعية وتغييرات الإصدارات المتجاورة للوسم dsh-v0.1.0-rc.7."
kind: persistence-release
---

# إصدار الحفظ الدائم: dsh-v0.1.0-rc.7

[English](dsh-v0.1.0-rc.7.md) | العربية

## الملخص

يتغيّر الحقلُ replayState في `assistant/chunk` من unknown إلى كائن بحقل response مطلوب وحقل blocks اختياري. ويبقى إصدار الكاتب 0.

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
| وسم المصدر | `dsh-v0.1.0-rc.7` |
| تاريخ المصدر | 2026-08-17T11:03:17.000Z |
| سجل الإصدار | كائن الإصدار موجود. |
| الإصدار السابق | [dsh-v0.1.0-rc.6](dsh-v0.1.0-rc.6.ar.md) |
| إصدار كاتب Session | 0 |
| الجرد المعاد بناؤه | <!-- persistence-release-inventory:start -->47 جذرًا / 376 نوعًا<!-- persistence-release-inventory:end --> |
| هذه اللقطة | [dsh-v0.1.0-rc.7.schema.json](dsh-v0.1.0-rc.7.schema.json) |

دليلُ المصدر لثابت إصدار الكاتب عند هذا الوسم:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 0`

<a id="declaration"></a>
## التصريح

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
## التغييرات البنيوية

<!-- persistence-release-changes:start -->

اكتُشف 1 جذرًا متغيّرًا و1 فرقًا بنيويًا. والحدُّ الأدنى أدناه محسوبٌ بالقواعد الحالية للمقارنة وحدها؛ وهو لا يؤكّد امتثالًا تاريخيًا ولا صحةَ ترحيل ولا توافقًا في وقت التشغيل.

| المسار | التغيير | الحد الأدنى الحالي |
|---|---|---|
| `event:assistant/chunk.data.chunk.replayState` | `type-changed` | `version-bump` |

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
