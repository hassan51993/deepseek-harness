---
description: "يسجّل انتقالَ نوع حفظ دائم وتأكيدَ توافقه."
kind: persistence-change
---

# 2026-09-12-auto-review-error-metadata

[English](2026-09-12-auto-review-error-metadata.md) | العربية

## الملخص

يضيف بياناتٍ وصفية مبنيَنة اختيارية للأخطاء إلى توزيعات PTC المحفوظة، وسببًا اختياريًا يراه المستخدم إلى أخطاء الأدوات الأصيلة المحفوظة. وتحتفظ الإضافتان بإصدار صيغة الجلسة.

## المحتويات

- [التصريح](#declaration)
- [التوافق](#compatibility)
- [التحقق](#verification)
- [ملاحظة التطوير](#dev-note)

<a id="declaration"></a>
## التصريح

```yaml persistence-change
schemaVersion: 1
id: 2026-09-12-auto-review-error-metadata
baseline: false
changes:
  - root: "event:tool/ptc-dispatch"
    previous: "2026-09-11-initial"
    after: "b5d66eaebed4da391b13498623b11142222149fbf5e025975dbc6d94f0d06796"
    decision: same-version
  - root: "event:tool/result"
    previous: "2026-09-11-initial"
    after: "3a803805bdeb805f32b229e399fb7258be8e32a89f89063a7c99957cfea942f7"
    decision: same-version
```

<a id="compatibility"></a>
## التوافق

تستطيع أحداثُ `tool/ptc-dispatch` القائمة حذفَ error، وتستطيع أخطاءُ `tool/result` القائمة حذفَ reason. وأحداثُ توزيع PTC لا تدخل تاريخَ النموذج؛ وإعادةُ تشغيل نتائج الأدوات الأصيلة تُسقط `data.message` ولا تشمل بياناتِ الخطأ الوصفية. ويستطيع القرّاءُ الأقدم تجاهلَ هذه الإضافات بلا تغيير إعادة تشغيل النموذج. ويقبل قرّاءُ Web الحاليون غيابَ السبب، ولا يعرضون تفاصيلَ منع Auto review إلا حين تطابق هويةُ الخطأ المسجَّلة. ويبقى وضعُ الأذونات نصًّا في الحدث القائم؛ واختيارُ auto لا يُدخل تغييرَ نوع حفظ دائم معلَنًا. ولا تتغيّر الترويسةُ ولا مغلّفُ الأحداث ولا أيُّ نوع قيمة قائم، ولا يلزم ترحيلٌ متجاور.

<a id="verification"></a>
## التحقق

نجح `pnpm exec vitest run scripts/persistence-changes.spec.ts scripts/persistence-schema.spec.ts` بـ 64 اختبارًا. ونجحت اختباراتُ المالك المركَّزة للأذونات وAuto review وتنفيذ الأدوات وagent loop ووراثة subagent وTypeScript SDK بـ 390 اختبارًا عبر 10 ملفات، بما فيها بياناتُ المنع الوصفية في المسار الأصيل وفي PTC. ونجح `uv run --python 3.10 --group test --project python/sdk pytest python/sdk/tests/test_client.py -k preserves_auto_review_errors` باختبار واحد. وصنّفت معاينةُ الحفظ الدائم الإضافتين الاختياريتين وحدهما ولم تشترط رفعَ إصدار.

<a id="dev-note"></a>
## ملاحظة التطوير

لا شيء.
