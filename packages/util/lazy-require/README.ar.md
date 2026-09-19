---
description: "حسب استدعاء جهة تحليل و كسول صفة تحميل CommonJS توافق Host اعتماد، جعل تطبيق بدء وقت لا ابتدائي تحويل بعد لم استخدام اعتماد."
kind: "package-library"
---

# @deepseek-ai/dsh-lazy-require

[English](README.md) | العربية

## عام وصف

`dsh-lazy-require` سوف يجعل CommonJS توافق Host اعتماد إبقاء لم تحميل حالة، مباشر إلى أول مرة فعلي عملية. تحليل ما زال بـ مستهلك package لـ أساس دقيق، نفس عملية realm سوف إعادة استخدام مرة نجاح تحميل وحدة قيمة.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [حدود معروفة وعمل مؤجل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

نقل دخول اعتماد حرف وجه كمية specifier و استدعاء جهة `import.meta.url`:

```ts
import { createLazyRequire } from '@deepseek-ai/dsh-lazy-require'

interface NativeModule { open(): void }
const requireNative = createLazyRequire<NativeModule>('native-package', import.meta.url)
```

استدعاء `requireNative()` وقت عندئذ تحميل اعتماد، و فقط تحميل مرة. فشل تحميل لن يتم ذاكرة مؤقتة.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

هذا أداة استخدام نقل دخول استدعاء جهة URL إنشاء Node `require`، و كما فقط ذاكرة مؤقتة نجاح إرجاع قيمة. صريح استدعاء جهة URL سوف في إصدار بعد إبقاء package نطاق جزء اعتماد تحليل.

### شفرة المصدر أرض رسم

| ملف | مسؤولية |
|---|---|
| [`src/index.ts`](src/index.ts) | حسب استدعاء جهة تحليل loader و نجاح نتيجة ذاكرة مؤقتة |

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [أداة حزمة أرض رسم](../README.ar.md)——متبادل مجاور مشترك أصل لغة.
- [NPM إصدار تسلسل](../../../.agents/notes/implemented/process/2026-08-10-npm-release-sequences.ar.md)——إصدار اعتماد تصنيف و أول مرة استخدام تحميل سياسة.

-----

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن هذا Host أداة لا تسجيل أي نموذج مرئي سلوك.

#### KV Cache أثر

بلا.

## حدود معروفة وعمل مؤجل

<a id="known-limitations-and-deferred-work"></a>

- **فقط حد توافق CommonJS اعتماد**——فقط ESM package حاجة من استدعاء جهة يملك مختلف خطوة factory.
- **WebWorker تحزيم حاجة صريح طلب**——ساكن حالة packer لا يمكن اكتشاف فقط في `createLazyRequire()` استدعاء في تسمية اعتماد.Preview image استخدام package يجب عبر تلقي دعم حمل حرف وجه كمية طلب إبقاء هذا اعتماد يمكن بلوغ، مباشر إلى packer قدرة كاف تعرف آخر هذا helper.

هذه الحزمة لا إصدار وقت التشغيل invariant companion، لأن loader لا يحتفظ يمكن مستقل مراقبة قياس متغير علاقة.

<a id="dev-note"></a>
### ملاحظة تطوير

بلا.
