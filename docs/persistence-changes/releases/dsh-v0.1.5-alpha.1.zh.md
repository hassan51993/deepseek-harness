---
description: "عودة تتبع dsh-v0.1.5-alpha.1 قد إعلان Session حفظ دائم نوع و متبادل مجاور إصدار تغير."
kind: persistence-release
---

# حفظ دائم إصدار عودة تتبع: dsh-v0.1.5-alpha.1

[English](dsh-v0.1.5-alpha.1.md) | العربية

## عام وصف

كتابة صيغة من 2 رفع حتى 3: إضافة جديدة system/message،EpochHeader حذف system.SurfaceOp استبدال عملية حقل من start/end تعديل لـ startSeq/endSeq،tool/code-dispatch حدث مفتاح تعديل لـ tool/ptc-dispatch حدث مفتاح.

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
| شفرة المصدر tag | `dsh-v0.1.5-alpha.1` |
| شفرة المصدر يوم مدة | 2026-09-08T15:25:45.000Z |
| إرسال سطر سجل | لديه release كائن. |
| قبل واحد إصدار | [dsh-v0.1.3-alpha.2](dsh-v0.1.3-alpha.2.zh.md) |
| Session كتابة إصدار | 3 |
| كامل إعادة بناء بيان | <!-- persistence-release-inventory:start -->57 عدد أصل نوع / 443 نوع نوع<!-- persistence-release-inventory:end --> |
| هذا بند لقطة | [dsh-v0.1.5-alpha.1.schema.json](dsh-v0.1.5-alpha.1.schema.json) |

كتابة إصدار معتاد كمية في هذا tag في شفرة المصدر دليل:

- `packages/core/session/src/types.ts`: `export const SESSION_FORMAT_VERSION = 3`

<a id="declaration"></a>
## إعلان

```yaml persistence-release
schemaVersion: 1
tag: dsh-v0.1.5-alpha.1
previous: dsh-v0.1.3-alpha.2
sessionFormatVersion: 3
changes:
  - root: SessionEventEnvelope
    before: 04184edc061905410cc7e3db8d5c7cf393d739c89eb523ba8bad3831fb23ba95
    after: 5776e5553ff2dfe3f5bc202dbb1e7c9f93e35a531aebb7764c23b2b6153b2ccc
  - root: SessionHeader
    before: 15918d785bdccedf0dba204622c75591bfb833bbf107ae0894bbc44cfbd73c1d
    after: 2a8b114637e66faab5fae1c6e2fba65320db6224c80f5f36c5bf32f937154d03
  - root: event:assistant/message
    before: 83f26c7a856f772e6ffd9a5a144e5aaccf771ac54cef41948f99eed99e1a25a7
    after: a58ca1bed502d425a8b65cac02f59717498cd296de9513c6f81b83b791c20e9b
  - root: event:request/context
    before: f6b733e38d46dde3f8ab1ade2be3362abb6642eb97982a98ee64a57ff60d0c28
    after: 37cbc9cf06d494cfe5c67f078af1605eacb8e4c2c853e9e26455b73de0ee7ccf
  - root: event:request/header
    before: 1de6c9c8764045ea9a1357bae6ccbbd57c19f6f337f8f25697c919c7cc9abf16
    after: 8ea13bcd983eab596dbfd41c5c2b62a0b318b71cd2a987a6fd752c6ced7e4489
  - root: event:system/message
    before: null
    after: 0ae7ccdc1cc5d9d43772ebd5c7357ff509011c3a6ba188d9c274d33df2542c42
  - root: event:tool/code-dispatch
    before: f8dc5624cd0c942a069063ae0d90a61d821b4fddd1d967dcded91cf17933e708
    after: null
  - root: event:tool/code-dispatch-start
    before: 9eb21c10fc675e1fa4184e5eecc9697aa87054ffd836d49428174897f0e64b62
    after: null
  - root: event:tool/ptc-dispatch
    before: null
    after: da807583a19f4ebe2bc9115c9686016e1521e405bdfaced296ae652b91e8e5f6
  - root: event:tool/ptc-dispatch-start
    before: null
    after: ec38b5949af8eacaf00df002f4acbe344f934f8a061e9cdc65a52a48e5f6dd93
  - root: event:tool/result
    before: eacefd48000720582725ccfc6ff7a0ac02755a1a3c57a8f9754125f99aab6c1b
    after: cc3e270ab982cbafff602b753647b6f056decb7fe4fd523afd2f157a65c3d622
  - root: event:user/message
    before: a57a77f18de7b37b724293830a57064696895d69f2afcd2c0264f41cd13ba980
    after: 2e49ede7fb3a592cce8919ebe982f6ca1c1f67abe4def359ffc028c85e6d1ad8
```

<a id="changes"></a>
## بنية تغير

<!-- persistence-release-changes:start -->

فحص قياس إلى 12 عدد أصل نوع تغير،25 بند بنية فرق مختلف. تحت جدول الأكثر منخفض اشتراط حسب حالي قاعدة حساب حساب، فقط لأجل مقارنة مقارنة؛ لا يمثل قديم إصدار سبق التزام حراسة هذه قاعدة، أيضا لا إثبات ترحيل أو وقت التشغيل توافق صفة.

| مسار | تغير | حالي الأكثر منخفض اشتراط |
|---|---|---|
| `SessionEventEnvelope` | `union-variants-changed` | `version-bump` |
| `SessionHeader.version` | `type-changed` | `version-bump` |
| `event:assistant/message.sourceEventSeqs` | `property-removed` | `version-bump` |
| `event:assistant/message.surfaceOp` | `property-made-required` | `version-bump` |
| `event:assistant/message.surfaceOp.end` | `property-removed` | `version-bump` |
| `event:assistant/message.surfaceOp.start` | `property-removed` | `version-bump` |
| `event:assistant/message.surfaceOp.endSeq` | `required-property-added` | `version-bump` |
| `event:assistant/message.surfaceOp.startSeq` | `required-property-added` | `version-bump` |
| `event:request/context.data.systemPromptUpdate` | `optional-property-added` | `same-version` |
| `event:request/header.data.header.system` | `property-removed` | `version-bump` |
| `event:system/message` | `root-added` | `version-bump` |
| `event:tool/code-dispatch` | `root-removed` | `version-bump` |
| `event:tool/code-dispatch-start` | `root-removed` | `version-bump` |
| `event:tool/ptc-dispatch` | `root-added` | `same-version` |
| `event:tool/ptc-dispatch-start` | `root-added` | `same-version` |
| `event:tool/result.surfaceOp` | `property-made-required` | `version-bump` |
| `event:tool/result.surfaceOp.end` | `property-removed` | `version-bump` |
| `event:tool/result.surfaceOp.start` | `property-removed` | `version-bump` |
| `event:tool/result.surfaceOp.endSeq` | `required-property-added` | `version-bump` |
| `event:tool/result.surfaceOp.startSeq` | `required-property-added` | `version-bump` |
| `event:user/message.surfaceOp` | `property-made-required` | `version-bump` |
| `event:user/message.surfaceOp.end` | `property-removed` | `version-bump` |
| `event:user/message.surfaceOp.start` | `property-removed` | `version-bump` |
| `event:user/message.surfaceOp.endSeq` | `required-property-added` | `version-bump` |
| `event:user/message.surfaceOp.startSeq` | `required-property-added` | `version-bump` |

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
