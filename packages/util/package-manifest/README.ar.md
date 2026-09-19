---
description: "حزمة هوية، وقت التشغيل اشتراط و DSH إضافة بيانات وصفية مشترك TypeScript إعلان."
kind: "package-library"
---

# @deepseek-ai/dsh-package-manifest

[English](README.md) | العربية

## عام وصف

استخدام `DshPackageManifest` وصف حزمة بيانات وصفية،`DshManifest` وصف `dsh` تحت عام مشترك حقل، و `DshClientManifest` انتظار عضو نوع وصف مفرد عدد مجال. كل قراءة جهة مسؤول JSON تحليل، تحقق و قيمة افتراضية تحليل.

## دليل

- [استخدام هذه الحزمة](#use-this-package)
- [فهم التنفيذ](#understand-the-implementation)
- [بحث إضافي](#further-exploration)
- [تجربة النموذج](#model-experience)
- [معروف حد و لاحق عمل](#known-limitations-and-deferred-work)
- [ملاحظة تطوير](#dev-note)

-----

<a id="use-this-package"></a>
## استخدام هذه الحزمة

من حزمة أصل استيراد نوع. فقط فحص ذاتي ذات شفرة المصدر وقت استخدام تطوير اعتماد؛ إذا إصدار إعلان ملف مرجع هذه نوع، فإن استخدام إنتاج اعتماد.

```ts
import type { DshClientManifest, DshPackageManifest } from '@deepseek-ai/dsh-package-manifest'

const client: DshClientManifest = { platform: 'web' }
const manifest: DshPackageManifest = {
  name: 'example-dsh-plugin',
  version: '1.0.0',
  engines: { node: '>=24', dsh: '0.1.5-alpha.1' },
  dsh: {
    manifestVersion: 1,
    bundle: { patch: './cordis.patch.yml' },
    client,
  },
}
```

`DshPackageManifest` وصف DSH استخدام package.json حقل، منها `name` و `version` لا بد ملء؛ هو لا هو كامل npm schema(نمط). محلي profile قراءة جهة استخدام `Partial<DshPackageManifest>`، لأن profile بلا حاجة إصدار إصدار.`DshManifest` فقط وصف `dsh` تحت عام مشترك عمل من حقل.TypeScript فحص عرض مثال و حذف `import type`؛ هذه واجهة لا تحليل JSON، أيضا لا كتابة ملف.

التالي بيانات وصفية حقل متساو اختياري. حذف وقت، صيغة إصدار أو توافق مضيف إصدار إبقاء لم إعلان حالة؛ قراءة جهة لا دفع قطع قيمة افتراضية.

| حقل | يحتوي معنى |
|---|---|
| `dsh.manifestVersion` | manifest(بيانات وصفية بيان) صيغة معرف؛ إعلان صيغة لـ `1`، مستقل في npm حزمة إصدار و Session صيغة إصدار. |
| `engines.dsh` | عمل من إعلان توافق DSH إصدار، استخدام SemVer نطاق، أيضا يمكن ملء كتابة دقيق مسبق إصدار إصدار. هذا حقل و `engines.node`،`engines.npm` و صف؛engines كائن يمكن حذف `dsh`. |

عام مشترك تركيب إعلان تعريف في [`src/types.ts`](src/types.ts) في. داخلي `configTrees`،`sessionFormatMigration` و توليد `moduleFallback` بيانات وصفية قسم آخر من مرآة مثل تحزيم جهاز، دليل توليد جهاز و بدء جهاز قراءة جهة يملك؛ عام مشترك نوع لا كشف هذه حقل.

-----

<a id="understand-the-implementation"></a>
## فهم التنفيذ

<details>
<summary>تنفيذ دقيق عقدة——انقر للتوسيع</summary>

حزمة أصل فقط إعادة توجيه خروج [`src/types.ts`](src/types.ts) في إعلان. هذه الحزمة لا إصدار وقت التشغيل ثابت كمية مرافق مع وحدة، لأن هو لا يوجد وقت التشغيل حالة أو يمكن مستقل مراقبة علاقة.

</details>

-----

<a id="further-exploration"></a>
## بحث إضافي

- [Profile بدء جهاز](../../boot/app-boot/README.ar.md#profiles)——manifest تحميل و تركيب.
- [عام مشترك حزمة بيانات وصفية](../../../.agents/notes/implemented/architecture/2026-09-10-public-package-manifest.ar.md)——حقل موضع و قراءة جهة ملكية.

<a id="model-experience"></a>
## تجربة النموذج

بلا، لأن هذه الحزمة فقط توجيه خروج نوع.

#### KV Cache أثر

نوع إعلان لا زيادة نموذج إدخال، لذلك لا أثر مزود ذاكرة مؤقتة إعادة استخدام.

## معروف حد و لاحق عمل

<a id="known-limitations-and-deferred-work"></a>

- **فقط توفير ساكن حالة نوع.** مستهلك قراءة و تحقق الذي يحتاج JSON حقل، مجددا سوف مشترك إعلان ملائم إعداد لـ وقت التشغيل بيانات. هذه الحزمة لا توفير محلل،getter helper، ملف فحص أو قيمة افتراضية.
- **توافق صفة فقط عمل إعلان.** حالي تثبيت جهاز و تحميل جهاز لا قوي صنع فحص `dsh.manifestVersion` أو `engines.dsh`؛ إعلان نطاق لن رفض لا توافق مضيف، أيضا لن تحقق SemVer لغة قاعدة.

<a id="dev-note"></a>
### ملاحظة تطوير

<details>
<summary>صيانة من عمل سياق——انقر للتوسيع</summary>

بلا.

</details>
